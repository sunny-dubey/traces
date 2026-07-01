---
title: Claude Code Can Read Your .env. I Finally Did Something About It.
date: 2026-06-23
tags:
  - claude
  - security
  - ai-tooling
  - devops
readTime: 5
public: true
---

Today I finally took action on something I've known for a while: **Claude Code CLI can read your `.env` file, your `.aws` credentials — basically anything your terminal user has access to.**

I'm not sure how concerning this is for every developer, but the least I could do was go through the Claude Code configuration docs and set up **PreToolUse hooks** to block access to sensitive files.

I tested it, and it works.

---
## The Accidental Source Leak

The Claude Code CLI itself is closed source — or at least it was until today. The entire source code was accidentally leaked via a source map file shipped in the npm package version **2.1.88**. Anthropic confirmed it was a packaging error. The internet has already mirrored and dissected the full **512,000-line** TypeScript codebase.

---
## Project vs Organization Config

If you're interested in setting up Claude for your system, check out the [configuration docs](https://docs.anthropic.com/en/docs/claude-code/settings). I've only set this up at the **project level**, but you could use **organization-level shared management** if you're looking at enterprise-level Claude management.

---
## Sandboxing Elsewhere

For context, **Gemini CLI** and **Codex CLI** are sandboxed at the OS level. The superiority of Claude's model keeps me using it for now — but that tradeoff is worth being explicit about.

---
## Logging Every Tool Call

I've also added a logging system that captures every tool call Claude makes during a session. Not sure if this is something every developer would care about, but it could be a starting point for analyzing token usage at the project level.

---
## Template Repo

If you want a starting point for your own project:

**[sunny-dubey/claude-config-template](https://github.com/sunny-dubey/claude-config-template)**

PreToolUse hooks, sensitive-file blocks, and session logging — ready to adapt.
