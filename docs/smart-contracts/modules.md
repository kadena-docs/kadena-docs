---
title: Modules and interfaces
description: "Modules define the business logic and essential functions for blockchain applications and provide the basic foundation for all Pact smart contracts."
id: modules
sidebar_position: 7
---

# Modules and interfaces

The fundamental building blocks for all Pact smart contracts are defined in Pact **modules**.
For simple contracts, a module often acts as a mostly self-contained logical unit with all of the code necessary to create an application or a service.
All of the functions and data definitions required to complete business operations are defined within the context of a module.

Although you can use modules as composable and callable units that interoperate, Pact modules typically include some or all of the following components:

- Capability definitions
- Schema definitions
- Table definitions
- Function definitions
- Multi-step defpact definitions
- Constant values

Some elements that are required by smart contracts aren't included in the module declaration, but are defined outside of the module code.
For example, the code related to the following elements is considered to be outside of and separate from the module declaration:

- Namespace definition
- Keyset definitions
- Table creation
- Function calls

## Modules and smart contracts

When you start working with Pact, you typically create single modules that contain the full functionality of your smart contract, much like most of the examples in the [coding projects](/coding-projects/coding-projects).
Using a single module to define a contract keeps your codebase simple and straightforward because there's only one file to keep track of.
However, as you begin writing more complex or sophisticated programs, you might find it more convenient to split the smart contract logic into multiple modules that work together to compose the complete application.
In a typical smart contract—the full application—each individual module can provide a focused set of functionality with clear organizational logic.

Because a smart contract can be defined using one module or many modules, the logic in individual Pact files (`.pact`) is always referred to as a module.

## Module declaration

You can create a module by typing the `module` keyword, followed by the module name and the keyset or governance capability that owns the module.
The following example illustrates a module named **example** that is governed by the **admin-keyset** referenced in the first line of the module declaration:

```pact
;; Define and read keysets

(module example "admin-keyset"
    ;; module code goes here

    ;; function calls
)
```

The entire **example** module consists of the code within the opening and closing parentheses.
Top-level code, like `namespace` definitions and `keyset` definitions, are outside of these parentheses.
For example, you enter a namespace and define a keyset for a module before starting the module declaration like this:

```pact
;; Enter a namespace
(namespace "free")

;; Define and read a keyset
(define-keyset "free.admin-keyset" (read-keyset "admin-keyset"))

(module example "admin-keyset"
    ;; module code goes here

    ;; function calls
)
```

## Module governance

With keyset governance like the previous example, the `admin-keyset` is defined outside of the module and checked and enforced at the module level.
Any attempt to upgrade the module, write to module tables, or access table functions directly requires the `admin-keyset` to sign the transaction.

As an alternative to strict keyset enforcement, you can specify a _governance capability_ in the module declaration to support a more generalized form of module governance.
By using a governance capability that references a `defcap` declaration in the module body, you can define more flexible models for enforcing access to Pact modules, tables, and functions.

For example, you can implement the same governance for the **example** module using a governance capability named **GOVERNANCE** like this:

```pact
(module example GOVERNANCE
  ...
  (defcap GOVERNANCE ()
    (enforce-guard "admin-keyset"))
  ...
)
```

Note that the capability name has no significance, except to indicate the purpose of the capability.
Its placement at the beginning of the module declaration is what identifies this capability as a module governance capability.

It's worth noting that, when you initially deploy a module, the module governance capability is not invoked.
This behavior is different than when you use a keyset.
With a keyset, the keyset must always be defined and evaluated to ensure that the keyset exists before a module can be deployed.
The module governance capability is enforces after a module is deployed, when it's accessed or upgraded.

### Invoking governance

Because the module governance capability is defined using the `defcap` keyword, its elevated administrative function cannot be called directly.
The **module administrator** elevated permissions are only automatically invoked in the following situations:

- When a module upgrade is attempted.
- When module tables are directly accessed from outside of the module code.

Transactions that attempt to upgrade a module or access module tables can only be executed by the module owner specified by the **module administrator capability**—in this example, the `GOVERNANCE` capability.
If the conditions specified for the `GOVERNANCE` capability are met, full administrative rights are granted.

### Module administrator scope

The module administrator capability, once automatically invoked, stays in scope for the rest of the calling transaction.
This is unlike other capabilities that can only be acquired in a fixed scope specified by the body of a `with-capability` function call.
The reason for this difference in behavior is to ensure that a governance capability doesn't rely on transient information that can change during a single transaction.
This is important, for example, in the case of module upgrades.
A module upgrade might change the governance capability itself.
If the module administrator capability didn't remain in scope through the completion of the transaction, the upgrade might fail because the administrative capability is required to migrate table data as part of the upgrade process.

