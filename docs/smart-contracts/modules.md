---
title: Modules
description: "Modules that define the business logic and essential functions for blockchain applications and provide the basic foundation for all Pact smart contracts."
id: modules
sidebar_position: 6
---

# Modules

The fundamental building blocks for all Pact smart contracts are defined as Pact **modules**. 
In most cases, a module acts as a self-contained logical unit with all of the code necessary to create an application or a service. 
All of the functions and data definitions required to complete business operations are defined within the context of a module.

Although you can use modules as composable and callable units that interoperate in a smart contract, modules typically include the following 
components:

- Schema definitions
- Table definitions
- Functions definitions
- Pact special functions
- Constant values

Some elements of smart contracts are defined in modules but aren't contained withing the module itself.
For example, modules don't contain the following elements in the code that's included in the module itself:

- Namespace definition
- Keyset definitions
- Table creation
- Function calls

The code related to these elements is considered to be outside of and separate from the module definition.

## Module and smart contracts

When you start working with Pact, you typically create single modules that contain the full functionality of your smart contract, much like most of the examples in the [coding projects](/coding-projects/coding-projects).
Using a single module to define a contract keeps your code organized and starightforward.
However, as you begin writing more complex or sophisticated programs, you'll find it more convenient to split the smart contract logic into multiple modules that work together to compose the complete application. 
In a typical smart contract—the full application—each individual module can provide a focused set of functionality with clear organizational logic.

Because a smart contract can be defined using one module or many modules, the logic in individual Pact files (.pact) is always referred to as a module.

## Create a module

To create a module, you write the module keyword and name followed by the keyset
that has access to call this module.

Here is a module named **example** that gives access to an **admin-keyset**.

```pact title=" "
;; define and read keysets

(module example 'admin-keyset
    ;; module code goes here
)

;; function calls

```

The entire module is written within these parentheses. The top level code, like
keysets, are defined outside of these parentheses.

The basic idea of modules is simple, but the structure of the code and the
actual logic within the module can get pretty complicated. For that reason, it’s
helpful to start by focusing on the basic syntax and structure of existing
modules.

### Example Modules

You can find examples using the Module Explorer in [Set up a local development network](/build/pact/dev-network).

#### Hello World

From the Module Explorer, open the Hello World Smart Contract. If you’re
interested, this smart contract is explained in depth in the
[Hello World with Pact](/build/pact/hello-world).

Notice that the pattern of this smart contract is similar to the outline
described above.

```pact title=" "
;; define and read keysets
(define-keyset 'admin-keyset (read-keyset "admin-keyset"))

(module helloWorld 'admin-keyset
   ;; module code goes here
  (defun hello (name)
    (format "Hello {}!" [name]))
)

;; function calls
(hello "world")

```

In this case, the module code only contains a simple function named **hello**.
Later modules will include much more complexity.

#### Simple Payment

Next, take some time to look through the simple payment module. From the Module
Explorer, select **open** on **Simple Payment** to open this smart contract in
the online editor.

Once again, you’ll notice the same pattern. This time, the smart contract
includes a few other features.

**Included in the Simple Payment Smart Contract**

- Schema Definitions
- Table Definitions
- Table Creation
- Functions
- Function Calls

View the summary of this contract below and take some time to investigate the
actual code provided in the **Simple Payment Module**.

```pact title=" "
;; define and read keysets
(define-keyset 'admin-keyset (read-keyset "admin-keyset"))

(module payments 'admin-keyset
   ;; module code goes here

   ;; define schemas
   ;;    ex. defschema payments...

   ;; define tables
   ;;    ex. deftable payments-table:{payments})

   ;; define functions
   ;;    ex. defun create-account...
   ;;    ex. defun get-balance...
   ;;    ex. defun pay...

)
;; create tables
    ;; ex. create-table payments-table

;; function calls
    ;; ex. pay
    ;; ex. get-balance
```

While you may not fully understand each line of code quite yet, there are a few
important things to note here.

First, schemas and tables are defined inside of modules, but tables are created
outside of modules. Table and schema definitions include built in functions
including defschema, deftable, and create-table. You’ll learn more about each of
these functions in the **Pact Schemas and Tables tutorial**.

Next, there are some new Pact built in functions that you may have not seen
before.

**Contract Built-in functions include:**

- [enforce](/reference/functions/general#enforceh-1604583454)
- [insert](/reference/functions/database#inserth-1183792455)
- [with-read](/reference/functions/database#with-readh866473533)

We’ll also go over each of these in more detail in later tutorials. You can
explore the
[Pact Language Reference built-in functions](/reference/functions) to learn
more about each of them now if you’d like.

---

### Explore Other Modules

Other modules include the same basic framework as those included in these simple
smart contracts. Take some time now to explore each of the other Smart Contract
examples to get more familiar with how they work.

**Example Modules**

- International Payment
- Verification
- Accounts

Focus on understanding the structure of each module. Gain some familiarity with
the different techniques used to create each smart contract.

## Review

That wraps up this tutorial on **Pact Modules**.

In this tutorial you were introduced to modules, one of the core features of the
Pact Programming Language. You learned what modules are, why they’re important,
and went over a few examples.

The goal for this tutorial wasn’t to help you learn all of the code that can
possibly go into creating a module. That’s what most of the entire Pact
programming language is built to accomplish. You’ll learn much more about this
in later tutorials.

For now, the important takeaway is to understand what a module is, as well as to
recognize the key elements that belong inside and outside of Pact modules.

Take some time now to continue exploring the examples provided. When you’re ready, you can learn more about the Pact programming
language in our next tutorial.


## Module declaration

[Module declarations](/reference/syntax#module) use the following keywords to define the following module components:

- [defun](/reference/syntax#defun) to define module functions.
- [defschema](/reference/syntax#defschema) to define schemas for module tables.
- [deftable](/reference/syntax#deftable) to define the tables to create for a module.
- [defpact](/reference/syntax#defpact) to define multi-step transactions in the module.
- [defconstant](/reference/syntax#defconst) to define constant value variables in the module.
- [defcap](/reference/syntax#defcap) to define capabilities in the module.
- [use](/reference/syntax#use) to import functions from other modules into the module.
- [implements](/reference/syntax#implements) to implement functions from other modules into the module.

Modules can also include different types of [metadata](/reference/syntax/metadata), such as documentation strings or information for emitted events.

When a module is declared, all references to native functions, interfaces, or definitions from other modules are resolved. 
Resolution failure results in transaction rollback.

Modules can be re-defined as controlled by their governance capabilities. 
Often, such a function is simply a reference to an administrative keyset. 
Module versioning is not supported, except by including a version sigil in the module name (e.g., "accounts-v1"). 
However, _module hashes_ are a powerful feature for ensuring code safety. 
When a module is imported with [use](/reference/syntax#use), the module hash can be specified, to tie code to a particular release.

By combining module imports with module hashes, you can ensure that updated module code will fail to import if a dependent module has subsequently changed on the chain. 
This mechanism helps to protect downstream modules from inadvertent changes when modules are updates.

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


### Static type inference on modules

With the [typecheck](/reference/functions/repl-only-functions) repl command, the Pact interpreter will analyze a module and attempt to infer types on every variable, function application or const definition. Using this in project repl scripts is helpful to aid the developer in adding "just enough types" to make the typecheck succeed. Successful typechecking is usually a matter of providing schemas for all tables, and argument types for ancillary functions that call ambiguous or overloaded native functions.