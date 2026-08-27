---
title: "Une stratégie d’options haussière de long terme : les LEAPS"
date: "2026-04-21"
excerpt: "S’appuyer sur la chance de long terme du QQQ"
tags: ["options"]
---

## Setup central QQQ LEAPS
* **Capital initial :** 100 000 $ (ou les mêmes proportions)
* **Sous-jacent :** QQQ (ETF Nasdaq-100)
* **Expiration (DTE) :** 650–800 jours (LEAPS à 2 ans)
* **Choix du strike :** Delta 0.8 (deep in the money)
* **Allocation :** **60 %** d’options longues | **40 %** de réserve cash
* **Entrée :** commencer la première position quand le QQQ baisse de **> 1 %** dans la séance

## Trois modules de gestion

### 1. Recharge infinie (Roll Out) — entretenir le temps
* **Déclencheur :** le prix est calme ou haché, mais le temps restant **DTE < 300 jours**.
* **But :** rester hors de la zone d’accélération du theta (la « zone de mort ») et garder un « renouvellement permanent ».
* **Action :** vendre le contrat actuel, racheter un nouveau contrat **DTE 700+** (Delta restant sous 0.9).
* **Effet :** payer un petit débit pour une survie en temps illimitée.

### 2. Récolter les profits (Roll Out & Up) — verrouiller les gains
* **Déclencheur :** le QQQ continue de monter, et le **Delta du contrat détenu passe au-dessus de 0.9**.
* **But :** réduire le levier, réaliser les plus-values latentes, recharger la réserve cash.
* **Action :** vendre le contrat à Delta élevé, acheter un nouveau contrat **plus long (DTE > 650)** et **de strike plus haut (Delta revenu à 0.7–0.8)**.
* **Effet :** ramener du cash (crédit), baisser la pression de position, garder l’exposition haussière.

### 3. Sniper à contre-tendance (renforcer en bear) — la règle d’ajout
* **Conditions préalables :**
    1. Réserve cash > 10 % du book.
    2. Plus de 30 jours depuis le dernier ajout (cooldown).
    3. Les LEAPS sont en moins-value, ou le Delta a baissé.

* **Modes d’ajout :**
    * **Mode lourd :** si cash > 40 %, dépenser **10 %** du book en cash pour un nouveau contrat.
    * **Mode standard :** si 10 % < cash < 40 %, dépenser **5 %** du book en cash pour un nouveau contrat.

## Logique de la stratégie

| Marché | Action | Objectif |
| :--- | :--- | :--- |
| **Forte hausse** | **Roll Up** | Verrouiller les plus-values, baisser le levier, recharger le cash |
| **Range** | **Roll Out** | Dépenser un peu de cash pour acheter plus de temps |
| **Baisse lente** | **Attendre** (cooldown) | Rester patient ; ne pas renforcer à l’aveugle |
| **Krach** | **Sniper lourd** | Utiliser le pool de 40 % de cash pour ramasser plus bas et moyenner fort |

## Exécutables

### Avant la première position

Le compte est 100 % cash.

Quand le QQQ baisse ≥ 1 % dans la séance, on commence à construire.

Action : dépenser 60 % du book en calls LEAPS QQQ, garder 40 % en cash.

Exigences du contrat : DTE entre 650 et 800 jours, Delta aussi proche que possible de 0.8, calls deep ITM.

Si 60 % du capital ne suffit pas à acheter au moins 1 contrat, on n’entre pas. On attend le prochain jour QQQ ≥ 1 % à la baisse.

Après le premier fill, on enregistre ce jour et on le traite comme premier « jour d’ajout » pour le cooldown de 30 jours.

### Après la première position

Vérifier une fois après la clôture, dans cet ordre de priorité :

1. D’abord, faut-il récolter les profits
2. Ensuite, faut-il rouler le temps
3. Enfin, un ajout bear est-il autorisé
4. Si rien ne se déclenche, on reste investi

#### Cas 1 : après une hausse, Delta > 0.9

Déclencheur : n’importe quel call LEAPS QQQ détenu a un Delta > 0.9.

Action : Roll Out & Up.

Concrètement : vendre ce vieux contrat Delta > 0.9, acheter un nouveau call LEAPS QQQ.

Nouveau contrat : DTE > 650 jours, Delta revenu autour de 0.7, strike plus haut que l’ancien.

Objectif : ce roll devrait de préférence produire un crédit — le produit de la vente de l’ancien dépasse le coût du nouveau.