### Stakeholder upgrade vote

The following example demonstrates how to upgrade a module based on a stakeholder vote.
The upgrade is designed as a Pact transaction, and its hash and code are distributed to stakeholders, who vote for or against the upgrade.
After the upgrade transaction is distributed, the vote is tallied in the governance capability, and if a simple majority is found, the code is upgraded.

```pact
(module govtest count-votes
  "Demonstrate programmable governance showing votes \
 \ for upgrade transaction hashes"
  (defschema vote
    vote-hash:string)

  (deftable votes:{vote})

  (defun vote-for-hash (user hsh)
    "Register a vote for a particular transaction hash"
    (write votes user { "vote-hash": hsh })
  )

  (defcap count-votes ()
    "Governance capability to tally votes for the upgrade hash".
    (let* ((h (tx-hash))
           (tally (fold (do-count h)
                        { "for": 0, "against": 0 }
                        (keys votes)))
          )
      (enforce (> (at 'for tally) (at 'against tally))
               (format "vote result: {}, {}" [h tally])))
  )

  (defun do-count (hsh tally u)
    "Add to TALLY if U has voted for HSH"
    (bind tally { "for" := f, "against" := a }
      (with-read votes u { 'vote-hash := v }
        (if (= v hsh)
            { "for": (+ 1 f), "against": a }
          { "for": f, "against": (+ 1 a) })))
  )
)
```

## Module properties and components

As you've seen, module declarations start with the `module` keyword and a name.
Module names must be unique within a namespace.
You can define custom namespaces for local development.
However, you must deploy modules to a registered namespace in the Kadena test or production networks.

