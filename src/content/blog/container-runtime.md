---
title: Docker Works Fine. I Wanted to Know What Was Actually Happening.
date: 2026-05-14
public: true
---

I've been using Docker for a while now — writing Dockerfiles, running containers, and wiring up GitHub Actions to push images to ACR. It works, and you move on. But I never really understood what was happening underneath.

So I started reading more about how container runtimes like **runc** actually work.

---
## Containers Aren't a Kernel Object

The first thing I learned is that Linux provides the core primitives required for container-style process isolation. Other operating systems like macOS and Windows do support isolation mechanisms as well, but modern containers are fundamentally built around **Linux kernel features**.

Containers are not a native "object" in the Linux kernel. Instead, the illusion of isolation is created by combining features such as **namespaces**, **cgroups**, and **chroot**.

**Namespaces** give a process its own isolated view of system resources, creating the illusion that it is running in its own separate environment.

Linux provides several types of namespaces. I used these three:

- **PID namespace** (`CLONE_NEWPID`): isolates process IDs, so processes inside the container see their own process tree.
- **Mount namespace** (`CLONE_NEWNS`): isolates filesystem mount points.
- **UTS namespace** (`CLONE_NEWUTS`): isolates hostname and domain name.

---
## Why Go Instead of FastAPI

For simple reasons, I chose to build a small backend server in **Go** instead of using something like FastAPI, so I could create a single static binary and use it directly as the root filesystem inside the container. Python would've been messier.

To do the same thing with FastAPI, you'd need to bundle the Python interpreter, all your pip packages, shared libraries — the whole thing. The clean way to do that is to build a Docker image first and extract the filesystem from it, which means I would've had to use Docker anyway. So I dropped the idea.

---
## Running It on Linux (From a Mac)

Since all of this is Linux syscall territory, none of it runs directly on macOS. I compiled the binary for Linux, SSHed into a **Colima** VM on my Mac, and ran it there.

The server came up on port `8080` and reported its hostname as `isolated-container`. So it worked.

There are obviously a lot of security concerns and missing pieces in this approach — cgroups, proper rootfs setup, capability dropping, and more — but that's future scope.

It was a nice learning experience, hence the post you see.

**GitHub repo:** [sunny-dubey/container-runtime](https://github.com/sunny-dubey/container-runtime)
