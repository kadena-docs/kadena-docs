---
title: Basic concepts
id: basic-concepts
sidebar_position: 3
description: "Get familiar with important Kadena blockchain and Pact language concepts and terminology."
---

# Basic concepts


Basic concepts
- modules
- keysets
- capabilities (privileges or permissions that can be granted / acquired or installed, that can be scoped to a specific section of code, a signature or another verification method)åß
- guards
- defpact for cross chain and multi-step transactions 
- Accounts and principals 
- namespaces

Basic operations
* Execution modes
* Pact-specific terms and concepts
* Architecture and workflow

## Chainweb and consensus

The core of the Kadena network is defined in its **Chainweb** protocol.
The Chainweb architecture is based on a proof-of-work consensus model.
In the proof-of-work consensus model, computers in a decentralized, distributed network solve complex mathematical problems to validate transactions submitted to the network.
Traditionally, networks that rely on the proof-of-work consensus model have been successful in delivering secure and trustless interactions, but limited by scalability issues, including:

- The number of transactions they can process.
- The speed at which they can process transactions.
- The energy consumption required to validate transactions.
- The high cost of transaction fees when the network in busy.
  
These factors have limited the effectiveness of blockchain networks to handle modern economic activity. 

## Parallel chains

The Chainweb protocol addresses these limitations and improves on the underlying consensus model by introducing **parallel blockchains** to maximize network throughput.
The parallel chains are connected in a way that optimizes network throughput and minimizes the number of cross-chain hops required for transactions.
These optimized network connections enable the chains to operate simultaneously and increase transaction processing capacity.

Each parallel chain includes block hashes (Merkle roots) from blocks on peer chains into their headers.
By referencing block hashes from peer chains, each chain can validate the consistency of its peer chains and provide a trustless oracle for cross-chain transfers of funds.
With this mechanism, the chains are braided together into a single canonical chain that offers an effective hash power that is the sum of the hash rate of each individual chain. 

Each chain in the network mints its own coin, but all of the chains use same cryptocurrency.
Because the chains share a common currency, coins can be transferred cross-chain using a trustless, two-step simple payment verification (SPV) at the smart contract level.

## Execution modes

Pact is designed to use distinct _execution modes_ to address the performance requirements of rapid linear execution on a blockchain. 
These execution modes are:

- Contract deployment.
- Transaction execution.
- Queries and local execution.

### Contract deployment

When a contract is deployed, the transaction sent to the blockchain is comprised of modules, tables, and authorization data.
The transaction can also include database-modifying code, for example, to initialize data that the contract requires.
For a given smart contract, the transaction used to establish the contract on the blockchain should be sent as a single message, so that any error will rollback the entire smart contract as a unit.

When contracts are initialized on the blockchain, they identify a [namespace](#namespace-declaration) that provides context for the contract code and a unique prefix for modules and interfaces defined in the contract.
Deploying a contract also requires you to define one or more authorization [keysets](#keysets) that have administrative control over the contract modules and tables. 
Keysets defined in the runtime environment are then stored in the global keyset database.

After setting the runtime context, Pact executes module and interface declarations and creates required tables.

### Transaction execution

Transactions refer to business events enacted on the blockchain, like a payment, a sale, or a workflow step of a complex contractual agreement. 
A transaction is generally a single call to a module function. 
However there is no limit on how many statements can be executed. 
The difference between transaction execution and contract deployment is simply the _kind_ of code executed.
There's no difference in how the code is evaluated.

### Queries and local execution

Querying data is generally not a business event, and can involve data payloads that could impact performance, so querying is carried out as a _local execution_ on the node receiving the message. 
Historical queries use a _transaction ID_ as a point of reference, to avoid any race conditions and allow asynchronous query execution.

Transactional vs local execution is accomplished by targeting different API endpoints; pact code has no ability to distinguish between transactional and local execution.


## Namespaces

[Namespace](/build/pact/advanced#namespacesh-2137443688) declarations provide a unique prefix for modules and interfaces defined within the namespace scope. Namespaces are handled differently in public and private blockchain contexts: in private they are freely definable, and the _root namespace_ (ie, not using a namespace at all) is available for user code. In public blockchains, users are not allowed to use the root namespace (which is reserved for built-in contracts like the coin contract) and must define code within a namespace, which may or may not be definable (ie, users might be restricted to "user" namespaces).

Namespaces are defined using [define-namespace](/reference/functions/general#define-namespaceh-1430035511). Namespaces are "entered" by issuing the [namespace](/reference/functions/general#namespaceh1252218203) command.