[Module declarations](/reference/syntax#module) use the following keywords to define module components:

- [defun](/reference/syntax#defun) to define module functions.
- [defschema](/reference/syntax#defschema) to define schemas for module tables.
- [deftable](/reference/syntax#deftable) to define the tables to create for a module.
- [defpact](/reference/syntax#defpact) to define multi-step transactions in the module.
- [defconst](/reference/syntax#defconst) to define constant value variables in the module.
- [defcap](/reference/syntax#defcap) to define capabilities in the module.
- [use](/reference/syntax#use) to import functions from other modules into the module.
- [implements](/reference/syntax#implements) to implement functions from interfaces exposed in other modules into the module.

Modules can also include different types of metadata, such as documentation strings or information for emitted events.

When a module is declared, all references to native functions, interfaces, or definitions from other modules are resolved.
Resolution failure results in transaction rollback.

### Module versioning and dependencies

Module versioning is not supported, except by including a version identifier in the module name, for example, `accounts-v1` or `marmalade-v2`.
However, you can use _module hashes_ to import a specific version of a module with the [`use`](/reference/syntax#use) keyword.
By specifying a module hash when you import the module, you can link your code to a particular release of a module that's identified by the hash.

By combining module imports with module hashes, you can ensure that updated module code will fail to import if a dependent module has subsequently changed on the chain.

### Module table creation

Tables are created at the same time as modules and include the module name as a prefix to the table name.
With this naming convention, the module acts as a guard to protect access to tables using [database functions](/pact-5/database) that are controlled by the module owner.
You can create any number of tables in a module.

It’s important to note that you define table schemas, the tables that use the schemas, and the functions that insert, read, and modify database records inside of module code, but you create tables outside of module code.
That is, tables are _defined_ in modules, but they are _created_ after the module declaration.
This separation allows module code to be potentially updated without recreating the table.

## Interfaces

In Pact, interfaces represent an abstract API that modules can implement to make use of the constants and typed function signatures that an interface defines.

To make use of the components defined in an interface, module declarations can include one or more [`implements`](/reference/syntax#implements) statements to specify the interface from which the module wants to implement features.
A single module can implement multiple interfaces.
However, if you implement interfaces with conflicting function names, you must resolve the conflict in your code or by redefining the interfaces to remove the conflict.

### Interface properties and components

You can declare an interface using the `interface` keyword followed by the name for the interface.
Interface names must be unique within a namespace.
Interfaces can't be upgraded and aren't governed by keysets or a governance capability.

Interfaces can import definitions from other modules with [`use`](/reference/syntax#use) statements to construct new constant definitions, or make use of types or functions defined in the imported module.

Modules can implement interfaces that include the following components:

- [function](/reference/syntax#defun) signatures
- [constant](/reference/syntax#defconst) values
- [schema](/reference/syntax#defschema) definitions
- [defpact](/reference/syntax#defpact) specifications
- [capability](/reference/syntax#defcap) specifications
- [imported definitions](/reference/syntax#use) from other modules

The following example illustrates how to declare and implement an interface with one function signature and one constant value:

```pact
(interface my-interface
    (defun hello-number:string (number:integer)
      @doc "Return the string \"Hello, $number!\" when given a string"
        )

    (defconst SOME_CONSTANT 3)
)

(module my-module (read-keyset 'my-keyset)
    (implements my-interface)

    (defun hello-number:string (number:integer)
        (format "Hello, {}!" [number]))

    (defun square-three ()
        (* my-interface.SOME_CONSTANT my-interface.SOME_CONSTANT))
)
```

As you can see in this example, the `my-module` module implements the `hello-number` function signature.
The constant declared in the interface is accessed directly by its fully qualified name `namespace.interface.const`.

## Implements and use keywords

You can create complex and layered relationships between interfaces and modules.
One important way you can create this layered relationships is by using combinations of the `implements` and `use` keywords.
The `use` keyword enables you to import elements from the specified `module` into a namespace, interface, or module.
For example, you can specify the `use` keyword in an interface declaration to import table schemas and types from a specified module.

You can also include `use` statements at the top-level of a contract or within a module declaration to make all or parts of a specified module available in the current module context.
For example, you can specify a list of functions, constants, and schema names to import from the specified `module`.
If you explicitly define the function, constant, and schema names to import, only those items are available in the module body.

You can also specify a `hash` argument in `use` statements to check that an imported module's hash matches the `hash` you expect, and fail if the hashes are not the same.
By including the `hash` argument in a `use` statement, you can perform a simplified form of version control or dependency checking.

The following example is an excerpt from the `marmalade-v2.ledger` module that illustrates the relationships created by combining `implements` and `use` statements.
In this example, `marmalade-v2` is the primary namespace where the `ledger` contract is deployed.

```pact
(namespace (read-string 'ns))

(module ledger GOVERNANCE

  (implements marmalade-v2.ledger-v2)
  (implements kip.poly-fungible-v3)

  (use kip.poly-fungible-v3 [account-details sender-balance-change receiver-balance-change])
  (use kip.token-policy-v2 [token-info])
  (use util.fungible-util)
  (use marmalade-v2.policy-manager)
     ...
)
```

This module implements the `ledger-v2` interface that defines a set of capabilities.

```pact
(interface ledger-v2

  (defcap INIT-CALL:bool (id:string precision:integer uri:string)
    @doc
      "Capability securing the modref call for enforce-init "
  )
  ...

)
```

The module also implements the `poly-fungible-v3` interface and imports the specified functions.

```pact
(interface poly-fungible-v3

  (defschema account-details
    @doc
      " Account details: token ID, account name, balance, and guard."
    id:string
    account:string
    balance:decimal
    guard:guard)

  (defschema sender-balance-change
    @doc "For use in RECONCILE events"
    account:string
    previous:decimal
    current:decimal
  )

  (defschema receiver-balance-change
    @doc "For use in RECONCILE events"
    account:string
    previous:decimal
    current:decimal
  )
...
)
```

For more information about the syntax for using these keywords, see the [implements](/reference/syntax#implements) and [use](/reference/syntax#use) syntax descriptions.

## Module references

Pact **module references** enable you to support use-cases that require polymorphism.
For example, a Uniswap-like exchange allows users to specify pairs of tokens to allow trading between them.
The Pact `fungible-v2` interface allows tokens to offer identical operations such as `transfer-create`.
However, without a way to abstract over different `fungible-v2` implementations, an exchange smart contract would have to be upgraded for each token pair with custom code for every operation.

For example:

```pact
;;; simplified DEX example with hardcoded dispatching on token symbols
(defun swap
  ( a-token:string a-amount:decimal a-account:string
    b-token:string b-amount:decimal b-account:string
  )
  (with-read pair-accounts (format "{}:{}" [a-token b-token])
    { 'pair-a-account := pair-a-account
    , 'pair-b-account := pair-b-account
    }
    (cond
      ((= "KDA" a-token)
       (coin.transfer a-account pair-a-account a-amount))
      ((= "KBTC" a-token)
       (kbtc.ledger.transfer a-account pair-a-account a-amount))
      ((= "KUSD" a-token)
       (kusd.ledger.transfer a-account pair-a-account a-amount))
      "Unrecognized a-token value")
    (cond
      ((= "KDA" b-token)
       (coin.transfer b-pair-account b-account b-amount))
      ((= "KBTC" b-token)
       (kbtc.ledger.transfer b-pair-account b-account b-amount))
      ((= "KUSD" b-token)
       (kusd.ledger.transfer b-pair-account b-account b-amount))
      "Unrecognized b-token value"))
)
```

With module references, an exchange-type smart contract can accept pairs of values where each value references a concrete module that implements the `fungible-v2` interface, giving it the ability to call `fungible-v2` operations using those values.

For example:

```pact
;;; simplified DEX example with module references in a dynamic dispatch
(defun swap
  ( a-token:module{fungible-v2} a-amount:decimal a-account:string
    b-token:module{fungible-v2} b-amount:decimal b-account:string
  )
  (with-read pair-accounts (format "{}:{}" [a-token b-token])
    { 'pair-a-account := pair-a-account
    , 'pair-b-account := pair-b-account
    }
    (a-token::transfer a-account pair-a-account a-amount)
    (b-token::transfer pair-b-account b-account b-amount))
)
```

To invoke the `swap` function, the module names are directly referenced in code.

```pact

(swap coin a-amount a-account
      kbtc.ledger b-amount b-account)

```

Module reference values are normal Pact values that can be stored in the database, referenced in events, and returned from functions.

```pact
;;; simplified DEX example with stored pair module reference values
(defun swap
  ( pair-symbol:string
    a-amount:decimal a-account:string
    b-amount:decimal b-account:string
  )
  (with-read pair-accounts pair-symbol
    { 'pair-a-account := pair-a-account:string
    , 'a-token := a-token:module{fungible-v2}
    , 'pair-b-account := pair-b-account:string
    , 'b-token := b-token:module{fungible-v2}
    }
    (a-token::transfer a-account pair-a-account a-amount)
    (b-token::transfer pair-b-account b-account b-amount))
)
```

### Polymorphism

Module reference values provide polymorphism for use cases like the previous example with an emphasis on interoperability.
A module reference is specified with one or more interfaces, allowing for values to reference modules that implement those interfaces.

In the previous example, the module reference `a-token:module{fungible-v2}` accepts a reference to the Kadena `coin` KDA token module, because `coin` implements `fungible-v2`.
There's nothing special about the `fungible-v2` interface.
Module references can specify any defined interface and accept any module that implements the specified interface.

The Pact module reference polymorphism is similar to generics in Java or traits in Rust, and should not be confused with more object-oriented polymorphism like that found with Java classes or TypeScript types.
Modules cannot extend one another.
They can only offer operations that match some interface specification, and interfaces themselves cannot extend other interface.

You should note that module references introduce indirection and, therefore, can increase the overall complexity of Pact smart contracts, making contract logic harder to understand and reason about.
You should only use module references when you need to provide flexible interoperation between smart contracts.
If all of the modules are your own code, you should use direct references instead of external module references whenever possible.

### Reference value binding

Module references use the latest upgraded version of the referenced module when you invoke a module operation.
For example, consider a module reference to a `payments` module stored in the database when the `payments` module is at version 1.
Sometime later, the `payments` module is upgraded to version 2.
The module reference in the database will refer to the upgraded version 2 of the `payments` module when the reference is called.
This behavior is different from Pact direct references, which are not late-binding, so you should consider this difference in module reference behavior to prevent returning unexpected results.

### Referencing untrusted code

Because module references allow external modules to interoperate with your code, you should not assume that the external code is safe.
Instead, you should treat any module reference call as a call to untrusted code.
In particular, you should be aware that invoking module references in the context of acquiring a capability can result in unintended privilege escalation.

For example, the following `data-market` module has a public `collect-data` function that is intended to allow external modules to provide some data, resulting in the one-time payment of a fee.
The external modules implement a `data-collector` interface with a `collect` function to get the data and a `get-fee-recipient` function to identify the receiving account.
In this example, the `data-market` module code acquires the `COLLECT` capability, and uses this capability to prevent `collect` and a `get-fee-recipient` functions from being called directly.

However, with the wrong code, this seemingly benign code can be exploited by a malicious module reference implementation:

```pact
(module data-market GOVERNANCE
  ...

  (defun collect-data (collector:module{data-collector})
    "Provide data, get paid!"
    ;; BAD: capability acquired before modref calls
    (with-capability (COLLECT)
      ;; BAD: modref invoked with capability in scope!
      (store-data (collector::collect))
      (pay-fee (collector::get-fee-recipient)))
  )

  (defun pay-fee (account:string)
    "Private function to pay one-time fee for collection"
    (require-capability (COLLECT))
    (coin.transfer FEE_BANK account FEE))

  (defun store-data (data:object{data-schema})
    "Private function to update database with data collection results"
    (require-capability (COLLECT))
    ...)
)
```

The problem with the module code is that the `with-capability` call happens _before_ the calls to the module reference operations, such that while the external module code is executing, the `COLLECT` capability is in scope.
While the `COLLECT` capability is in scope, the `pay-fee` and `store-data` functions can be called from anywhere.
Malicious code could exploit this code with a module reference that calls the `data-market.pay-fee` function repeatedly in the seemingly innocent calls to the `collect` or `get-fee-recipient` functions.
Malicious code could also call the `data-market.store-data` function and wreak havoc that way.
The important point in this example is that once a capability is in scope, the protections provided by the `require-capability` function aren't available.

Fortunately, you can avoid this situation by keeping module reference calls outside of the scope of the sensitive capability.
For example:

```pact
(defun collect-data (collector:module{data-collector})
  "Provide data, get paid!"
  ;; GOOD: modref invoked before with-capability call
  (let ((data (collector::collect))
        (account (collector::get-fee-recipient)))
    (with-capability (COLLECT)
      (store-data data)
      (pay-fee account))))
```

In this example, the module reference calls have safely returned before the `COLLECT` capability is acquired.
A malicious implementation has no way to invoke the sensitive code.

### Coding with module references

You can reference modules and interfaces directly by issuing their name in code.
For example:

```pact
(module foo 'k
  (defun bar () 0))

(namespace ns)

(interface bar
  (defun quux:string ()))

(module zzz 'k
  (implements bar)
  (defun quux:string () "zzz"))

foo ;; module reference to 'foo', of type 'module'
ns.bar ;; module reference to `bar` interface, also of type 'module'
ns.zzz ;; module reference to `zzz` module, of type 'module{ns.bar}'
```

Using a module reference in a function is accomplished by specifying the type of the module reference argument, and using the [dereference operator](/reference/syntax#dereference-operator) `::` to invoke a member function of the interface specified in the type.

```pact
(interface baz
  (defun quux:bool (a:integer b:string))
  (defconst ONE 1)
  )
(module impl 'k
  (implements baz)
  (defun quux:bool (a:integer b:string)
    (> (length b) a))
  )

...

(defun foo (bar:module{baz})
  (bar::quux 1 "hi")   ;; dereferences 'quux' on whatever module is passed in
  bar::ONE             ;; directly references interface const
)

...

(foo impl) ;; 'impl' references the module defined above, of type 'module{baz}'
```

You should use module reference calls in use cases that require dynamic evaluation of a function or interface or when an interface requires multiple implementations.
For example, decentralized exchanges and liquidity pools typically require module references.
You should avoid using use module reference calls where you have a capability that you are using to guard resources could be brought into scope in an external module.

For example, if you are using the INTERNAL_FUNDS_CAP to guard account funds in the `mymodule` module, you shouldn't bring that capability into scope before calling the external module:

```pact
(module mymodule GOVERNANCE
  ...
  (defcap INTERNAL_FUNDS_CAP true) ; my capability for funds owned by this module
  (defconst MODULE_ACCOUNT_GUARD (create-capability-guard (INTERNAL_FUNDS_CAP))
  (defconst MODULE_ACCOUNT (create-principal MODULE_ACCOUNT_GUARD))
  
  (defun withdraw (person:string amount:decimal mref:module{fungible-v2}) 
    (with-capability (INTERNAL_FUNDS_CAP)
      (mref::transfer person MODULE_ACCOUNT amount)
      (coin.transfer MODULE_ACCOUNT person amount))))
```

In this example, the INTERNAL_FUNDS_CAP capability—which should only be brought into scope for the `coin.transfer` call—is in scope for both the external `mref::transfer` call and the `coin.transfer` call.
With this vulnerability, a malicious user could write a module that satisfies the `fungible-v2` interface that drains all of the funds from `mymodule` because the INTERNAL_FUNDS_CAP is in scope.

To fix the issue, you need to change where the call that grants the INTERNAL_FUNDS_CAP capability is brought into scope:

```pact
(defun withdraw (person:string amount:decimal mref:module{fungible-v2}) 
    (mref::transfer person MODULE_ACCOUNT amount)
    (with-capability (INTERNAL_FUNDS_CAP)
       (coin.transfer MODULE_ACCOUNT person amount))))
```

## Read-only module reference calls

With Pact 5.3, any module reference function call that calls back into the originating module are enforced as read-only calls to prevent database modification and re-entrancy attacks.