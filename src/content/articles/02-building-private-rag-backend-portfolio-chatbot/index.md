---
title: "Building a Private RAG Backend for My Portfolio Chatbot"
slug: "building-private-rag-backend-portfolio-chatbot"
date: "2026-05-26"
description: "A build log on designing a private RAG backend for my portfolio chatbot with local retrieval, server-side secrets, streaming, and abuse controls."
tags: ["AI", "RAG", "Architecture", "Backend", "Portfolio"]
readTime: "9 min"
type: "Case Study"
---

# Building a Private RAG Backend for My Portfolio Chatbot

I wanted my portfolio chatbot to answer useful questions about my work without turning the portfolio into a thin wrapper around a generic model API. The bot needed to use curated information about me, answer in a professional first-person second-brain voice, and stay safe enough to expose through a public website.

That pushed the project away from a simple browser-to-model call and toward a small RAG backend: retrieval stays on my server, secrets stay server-side, the portfolio only talks to a proxy, and the model receives selected text chunks instead of raw private files or embeddings.

The final shape is intentionally boring infrastructure around a more interesting AI workflow:

```text
Portfolio chatbox
 -> Vercel serverless proxy
 -> protected Next.js RAG backend
 -> local LanceDB retrieval
 -> remote generation fallback chain
 -> streamed answer back to the browser
```

This article is a build log of the decisions behind that system.

## Context

The product surface is my public portfolio site. A visitor should be able to ask questions like what I have built, what technologies I use, how I approach engineering work, or whether a specific project matches a role.

The implementation constraint was different from a normal SaaS chatbot. I did not want a heavy production platform, a managed vector database, or a new backend stack just to support one portfolio feature. I also did not want raw personal source material or backend credentials to end up in browser code.

So I split the system into two responsibilities:

- The portfolio owns the user experience and a same-origin serverless proxy.
- The backend owns auth, rate limits, retrieval, prompt assembly, provider fallback, and streaming.

That boundary is the most important decision in the project.

## Problem

A portfolio chatbot looks simple from the outside, but the backend has to handle several failure modes:

- A public browser cannot be trusted with model provider keys.
- A public browser should not call the protected RAG backend directly.
- Personal source documents need to be curated before they become retrieval context.
- Retrieval can return weak or irrelevant context if the query is vague.
- Provider APIs can time out, rate limit, or return empty streams.
- A public endpoint needs abuse controls before it spends money or quota.
- Logs need to help debugging without storing prompts, private chunks, or raw IP addresses.

The goal was not to make the bot sound impressive once. The goal was to build a system where the behavior is explainable, bounded, and recoverable.

## Constraints

I kept the first version deliberately small:

- Use the existing Vite/React portfolio for the public UI.
- Use a Next.js backend because API routes, streaming, and deployment fit the project.
- Keep retrieval local with LanceDB instead of adding managed vector infrastructure.
- Use SQLite for persistent rate-limit state instead of Redis on the backend.
- Run generation through remote providers rather than hosting a model locally.
- Keep raw source preparation outside the public portfolio repo.
- Treat retrieved chunks as untrusted context, not instructions.

This was a classic MVP tradeoff: fewer moving pieces, but more care around boundaries.

## Architecture

The portfolio browser never sends secrets to the client. It posts chat requests to a same-origin serverless function:

```text
Browser
 -> /api/second-brain-chat
 -> protected backend /api/chat
```

The portfolio proxy validates the request, applies its own visitor rate limit, forwards a server-side shared secret to the backend, and streams the backend response back to the browser.

The backend then handles the RAG workflow:

```text
User message
 -> authorize server-to-server request
 -> validate message and history
 -> check backend rate limits
 -> rewrite follow-up question for retrieval
 -> embed retrieval query
 -> retrieve vector + FTS/BM25 candidates from LanceDB
 -> merge, rerank, and filter chunks
 -> build prompt with selected context
 -> stream answer through provider fallback chain
```

The generation model does not receive embeddings. Embeddings are only a retrieval mechanism. The model receives selected text chunks, the question, conversation history, and the system instruction.

That separation matters because it keeps each layer easier to reason about. Retrieval decides what evidence is relevant. Prompt assembly decides how that evidence is presented. Generation decides how to answer from the available context.

## Implementation

The portfolio proxy is intentionally narrow. It accepts `POST` requests, trims the message, caps message length, normalizes a short conversation history, and forwards the request to the backend with a server-side secret header.

Successful backend responses are `text/event-stream`, so the proxy preserves streaming instead of waiting for a full JSON response. Pre-stream failures stay JSON so the UI can show clear errors for validation, rate limits, timeouts, or backend reachability.

On the backend, the chat route authorizes before doing expensive work. That means an unauthenticated request is rejected before JSON parsing, rate limiting, embeddings, retrieval, or provider calls.

The core request flow lives in a shared chat orchestration module:

```text
prepare RAG context
 -> rewrite retrieval query
 -> embed query
 -> retrieve chunks
 -> build prompt
 -> stream generation
```

This made the route handler mostly responsible for HTTP behavior while the RAG pipeline stayed reusable for local testing and evals.

## Retrieval Design