But : verrouiller une partie des plus-values, baisser le levier, recharger le cash, garder l’exposition longue QQQ.

Si on ne trouve pas de nouveau contrat qui respecte les règles et produit un crédit, on ne fait rien. On tient et on revérifie à la séance suivante.

#### Cas 2 : DTE < 300, mais le Delta n’a pas dépassé 0.9

Déclencheur : n’importe quel call LEAPS QQQ détenu a DTE < 300 et Delta ≤ 0.9.

Action : Roll Out.

Concrètement : vendre l’ancien contrat, acheter un nouveau call LEAPS QQQ long terme.

Nouveau contrat : DTE ≥ 700 jours, Delta revenu autour de 0.8.

Objectif : un débit est autorisé — on peut payer pour prolonger.

But : sortir l’option de la zone d’érosion accélérée et la remettre en statut LEAPS long terme.

Si le cash ne couvre pas le coût du roll, on passe. On tient et on revérifie à la séance suivante.

#### Cas 3 : baisse bear, Delta < 0.5

Les trois conditions doivent tenir :

Condition 1 : n’importe quel call LEAPS QQQ détenu a un Delta < 0.5.

Condition 2 : réserve cash > 10 % du book.

Condition 3 : plus de 30 jours depuis le dernier ajout.

Ce n’est que si les trois sont vraies qu’un ajout bear est autorisé.

Si l’une échoue, on n’ajoute pas. On tient.

#### Cas 4 : ajout bear quand cash ≥ 40 %

Déclencheur : toutes les préconditions « baisse bear, Delta < 0.5 » sont remplies, et cash ≥ 40 %.

Action : mode lourd.

Concrètement : dépenser 10 % du book en cash pour un nouveau call LEAPS QQQ.

Nouveau contrat : DTE 650–800 jours, Delta aussi proche que possible de 0.8.

Après le fill, enregistrer ce jour comme nouveau « dernier jour d’ajout » et relancer le cooldown de 30 jours.

#### Cas 5 : ajout bear quand 10 % < cash < 40 %

Déclencheur : toutes les préconditions « baisse bear, Delta < 0.5 » sont remplies, et le cash est entre 10 % et 40 %.

Action : mode standard.

Concrètement : dépenser 5 % du book en cash pour un nouveau call LEAPS QQQ.

Nouveau contrat : DTE 650–800 jours, Delta aussi proche que possible de 0.8.

Après le fill, enregistrer ce jour comme nouveau « dernier jour d’ajout » et relancer le cooldown de 30 jours.

#### Cas 6 : Delta < 0.5, mais le cooldown n’est pas fini

Déclencheur : n’importe quel LEAPS a un Delta < 0.5, mais ≤ 30 jours depuis le dernier ajout.

Action : ne pas ajouter.

But : éviter d’empiler les ajouts dans une baisse continue et de brûler le cash trop vite.

#### Cas 7 : Delta < 0.5, mais cash ≤ 10 %

Déclencheur : n’importe quel LEAPS a un Delta < 0.5, mais cash ≤ 10 %.

Action : ne pas ajouter.

But : garder un coussin cash minimum ; ne pas se retrouver fully invested à encaisser le choc.

#### Cas 8 : QQQ en range ou petit chop

Déclencheur : aucun LEAPS avec Delta > 0.9, aucun avec DTE < 300, aucun avec Delta < 0.5.

Action : pas de trade, on tient.

But : éviter les rolls inutiles, les coûts extra et les erreurs de sloppy.

#### Cas 9 : QQQ qui grince à la baisse, mais le Delta n’a pas cassé 0.5

Déclencheur : le QQQ baisse, mais tous les LEAPS ont encore un Delta ≥ 0.5.

Action : ne pas ajouter, continuer d’attendre.

But : ne déclencher la règle d’ajout bear que lorsque les LEAPS sont clairement blessés et que le Delta a cassé 0.5.

#### Cas 10 : plusieurs LEAPS touchent des règles différentes en même temps

Ordre fixe :

D’abord, traiter les contrats Delta > 0.9 : Roll Out & Up.

Ensuite, traiter DTE < 300 et Delta ≤ 0.9 : Roll Out.

Enfin, vérifier s’il existe un Delta < 0.5, et si un ajout bear est autorisé.

Pourquoi : Delta > 0.9, c’est la gestion des profits après une hausse ; DTE < 300, c’est le risque-temps ; Delta < 0.5, c’est le signal d’ajout bear. Ne pas mélanger les trois.
