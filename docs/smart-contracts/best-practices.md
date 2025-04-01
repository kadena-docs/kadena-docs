---
title: Common mistakes and best practices 
description: "Recommendations and reminders for patterns to avoid and practices to follow when writing programs using the Pact smart contract programming language." 
id: best-practices
---

# Common mistakes and best practices 

As a programming language, Pact has some unique features that make it adaptable to writing sophisticated applications, but that are also flexible enough to allow coding mistakes that can make a contract vulnerable to potential misuse. 
This topic summarizes common mistakes to avoid and best practices you should follow as you develop programs with Pact. 

## Common issues

The following list summarizes the most common difficulties that developers who are new to Pact encounter or are most likely to misinterpret.

- Internal methods are often not guarded by capabilities, allowing any unprivileged user to modify contract state.

- Capabilities are often granted in cross-module calls by accident, giving the target module more permissions than it should have in the calling module.

- How namespaces, accounts, and guards are used in Pact can be difficult to adjust to for developers familiar with other blockchain ecosystems or programming languages.
  For example, Solidity developers are used to accounts being public keys and contracts having addresses, and often write smart contracts that only support single key (k:) accounts or deploy contracts insecurely in the free namespace.

- Developers often forget to add types to their contracts, causing type errors that result in failed transactions later on.

- Projects often split contract functionality into too many separate contracts—even if they share the same governance—complicating security and the overall design.

## Best practices 

The following list summarizes patterns, practices, and strategies for writing Pact code and delivering quality projects for the Kadena ecosystem.

- Explicitly type all function parameters and results.

- Use objects with schemas and use lists with the list item type resolved. 
  For example, use (a:object{my-schema}) and avoid (a:object).
  Similarly, use (a:[integer]) instead of (a:list). 

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
  Remember that capabilities can provide fine-grained access control to functions, but only if you enforce the conditions to guard them correctly.
  Be sure you know how calling a capability using the `with-capability` function differs from calling a capability using the `require-capability` function.

- Keep in mind that any code executed in the same transaction as the transaction that deploys a contract is granted full administrative privilege over the module, including the ability to update the module and edit module tables. 

## Enforcing access controls

As discussed in [Capabilities](/smart-contracts/capabilities), basic and managed capabilities are critical components for controlling how permissions are granted to users of smart contracts.
In addition, most modules define a governance capability as the module owner.
Conceptually, capabilities aren't difficult to comprehend or implement.
However, if they aren't used correctly, capabilities can make your contract vulnerable to unexpected behavior or to be exploited.

The following examples demonstrate patterns and outcomes for governance and basic capabilities.

### Governance

The code defined for the GOVERNANCE capability determines the ownership of a module and its administrative privileges.
For simplicity in code examples, the body of the GOVERNANCE capability is often set to true. 
For example:

```pact
(module payments GOV
   (defcap GOV () true)
   ...
)
```

If the code associated with a capability—like GOVERNANCE in this example—is simply set to true, no conditions are being enforced to restrict access and the capability is always granted.
If you don't enforce any restrictions on the module administrative privileges, anyone can take control of the contract and modify its tables and functions. 
This vulnerability might seem insignificant while you're testing in a development environment.
However, it's important to plan for and implement access controls that prevent unauthorized use of functions that perform any type of sensitive or privileged operation.

The following examples demonstrate common patterns to avoid and follow to help you make contract operations more secure.
You can find more complex and complete examples in the `coin` contract and in the `marmalade` and `spirekey` repositories.

As previously noted, the following pattern is often used in sample code for simplicity:

```pact
(namespace 'free)
(module YODA0 GOV
  (defcap GOV () true) ; Anyone can take over the governance of the module with this capability body
  
  (defun hello-world:string (input:string)
    (format "Hello {}" [input]))
)
```

However, this pattern makes your contract vulnerable to hijacking with no protections in place to prevent unauthorized access.
You should only use this pattern in your local development environment and in the early stages of learning to write Pact code.

Another common mistake is to read a keyset or message that doesn't enforce a signing key to grant a capability as illustrated in the following example:

