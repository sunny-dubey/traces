---
title: A Few Things to Document (That Might Not Be Related)
date: 2026-06-22
public: true
---

Few things I'd like to document, and the points might not be related, so bear with me.

---
## Stay Skeptical of LLM Outputs

I've realised that being skeptical about LLM outputs — no matter how accurate the prompt is — helps maintain a balance between reading code and buying yourself time to make more product decisions.

The model can sound right and still be wrong. Skepticism isn't cynicism; it's leaving room to think.

---
## Moving Back to VS Code

I am moving back to VS Code after using Cursor for many months.

Cursor was useful, especially when models were improving fast and the IDE was tightly integrated with them. But after a while I wanted a simpler editor, fewer defaults made for me, and a setup I control end to end. VS Code is that for me right now.

---
## Design the Flow, Distribute the Work

I'm also trying to move away from the mindset of "I'll do everything myself." Instead of relying on ego and trying to complete everything alone, it makes more sense to **design the architecture and define the flow**, then distribute the work amongst peers.

Someone still has to own the system. That person doesn't have to write every line.

---
## Still Waiting on Better Models

I still look forward to better models so that I don't get bored and can execute faster once I've already understood the PRDs — reducing the overall time from feature ideation to release.

The bottleneck I care about isn't typing speed. It's the gap between understanding what to build and actually shipping it.

---
## Edge Computing and Open-Weight Models

I like what Google is doing with the release of open-weight models like **Gemma 4** that are designed to run efficiently on local hardware, including laptops and edge devices. I'm convinced that **edge computing will be a major part of the AI stack**.

Not everything needs a round trip to a hosted API. A lot of engineering work is local, repetitive, and context-heavy — exactly where on-device models start to make sense.

---
## What I Expect From Local LLMs

Major expectations from local LLMs are to use them for minor tasks such as:

- Tracing files, functions, or endpoints when context is already known at a modular level
- Simply enjoying the fact that local LLMs work for a codebase and you don't always have to rely on a hosted model
- Understanding the set of DB query calls, especially from a latency and system design perspective
- Generating scripts and cron jobs

And **not** refactoring. Obviously.
