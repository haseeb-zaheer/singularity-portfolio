## Orientation: Entering the AI Era

### Main Principles Learned

- LLMs are probabilistic systems, so fluent output still needs validation through review, tests, trusted sources, or tool results.
- Prompt quality matters because instructions, constraints, examples, context ordering, and output format directly affect model behavior.
- More context is not automatically better; useful context should be relevant, trusted, and scoped to the task to reduce cost, latency, distraction, and prompt-injection risk.
- RAG, tools, and MCP extend LLMs beyond static model memory by giving them controlled access to company knowledge, external systems, and task-specific capabilities.
- AI agents are goal-directed systems that combine perception, planning, tool use, observation, and iteration within defined permissions.
- Production AI workflows need security boundaries around prompts, retrieved context, tools, proprietary data, credentials, audit logs, and approval gates.
- Human oversight remains necessary for high-risk decisions, especially when AI output affects code, customer data, deployment, legal compliance, or business-critical workflows.

### Generative AI in a Nutshell

Resource: [https://www.youtube.com/watch?v=2IK3DFHRFfw](https://www.youtube.com/watch?v=2IK3DFHRFfw)

#### Overview of Video

The video introduces generative AI as a shift from deterministic software workflows toward probabilistic systems that can generate new text, images, audio, and other outputs from learned patterns in training data. It frames AI as a highly capable but imperfect technical collaborator whose value depends on the user's ability to communicate intent clearly through prompts, constraints, examples, and iteration.

The video contrasts traditional AI systems, which often classify inputs or predict labels, with generative models that synthesize new content through "guess-the-next-word" style token prediction. It also highlights the need for human oversight because LLM output can be fluent but incorrect, especially when the model is not grounded in reliable context or tool results. The lecture closes with a practical mindset: avoid both panic and denial, experiment continuously, and recognize that AI is evolving from simple chat interfaces into multimodal systems and autonomous agents capable of planning, tool use, and multi-step execution.

#### What I Learned

- LLMs generate output through probabilistic token prediction, not guaranteed factual lookup. This means fluent responses still need validation when correctness matters.
- Transformer-based models use attention over the provided context, so prompt structure, context ordering, and instruction clarity can materially affect output quality.
- Generative AI differs from traditional classification-focused AI because it can synthesize new outputs across modalities instead of only assigning labels or making narrow predictions.
- Human oversight remains required for domain correctness, security review, legal constraints, and factual validation because hallucinations are a core failure mode of generation.
- Prompt engineering is an engineering interface: prompts should define task scope, constraints, examples, expected output format, and refusal behavior.
- Multimodal AI extends model interaction beyond text into images, audio, and other inputs/outputs, while agentic systems add planning, tool use, state management, and multi-step execution.
- Practical AI adoption requires continuous experimentation, but production use also requires guardrails, evals, observability, and clear ownership of final decisions.

#### Quick Check Answers

- **Question:** List 2 opportunities and 2 risks for your domain.
   - Opportunities:
     > Productivity gains: AI can generate code scaffolds, tests, documentation, migration scripts, structured data like JSON or CSV, and small automation tools. This can shorten the path from idea to implementation when the output is reviewed and integrated by an engineer.
     > Continuous learning and mentorship: Using AI as a coding assistant can provide fast explanations, examples, and feedback loops while working. This helps developers learn from generated output, compare approaches, and build technical fluency as AI tools evolve.
   - Risks:
     > Accuracy and hallucinations: AI models can produce convincing but incorrect code, explanations, or implementation details. Human review, tests, and validation are required before accepting AI-generated output.
     > Security and data privacy: Sensitive information, proprietary code, credentials, customer data, and regulated data must not be sent to an AI system without clear policies for retention, training usage, access controls, and vendor boundaries.

- **Question:** Name one workflow in your org that AI could streamline; estimate impact.
   > Answer: The end-to-end ticket-to-deployment workflow could be optimized. AI agents could support ticket analysis, PRD creation, acceptance criteria definition, test generation, code implementation, test execution, debugging, documentation, and deployment readiness checks. The expected impact would be shorter cycle time, fewer missed requirements, faster feedback loops, and more consistent engineering quality, as long as human review, CI checks, security controls, and approval gates remain part of the process.

- **Question:** Identify one ethical or regulatory constraint you'd need to respect.
   > Answer: A key constraint is protecting proprietary code, customer data, credentials, and internal ticket information as AI agents move through the ticket-to-deployment workflow. The organization would need clear policies for what data agents can access, whether prompts and outputs are retained or used for training, how secrets are blocked, and which actions require human approval. Code generation, test execution, debugging, and deployment readiness checks should stay behind access controls, audit logs, and CI/security gates.

- **Question:** Draft a one-sentence value hypothesis for an AI feature you could ship.
   > Answer: By integrating an AI Delivery Copilot into the ticket-to-deployment workflow, we can use bounded agents to analyze tickets, generate PRDs, propose tests, assist implementation, debug CI failures, and produce deployment checklists, reducing cycle time and missed requirements while keeping code review, security scans, and deployment approval under human control.

- **Question:** Write a 2-3 sentence pitch to a skeptical stakeholder.
   > Answer: The goal is not to replace engineering judgment, but to reduce the repetitive work between ticket intake and deployment while keeping humans responsible for approval. An AI Delivery Copilot can draft PRDs, propose tests, assist implementation, and debug CI failures, but every output remains behind code review, automated tests, security checks, and deployment gates. This gives us faster feedback loops and more consistent delivery without removing accountability or control.

### LLMs 101: Foundations

Resource: [https://www.youtube.com/watch?v=zjkBMFhNj_g](https://www.youtube.com/watch?v=zjkBMFhNj_g)

#### Overview of Video

The video explains LLMs as deployable software artifacts made up of a large parameter file containing neural network weights and a comparatively small inference program that runs those weights. During pre-training, the model performs lossy compression of large-scale internet text into billions of optimized parameters by repeatedly predicting the next token in a sequence across massive GPU clusters. Most modern LLMs use the Transformer architecture, where attention layers and learned weights are optimized to reduce prediction error, even though the exact internal behavior of those parameters remains difficult to interpret.

The lecture separates base-model training from assistant behavior. A pre-trained base model can continue text patterns, but it becomes a useful assistant through supervised fine-tuning on high-quality question-and-answer data. Reinforcement Learning from Human Feedback (RLHF) can further improve alignment by training from human preference comparisons, especially when it is easier to rank answers than to write ideal examples. The video also introduces scaling laws, where model capability improves predictably with more parameters and more training data, with no clear evidence yet that this trend has fully saturated.

The video then expands LLMs from text generators into tool-using, multimodal systems. A useful mental model is the "LLM OS": the model acts like a kernel or orchestrator, the context window is RAM, RAG/files are storage, tools are applications, and multimodal inputs/outputs are I/O. In this model, natural language becomes the interface for coordinating existing software infrastructure.

The lecture also covers current limitations and security risks. Most LLM generation behaves like fast "System 1" token sampling, while researchers are trying to build stronger "System 2" reasoning that can explore alternatives before answering. Jailbreaks are prompt-level or input-level attacks that try to bypass a model's safety alignment using techniques such as roleplay framing, encoded prompts, adversarial suffixes, or visual triggers in multimodal inputs. Related risks include prompt injection through untrusted external content and data poisoning attacks where malicious training data creates hidden trigger behaviors. These risks mean LLM applications need layered controls beyond built-in refusal behavior, including strong tool boundaries, input isolation, permission checks, retrieval hygiene, monitoring, and human approval for sensitive actions.

#### What I Learned

- LLMs are deployable artifacts made of learned parameters plus inference code; most of the model capability is encoded in the parameter weights.
- Pre-training creates a base model by optimizing next-token prediction over massive datasets, but a base model is not automatically a helpful assistant.
- Supervised fine-tuning and RLHF shape model behavior toward instruction-following, helpfulness, and preference alignment.
- More context is useful only when it is relevant, trusted, and well-structured; excessive or untrusted context increases cost, latency, distraction, and prompt-injection risk.
- Tool use and RAG are necessary when the model needs current facts, exact computation, private data, or grounded answers.
- The LLM OS mental model is useful because it explains how context, tools, files, retrieval, and multimodal I/O can be coordinated by the model as part of a larger computing system.
- Model size can improve capability, but it also increases serving cost, latency, memory requirements, and infrastructure complexity.
- Production LLM systems need security boundaries around prompts, retrieved context, tools, permissions, and external data.

#### Quick Check Answers

- **Question:** In one paragraph, explain why "more context" isn't always "better."
   > Answer: More context is not always better because the context window is a finite working-memory resource. Adding more tokens increases latency and cost, and irrelevant context can distract the model or push important information into positions where it is less likely to be used effectively. Extra context also expands the security surface: untrusted webpages, documents, or tool outputs can contain prompt-injection instructions that try to override the user's intent or trigger unauthorized actions. Good context engineering is about selecting the most relevant, trusted, and task-specific information rather than passing everything to the model.

- **Question:** Define: token, parameter, pretraining, fine-tuning, inference.
   - Token: The basic unit of text processed by an LLM. A token can be a word, part of a word, punctuation, whitespace, or another text fragment.
   - Parameter: A learned numerical weight in the neural network. The model's billions of parameters encode statistical patterns from training data and determine how inputs are transformed into token predictions.
   - Pretraining: The first major training stage where a model learns general language and world patterns from massive datasets by optimizing next-token prediction. This produces a base model.
   - Fine-tuning: A later training stage where the base model is trained on smaller, higher-quality examples, such as instruction or Q&A data, to make it behave more like a helpful assistant.
   - Inference: The process of running a trained model with existing parameters to generate output. Inference is much cheaper than training, but larger models can still be expensive and slower to serve at scale.

- **Question:** Give one trade-off between bigger models and latency/cost.
   > Answer: Bigger models often produce stronger outputs because they have more parameters and can learn more complex patterns, but they are slower and more expensive to run. A larger model requires more memory, more compute per token, and more infrastructure for serving, so latency and inference cost increase compared with a smaller model. Training cost also rises dramatically because state-of-the-art models require large GPU clusters and long training runs.

- **Question:** Describe a failure mode of LLMs and one mitigation.
   - Failure mode: Hallucination. An LLM can generate plausible-sounding but false information because it is predicting likely token sequences rather than querying a guaranteed source of truth.
   - Mitigation: Use source grounding through RAG or trusted tool calls, require citations when factual claims are made, validate outputs with tests or external checks, and keep human review for high-risk decisions. Fine-tuning can help reduce repeated behavior problems, but it is not enough by itself for factual correctness or current information.

- **Question:** Map 3 inputs that affect output quality.
   > Prompt and instructions: Clear task framing, constraints, examples, role definitions, and output formats make the model more likely to produce useful results.
   > Context and retrieved data: Relevant, trusted, and well-structured context improves grounding, while noisy or untrusted context can reduce quality or introduce prompt-injection risk.
   > Model and generation settings: Model choice, temperature, top-p, max tokens, and tool availability affect accuracy, creativity, consistency, latency, and cost.

### Core AI Vocabulary: 7 Terms Every Engineer Should Know

Resource: [https://www.youtube.com/watch?v=VSFuqMh4hus](https://www.youtube.com/watch?v=VSFuqMh4hus)

#### Overview of Video

The video introduces core AI engineering vocabulary needed to discuss modern LLM systems clearly. It explains agentic AI as systems that go beyond single-turn chatbot responses by repeatedly perceiving context, reasoning about next steps, taking actions through tools, and observing results. It also distinguishes standard LLMs from reasoning-focused models that are fine-tuned to work through complex tasks such as math, code, and planning before producing a final answer.

The video also covers the retrieval stack behind grounded AI applications. Embedding models convert text, images, or other data into vectors that capture semantic meaning, and vector databases use those vectors to retrieve similar content through mathematical similarity search rather than keyword matching. RAG builds on this by retrieving relevant external knowledge and inserting it into the model's context so the LLM can answer using current, private, or domain-specific information.

The lecture then expands into tool and model architecture concepts. MCP standardizes how AI systems connect to external tools, services, and data sources instead of relying on custom integrations for every system. Mixture of Experts (MoE) improves scaling efficiency by routing each request through only the most relevant expert subnetworks rather than activating the full model. It closes with AGI and ASI as theoretical long-term goals: AGI refers to human-level general cognitive capability, while ASI refers to intelligence beyond human capability, potentially including recursive self-improvement.

#### What I Learned

- AI agents combine reasoning, planning, tool use, and feedback loops, which makes them closer to goal-directed systems than simple chat interfaces.
- Reasoning models are optimized for tasks where step-by-step problem solving improves accuracy, especially domains with verifiable answers such as code and math.
- Embeddings and vector databases are the foundation for semantic retrieval because they represent meaning numerically and allow similarity search across large datasets.
- RAG is a practical pattern for grounding LLM responses in external knowledge without retraining the model.
- MCP is important because it standardizes tool and data access for AI systems, reducing the need for one-off integrations.
- MoE models can increase total model capacity while keeping inference cost lower by activating only a subset of experts per request.
- AGI and ASI are useful terms for discussing long-term AI capability, but they remain theoretical compared with the engineering patterns used in current systems.

#### Quick Check Answers

- **Question:** Match each term to a real product.
   - Agent: A coding agent that reads a ticket, edits files, runs tests, observes failures, and iterates until the task is ready for review.
   - RAG: An internal support assistant that retrieves relevant employee handbook sections before answering HR policy questions.
   - Embeddings: A semantic search feature that finds similar tickets, documents, or code snippets even when the exact keywords do not match.
   - Context window: The working memory of a chat or coding assistant that contains the current prompt, relevant files, prior messages, and retrieved context.

- **Question:** Pick two terms that are easy to confuse; contrast them in 2-3 bullets.
   > AGI is the theoretical point where an AI system can perform general cognitive tasks at the level of a human expert.
   > ASI goes beyond AGI and refers to intelligence that exceeds human capability across a broad range of domains.
   > A key difference is recursive self-improvement: ASI is often described as being able to redesign and improve itself, creating a feedback loop where the system becomes progressively more capable.

- **Question:** For "agent," list 3 capabilities an agent needs beyond a plain chat model.
   > Perception: It must understand the relevant environment, inputs, state, and constraints around the task.
   > Reasoning and planning: It must determine the next best steps toward a goal instead of only producing a single response.
   > Autonomous observation: It must act, observe the result of that action, and use the feedback to decide what to do next.

- **Question:** For "embeddings," describe one non-RAG use case.
   > Embeddings can power similarity search without generating text, such as finding duplicate or related tickets by comparing a new issue against existing bug reports, incidents, or feature requests in vector space.

- **Question:** Translate each term into a sentence a non-technical stakeholder understands.
   - Agent: An AI helper that can plan, use tools, and keep working toward a goal within approved limits.
   - Large Reasoning Model: An AI that thinks through harder problems step by step before answering.
   - Vector Database: A search system that finds information by meaning, not just exact words.
   - RAG: A way for AI to look up trusted company information before answering.
   - MCP: A standard way for AI to connect to tools, files, and systems.
   - Mixture of Experts: A model design that uses the right specialist parts of the AI for each task.
   - AGI / ASI: AGI is a future AI that could do most thinking tasks as well as a human expert, while ASI would go beyond human-level intelligence.
