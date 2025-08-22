---
title: Basic concepts
id: basic-concepts
sidebar_position: 3
description: "Get familiar with important Kadena blockchain and Pact language concepts and terminology."
---

# Basic concepts

The main purpose of a blockchain is to record **transactions**.
Typically, transactions are business events that transfer some form of digital asset from one owner or entity to another.
Through the use of modern **cryptography**, a blockchain can provide guarantees about the authenticity and integrity of the transactions recorded without relying on any central authority or under the control of any government, corporation, or other institution.

The **decentralized** nature of the blockchain depends on having its computational resources distributed across many individual computers.
The individual computers in the network—called **nodes**—run the blockchain software and communicate with each other as a peer-to-peer (P2P) network using the internet and publicly-accessible IP addresses. 
Nodes provide the bandwidth, processors, memory, and storage capacity to handle incoming transaction requests and validate the transactions results that change the blockchain state.

## Consensus models

The method that a blockchain uses to validate transactions, insert transactions into blocks, and submit blocks to continue the chain is called its **consensus model** or **consensus algorithm**. 
For the Kadena blockchain, the method of adding new blocks to the blockchain is a variation of a **proof of work** consensus model used by Bitcoin.
With the proof-of-work consensus model, the first node to solve a computational problem for a transaction adds the transaction to a block.
As new transactions are added to blocks and new blocks are produced, all of the nodes in the network attempt to stay in sync with each other so that there's a consistent view of the blockchain state.

The computers used to solve the mathematical problems that validate transactions typically run specialized hardware and are commonly referred to as **miners** because they earn rewards for the work they do to keep the chain going.
The rewards take the form of KDA tokens that are deposited in accounts owned by the node operators.
The Kadena proof-of-work consensus model is unique in its use of **multiple chains** to support horizontal scaling and in the use of degree and diameter network design to identify adjacent peers.

## Chainweb and parallel chains

Networks that rely on a proof-of-work consensus model provide security and decentralization, but are often limited by scalability issues, including:

- The number of transactions they can process.
- The speed at which they can process transactions.
- The energy consumption required to validate transactions.
- The high cost of transaction fees when the network is busy.
  
These factors have limited the effectiveness of blockchain networks to handle modern economic activity. 

The Kadena proof-of-work consensus model is designed to address these scalability issues and deliver a blockchain built for business.
The core of the Kadena blockchain is defined in its **Chainweb** architecture.
The Chainweb architecture is based on a proof-of-work consensus model, but introduces the concept of **parallel blockchains** to minimize latency and maximize throughput.
The parallel chains are connected through peer nodes in an adjacency graph that makes efficient use of cross-chain hops for transaction execution and validation.
The optimized network connections enable the chains to operate simultaneously to increase transaction processing capacity and reduce transaction costs across all of the chains in the network.

The nodes that participate in the network run `chainweb-node` software to communicate as a peer-to-peer network and to execute transactions.
Each parallel chain includes block hashes (Merkle roots) from blocks on peer chains into their headers.
By referencing block hashes from peer chains, each chain can validate the consistency of its peer chains and provide a trustless oracle for cross-chain transfers of funds.
With this mechanism, the chains are braided together into a single canonical chain that offers an effective hash power that is the sum of the hash rate of each individual chain. 

Each chain in the network mints its own coin, but all of the chains use same cryptocurrency.
Because the chains share a common currency, coins can be transferred cross-chain using a trustless, two-step simple payment verification (SPV) at the smart contract level.

## Applications and smart contracts

Applications that run on a blockchain—often referred to as decentralized applications or dApps—are typically web applications that are written using frontend frameworks like React, Angular, Vue, or Next.js but depend on backend **smart contracts** to capture, store, modify, and read application data.

A smart contract is a program that executes specific instructions under specific conditions that can be programmatically-enforced to ensure that the outcome is recorded and immutable. 
Smart contracts can be written in different languages for different blockchain networks.
For the Kadena network, most smart contracts are written using the Pact smart contract programming language.
Pact has several key features that make it well-suited to writing business applications that run as smart contracts on the Kadena network and Chainweb nodes.

