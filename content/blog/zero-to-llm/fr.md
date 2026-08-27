---
title: "Entraîner un LLM from scratch : le pipeline complet"
date: "2026-03-19"
excerpt: "Trois étapes principales"
tags: ["llm"]
---

**Trois étapes principales**, qui couvrent le traitement des données, l’écriture de l’architecture, le préentraînement, et deux formes de fine-tuning. Voici un résumé détaillé du pipeline :

**Étape 1 : construire l’architecture du LLM et préparer les données.** L’objectif est d’implémenter tout le code de bas niveau from scratch, pour que le modèle accepte du texte et ait déjà la base architecturale pour en générer.

- **Étape 1 : préparation et échantillonnage des données.** Un réseau ne traite pas le texte directement, il faut donc d’abord le transformer. Un tokenizer BPE (byte-pair encoding) découpe le texte en tokens et les convertit en IDs. Ces IDs deviennent des embeddings de tokens, auxquels on ajoute des embeddings de position pour conserver l’ordre. Enfin, une fenêtre glissante échantillonne le texte pour construire des paires entrée/cible pour la prédiction du token suivant.
- **Étape 2 : écrire le mécanisme d’attention.** L’attention est le cœur du Transformer. On part de la self-attention la plus simple, puis on introduit des matrices de poids entraînables Query, Key et Value. Pour la génération de texte, il faut un masque d’attention causale, qui cache les tokens futurs afin que le modèle ne prédise le mot suivant qu’à partir du passé. Après un dropout pour limiter le surapprentissage, on étend le tout en attention multi-têtes, pour que le modèle suive en parallèle différentes caractéristiques de l’entrée.
- **Étape 3 : implémenter une architecture de type GPT.** On assemble l’attention avec le reste des briques : normalisation de couche pour stabiliser l’entraînement, un réseau feed-forward avec GELU, et des connexions raccourcies qui aident les gradients à traverser les piles profondes. Ces composants forment un bloc Transformer, empilé plusieurs fois, jusqu’à un modèle complet de type GPT.

**Étape 2 : préentraîner sur des données non annotées.** Le modèle apprend les régularités de la langue, passant d’un réseau initialisé au hasard à un modèle de fondation capable de produire du texte cohérent.

- **Étape 4 : préentraînement et évaluation.** Par apprentissage auto-supervisé, le modèle s’entraîne sur de grands corpus non annotés, avec pour objectif de prédire le token suivant. La cross-entropy sert à suivre en continu les performances train et validation.
- **Étape 5 : stratégies de décodage et chargement des poids.** Pour contrôler la diversité et la créativité, et éviter un texte figé, le pipeline introduit le temperature scaling et le top-k sampling.

**Étape 3 : fine-tuner pour une tâche précise.** Après le préentraînement, le modèle n’a qu’une capacité basique de continuation. Le fine-tuning l’adapte à une tâche. Deux paradigmes courants :

- **Étape 6 : fine-tuning de classification.** On apprend au modèle à classer du texte (par exemple du spam). Cela implique de modifier l’architecture : remplacer la couche de sortie sur un immense vocabulaire par une petite tête (deux nœuds pour « spam » / « pas spam »). Après entraînement sur des données labellisées, le modèle ne produit plus que ces classes.
- **Étape 7 : fine-tuning d’instruction.** Pour que le modèle suive des consignes humaines à la ChatGPT (par exemple « mets cette phrase au passif »), il faut un fine-tuning d’instruction supervisé. Cela demande un dataset au format instruction–entrée–sortie (format Alpaca, par exemple). Lors du batching, des placeholders spéciaux (comme -100) masquent le padding et l’instruction elle-même, pour que la loss se concentre entièrement sur la réponse correcte.
- **Étape 8 : évaluation et fine-tuning efficace.** Après le fine-tuning d’instruction, on peut appeler un LLM externe plus fort (par exemple un Llama 3 local) pour noter automatiquement les réponses. Des méthodes efficaces comme LoRA (adaptation de rang faible) ne mettent à jour qu’une infime partie des paramètres (en insérant de petites matrices A et B), ce qui abaisse fortement le coût du fine-tuning de grands modèles sur du matériel grand public.
