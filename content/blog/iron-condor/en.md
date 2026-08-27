---
title: "An Options Strategy for Range-Bound Markets: the Iron Condor"
date: "2026-03-23"
excerpt: "Profit by betting a stock stays inside a range for a period of time"
tags: ["options"]
---

## Strategy

An iron condor is four option positions at four different strikes ($K_1 < K_2 < K_3 < K_4$):

| Layer | Option type | Action | Strike | Cash flow | Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Far wing (outer)** | **Put** | **Buy (Long)** | $K_1$ | Outflow (-) | Cap downside tail risk (floor) |
| **Main credit leg (inner)** | **Put** | **Sell (Short)** | $K_2$ | **Inflow (+)** | Collect premium; bet it does not break $K_2$ |
| **Main credit leg (inner)** | **Call** | **Sell (Short)** | $K_3$ | **Inflow (+)** | Collect premium; bet it does not break $K_3$ |
| **Far wing (outer)** | **Call** | **Buy (Long)** | $K_4$ | Outflow (-) | Cap upside tail risk (ceiling) |

## Initial net credit $R$

This is the **total you receive up front** when you open the trade, and also the strategy’s **maximum potential profit ($R$)**:

**$R = (\text{Put}_{K2} + \text{Call}_{K3}) - (\text{Put}_{K1} + \text{Call}_{K4})$**

> Because $K_2$ and $K_3$ are closer to spot, the credit from selling them is necessarily larger than the debit from buying $K_1$ and $K_4$, so $R$ is always positive.

## Expiration P&L

Let the underlying price at expiration be $S_T$. Final P&L $\Pi$ works as follows:

| Closing price ($S_T$) | Final P&L ($\Pi$) | What happened |
| :--- | :--- | :--- |
| **$S_T \leq K_1$** | **$R - (K_2 - K_1)$** | **Max loss**: insurance cap is hit |
| **$K_1 < S_T < K_2$** | **$R - (K_2 - S_T)$** | **Partial loss / breakeven**: giving premium back |
| **$K_2 \leq S_T \leq K_3$** | **$R$** | **Max profit**: all options expire worthless |
| **$K_3 < S_T < K_4$** | **$R - (S_T - K_3)$** | **Partial loss / breakeven**: giving premium back |
| **$S_T \geq K_4$** | **$R - (K_4 - K_3)$** | **Max loss**: insurance cap is hit |

## Key metrics

* **Max profit**: $R$
* **Max risk**: $W - R$ (assuming equal wing width $W = K_2 - K_1 = K_4 - K_3$)
* **Upper breakeven**: $K_3 + R$
* **Lower breakeven**: $K_2 - R$

## After expiration

What happens at expiration depends on whether the option is **in the money (ITM)** or **out of the money (OTM)** at that moment.

Simply: **OTM expires worthless; ITM is exercised automatically.**

| State | Definition | Result | What to do |
| :--- | :--- | :--- | :--- |
| **OTM** | Price between $K_2$ and $K_3$ | **Expires worthless** | **Do nothing.** Options go to zero; you keep credit $R$. |
| **ITM** | Price has crossed your strike | **Auto-exercise / assignment** | **Dangerous.** The broker will force a buy or sell of stock at the strike. |

If the $K_3$ call you sold is breached (price > $K_3$) at expiration:
* **Assignment:** you are forced to sell 100 shares at $K_3$.
* **The risk:** if you do not already hold those 100 shares, you become **short stock**.
* **Margin pressure:** a short stock position needs a lot of margin. If the account cannot support it, you can blow up or get force-liquidated.

The system will handle expiration, but **do not sit and wait for automatic settlement**.
1. **Take profits:** once you have captured 80%–90% of the expected credit, close manually (buy to close). There is no point taking the last few hours of gap risk for the last few cents.
2. **Near the short strikes:** if price is very close to $K_2$ or $K_3$, **close it**. In the minutes after the close, price can still move, flipping an OTM option ITM and triggering unexpected exercise (pin risk).
3. **Wings getting hit:** you bought $K_1$ or $K_4$ as insurance, but if you let both sides exercise, you pay two fat commission bills.
