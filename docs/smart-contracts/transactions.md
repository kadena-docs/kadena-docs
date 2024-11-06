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

Most transactions execute as a single step with a single message that is sent to a blockchain node to be evaluated by Pact.
The execution of the code in the message is _atomic_ and the transaction succeeds as a complete unit, or doesn't succeed at all.
For these types of transactions, Pact doesn't allow partial execution or provide any concept for rollback handling.

For transactions that consist of more than one step, each step is effectively a single transaction.
However, each step must be executed in sequence and if any step in the sequence fails, the entire transaction can be rolled back to its initial state or allowed to continue without rollback handling. 
For example, a cross-chain transfer is essentially a two-step transaction, with a debit transaction initiated on a source chain and a separate credit transaction occurring on a destination chain.
Without rollback handling, if the second step isn't called to complete the transaction, the first step becomes an orphan and the intended transfer operation remains in an incomplete, interrupted state.
However, multi-step transactions can include a rollback step so that if a specific condition exists, a previously completed steps can be reversed.
For example, if an asset is moved to from a seller's account to an escrow account awaiting a buyer to complete the transaction, the transfer can be reversed if the buyer doesn't complete necessary steps within a previously agreed upon time.

## Transaction formats

Given that there are two types of transactions, there are also two transaction formats.

## Transaction flow

You start by submitting this transaction to a node, usually a node you control, via the pact /send endpoint

This does a first pass at validating the transaction just for your convenience, so that any obvious issues with the transaction can be caught early and reported, specifically issues that would cause the transaction to be so invalid that it doesn't even make it into a block

Like broken signatures, insufficient funds to pay for gas, invalid metadata like TTL expiration

Then it inserts the transaction into that node's mempool, which yes is a place for transactions to wait before being included in a block, but it's not exactly a queue, rather the order in which transactions make it into blocks is based on their gas price, not their creation time

Higher gas price, that's a bribe to miners to include the transaction in the block sooner

Anyway all nodes synchronize their mempool contents with one another

Eventually a mining node that has the transaction in its mempool will include it into its next block, and the block will be mined

The block with the transaction is then sent around the network, including back to the node that the transaction was submitted to originally, at which point the pact /poll endpoint will return the result of that transaction