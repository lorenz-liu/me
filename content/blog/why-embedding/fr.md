---
title: "Pourquoi a-t-on besoin d’embeddings ?"
date: "2026-03-19"
excerpt: "Qu’est-ce qu’un embedding ?"
tags: ["llm"]
---

Les réseaux de neurones ne peuvent pas traiter directement des formats bruts comme le texte, l’audio ou la vidéo. Le but d’un embedding est précisément de convertir ces données catégorielles, non numériques, lisibles par un humain, en vecteurs denses qu’un réseau peut comprendre et sur lesquels il peut calculer. Les objets discrets deviennent alors des « nombres » continus que l’ordinateur manipule facilement — des tableaux ou vecteurs multidimensionnels.

Les notions de « discret » et de « continu » se comprennent à plusieurs niveaux :

**Pourquoi le texte brut est-il discret ?** En mathématiques et en informatique, « discret » signifie que les choses sont indépendantes, séparées, non continues. Le texte est essentiellement catégoriel. Chaque mot d’un vocabulaire (par exemple « pomme » et « orange ») est un symbole indépendant. Sous forme de texte brut, on ne trouve pas de mot intermédiaire fluide entre « pomme » et « orange », et on ne peut pas les additionner, les soustraire, les multiplier ou les diviser. Ils n’ont pas de grandeur numérique intrinsèque. Cette frontière nette, ce caractère « l’un ou l’autre », c’est le discret. À cause de cela, ils sont incompatibles avec les opérations dont dépend l’apprentissage profond.

**Pourquoi l’espace vectoriel est-il continu ?** « Continu » signifie que les valeurs peuvent se subdiviser à l’infini, et qu’on peut y faire des transitions et des ajustements lisses. Une fois les mots discrets projetés en vecteurs à valeurs continues, chaque mot devient un point dans un espace multidimensionnel (une liste de flottants, par exemple `[0.3374, -0.1778, 0.9178]`). Cet espace est dit continu pour quelques raisons essentielles :

1. **Il permet le calcul et la mesure des relations.** Dans un espace continu, on peut calculer le produit scalaire de deux vecteurs pour quantifier la similarité ou l’alignement de deux concepts. Les mots d’idées proches (différentes espèces d’oiseaux, par exemple) sont plus proches que des mots sans rapport (pays et villes).
2. **Il permet la rétropropagation et l’optimisation.** Les représentations vectorielles continues sont indispensables, car les grands modèles de langage comme GPT sont des réseaux profonds entraînés par rétropropagation. Celle-ci a besoin de gradients (dérivées), donc d’un espace de données lisse et continu. Ce n’est qu’alors que le modèle peut, pendant l’entraînement, ajuster minusculement les poids de ces vecteurs et apprendre la structure des données.
