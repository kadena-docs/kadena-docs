---
title: Basic concepts
id: basic-concepts
sidebar_position: 3
description: "Get familiar with important Kadena network and Pact language concepts and terminology."
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

Pact is designed to be used in distinct _execution modes_ to address the performance requirements of rapid linear execution on a blockchain. These are:

- Contract definition.
- Transaction execution.
- Queries and local execution.

### Contract definition

In this mode, a large amount of code is sent into the blockchain to establish the smart contract, as comprised of modules (code), tables (data), and keysets (authorization). This can also include "transactional" (database-modifying) code, for instance to initialize data.

For a given smart contract, these should all be sent as a single message into the blockchain, so that any error will rollback the entire smart contract as a unit.

#### Keyset definition

[Keysets](/reference/functions/keysets) are customarily defined first, as they are used to specify admin authorization schemes for modules and tables. Definition creates the keysets in the runtime environment and stores their definition in the global keyset database.

#### Namespace declaration

[Namespace](/build/pact/advanced#namespacesh-2137443688) declarations provide a unique prefix for modules and interfaces defined within the namespace scope. Namespaces are handled differently in public and private blockchain contexts: in private they are freely definable, and the _root namespace_ (ie, not using a namespace at all) is available for user code. In public blockchains, users are not allowed to use the root namespace (which is reserved for built-in contracts like the coin contract) and must define code within a namespace, which may or may not be definable (ie, users might be restricted to "user" namespaces).

Namespaces are defined using [define-namespace](/reference/functions/general#define-namespaceh-1430035511). Namespaces are "entered" by issuing the [namespace](/reference/functions/general#namespaceh1252218203) command.

#### Module declaration

[Modules](/reference/syntax#moduleh-1068784020) contain the API and data definitions for smart contracts. They are comprised of:

- [functions](/reference/syntax#defunh95462750)
- [schema](/reference/syntax#defschemah-1003560474) definitions
- [table](/reference/syntax#deftableh661222121) definitions
- [pact](/reference/syntax#defpacth1545231271) special functions
- [constant](/reference/syntax#defconsth645951102) values
- [models](/reference/property-checking)
- [capabilities](/build/pact/advanced#capabilitiesh-1323277354)
- [imports](/reference/syntax#useh116103)
- [implements](/reference/syntax#implementsh-915384400)

When a module is declared, all references to native functions, interfaces, or definitions from other modules are resolved. Resolution failure results in transaction rollback.

Modules can be re-defined as controlled by their governance capabilities. Often, such a function is simply a reference to an administrative keyset. Module versioning is not supported, except by including a version sigil in the module name (e.g., "accounts-v1"). However, _module hashes_ are a powerful feature for ensuring code safety. When a module is imported with [use](/reference/syntax#useh116103), the module hash can be specified, to tie code to a particular release.

As of Pact 2.2, `use` statements can be issued within a module declaration. This combined with module hashes provides a high level of assurance, as updated module code will fail to import if a dependent module has subsequently changed on the chain; this will also propagate changes to the loaded modules' hash, protecting downstream modules from inadvertent changes on update.

Module names must be unique within a namespace.

#### Interface declaration

[Interfaces](/build/pact/advanced#interfacesh394925690#interfaces) contain an API specification and data definitions for smart contracts. They are comprised of:

- [function](/reference/syntax#defunh95462750) specifications (i.e. function signatures)
- [constant](/reference/syntax#defconsth645951102) values
- [schema](/reference/syntax#defschemah-1003560474) definitions
- [pact](/reference/syntax#defpacth1545231271) specifications
- [models](/reference/property-checking)
- [capabilities](/build/pact/advanced#capabilitiesh-1323277354) specifications
- [imports](/reference/syntax#useh116103)

Interfaces represent an abstract api that a [module](/reference/syntax#moduleh-1068784020) may implement by issuing an `implements` statement within the module declaration. Interfaces may import definitions from other modules by issuing a [use](/reference/syntax#useh116103#use) declaration, which may be used to construct new constant definitions, or make use of types defined in the imported module. Unlike Modules, Interface versioning is not supported. However, modules may implement multiple interfaces.

Interface names must be unique within a namespace.

#### Table creation

Tables are [created](/reference/functions/database#create-tableh447366077) at the same time as modules. While tables are _defined_ in modules, they are _created_ "after" modules, so that the module may be redefined later without having to necessarily re-create the table.

The relationship of modules to tables is important, as described in [Table Guards](/build/pact/advanced#module-table-guardsh-1588944812).

There is no restriction on how many tables may be created. Table names are namespaced with the module name.

Tables can be typed with a [schema](/reference/syntax#defschemah-1003560474).

### Transaction execution

"Transactions" refer to business events enacted on the blockchain, like a payment, a sale, or a workflow step of a complex contractual agreement. A transaction is generally a single call to a module function. However there is no limit on how many statements can be executed. Indeed, the difference between "transactions" and "smart contract definition" is simply the _kind_ of code executed, not any actual difference in the code evaluation.

### Queries and local execution

Querying data is generally not a business event, and can involve data payloads that could impact performance, so querying is carried out as a _local execution_ on the node receiving the message. Historical queries use a _transaction ID_ as a point of reference, to avoid any race conditions and allow asynchronous query execution.

Transactional vs local execution is accomplished by targeting different API endpoints; pact code has no ability to distinguish between transactional and local execution.
