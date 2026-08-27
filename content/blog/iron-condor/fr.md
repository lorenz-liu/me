---
title: "Une stratégie d’options pour les marchés range : l’iron condor"
date: "2026-03-23"
excerpt: "Gagner en pariant qu’un titre reste dans une fourchette pendant un temps donné"
tags: ["options"]
---

## Stratégie

Un iron condor combine quatre positions d’options à quatre strikes différents ($K_1 < K_2 < K_3 < K_4$) :

| Couche | Type d’option | Action | Strike | Flux | Rôle |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Aile lointaine (extérieure)** | **Put** | **Achat (Long)** | $K_1$ | Sortie (-) | Plafonner le risque extrême baissier (plancher) |
| **Jambe de crédit (intérieure)** | **Put** | **Vente (Short)** | $K_2$ | **Entrée (+)** | Encaisser la prime ; parier que $K_2$ ne casse pas |
| **Jambe de crédit (intérieure)** | **Call** | **Vente (Short)** | $K_3$ | **Entrée (+)** | Encaisser la prime ; parier que $K_3$ ne casse pas |
| **Aile lointaine (extérieure)** | **Call** | **Achat (Long)** | $K_4$ | Sortie (-) | Plafonner le risque extrême haussier (plafond) |

## Crédit net initial $R$

C’est le **montant total reçu à l’ouverture**, et aussi le **profit maximum potentiel ($R$)** de la stratégie :

**$R = (\text{Put}_{K2} + \text{Call}_{K3}) - (\text{Put}_{K1} + \text{Call}_{K4})$**

> Comme $K_2$ et $K_3$ sont plus proches du spot, le crédit de leur vente dépasse nécessairement le débit d’achat de $K_1$ et $K_4$, donc $R$ est toujours positif.

## P&L à l’expiration

Soit $S_T$ le prix du sous-jacent à l’expiration. Le P&L final $\Pi$ se calcule ainsi :

| Prix de clôture ($S_T$) | P&L final ($\Pi$) | Situation |
| :--- | :--- | :--- |
| **$S_T \leq K_1$** | **$R - (K_2 - K_1)$** | **Perte max** : le plafond d’assurance est touché |
| **$K_1 < S_T < K_2$** | **$R - (K_2 - S_T)$** | **Perte partielle / équilibre** : on rend de la prime |
| **$K_2 \leq S_T \leq K_3$** | **$R$** | **Profit max** : toutes les options expirent sans valeur |
| **$K_3 < S_T < K_4$** | **$R - (S_T - K_3)$** | **Perte partielle / équilibre** : on rend de la prime |
| **$S_T \geq K_4$** | **$R - (K_4 - K_3)$** | **Perte max** : le plafond d’assurance est touché |

## Indicateurs clés

* **Profit max** : $R$
* **Risque max** : $W - R$ (en supposant une largeur d’ailes égale $W = K_2 - K_1 = K_4 - K_3$)
* **Seuil haut** : $K_3 + R$
* **Seuil bas** : $K_2 - R$

## Après l’expiration

Le traitement à l’expiration dépend du fait que l’option soit **dans la monnaie (ITM)** ou **hors de la monnaie (OTM)** à cet instant.

En bref : **OTM, elle expire sans valeur ; ITM, elle est exercée automatiquement.**

| État | Définition | Résultat | Que faire |
| :--- | :--- | :--- | :--- |
| **OTM** | Prix entre $K_2$ et $K_3$ | **Expire sans valeur** | **Rien à faire.** Les options valent zéro ; vous gardez le crédit $R$. |
| **ITM** | Le prix a franchi votre strike | **Exercice / assignation auto** | **Dangereux.** Le broker force un achat ou une vente d’actions au strike. |

Si le call $K_3$ que vous avez vendu est enfoncé (prix > $K_3$) à l’expiration :
* **Assignation :** vous êtes forcé de vendre 100 actions à $K_3$.
* **Le risque :** si vous n’avez pas déjà ces 100 actions, vous devenez **short stock**.
* **Pression de marge :** une position short actions demande beaucoup de marge. Si le compte ne suit pas, vous pouvez exploser ou être liquidé de force.

Le système gère l’expiration, mais **n’attendez pas le règlement automatique**.
1. **Prendre ses profits :** une fois 80 %–90 % du crédit attendu en poche, clôturez à la main (buy to close). Inutile de prendre le risque des dernières heures pour quelques cents.
2. **Près des strikes shorts :** si le prix est très proche de $K_2$ ou $K_3$, **clôturez**. Dans les minutes après la clôture, le prix peut encore bouger et faire passer une option OTM en ITM, d’où un exercice surprise (pin risk).
3. **Ailes touchées :** vous avez acheté $K_1$ ou $K_4$ comme assurance, mais si vous laissez les deux côtés s’exercer, vous payez deux commissions élevées.
