---
title: Pact best practices 
description: "Recommendations and reminders for patterns to avoid and practices to follow when writing programs using the Pact smart contract programming language." 
id: best-practices
---

# Pact best practices 

As a programming language, Pact has some unique features that make it adaptable to writing sophisticated applications, but that are also flexible enough to allow coding mistakes that can make a contract vulnerable to potential misuse. 
This topic summarizes common mistakes to avoid and best practices you should follow as you develop programs with Pact. 

## Common issues and mistakes

The following list summarizes the most common difficulties that developers who are new to Pact encounter or are most likely to misinterpret.

- Internal methods are often not guarded by capabilities, allowing any unprivileged user to modify contract state.

- Capabilities are often granted in cross-module calls by accident, giving the target module more permissions than it should have in the calling module.

- How namespaces, accounts, and guards are used in Pact can be difficult to adjust to for developers familiar with other blockchain ecosystems or programming languages.
  For example, Solidity developers are used to accounts being public keys and contracts having addresses, and often write smart contracts that only support single key (k:) accounts or deploy contracts insecurely in the free namespace.

- Developers often forget to add types to their contracts, causing type errors that result in failed transactions later on.

- Projects often split contract functionality into too many separate contracts—even if they share the same governance—complicating security and the overall design.

- Contract operations that require user authorization use the `enforce-guard` function to require a transaction signature without using a capability.
  In Pact, capabilities enable users to scope their signature to specific actions—explicitly signaling their consent—so that they know exactly what operations they are authorizing with their signature.
  However, if you allow unscoped signatures by using `enforce-guard` without putting it into the body of a capability code block, it's impossible for users for know what actions they are authorizing with their signature.

- Developers often avoid defining managed capabilities because they seem complex or to introduce friction by requiring users to explicitly authorize the operation they are signing for.
  However, managed capabilities prevent transactions from replay operations that could allow funds to be drained from accounts or other operations could have unintended consequences.
  By requiring a signature, capability guard, or user guard to authorize activity, you can safeguard users from transactions that perform unintended operation when executing contract functions.

- Developers sometimes deploy contracts in the free or user namespace, fail to register a principal namespace, or accidentally deploy contracts in more than one namespace.
  It's important to note, that functions are defined in module declarations, and modules are deployed in namespaces.
  A `payment` function defined in the `pistolas-retail` module that's deployed in the `n_01234567` namespace is not the same as the `payment` function defined in the `pistolas-retail` module that's deployed in the `n_890abcde` namespace.
  Even if the code is identical, the path to the function uniquely identifies each function.

## Best practices 

The following list summarizes patterns, practices, and strategies for writing Pact code and delivering quality projects for the Kadena ecosystem.

- Explicitly type all function parameters and results.

- Use objects with schemas and use lists with the list item type resolved. 
  For example, use `(a:object{mySchema})` and avoid `(a:object)`.
  Similarly, use `(a:[integer])` instead of `(a:list)`. 

- Run the type checker over the code as you iterate on the implementation. 

- Create unit tests for every function that fully exercise error cases, especially cases of missing authorization to perform actions. 

- Be careful when using module references.
  In particular, keep in mind that when you call into other modules, those modules will be granted the same set of capabilities as the code making the call into those modules.

- Use the `enforce` built-in functions to check for conditions that should terminate transaction execution immediately. 
  The `enforce` functions ensure that if any invariants are violated, the transaction fails. 

- Use the [`/local`](/api/pact-api/local) endpoint when you want to query Pact state in tables or blockchain data.

