---
title: "Why Do We Need Embeddings?"
date: "2026-03-19"
excerpt: "What is an embedding?"
tags: ["llm"]
---

Neural networks cannot directly process raw data formats like text, audio, or video. The core purpose of an embedding is to convert this human-readable, non-numeric, categorical data into dense vectors that a network can understand and compute over. Discrete objects become continuous “numbers” the computer can work with easily — that is, multidimensional arrays or vectors.

The ideas of “discrete” and “continuous” here can be understood on a few levels:

**Why is raw data like text discrete?** In mathematics and computer science, “discrete” means things are independent, separate, and non-continuous. Text is essentially categorical. For example, each word in a vocabulary (say “apple” and “orange”) is an independent symbol. In raw text form, you cannot find a smooth in-between word between “apple” and “orange,” and you cannot add, subtract, multiply, or divide them. They have no inherent numeric magnitude. That sharp, either-or quality is what “discrete” means. Because of it, they are incompatible with the math that deep learning depends on.

**Why is vector space continuous?** “Continuous” means values can be subdivided without limit, and can transition and be fine-tuned smoothly. Once we map discrete words to continuous-valued vectors, each word becomes a coordinate in a multidimensional space (a list of floats, e.g. `[0.3374, -0.1778, 0.9178]`). This space is called continuous for a few core reasons:

1. **It supports math and measuring relationships.** In a continuous space we can compute the dot product of two vectors and quantify how similar or aligned two concepts are. Words for similar ideas (different kinds of birds, say) sit closer together than unrelated words (countries and cities).
2. **It supports backpropagation and optimization.** Continuous vector representations are essential because large language models like GPT are deep networks trained with backpropagation. Backprop needs gradients (derivatives), which requires a smooth, continuous data space. Only then can the model keep making tiny numeric adjustments during training, optimizing the vector weights and learning the structure of the data.