```pact
(namespace 'free)

(module YODA1 GOV
  (defcap GOV () 
    (enforce-keyset (read-keyset 'hello-world))) ; You can put any value into hello-world
  
  (defun hello-world:string (input:string)
    (format "Hello {}" [input]))
)
```

In this example, the `read-keyset` function reads whatever value is defined under the "hello-world" key in the environment data.
The `read-keyset` function doesn't verify that the value under the "hello-world" key represents a valid keyset object, valid values, or a keyset you control.
If someone else specifies a valid keyset in the environment data, that keyset would pass the governance check and take control of the module.

The following example is similar except that it identifies a specific keyset name to enforce—not just read—and specifies that the keyset exists within the `free` namespace:

```pact
(namespace 'free)

(module YODA2 GOV
  (defcap GOV () 
    (enforce-keyset "free.hello-world")) ; You must create the keyset on-chain in the same transaction
                                         ; used to deploy the module
  (defun hello-world:string (input:string)
    (format "Hello {}" [input]))
)
```

This example uses the correct syntax, but the `free.hello-world` keyset could be claimed by someone else if you don't create the keyset in the message payload for the transaction used to deploy the module.

The following example illustrates a more secure pattern that defines a keyset, then uses that keyset to control the administrative privileges for a module:

```pact
(namespace 'free)
(define-keyset "free.hello-world" (read-keyset 'ks))

(module YODA3 GOV
  (defcap GOV () 
    (enforce-keyset "free.hello-world")) ; Correct usage for deploying a module in the free namespace
  (defun hello-world:string (input:string)
    (format "Hello {}" [input]))
)
```

In this example, you define a `hello-world` keyset in the `free` namespace and must include the `ks` keyset definition in the environment data for testing in the Pact REPL or in the message payload for deployment.

### Basic capabilities

The following example illustrates defining a second capability to control access to a specific function:

```pact
(namespace 'free)
(define-keyset "free.hello-world" (read-keyset 'ks))

(module YODA4 GOV
  (defcap GOV () 
    (enforce-keyset "free.hello-world")) 
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
(free.YODA4.hello-world "Robot" "k:000ca7383b2267a0ffe768b97b96104d0fb82e576c53e35a6a44e0bb675c53ce")
```

With this pattern, the condition for the USER capability checks that the guard matches the specified account.
If the account exists and the condition evaluated is true, the account can run the `hello-world` function.
The USER capability now enforces that only the specified account can run the `hello-world` function.

The following example illustrates using a guard as input to acquire the capability to access a specific function:

```pact
(namespace 'free)
(define-keyset "free.hello-world" (read-keyset 'ks))

(module YODA5 GOV
  (defcap GOV () 
    (enforce-keyset "free.hello-world")) 
  
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
(free.YODA5.hello-world "Robot" "k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0" (read-keyset 'ks)) 
"Hello Robot"
```

The following example illustrates another common enforcement mistake;

```pact
(namespace 'free)
(define-keyset "free.hello-world" (read-keyset 'ks))

(module YODA6 GOV
  (defcap GOV () 
    (enforce-keyset "free.hello-world"))

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
(free.YODA6.hello-world "Robot" "jae") 
"Hello Robot"
```

The following example illustrates using a hard-coded account string instead of reading a keyset or guard from a table or the message payload:

```pact
(namespace "free")
(define-keyset "free.ks" (read-keyset 'ks))

(module YODA7 GOV
  (defcap GOV () 
    (enforce-keyset "free.ks")) 
  
  (defcap USER (account:string) 
    (enforce (= account "k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0") "Invalid account"))
  
  (defun hello-world:string (input:string account:string)
    (with-capability (USER account)
    (format "Hello {}" [input])))
)
```

If the enforced `account` string is used, the capability is acquired:

```pact
(free.YODA7.hello-world "Robot" "k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0")
"Hello Robot"
```

If any other account or arbitrary string is used, the operation fails:

```pact
(free.YODA7.hello-world "Robot" "k:9a23bf6a61f753d3ffa45c02b33c65b9dc80b8fb63857debcfe21fdb170fcd99")
Error: <interactive>:9:4: Invalid account
```
