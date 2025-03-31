---
title: Chainweb execution and latency
description: "Benchmarks and calculations to help you understand expected execution times."
id: latency
sidebar_position: 5
---

# Chainweb execution and latency

There are a number of factors that influence the time it takes to execute transactions, including network topology and the performance of individual nodes.
This section provides benchmarks, estimations, and calculations to help you better understand the time it takes to execute transactions on Chainweb nodes under different circumstances.

## Local execution

In general, calls to the Chainweb `/local` endpoint return results almost immediately.
Depending on how long it takes to execute the Pact code in a transaction, you can typically expect to see results from `/local` call within seconds, at most. 
However, it's important to know that `/local` calls are executed on a single chain and served in a single-threaded, first-come-first-served basis.
If a node is under contention—because it's catching up with state, busy processing multiple `/local` calls, or performing mempool checks—execution could take as long as needed for the request to be serviced in the queue.

## Block production

On average, producing a block takes 30 seconds.
The actual time it takes to produce any given block depends on the time required to prepare the block for mining, and the time it takes to mine the block.
Before a block can be mined on any chain, it must satisfy specific requirements.

To give you better insight into how blocks are produced, the following example describes the workflow and requirements for mining a block.
For this example, the target chain for the block is chain 1 on a Kadena network with 20 chains.

To start block production on chain 1, the new block candidate must provide the following inputs:

- The block header for a block that exists on chain 1 to serve as the parent of the new block.
- The block headers for the parent block of the new block on the adjacent chains, which are currently chains 6, 11, and 18 for chain 1.
- The sequence of transactions in the new block and the output from running the transactions in the new block.
- The nonce and creation time for the new block, which are set by the miner.

### Block parents and orphans

If the block selected to serve as the parent of the new candidate block is superseded by the arrival of a new block on the target chain, the block production process must start over with the new parent block.
If the block production process starts over, the new block candidate that was being processed is no longer valid for the continuity of the chain and is deemed an **orphaned** block.

### Block height and payload

The next step in the block production process involves two requirements that are satisfied in parallel. 

- The first requirement is to determine whether the chains that are adjacent to the target chain in the chain graph have any blocks at the same height as the parent block.
  If the adjacent chains have blocks at the same height as the parent block, a new block can be created while satisfying the braiding requirement of the Chainweb protocol.

- The second requirement is to produce the block payload on the target chain.
  Producing the payload involves querying the mempool for a set of transactions that can fit in the block, and executing those transactions on the Pact state.
  Currently, the gas limit for a block is 150000, and each unit of gas can represent up to 2.5 microseconds of execution time, leading to a maximum execution time of 375 milliseconds.
  However, node contention can increase the maximum execution time up to 600 milliseconds.

### Mining work

After the block production requirements are met—that is, the block payload, parent block, and the adjacent parent blocks have been validated—the new block can be mined and added to the target chain.

Miners make a request to the node and can receive a new block on any chain that has a new block ready.
Mining time follows an [exponential distribution](https://en.wikipedia.org/wiki/Exponential_distribution) where the mean time is such that the average *total* block time is 30 seconds. 
Because other parts of the block production process take some time as well, mining time will actually be less than 30 seconds on average.

After mining is successful, the new block candidate is added to the target chain on the mining node, and then sent around the chainweb network for other nodes to see.

## Single chain transactions

On average, single chain transactions take approximately 45 seconds.
However, transaction latency—defined as the time between submitting a transaction to a node `/send` endpoint and seeing its result with the `/poll` endpoint—can take much longer than 45 seconds, in particular, if there are mining delays.

To give you better insight into how transactions are executed, the following example describes the workflow for a single chain transaction.
You start a transaction by submitting a formatted request to the `/send` endpoint on a node.
The code provided by the `/send` endpoint performs some simple initial checks that validate the transaction has a reasonably high chance of being executed successfully. 
These initial checks ensure that you learn if a transaction is invalid as soon as possible. 
If the transaction passes the initial checks, the `/send` process adds the transaction to the mempool for the local node. 
The transaction is then gossiped to remote nodes, and, eventually, one of the nodes is selected to mine the next block, and the node includes the transaction in that block. 
After the mined block is added to its target chain, the block with the transaction result is synchronized on the local node, and a request to the `/poll` endpoint returns the transaction result.

Under normal load, the initial checks should take less than a millisecond for a single transaction.
However, if a node in under heavy load—for example, because the PactService is contending with a high volume of `/local` or `/send` calls or because the node is catching up—you might experience delays in sending or polling transactions. 
It's worth noting that if a node is too busy, it will always prioritize staying caught up over sending transactions.

The propagation of transactions in the mempool to other nodes takes, on average, 10 seconds, but it can take longer if there are networking delays, such as increased network traffic or slow network connections between nodes.
Block propagation back to the local node is usually a matter of seconds.

## Cross-chain transfers

As discussed in [Transaction format and flow](/smart-contracts/transactions), a cross-chain transfer is essentially two separate but related transactions.
The time it takes to complete a cross-chain transfer can depend on several factors, including the physical distance between the chain nodes in the network, network congestion, and the synchronization of state between the chains involved.

For two distant chains—representing the worst case—a cross-chain transfer is expected to take the following time to complete:

- The initiating transaction has an average time from submission to completion of 45 seconds.
- With the current 20-chain graph, two blocks at most must be propagated to the target chain so that the source and target chain share the same view of state, with an average time of 30 seconds per block. 
  The number of blocks at most must be propagated will increase as more chains are added, and will depend on the distance between the chains.
- The continuation step is a second transaction, again with an average time of 45 seconds.

Therefore, a cross-chain transfer typically takes 2 minutes and 30 seconds to complete.
If either the source or target chain is ahead of the other chain, more blocks might be required to synchronize the chains before the transaction can complete, in which case the transfer might take additional time.

## Mining per block

Mining a block takes 16 seconds on average with the current 20-chain graph. 
The average time it takes to mine a block will decrease as more chains are added and chains spend more time blocked from creating new blocks.
With the average block production of 30 seconds, mining accounts for roughly half of the time it takes to advance each chain by one block. In most cases, this delay is caused by adjacent chains that have not yet advanced to the block height required for the target chain to add a new block.