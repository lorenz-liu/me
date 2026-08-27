---
title: "Options 101"
date: "2026-03-23"
excerpt: "Les bases des options"
tags: ["options"]
---

## L’essentiel des options

Une option est un **contrat de droit asymétrique**.
Vous achetez un « droit », pas une « obligation ».

* **Call :** le droit d’acheter plus tard un actif à un prix fixe
* **Put :** le droit de vendre plus tard un actif à un prix fixe

Termes clés :

* **Sous-jacent (Underlying) :** l’action / l’ETF (ex. VOO, QQQ)
* **Strike :** le prix d’achat / vente convenu
* **Expiration**
* **Prime (Premium) :** le prix de l’option (ce que vous payez ou encaissez)
* **Taille de contrat :** en général 1 contrat = 100 actions

## Quatre opérations de base

C’est la partie la plus importante. Au fond : **acheteur vs vendeur + haussier vs baissier**.

### Buy Call — acheter un call

> Parier à la hausse avec peu de capital

* Vous pensez : **le prix va monter**
* Coût : payer la prime
* Gain : théoriquement illimité
* Perte max : la prime

### Sell Call — vendre un call

> Encaisser un loyer, mais on peut se faire comprimer

* Vous pensez : **le prix ne va pas flamber**
* Gain : encaisser la prime
* Risque :

    * Nu (naked) : **risque illimité**
    * Couvert (covered call) : risque limité

### Buy Put — acheter un put

> La version assurée du short (risque défini)

* Vous pensez : **le prix va baisser**
* Coût : la prime
* Gain : plus ça baisse, plus vous gagnez
* Perte max : la prime

### Sell Put — vendre un put

> Un peu comme « un ordre limite d’achat + des intérêts ». L’une des stratégies les plus utilisées par les investisseurs de long terme

* Vous pensez : **le prix ne va pas s’effondrer / vous acceptez d’acheter plus bas**
* Gain : encaisser la prime
* Risque : le sous-jacent s’écrase (il faut prendre les titres)

## Structure de payoff

| Opération | Gagne si | Gain max | Perte max |
| --------- | ---- | ------- | ------- |
| Buy Call  | Hausse   | Illimité      | prime |
| Sell Call | Pas de hausse   | prime | Illimité (naked)  |
| Buy Put   | Baisse   | Large      | prime |
| Sell Put  | Pas de baisse   | prime | Assigné jusqu’à 0    |

## Les Grecs : le cœur du pricing

Les Grecs décrivent **la sensibilité du prix de l’option à différents facteurs**.

### Delta $\Delta$ — sensibilité directionnelle

* Signifie : si le sous-jacent monte de $1, de combien monte l’option
* Plage :

    * Call : 0 ~ 1
    * Put : 0 ~ -1

Exemple :

* $\Delta$ = 0.6 → l’action +$1, l’option +$0.6

> En essence : **un proxy de levier de position**

### Gamma $\Gamma$ — vitesse de changement du Delta

* Signifie : à quel point le Delta est sensible au prix

En essence : plus on est proche de l’expiration + ATM, plus $\Gamma$ est grand → les mouvements sont plus violents

### Theta $\Theta$ — érosion du temps

* Signifie : combien de valeur se perd chaque jour
* **L’ennemi de l’acheteur, l’ami du vendeur**

> En essence : le temps = la façon dont le vendeur est payé

### Vega $v$ — sensibilité à la volatilité

* Signifie : l’effet d’un changement d’implied volatility (IV) sur le prix

> En essence : IV en hausse → les options coûtent plus cher

### Rho $\rho$ — les taux (secondaire)

* L’effet d’un changement de taux
* Presque négligeable en pratique

## Comment le marché price

Prix de l’option = **valeur intrinsèque + valeur temps**

### Valeur intrinsèque

* Call : max(0, spot − strike)
* Put : max(0, strike − spot)

### Valeur temps

Pilotée par trois choses :

* Le temps (plus long = plus cher)
* La volatilité (plus haute = plus cher)
* L’incertitude

## Les idées clés

### Les options sont un jeu de probabilités

* Les vendeurs ont un taux de réussite élevé (ils encaissent le theta)
* Les acheteurs ont un payoff élevé (ils parient sur une explosion)

### L’IV est la variable centrale

* IV haute → plutôt vendre
* IV basse → plutôt acheter

### La plupart des options finissent à zéro

* Le theta decay est un avantage structurel

### Sell Put ≈ acheter l’action en limite

* En plus, vous encaissez une prime
