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

After you have a transaction message properly formatted as a JSON object, it can be executed locally for testing purposes or sent to the blockchain for execution on-chain.
You submit transactions to the blockchain for on-chain execution by connecting to a node using the Pact `/send` endpoint.
In most cases, the node you connect to is a node that you control—in the local development environment, the public test network, or the production main network. 

Before moving the transaction into a pending state, Pact performs some initial checks on the message to validate that the transaction doesn't have errors that would prevent it from being executed. 
These initial checks include verifying the signatures format, metadata, and the availability of funds to pay transaction fees. 
If there are issues—like an invalid signature or a time-to-live (TTL) that has expired—the transaction fails immediately without further processing.
If the initial checks pass, the node receiving the transaction message inserts the transaction into its holding area for pending transactions, called the mempool.
The transactions waiting to be included in a block are synchronized across all of the nodes.

Mining nodes, typically Chainweb nodes with specialized application-specific integrated circuit hardware attached, periodically check the transaction pool—the mempool—for new work and select transactions to validate based on their transaction fees.
After the mining node computes the solution that validates the transaction, it includes the transaction in its next block.
The block that includes the transaction is then sent to all of the nodes in the network, including the node where the transaction originated, enabling you to see the result of the transaction by using the Pact `/poll` endpoint or block explorer.

The following diagram provides a simplified view of the transaction flow for a single-step exec transaction.

![Transaction lifecycle](/img/tx-workflow.png)