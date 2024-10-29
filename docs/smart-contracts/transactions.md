---
title: Transaction format and flow
id: transactions
sidebar_position: 10
description: "There are two types of transaction in Pact smart contracts: transactions that execute in a single step and transactions that consist of more than one step."
---

# Transaction format and lifecycle

There are two types of transaction in Pact smart contracts: 

- Transactions that execute in a single step, identified in Pact code as `exec` transactions.
- Transactions that consist of more than one step, identified in Pact code as `cont` transactions.



## Atomic execution

A single message sent into the blockchain to be evaluated by Pact is _atomic_: the transaction succeeds as a unit, or does not succeed at all, known as "transactions" in database literature. There is no explicit support for rollback handling, except in [multi-step transactions](/reference/pacts).

I personally think of things like cross-chain transfers as "multiple-transaction workflows", just because technically, each part is a transaction

A "transaction" means to me specifically that either all or none of it happens, but with a cross-chain transfer, you can just not complete the final step

With that out of the way, just the lifecycle of a transaction

You start by submitting this transaction to a node, usually a node you control, via the pact /send endpoint

This does a first pass at validating the transaction just for your convenience, so that any obvious issues with the transaction can be caught early and reported, specifically issues that would cause the transaction to be so invalid that it doesn't even make it into a block

Like broken signatures, insufficient funds to pay for gas, invalid metadata like TTL expiration

Then it inserts the transaction into that node's mempool, which yes is a place for transactions to wait before being included in a block, but it's not exactly a queue, rather the order in which transactions make it into blocks is based on their gas price, not their creation time

Higher gas price, that's a bribe to miners to include the transaction in the block sooner

Anyway all nodes synchronize their mempool contents with one another

Eventually a mining node that has the transaction in its mempool will include it into its next block, and the block will be mined

The block with the transaction is then sent around the network, including back to the node that the transaction was submitted to originally, at which point the pact /poll endpoint will return the result of that transaction