## Namespaces and modules

Two important concepts in Pact are [namespaces](/resources/glossary#namespace) and [modules](/resources/glossary#module).
A namespace is a logical ownership boundary for smart contracts that are controlled by a specific entity.
Smart contracts include a namespace declaration to provide a unique prefix for everything—including modules, functions, keysets, and interfaces—that are defined within the namespace scope. 
The _root namespace_ in the Kadena test and main networks is reserved for built-in contracts like the `coin` contract. 
You can't deploy contracts directly in the unpartitioned root namespace.
However, Kadena provides the `free` namespace and the `user` namespace as publicly-accessible namespaces for testing and training purposes.
For local development, you can deploy contracts directly in the local root namespace or define custom namespaces. 
For public blockchains like the Kadena test and main networks, you must define and register custom namespaces for your projects.

Within a namespace, modules are the fundamental building blocks that provide the logic used in all Pact smart contracts. 
All of the functions and data definitions that are required to complete a set of related business operations are defined within the context of a module.
Individual modules are often self-contained logical units that implement a related set of functions. 

## Keysets, capabilities, and guards

Keysets define authorization rules for smart contracts. 
They often determine who can access specific functions in a program and the keys required to sign specific transactions.
Capabilities define specific privileges or permissions that must be granted or acquired to perform specific operations within a section of code.
Guards provide a way to enforce specific conditions, including that a required keyset is being used or a specific capability token has been granted.
A keyset is itself a type of guard.

## Cross chain and multi-step transactions 

Pact supports cross-chain and multi-step transactions by enabling you to define a sequence of steps in a `defpact` declaration. 
With a `defpact` declaration, you can emulate an escrow service or orchestrate a process that must be completed in a specific order.

## Execution modes

Pact is designed to use distinct _execution modes_ to address the performance requirements of rapid linear execution on a blockchain. 
These execution modes are:

- Contract deployment.
- Transaction execution.
- Queries and local execution.

### Contract deployment

When a contract is deployed, the deployment transaction that's sent to the blockchain is comprised of modules, tables, and authorization data.
The transaction can also include code that modifies the database, for example, to initialize information that the contract requires.
As a general rule, the transaction that you use to deploy a contract on the blockchain should be sent as a single message, so that any error will rollback the entire smart contract as a unit.

When contracts are initialized on the blockchain, they identify a [namespace](/resources/glossary#namespace) that provides context for the contract code and a unique prefix for modules and interfaces defined in the contract.
Modules contain the main business logic for the application or service you want to deploy.
Interfaces provide access to constant definitions and typed function signatures that are defined outside of a module to be implemented and used in a module.
Deploying a contract also requires you to define one or more authorization [keysets](/resources/glossary#keyset) that have administrative control over the contract modules and tables. 
Keysets that are defined as data in the runtime environment are then stored in the global keyset database.

After setting the runtime context, Pact executes the module and interface declarations and creates required tables to complete the contract deployment.

### Transaction execution

Most of the transactions executed on the blockchain are intended to record **business events**. 
For example, business events often involve the handling of assets, payments, ownership transfers, or the completion of contractual agreements. 
These types of transactions are typically executed using a single call to a specific module function. 
However, there is no limit on the number statements you can execute in a transaction and you can define transactions that are executed as a sequence of steps.
Note that the difference between transaction execution and contract deployment is simply the _kind_ of code executed.
There's no difference in how the code itself is evaluated.

### Queries and local execution

In general, querying data that's stored on the blockchain isn't considered a business event where execution and performance are more critical.
In addition, queries can often involve larger data payloads that could introduce overhead, bandwidth, and latency issues.
To reduce the impact of queries on network operations, queries are handled as _local execution requests_ on the node receiving the message. 
Historical queries use a _transaction hash_ as a point of reference to avoid race conditions and to allow asynchronous query execution.

Pact code doesn't distinguish between transactional execution and local execution.
However, the Pact API provides separate endpoints to execute transactions on the blockchain and submit local execution requests.
For more information about using the Pact API endpoints, see [Pact API](/api/pact-api).