- Use [events](/smart-contracts/capabilities#events) to send information about transaction results to off-chain software.

- Only use [`select`](/pact-5/database/select) and [`keys`](/pact-5/database/keys) built-in functions in `/local` queries. 

- Consider what data must be on chain and any data or operations that might be better suited to off-chain handling. 

- Plan for longevity and avoid defining functions that grow data structures—like lists—without bounds. 
  In general, gas usage per transaction should not go up over time as your code is used more. 

- Keep functions that share the same governance in the same module. 
  It’s fine to create composable contracts with reusable utility functions. 
  However, it’s generally a better practice to keep the implementation of core functions in the same module unless the functions are governed by different parties.

- Design and document the capabilities your contract requires and the conditions you'll use to enforce that only authorized users have access to privileged operations. 
  Remember that capabilities can provide explicit and fine-grained access control to functions, but only if you enforce the conditions to guard them correctly.
  Upfront planning can help to ensure you define and grant capabilities precisely where they are needed to make your contract secure.
  Be sure you know how calling a capability by using the `with-capability` function differs from calling a capability by using the `require-capability` function.

- Keep in mind that any code executed in the same transaction as the transaction that deploys a contract is granted full administrative privilege over the module, including the ability to update the module and edit module tables.

- Create your own [principal namespace](/guides/transactions/howto-namespace-tx) before deploying contracts on the Kadena test or main production network.

- You should always use [managed capabilities](/smart-contracts/capabilities#managed-capabilities) to guard contract operations that require user authorization and that should only be executed once in a transaction.
  All capabilities allow users to authorize specific actions. 
  Managed capabilities allow contracts to keep track of how a capability that's been granted in a transaction can be used, either by setting a limit on a protected resource or by preventing the capability from being granted more than once in a transaction.
  For functions involving assets transfers, you should use managed capabilities to prevent replay attacks within a transaction.

## Enforcing access controls

As discussed in [Capabilities](/smart-contracts/capabilities), basic and managed capabilities are critical components for controlling how permissions are granted to users of smart contracts.
In addition, most modules define a governance capability as the module owner.
Conceptually, capabilities aren't difficult to comprehend or implement.
However, if they aren't used correctly, capabilities can make your contract vulnerable to unexpected behavior or to be exploited.

The following examples demonstrate patterns and outcomes for governance and basic capabilities.

### Governance

As discussed in [Modules and references](/smart-contracts/modules), every Pact module has a keyset or capability that has full administrative ownership of the module. 
In most cases, modules define a **governance capability**. 
The governance capability for a module is different from other capabilities in two important ways: 

- The governance capability for a module provides total control over the code defined in the module.
  With this capability, the module owner can grant capabilities, access tables, modify module functions, and deploy upgraded module code on the blockchain.

- External code can attempt to take control of a module by acquiring the module's governance capability.
  Usually, capabilities can only be granted inside the module they are defined in.

In example code for modules, the body of the governance capability is often set to `true` for simplicity.
For example:

```pact
(module payments GOV
   (defcap GOV () true)
   ...
)
```

If the code associated with a capability—like GOV in this example—is simply set to true, no conditions are being enforced to restrict access and the capability is always granted when requested.
Any Pact code can take total control over the module.

If you don't enforce any restrictions on the module administrative privileges, anyone can take control of the contract and modify its tables and functions. 
This vulnerability might seem insignificant while you're testing in a development environment.
However, it's important to plan for and implement access controls that prevent unauthorized use of functions that perform any type of sensitive or privileged operation.

The following examples demonstrate common patterns to avoid and follow to help you make contract operations more secure.
You can find more complex and complete examples in the `coin` contract and in the `marmalade` and `spirekey` repositories.

As previously noted, the following pattern is often used in sample code for simplicity:

```pact-bad
(namespace "free")     ; Public namespace used for testing only

(module YODA0 GOV
  (defcap GOV () true) ; Anyone can take over the governance of the module with this capability body
  
  (defun hello-world:string (input:string)
    (format "Hello {}" [input]))
)
```

However, this pattern makes your contract vulnerable to hijacking with no protections in place to prevent unauthorized access.
You should only use this pattern in your local development environment and in the early stages of learning to write Pact code.

Another common mistake is to read a keyset or message that doesn't enforce a signing key to grant a capability as illustrated in the following example:

```pact-bad
(namespace "n_d5ff15")

(module YODA1 GOV
  (defcap GOV () 
    (enforce-keyset (read-keyset "hello-world"))) ; You can put any value into hello-world
  
  (defun hello-world:string (input:string)
    (format "Hello {}" [input]))
)
```

In this example, the `read-keyset` function reads whatever value is defined under the "hello-world" key in the environment data.
The `read-keyset` function doesn't verify that the value under the "hello-world" key represents a valid keyset object, valid values, or a keyset you control.
If someone else specifies a valid keyset in the environment data, that keyset would pass the governance check and take control of the module.

The following example is similar except that it identifies a specific keyset name to enforce—not just read—and specifies that the keyset exists within the `n_d5ff15` namespace:

```pact
(namespace "n_d5ff15")

(module YODA2 GOV
  (defcap GOV () 
    (enforce-keyset "n_d5ff15.hello-world")) ; You must create the keyset on-chain in the same transaction
                                             ; used to deploy the module
  (defun hello-world:string (input:string)
    (format "Hello {}" [input]))
)
```

This example uses the correct syntax, but the `n_d5ff15.hello-world` keyset could be claimed by someone else if you don't create the keyset in the message payload for the transaction used to deploy the module.

The following example illustrates a more secure pattern that defines a keyset, then uses that keyset to control the administrative privileges for a module:

```pact
(namespace "n_d5ff15")

(define-keyset "n_d5ff15.hello-world" (read-keyset 'ks))

(module YODA3 GOV
  (defcap GOV () 
    (enforce-guard (keyset_ref_guard "n_d5ff15.hello-world")) ; Correct usage for deploying a module 
  )
  (defun hello-world:string (input:string)
    (format "Hello {}" [input]))
)
```

In this example, you define a `hello-world` keyset in the `n_d5ff15` principal namespace and must include the `ks` keyset definition in the environment data for testing in the Pact REPL or in the message payload for deployment.

### Basic capabilities

The following example illustrates defining a second capability to control access to a specific function:

```pact
(namespace "n_d5ff15")

(define-keyset "n_d5ff15.hello-world" (read-keyset 'ks))

(module YODA4 GOV
  (defcap GOV () 
     (enforce-guard (keyset_ref_guard "n_d5ff15.hello-world"))
  ) 
  (defcap USER (account:string) 
    (enforce-guard (at 'guard (coin.details account)))) ; This condition requires an account to exist, but will  
                                                        ; validate that the account guard matches the signer

  (defun hello-world:string (input:string account:string)
    (with-capability (USER account)
    (format "Hello {}" [input])))
)
```

This example requires the `coin` contract to be loaded and the specified account to exist on-chain.
The `hello-world` function has also been modified to require an `account` string as an argument.
For example:

```pact
(n_d5ff15.YODA4.hello-world "Robot" "k:000ca7383b2267a0ffe768b97b96104d0fb82e576c53e35a6a44e0bb675c53ce")
```

With this pattern, the condition for the USER capability checks that the guard matches the specified account.
If the account exists and the condition evaluated is true, the account can run the `hello-world` function.
The USER capability now enforces that only the specified account can run the `hello-world` function.

The following example illustrates using a guard as input to acquire the capability to access a specific function:

```pact
(namespace "n_d5ff15")

(define-keyset "n_d5ff15.hello-world" (read-keyset 'ks))

(module YODA5 GOV
  (defcap GOV () 
    (enforce-guard (keyset_ref_guard "n_d5ff15.hello-world"))
  )
  
  (defcap USER (account:string guard:guard) 
    (enforce-guard guard)) ; This condition requires the guard to be provided as input to sign for the transaction

  (defun hello-world:string (input:string account:string guard:guard)
    (with-capability (USER account guard)
    (format "Hello {}" [input])))
)
```

In this example, the `hello-world` function has been modified to require an `account` string and a `guard` as arguments.
If the guard is a keyset, you can use the `read-keyset` function and keyset name to input the keys and predicate for the account.
For example, if the guard is the keyset you defined using `ks` as the keyset name, you could call the function with arguments similar to the following:

```pact
(n_d5ff15.YODA5.hello-world "Robot" "k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0" (read-keyset 'ks)) 
"Hello Robot"
```

The following example illustrates another common enforcement mistake;

```pact
(namespace "n_d5ff15")
(define-keyset "n_d5ff15.hello-world" (read-keyset 'ks))

(module YODA6 GOV
  (defcap GOV () 
    (enforce-guard (keyset_ref_guard "n_d5ff15.hello-world"))
  )

  (defcap USER (account:string) 
    (enforce (!= account "") "Specify an account")) ; Anyone can sign for this capability

  (defun hello-world:string (input:string account:string)
    (with-capability (USER account)
    (format "Hello {}" [input])))
)
```

With this pattern, any string used for the `account` argument passes the enforcement rule for the USER capability, enabling any user to acquire the capability and use the unprotected function.
For example, any value can be used with this function:

```pact
(n_d5ff15.YODA6.hello-world "Robot" "jae") 
"Hello Robot"
```

The following example illustrates using a hard-coded account string instead of reading a keyset or guard from a table or the message payload:

```pact
(namespace "n_d5ff15")
(define-keyset "n_d5ff15.ks" (read-keyset 'ks))

(module YODA7 GOV
  (defcap GOV () 
    (enforce-guard (keyset_ref_guard "n_d5ff15.ks"))
  )
  
  (defcap USER (account:string) 
    (enforce (= account "k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0") "Invalid account"))
  
  (defun hello-world:string (input:string account:string)
    (with-capability (USER account)
    (format "Hello {}" [input])))
)
```

If the enforced `account` string is used, the capability is acquired:

```pact
(n_d5ff15.YODA7.hello-world "Robot" "k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0")
"Hello Robot"
```

If any other account or arbitrary string is used, the operation fails:

```pact
(n_d5ff15.YODA7.hello-world "Robot" "k:9a23bf6a61f753d3ffa45c02b33c65b9dc80b8fb63857debcfe21fdb170fcd99")
Error: <interactive>:9:4: Invalid account
```
