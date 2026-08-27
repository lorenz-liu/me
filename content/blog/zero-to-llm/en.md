---
title: "Training an LLM from Scratch: The Full Pipeline"
date: "2026-03-19"
excerpt: "Three main stages"
tags: ["llm"]
---

**Three main stages**, covering data processing, writing the architecture, pretraining, and two kinds of fine-tuning. Here is a detailed summary of the full pipeline:

**Stage 1: Build the LLM architecture and prepare the data.** The goal here is to implement all the underlying code from scratch, so the model can take text in and has the architectural basis to generate text.

- **Step 1: Data preparation and sampling.** Neural networks cannot process text directly, so the data has to be processed first. A BPE (byte-pair encoding) tokenizer splits text into tokens and maps them to token IDs. Those IDs are then turned into token embeddings, and positional embeddings are added to keep word order. Finally, a sliding window samples the text to build input/target pairs for next-token prediction.
- **Step 2: Write the attention mechanism.** Attention is the core of the Transformer. Start from the simplest self-attention, then introduce trainable Query, Key, and Value weight matrices. For text generation you must add a causal attention mask, hiding future tokens so the model can only predict the next word from the past. After adding dropout to reduce overfitting, extend it to multi-head attention so the model can attend to different features of the input in parallel.
- **Step 3: Implement a full GPT-style architecture.** Assemble attention with the rest of the deep-learning pieces: layer normalization to stabilize training, a feed-forward network with GELU, and shortcut connections that help gradients flow through deep stacks. Combine these into a Transformer block, stack it many times, and you have a complete GPT-like model.

**Stage 2: Pretrain on unlabeled data.** The model learns the regularities of language, going from a randomly initialized network to a foundation model that can generate coherent text.

- **Step 4: Run pretraining and evaluation.** Through self-supervised learning, the model trains on large-scale unlabeled text, with the objective of predicting the next token in the sequence. Cross-entropy loss is used throughout to monitor train and validation performance.
- **Step 5: Decoding strategies and loading weights.** To control diversity and creativity, and to avoid stiff, deterministic output, the pipeline introduces temperature scaling and top-k sampling.

**Stage 3: Fine-tune for a specific task.** After pretraining, the model only has basic continuation ability. Fine-tuning adapts it to a specific job. Two common paradigms:

- **Step 6: Classification fine-tuning.** Fine-tune the model to classify text (for example, spotting spam). This means changing the architecture: replace the original next-token output layer over a huge vocabulary with a tiny new head (two nodes for “spam” vs “not spam”). After training on labeled data, the model can only emit those class predictions.
- **Step 7: Instruction fine-tuning.** To make the model follow human requests the way ChatGPT does (e.g. “rewrite this in the passive voice”), you need supervised instruction tuning. That requires a dataset with an instruction–input–output structure (Alpaca format, for example). When batching, special placeholders (like -100) mask padding tokens and the instruction itself, so the loss focuses entirely on generating the correct response.
- **Step 8: Evaluation and parameter-efficient fine-tuning.** After instruction tuning, you can call a stronger external LLM (for example a local Llama 3) to score responses automatically. Efficient methods like LoRA (low-rank adaptation) update only a tiny number of parameters (inserting small A and B matrices), which cuts the cost of fine-tuning large models on consumer hardware.
