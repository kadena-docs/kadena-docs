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

When a contract is deployed, the deployment transaction that's sent to the blockchain is comprised of modules, tables, and authorization data.
The transaction can also include database-modifying code, for example, to initialize information that the contract requires.
As a general rule, the transaction that you use to deploy the contract on the blockchain should be sent as a single message, so that any error will rollback the entire smart contract as a unit.

When contracts are initialized on the blockchain, they identify a [namespace](#namespace-declaration) that provides context for the contract code and a unique prefix for modules and interfaces defined in the contract.
Modules contain the main business logic for the application or service you want to deploy.
Interfaces provide access to constant definitions and typed function signatures that are defined outside of a module to be implemented an used in a module.
Deploying a contract also requires you to define one or more authorization [keysets](#keysets) that have administrative control over the contract modules and tables. 
Keysets that are defined as data in the runtime environment are then stored in the global keyset database.

After setting the runtime context, Pact executes module and interface declarations and creates required tables to complete the contract deployment.

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
To reduce the impact of queries on network operations, queries are handles as _local execution requests_ on the node receiving the message. 
Historical queries use a _transaction hash_ as a point of reference to avoid race conditions and to allow asynchronous query execution.

Pact code doesn't distinguish between transactional execution and local execution.
However, the Pact API provides separate endpoints to execute transactions on the blockchain and submit local execution requests.
FOr more information about using the Pact API endpoints, see [Pact API](/api/pact-api).

## Namespaces

[Namespace](/build/pact/advanced#namespacesh-2137443688) declarations provide a unique prefix for modules and interfaces defined within the namespace scope. Namespaces are handled differently in public and private blockchain contexts: in private they are freely definable, and the _root namespace_ (ie, not using a namespace at all) is available for user code. In public blockchains, users are not allowed to use the root namespace (which is reserved for built-in contracts like the coin contract) and must define code within a namespace, which may or may not be definable (ie, users might be restricted to "user" namespaces).

Namespaces are defined using [define-namespace](/reference/functions/general#define-namespaceh-1430035511). Namespaces are "entered" by issuing the [namespace](/reference/functions/general#namespaceh1252218203) command.

