---
title: "Options 101"
date: "2026-03-23"
excerpt: "The basics of options"
tags: ["options"]
---

## Options fundamentals

An option is an **asymmetric rights contract**.
You are buying a “right,” not an “obligation.”

* **Call:** the right to buy an asset later at a fixed price
* **Put:** the right to sell an asset later at a fixed price

Key terms:

* **Underlying:** the stock/ETF (e.g. VOO, QQQ)
* **Strike:** the agreed buy/sell price
* **Expiration**
* **Premium:** the option’s price (what you pay or receive)
* **Contract size:** usually 1 contract = 100 shares

## Four basic trades

This is the most important part. It is really **buyer vs seller + bullish vs bearish**.

### Buy Call

> Bet on a rally with a small amount of capital

* You think: **price will go up**
* Cost: pay premium
* Upside: theoretically unlimited
* Max loss: premium

### Sell Call

> Collect rent, but you can get squeezed

* You think: **price will not rally hard**
* Reward: collect premium
* Risk:

    * Naked: **unlimited risk**
    * Covered call: limited risk

### Buy Put

> The insured version of going short (defined risk)

* You think: **price will go down**
* Cost: premium
* Reward: the more it falls, the more you make
* Max loss: premium

### Sell Put

> A bit like “a limit bid to buy + collecting interest.” One of the most common strategies for long-term investors

* You think: **price will not crash / you are willing to buy lower**
* Reward: collect premium
* Risk: the underlying dumps (you have to take the shares)

## Payoff structure

| Trade | Makes money if | Max gain | Max loss |
| --------- | ---- | ------- | ------- |
| Buy Call  | Up   | Unlimited      | premium |
| Sell Call | Not up   | premium | Unlimited (naked)  |
| Buy Put   | Down   | Large      | premium |
| Sell Put  | Not down   | premium | Assigned down to 0    |

## Greeks: the core of option pricing

Greeks describe **how sensitive the option price is to different factors**.

### Delta $\Delta$ — directional sensitivity

* Meaning: if the underlying rises $1, how much the option rises
* Range:

    * Call: 0 ~ 1
    * Put: 0 ~ -1

Example:

* $\Delta$ = 0.6 → stock up $1, option up $0.6

> In essence: **a stand-in for position leverage**

### Gamma $\Gamma$ — how fast Delta changes

* Meaning: how sensitive Delta is to price changes

In essence: closer to expiration + ATM, $\Gamma$ is larger → moves get more violent

### Theta $\Theta$ — time decay

* Meaning: how much value is lost each day
* **The buyer’s enemy, the seller’s friend**

> In essence: time = how the seller gets paid

### Vega $v$ — volatility sensitivity

* Meaning: how implied volatility (IV) changes affect price

> In essence: IV up → options get more expensive

### Rho $\rho$ — rates (secondary)

* How rate changes affect the option
* Almost irrelevant in practice

## How the market prices it

Option price = **intrinsic value + time value**

### Intrinsic value

* Call: max(0, spot − strike)
* Put: max(0, strike − spot)

### Time value

Driven by three things:

* Time (longer is more expensive)
* Volatility (higher is more expensive)
* Uncertainty

## The key ideas

### Options are a probability game

* Sellers have a high win rate (they collect theta)
* Buyers have high payoff (they bet on a burst)

### IV is the core variable

* High IV → better to sell
* Low IV → better to buy

### Most options go to zero

* Theta decay is a structural edge

### Sell Put ≈ buying stock on a limit

* Plus you collect a premium on top
