---
title: "A Long-Term Bullish Options Strategy: LEAPS"
date: "2026-04-21"
excerpt: "Leaning on QQQ’s long-run national luck"
tags: ["options"]
---

## Core QQQ LEAPS setup
* **Starting capital:** $100,000 (or the same proportions)
* **Underlying:** QQQ (Nasdaq-100 ETF)
* **Expiration (DTE):** 650–800 days (2-year LEAPS)
* **Strike selection:** Delta 0.8 (deep in the money)
* **Allocation:** **60%** long options | **40%** cash reserve
* **Entry:** start the first position when QQQ drops **> 1%** on the day

## Three core management modules

### 1. Infinite refill (Roll Out) — maintaining time
* **Trigger:** price is calm or choppy, but remaining time **DTE < 300 days**.
* **Goal:** stay out of the theta-decay acceleration zone (the “death zone”) and keep a “permanent renewal.”
* **Action:** sell the current contract, buy back a new one with **DTE 700+** (keep Delta inside 0.9).
* **Effect:** pay a small debit in exchange for unlimited survival time.

### 2. Harvesting profits (Roll Out & Up) — locking in gains
* **Trigger:** QQQ keeps rallying, and the held contract’s **Delta rises above 0.9**.
* **Goal:** cut leverage, realize paper gains, refill the cash reserve.
* **Action:** sell the high-Delta contract, buy a **further-dated (DTE > 650)** and **higher-strike (Delta back to 0.7–0.8)** new contract.
* **Effect:** bring cash back (credit), lower position pressure, keep the long exposure.

### 3. Counter-trend sniping (adding in a bear) — the add rule
* **Preconditions:**
    1. Cash reserve > 10% of the book.
    2. More than 30 days since the last add (cooldown).
    3. The LEAPS is in the red, or Delta has fallen.

* **Add modes:**
    * **Heavy mode:** when cash > 40%, spend **10%** of the book in cash on a new contract.
    * **Standard mode:** when 10% < cash < 40%, spend **5%** of the book in cash on a new contract.

## Strategy logic

| Market | Action | Goal |
| :--- | :--- | :--- |
| **Strong rally** | **Roll Up** | Lock paper gains, cut leverage, refill cash |
| **Sideways** | **Roll Out** | Spend a little cash to buy more time |
| **Slow grind down** | **Wait** (cooldown) | Stay patient; do not add blindly |
| **Crash** | **Heavy snipe** | Use the 40% cash pool to pick up chips lower and average down hard |

## Executables

### Before the first position

The account is 100% cash.

When QQQ drops ≥ 1% on the day, start building.

Action: spend 60% of the book on QQQ LEAPS calls, keep 40% in cash.

Contract requirements: DTE between 650 and 800 days, Delta as close to 0.8 as possible, deep ITM calls.

If 60% of capital is not enough to buy at least 1 contract, do not start. Wait for the next QQQ down day ≥ 1%.

After the first fill, record that day and treat it as the first “add day” for the 30-day cooldown.

### After the first position

Check once after the close each day, in this priority order:

1. First, whether profits need harvesting
2. Then, whether time needs rolling
3. Last, whether a bear-market add is allowed
4. If none of those fire, keep holding

#### Case 1: after a rally, Delta > 0.9

Trigger: any held QQQ LEAPS call has Delta > 0.9.

Action: Roll Out & Up.

Specifically: sell that old Delta > 0.9 contract, buy a new QQQ LEAPS call.

New contract: DTE > 650 days, Delta back around 0.7, strike higher than the old one.

Target: this roll should preferably produce a credit — proceeds from selling the old contract exceed the cost of the new one.

Purpose: lock some paper gains, cut leverage, refill cash, keep the long QQQ exposure.

If you cannot find a new contract that meets the rules and produces a credit, do nothing. Hold and check again next session.

#### Case 2: DTE < 300, but Delta has not gone above 0.9

Trigger: any held QQQ LEAPS call has DTE < 300 and Delta ≤ 0.9.

Action: Roll Out.

Specifically: sell the old contract, buy a new long-dated QQQ LEAPS call.

New contract: DTE ≥ 700 days, Delta back around 0.8.

Target: a debit is allowed — you may pay to extend.

Purpose: keep the option out of the accelerated decay zone and put it back into long-dated LEAPS status.

If cash cannot cover the roll cost, skip it. Hold and check again next session.

#### Case 3: bear decline, Delta < 0.5

All three must hold:

Condition 1: any held QQQ LEAPS call has Delta < 0.5.

Condition 2: cash reserve > 10% of the book.

Condition 3: more than 30 days since the last add.

Only if all three are true is a bear add allowed.

If any one fails, do not add. Keep holding.

#### Case 4: bear add when cash ≥ 40%

Trigger: all “bear decline, Delta < 0.5” preconditions are met, and cash ≥ 40%.

Action: heavy mode.

Specifically: spend 10% of the book in cash on a new QQQ LEAPS call.

New contract: DTE 650–800 days, Delta as close to 0.8 as possible.

After the fill, record that day as the new “last add day” and restart the 30-day cooldown.

#### Case 5: bear add when 10% < cash < 40%

Trigger: all “bear decline, Delta < 0.5” preconditions are met, and cash is between 10% and 40%.

Action: standard mode.

Specifically: spend 5% of the book in cash on a new QQQ LEAPS call.

New contract: DTE 650–800 days, Delta as close to 0.8 as possible.

After the fill, record that day as the new “last add day” and restart the 30-day cooldown.

#### Case 6: Delta < 0.5, but cooldown is not over

Trigger: any LEAPS Delta < 0.5, but ≤ 30 days since the last add.

Action: do not add.

Purpose: avoid stacking adds in a continuous decline and burning cash too fast.

#### Case 7: Delta < 0.5, but cash ≤ 10%

Trigger: any LEAPS Delta < 0.5, but cash ≤ 10%.

Action: do not add.

Purpose: keep a minimum cash cushion; do not go fully invested and just take the hit.

#### Case 8: QQQ sideways or small chop

Trigger: no LEAPS with Delta > 0.9, none with DTE < 300, none with Delta < 0.5.

Action: no trade, keep holding.

Purpose: avoid pointless rolls, extra costs, and sloppy mistakes.

#### Case 9: QQQ grinding down, but Delta has not broken 0.5

Trigger: QQQ is down, but every LEAPS still has Delta ≥ 0.5.

Action: do not add, keep waiting.

Purpose: only fire the bear-add rule once the LEAPS is clearly hurt and Delta has broken 0.5.

#### Case 10: several LEAPS hit different rules at once

Fixed order:

First, handle Delta > 0.9 contracts: Roll Out & Up.

Second, handle DTE < 300 and Delta ≤ 0.9: Roll Out.

Third, check whether any Delta < 0.5 exists, and whether a bear add is allowed.

Why: Delta > 0.9 is profit management after a rally; DTE < 300 is time-risk management; Delta < 0.5 is the bear-add signal. Do not mix the three.
