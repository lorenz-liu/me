---
title: "Why Does GPT Use a Decoder-Only Architecture?"
date: "2026-03-19"
excerpt: "Why keep only the decoder? What if you add an encoder? The reversal curse?"
tags: ["llm"]
---

You can understand why it is enough to keep the decoder — and what changes if you add an encoder — along a few dimensions:

## Why keep only the decoder?

- **Fit to the task.** In the original Transformer, the model was built for machine translation. The encoder reads the full input and encodes it as vectors; the decoder takes those vectors and generates the translated output token by token. GPT (Generative Pretrained Transformers) is aimed at generative tasks: continuing text, writing code, and so on.
- **Autoregression and one-way processing.** A decoder is naturally autoregressive: when it generates each new word, it takes the sequence already generated as input. To make that work, the decoder uses a causal attention mask to hide future tokens, so the model can only predict the next word from the past. That left-to-right, one-way mode matches text generation exactly.
- **A simpler architecture, and “emergent” ability.** Dropping the encoder is a huge simplification of the original Transformer. Researchers found that if you just train this simplified decoder-only model on huge, diverse data to “predict the next word,” emergent behavior appears. Even without being explicitly trained for it, and without a dedicated translation encoder, GPT can still “just” learn and do well at complex contextual tasks such as translation.

## What if you add an encoder?

Adding an encoder to GPT would return it to the original Transformer (encoder–decoder). How the model processes information, and what it is good at, would change:

- **A different way of processing information.** The model would no longer simply continue text left to right. The encoder would first read and process the entire input as a whole, producing an embedding that holds global context (in early RNNs this was the hidden state or context vector). The decoder would then generate the output token by token, conditioned on that encoded global vector.
- **A shift in use cases.** Models with an encoder are a more natural fit for sequence-to-sequence tasks: translating one language into another, or summarizing a long passage. Encoder-only models (like BERT) are mainly used for masked-token prediction (filling a missing word in the middle of a sentence), and they are strong at classification, sentiment, and other jobs that need bidirectional, global context.

In short, dropping the encoder is a design tradeoff. You lose the ability to read the input bidirectionally in full, but you get a radically simpler architecture. That decoder-only setup, trained at scale on next-token prediction, turned out to be enough for the model to learn complex language structure — the basis of the general-purpose LLMs we have today.

## The reversal curse

> In LLM research, the “reversal curse” means: if a model learns a one-way statement in training (e.g. “Tom Cruise’s mother is Mary”), it often cannot answer the reverse question (e.g. “Who is Mary’s son?”).
>
> The root cause is that, because of the causal mask and the left-to-right training objective, the model learns a strictly one-way sequence probability (B follows A). Lacking an encoder’s global, bidirectional read of context, it struggles to build a symmetric two-way mapping between A and B in its internal vector space.

GPT’s choice to drop the encoder and keep a decoder-only architecture is the architectural root of this behavior.

A few mechanisms explain why decoder-only models produce this failure:

**1. One-way, left-to-right autoregressive generation.** The GPT architecture is designed as a unidirectional, left-to-right autoregressive model. When generating each new word, it can only predict from the sequence that has already appeared.

**2. The causal attention mask.** To make sure the model only predicts the next word from the past, GPT’s self-attention uses a causal mask (also called masked attention). It forcibly hides future tokens, so when the model processes any given token it can only look at the current token and what came before. That is the opposite of standard self-attention in an encoder, which can see and understand the whole input in both directions. In short: by giving up the encoder’s bidirectional processing and keeping only a causally masked decoder, the model gained strong continuation and emergent abilities — and was also locked, at the mechanism level, into left-to-right one-way logic. That is the root of the reversal curse.
