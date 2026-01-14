---
title: Server Etiquette 101: Don't Just Pull the Plug
excerpt: Learn the Art of Polite Exit
date: 2026-01-14
Tags:
  - os-signals
  - devops
readTime: 5
public: true
og_image: images/og/scarface.jpg
---

If you’ve ever built a backend server, you know this ritual. You pick your stack be it NodeJs, FastAPI or Go and get to work. Once you are done with the writing part, you open a fresh terminal and run `npm run dev` or `uvicorn main:app` or `go run main.go`. The server starts locally, binds itself to a port maybe `3000` `8000` or `8080` and starts listening for incoming requests. You hit an endpoint from a browser, Postman or curl, you test stuff, maybe you break stuff and when you’re bored or just want to touch grass, you smash **Ctrl + C**. The application i.e process stops and life moves on.

That’s completely fine during local development. There are no users, no traffic, and no consequences. You can kill the process and forget about it five minutes later.

But now imagine a different situation. For some reason, you need to shut down a process running in **production**. This could be due to multiple reasons:
 - You’re deploying a new version
 - Kubernetes is scaling things down
 - Node is getting drained
 - Possibly you just want to restart the damn thing.

Whatever the reason is this time you’re not alone. There are **real users**, **real traffic**, and **real requests mid-flight**. And unlike your local machine, you don’t get to casually smash **Ctrl + C** and walk away. Because when you do that in production, it’s not just a server going down, it’s a real user getting cut off mid-action.

At that exact moment, depending on what your application does, some user might be checking their last payment or account balance in a fintech app. Few could be updating their relationship status or posting something they actually care about on a social platform, or maybe placing an order, booking a ride or submitting an important form in a consumer product.

And all of this is happening on **this very instance**, the one you’re about to shut down. These are the users whose traffic is currently being handled by this backend server. Pull the plug now, and they’re the ones who feel it.

Do you really want to disappoint your users like that?  
Yeah?. **Hell no.**

---
## Why Are We Shutting Down Servers?

Shutting down a production server doesn’t mean your product is going offline. Most of the time, you’re just **replacing that instance with another one**. New code is coming in, old code is going out, traffic is still flowing, and users are still interacting with your system. Ideally, they shouldn’t even notice that anything changed.

This happens all the time during deployments, scaling events, node maintenance, or bug fixes. The key is that the transition should be seamless, invisible to users, and handled politely.

---
## What Actually Happens Under the Hood

Your backend server, Node, FastAPI, Django or Go is still just a **process**. Kubernetes doesn’t understand HTTP requests or user intent. This is where the signals concept comes in. This is how operating system talks to you backend process. The operating system communicates with processes using **signals**. When Kubernetes wants your server to shut down, it usually sends a signal called **SIGTERM**.

SIGTERM is basically the system saying, “Hey, wrap up and exit.” If your application handles this signal via handler, well and good, you can handle the shutdown gracefully. If it doesn’t, Kubernetes waits for a bit and then sends **SIGKILL**, which is a hard stop. Once SIGKILL is sent, there is no cleanup, no waiting, and no finishing work. The process just disappears. Trust me, this will haunt you.

---
## Graceful Shutdown: Teaching Your Server Good Manners

Graceful shutdown is simply your server knowing how to **leave without being rude**. When your application receives a SIGTERM signal, it should stop accepting new requests, allow the ones already in progress to finish, clean up resources like database connections or background workers, and then exit calmly. That small pause, that moment where your server is basically saying, _“hold on, I’m wrapping things up”_  is what prevents users from running into failed or half-completed requests.

Kubernetes actually tries to make this easier for you. When it decides a pod needs to go away, it first stops sending new traffic to it. Then it sends a SIGTERM and waits for a configurable grace period. Only if your application ignores that signal or takes too long does Kubernetes step in with a SIGKILL and pull the plug for real. The whole process works beautifully but only if your application knows how to listen for signals and shut itself down properly.

---

##  A Visual Treat for Your Eyes

![Graceful Shutdown Diagram](/diagrams/graceful-shutdown-diagram.png)

---

## Code Example: Graceful Shutdown in Go

![Graceful Shutdown Code](/diagrams/graceful-shutdown-code.png)

## Final Thoughts

I hope you can appreciate how something as simple as OS signals enables clean, predictable shutdowns. Most of the time, you don’t even have to think about it, because your framework or server command already handles it. But hey! We’re in the post-AI era now. We gotta dig deeper into frameworks and libraries and understand everything from first principles.