I used LanceDB as a local file-based vector store because the corpus is small and private. The source material is prepared offline, split into chunks, embedded, reviewed, and then copied into the backend runtime artifact.

At runtime, retrieval uses a hybrid approach:

- Vector search finds semantically similar chunks.
- FTS/BM25 search catches exact wording and names.
- Reciprocal-rank style scoring merges candidates from both sources.
- Public metadata is preferred when available.
- Category hints help profile, project, skill, service, and experience questions land in the right part of the corpus.
- Confidence checks decide whether to pass strong context, limited context, or no context.

The confidence layer is important. A RAG system should not always force context into the prompt just because a vector database returned rows. Weak retrieval can be worse than no retrieval because it gives the model irrelevant evidence with a confident-looking surface.

For follow-up questions, the backend can rewrite the latest message into a standalone retrieval query. If rewriting fails, the system falls back to the original question instead of failing the whole request.

## Generation Design

The backend streams answers through a provider fallback chain. It tries a preferred OpenRouter model first, falls back to Gemini generation, and then falls back to a paid OpenRouter model if needed.

The streaming path waits for the first text chunk before committing to an SSE response. That detail keeps the API contract cleaner:

- If a provider fails before any answer text exists, the backend can try the next provider.
- If every provider fails before streaming starts, the route can return a safe JSON error.
- If a provider fails after streaming begins, the backend emits an SSE error event and closes the stream.

This behavior is more useful for a public chat UI than treating every provider failure the same way. The user sees progressive output when the system is healthy, but the UI still receives structured errors when failure happens before the stream starts.

## Security and Privacy Boundaries

The security model is simple: browser code gets the chat UI, server code gets the secrets, and private source material stays out of the portfolio bundle.

The backend requires a shared secret for production chat requests. The portfolio proxy adds that secret server-side. Direct public requests without the secret are rejected before the backend performs any expensive or sensitive work.

I also kept private data out of logs. Safe logs can include request ids, status codes, duration, selected provider, rate-limit result, and provider attempt metadata. They should not include user messages, prompts, retrieved chunk text, raw IPs, embeddings, API keys, or provider response bodies.

For rate limiting, the backend uses SQLite-backed counters keyed by hashed IP identifiers. The portfolio proxy adds a separate public-facing rate-limit layer before forwarding requests. The two layers are not meant to be clever. They are meant to make abuse more expensive than normal usage.

## Validation

I treated validation as part of the product, not a cleanup task after the chatbot started answering.

The backend has checks for:

- Request authorization before parsing or model work.
- Message and history shape.
- Message length.
- Per-visitor rate limits.
- Request deadlines and client disconnect cancellation.
- Provider quota and timeout failures.
- Safe JSON errors before streaming.
- SSE `delta`, `done`, and `error` events during streaming.
- Health checks for local runtime readiness.

For RAG quality, the project has a local eval harness with sanitized cases. That matters because retrieval bugs are often subtle. A chatbot can produce a polished answer while using the wrong context, missing the best source, or answering when it should admit uncertainty.

The public article version of this system should never expose raw eval prompts, private source chunks, or sensitive runtime artifacts. The important point is the workflow: prepare privately, retrieve selectively, evaluate with safe fixtures, and only publish behavior that can be defended.

## Result

The result is a portfolio chatbot architecture that feels small but has the right boundaries:

- The portfolio remains a static React experience with a thin serverless proxy.
- The backend owns retrieval, prompt construction, provider calls, rate limits, and logs.
- The RAG corpus stays local to the backend runtime.
- The browser never receives provider keys or backend secrets.
- Successful answers stream progressively to the UI.
- Operational failures return stable, safe error shapes.
- The system can be improved through retrieval tuning and evals without redesigning the whole app.

The biggest win is not any single library. It is the separation of responsibilities. The UI can evolve without learning about LanceDB. Retrieval can improve without changing the portfolio. Provider fallback can change without exposing anything to the browser.

## Tradeoffs

Local LanceDB is a good fit for a small personal knowledge base, but it is not a universal answer. A larger corpus, team usage, multi-region traffic, or heavier analytics might justify a managed database later.

SQLite rate limits are also a pragmatic choice. They are persistent and simple on a single backend host, but they would need rethinking if the backend scaled horizontally.

The provider fallback chain improves resilience, but it does not remove the need for budgets and monitoring. Remote APIs still have quota limits, latency variance, and policy differences.

The self-hosted backend keeps retrieval local and infrastructure costs low, but it also means I own deployment hygiene, service health, and runtime data handling. For a portfolio project, that is acceptable. For a customer-facing product with strict uptime requirements, I would evaluate the hosting model differently.

## What I Would Do Next

The next improvements are mostly about measurement and feedback:

- Add a small source display mode for trusted public chunks.
- Track anonymous thumbs-up or thumbs-down feedback.
- Expand the sanitized RAG eval fixture.
- Add regression checks for common profile, project, and collaboration questions.
- Improve retrieval observability without logging private content.
- Consider invite-only access if public usage grows.

I would still keep the core principle the same: generation remote, retrieval local, secrets server-side, and context treated as something the system must select carefully.

That is what made this a useful engineering project rather than just another chatbot demo.
