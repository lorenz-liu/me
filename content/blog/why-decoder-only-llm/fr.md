---
title: "Pourquoi GPT n’utilise-t-il qu’un décodeur ?"
date: "2026-03-19"
excerpt: "Pourquoi garder seulement le décodeur ? Que se passe-t-il si on ajoute un encodeur ? La malédiction d’inversion ?"
tags: ["llm"]
---

On peut comprendre pourquoi il suffit de garder le décodeur — et ce qui change si l’on ajoute un encodeur — selon quelques axes :

## Pourquoi ne garder que le décodeur ?

- **Adéquation à la tâche.** Dans le Transformer d’origine, le modèle était conçu pour la traduction. L’encodeur lit tout l’entrée et l’encode en vecteurs ; le décodeur prend ces vecteurs et génère la traduction token par token. GPT (Generative Pretrained Transformers) vise les tâches génératives : poursuivre un texte, écrire du code, etc.
- **Autorégression et traitement à sens unique.** Un décodeur est naturellement autorégressif : à chaque nouveau mot, il prend comme entrée la séquence déjà générée. Pour cela, il utilise un masque d’attention causale qui cache les tokens futurs, afin que le modèle ne prédise le mot suivant qu’à partir du passé. Ce mode gauche-droite correspond exactement à la génération de texte.
- **Architecture plus simple, et capacités « émergentes ».** Abandonner l’encodeur est une simplification radicale du Transformer d’origine. Les chercheurs ont constaté qu’en entraînant simplement ce décodeur-only sur d’énormes données diversifiées à « prédire le mot suivant », des comportements émergents apparaissent. Même sans entraînement explicite, et sans encodeur dédié à la traduction, GPT apprend quand même à bien faire des tâches contextuelles complexes comme la traduction.

## Et si l’on ajoute un encodeur ?

Ajouter un encodeur à GPT, ce serait revenir au Transformer d’origine (encodeur–décodeur). La façon de traiter l’information, et les cas d’usage, changeraient :

- **Une autre façon de traiter l’information.** Le modèle ne se contenterait plus de poursuivre le texte de gauche à droite. L’encodeur lirait d’abord l’entrée entière et produirait un embedding de contexte global (dans les RNN anciens, l’état caché ou le vecteur de contexte). Le décodeur générerait ensuite la sortie token par token, conditionné par ce vecteur global.
- **Un déplacement des cas d’usage.** Les modèles avec encodeur conviennent plus naturellement aux tâches sequence-to-sequence : traduire une langue dans une autre, ou résumer un long texte. Les modèles encodeur-only (comme BERT) servent surtout à la prédiction de tokens masqués (retrouver un mot manquant au milieu d’une phrase), et sont forts en classification, sentiment, et autres tâches qui demandent une lecture bidirectionnelle du contexte global.

En résumé, abandonner l’encodeur est un arbitrage de design. On perd la lecture bidirectionnelle complète de l’entrée, mais on gagne une architecture radicalement plus simple. Ce setup décodeur-only, entraîné à grande échelle sur la prédiction du token suivant, s’est révélé suffisant pour que le modèle apprenne la structure complexe du langage — la base des LLM généralistes d’aujourd’hui.

## La malédiction d’inversion

> Dans la recherche sur les LLM, la « malédiction d’inversion » (reversal curse) désigne ceci : si un modèle apprend en entraînement un énoncé à sens unique (par exemple « la mère de Tom Cruise est Mary »), il ne sait souvent pas répondre à la question inverse (par exemple « qui est le fils de Mary ? »).
>
> La cause profonde : à cause du masque causal et de l’objectif d’entraînement gauche-droite, le modèle apprend une probabilité de séquence strictement unidirectionnelle (B suit A). Sans la lecture globale et bidirectionnelle d’un encodeur, il a du mal à construire dans son espace vectoriel interne une correspondance symétrique entre A et B.

Le choix de GPT d’abandonner l’encodeur pour un architecture décodeur-only est la racine architecturale de ce phénomène.

Quelques mécanismes expliquent pourquoi les modèles décodeur-only produisent cette faille :

**1. Génération autorégressive à sens unique, gauche-droite.** L’architecture GPT est conçue comme un modèle autorégressif unidirectionnel, de gauche à droite. À chaque nouveau mot, elle ne peut prédire qu’à partir de la séquence déjà apparue.

**2. Le masque d’attention causale.** Pour que le modèle ne prédise le mot suivant qu’à partir du passé, l’auto-attention de GPT utilise un masque causal (aussi appelé attention masquée). Il cache de force les tokens futurs, si bien qu’en traitant un token donné le modèle ne voit que le présent et le passé. C’est l’inverse de l’auto-attention standard d’un encodeur, qui voit et comprend toute l’entrée dans les deux sens. En bref : en abandonnant le traitement bidirectionnel de l’encodeur et en ne gardant qu’un décodeur masqué causalement, le modèle a gagné de fortes capacités de continuation et d’émergence — et s’est aussi verrouillé, au niveau du mécanisme, dans une logique à sens unique gauche-droite. C’est la racine de la malédiction d’inversion.
