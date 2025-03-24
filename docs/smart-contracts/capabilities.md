---
title: Capabilities
description: "Capabilities are the primary means by which you can grant granular permissions to perform tasks for which you wan to control access."
id: capabilities
sidebar_position: 8
---

# Capabilities

At a high level, Pact **capabilities** are a straightforward **access control model** for smart contracts.
With capabilities, you can define specific conditions to authorize specific actions for specific users.
Capabilities provide an explicit and transparent way to protect privileged operations, enforce rules before allowing transactions to execute, and ensure smart contract users authorize actions that are performed on their behalf.

Because capabilities are a core feature in the Pact smart contract programming language and powerful in how they enable you to manage permissions and resources, it's important to understand what they are, how they work, and how to define them correctly to achieve intended results.

## Permissions, resources, and events

Before getting into the details of how capabilities are defined, you should consider that there are three distinct—but related—use cases for capabilities.
You can define capabilities to do the following: 

- Authorize access to a specific privileged operation.
- Manage updates for a specific protected resource.
- Report events from operations executed in a transaction.

In the most common use case, you define capabilities to manage permissions by enforcing one or more conditions. 
In combination with guards, these permission-driven capabilities act as gatekeepers to grant or deny access to specific operations in smart contract functions.
Capabilities that are used to manage permissions during the execution of a transaction are the most basic type of capability.

You define this type of capability by specifying the `defcap` reserved keyword followed by a name, optional arguments, and a predicate function body that returns a boolean value.
For more information about defining, acquiring, and scoping basic capabilities, see [Expressing basic capabilities](#expressing-basic-capabilities)

It's also possible to use a capability to manage a specific resource.
Capabilities that manage resources are called **managed capabilities**. 
Managed capabilities are defined with the same `defcap` reserved keyword, but also include the `@managed` metadata tag in the declaration body.
Managed capabilities also have slightly different properties and more complex use cases than capabilities that only control access to operations.
For more information about defining and using managed capabilities, see [Managed capabilities](#managed-capabilities).

You can configure any capability you define to emit an event by including the `@event` metadata tag in the declaration body.
For more information about using capabilities to emit events, see [Events](#events).

## Expressing basic capabilities

Basic capabilities provide a system for managing permissions during the execution of a transaction.
In general, you can think of basic capabilities as a _ticket_ that, when _acquired_, allows the user to perform a privileged operation.
If the user is unable to acquire the ticket, any part of the transaction that requires the ticket fails.

You can define capabilities in Pact modules by specifying the `defcap` reserved keyword followed by the following:

- A capability _name_ that describes the permission to be acquired or the operation to be protected.
- Optional _parameters_ that specify input arguments, properties, or conditions for the capability.
- A _predicate function_ that determines whether the capability is acquired or not.

The following example defines a basic ALLOW_ENTRY capability:

```pact
(defcap ALLOW_ENTRY (user-id:string)
  "Govern entry operation."
  (with-read users-table user-id
    { "guard" := guard, "active" := active }
    (enforce-guard guard)
    (enforce active "Only active users allowed entry"))
)
```

In this example, the ALLOW_ENTRY definition consists of the following:

- `ALLOW_ENTRY` is the _name_ of the capability.

- `user-id` is a _parameter_ to be evaluated when the capability is called.

- `with-read` contains the body of the capability that implements the _predicate function_ for the capability.
  In its simplest form, the predicate function evaluates one or more conditions to determine whether the permission is granted.
  If the conditions that are checked pass—that is, if the expression evaluates to true—the function where the capability is called acquires the capability.

### Acquiring a capability

You must define capabilities within the context of the module where you define the functions that should use them. 
You'll learn more about this requirement in [Scopes and capabilities](#scope-in-pact-modules).
For the purposes of this example, you can assume that the `ALLOW_ENTRY` capability is defined in a `registration` module that looks like this:

```pact
(module registration GOVERNANCE
  (defcap GOVERNANCE () true)
  
  (defcap ALLOW_ENTRY (user-id:string)
    "Govern entry operation."
    (with-read users-table user-id
      { "guard" := guard, "active" := active }
      (enforce-guard guard)
      (enforce active "Only active users allowed entry"))
  )
)
```

After you define a capability, you can call the `with-capability`built-in function to determine whether a function can acquire the capability.
For example, you can define the `entry` function to attempt to acquire the `ALLOW_ENTRY` capability before executing a protected operation by calling the `with-capability` function like this:

```pact
(defun entry (user-id)
  (with-capability (ALLOW_ENTRY user-id)
    (add-entry user-id)            ;; call a protected operation within the with-capability block
    (update-entry-status user-id)  ;; update database within the with-capability block
  )
  (record-audit "ENTRY" user-id)   ;; call an unprotected operation outside of the with-capability block
)
```

If acquiring the capability is successful, the capability remains in effect for the scope of the call to the `with-capability` function.
After the code block containing the call to the `with-capability` function exits, the capability is removed.
Restricting the capability to the code contained within the `with-capability` block prevents duplicate testing of the predicate.
Capabilities that have already been acquired and that are currently in scope are not re-evaluated.

### Requiring a capability

The `with-capability` function enables authorized users to acquire the specified capability that grants them permission to perform a privileged operation.
The `require-capability` function requires authorized users to have been granted the specified capability before they can execute a privileged operation.
The `require-capability` function doesn't allow users to acquire a capability.
If the capability wasn't acquired in the context of another function, the function calling the `require-capability` function will fail.

For example, you can require the ALLOW_ENTRY capability to have been acquired and currently in scope before executing the `add-entry` function like this:

```pact
(defun add-entry (user-id)
  (require-capability (ALLOW_ENTRY user-id))
  ...
)
```

By requiring a capability, you can define private or restricted functions than cannot be called directly.
In this example, the `add-entry` function can only be called by code inside the module that grants the ALLOW_ENTRY capability and can only be called for this `user-id` in particular, restricting the function to that user.

However, it's important to note that the `require-capability` function doesn't scope to a body of code.
The position at which you insert it affects the semantics of the function call and the operations that happen first, before the capability requirement is applied.
If you insert the `require-capability` call at an inappropriate position, you might see unexpected behavior or error messages.
In general, you should insert the `require-capability` call at the beginning of a function call.

### Composing capabilities

A `defcap` declaration can also include other capabilities, for modular factoring of guard code or to compose an outer capability from smaller, inner capabilities.
For example, the following ALLOW_ENTRY capability declaration includes an inner capability—the DB_LOG capability—that's defined its own separate `defcap` declaration:

```pact
(defcap ALLOW_ENTRY (user-id:string)
  "Govern entry operation."
  (with-read users-table user-id
    { "guard" := guard, "active" := active }
    (enforce-guard guard)
    (enforce active "Only active users allowed entry")
    (compose-capability DB_LOG) ;; allow db logging while ALLOW_ENTRY is in scope
    )
)
(defcap DB_LOG () true)
```

Composed capabilities must be defined using `defcap` declarations in the same module as the parent capability and are only in scope when their parent capability is granted.

In many cases, you can use the `compose-capability` function to improve code logic with clear separation of concerns.
The following example illustrates separating the `transfer`, `debit`, and `credit` functions—and corresponding capabilities—so that `debit` is always called with a corresponding `credit` operation with the `TRANSFER` capability being a "no-guard" capability that simply encloses the `debit` and `credit` calls:

```pact
(defcap TRANSFER:bool (from:string to:string amount:decimal)
  (compose-capability (DEBIT from))
  (compose-capability (CREDIT to)))

(defcap DEBIT (from:string)
  (enforce-guard (at 'guard (read table from))))

(defcap CREDIT (to:string)
  (check-account-exists to))

(defun transfer (from:string to:string amount:decimal)
  (with-capability (TRANSFER from to amount)
    (debit from amount)
    (credit to amount)))

(defun debit (user amount)
  (require-capability (DEBIT user))
    (update accounts user ...))

(defun credit (user amount)
  (require-capability (CREDIT user)
    (update accounts user ...)))
```

In this example:

- The `TRANSFER` capability protects the `debit` and `credit` calls from being used independently.
- The `DEBIT` capability governs the ability to debit, enforcing the guard.
- The `CREDIT` simply creates a restricted capability for the `credit` function.

## Managed capabilities

Most capabilities control permissions and act as tickets that you must acquire to access protected operations.
However, Pact also supports **managed capabilities** that are identified by adding the `@managed` metadata tag in the `defcap` declaration body.
Managed capabilities provide an additional layer of security that requires all parties involved in a transaction to specify the actions they are authorizing with their signature.
By requiring a signature to authorize an action, managed capabilities allow for safe inter-operation with otherwise untrusted code.

You can define managed capabilities to manage resources in two different ways:

- To update a specific resource dynamically through a **management function**. 
- To automatically update a resource once without using a management function.

Managed capabilities that use a management function can be called multiple times.
Managed capabilities that don't specify a management function can only be called once.  

### Using management functions

One of the most common use cases for managed capabilities with management functions is for transfer operations.
The following example illustrates this use case with the `TRANSFER` managed capability and the TRANSFER_mgr management function:

```pact
  (defcap TRANSFER:bool (sender:string receiver:string amount:decimal)
    @managed amount TRANSFER-mgr
    (enforce (!= sender receiver) "same sender and receiver")
    (enforce (> amount 0.0) "Positive amount")
    (compose-capability (DEBIT sender))
    (compose-capability (CREDIT receiver))
  )

  (defun TRANSFER-mgr:decimal (managed:decimal requested:decimal)
    (let ((newbal (- managed requested))) ;; update managed quantity for next time
      (enforce (>= newbal 0.0)            ;; check that the new balance doesn't exceed the managed quantity
        (format "TRANSFER exceeded for balance {}" [managed]))
      newbal)
  )
```

In this example, the `TRANSFER` capability allows the `sender` to approve any number of transfer operations to the `receiver` up to the _resource_ specified by the `@managed` keyword.
In this case, the resource is the `amount` value and the `TRANSFER_mgr` function checks and updates that resource value each time the TRANSFER capability is called for in the `transfer` function:

```pact
(defun transfer:string (sender:string receiver:string amount:decimal)
    (enforce (!= sender receiver) "sender cannot be the receiver of a transfer")
    (enforce (> amount 0.0) "transfer amount must be positive")

    (with-capability (TRANSFER sender receiver amount)
      (debit sender amount)
      (with-read coin-table receiver
        { "guard" := g }

        (credit receiver g amount))
    )
)
```

If transfer operations exceed the `amount` value, the TRANSFER capability can no longer be brought into scope.

You can install the TRANSFER capability by calling the `install-capability` function to scope the capability to a signature and set the initial `amount` for the resource to be managed.

```pact
(install-capability (coin.TRANSFER sender receiver amount))
```

In subsequent calls, you use the `with-capability` function and the `amount` argument to specify a value for the resource being requested before the capability can be granted.
In that scenario, the value passed as the first argument to the management function comes from the current amount held in the Pact state.

You can use managed capabilities and management functions to manage any type of resource.
For example, you could specify a list or an object as the resource you want to manage, then write a management function that removes names from the list or updates object properties based on some condition.
However, the `@managed` keyword only allows you to specify a single resource to be managed—that is, updated—by the management function.

The management function takes the type of the managed parameter, executes the logic required to validate the requested capability, and returns the new managed value that results from the request.

### Single-use managed capabilities

Managed capabilities that specify a management function update the managed resource dynamically each time the requested capability is acquired.
If a managed capability doesn't specify a management function, the requested capability can only be called once in a transaction.
After the capability is installed, it can be granted exactly once for the given parameters.
Further attempts will fail after the initial grant goes out of scope.

In the following example, the VOTE capability is automatically managed to ensure that a validated member can only vote once:

```pact
(defcap VOTE (member:string)
  @managed
  (validate-member member))
```

### Installing signatures and verifiers

In Pact transaction messages, transaction signers can **scope** their signature to one or more specific capabilities.
By scoping signatures to specific capabilities, smart contract users can restrict guard operations based on that signature.
These explicitly-authorized actions are separate from the Pact code that's executed in the transaction.
Regardless of the code that runs during the transaction, the scoped capabilities ensure that only the authorized actions can be performed on the user's behalf.

Scoped capabilities enable transaction signers to safely call untrusted code.
For example, the `sender` of a transaction can specify the `GAS` capability to authorize gas payments in the `coin` contract.
By scoping the signature to this capability, the account signature can't be used to access any other code that might be called by the transaction.

If a user authorizes a managed capability, the capability is installed and attached to the signature list for the transaction.
For example, the following transaction excerpt attaches two capabilities—coin.TRANSFER and coin.GAS—to the public key "fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7" signature:

```json
{
    "signers": [
        {
            "pubKey": "fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7",
            "clist": [
            {
                "name": "coin.TRANSFER",
                "args": ["k:fe4b6da3...27f608b7" "k:4fe7981d...0bc284d0\",2]},
            {
                "name": "coin.GAS",
                "args":[]}
            ]
        }
    ]
}
```

If the predicate function for the managed capability allows the signer to install the capability, the installed capability then governs the code required to unlock protected operations on the user's behalf.

You can test scoped signatures using the `env-sigs` built-in function as follows:

```pact
(module accounts GOV
  ...
  (defcap PAY (sender:string receiver:string amount:decimal)
    (enforce-keyset (at 'keyset (read accounts sender))))

  (defun pay (sender:string receiver:string amount:decimal)
    (with-capability (PAY sender receiver amount)
      (transfer sender receiver amount)))
  ...
)

(env-sigs [{'key: "alice", 'caps: ["(accounts.PAY \"alice\" \"bob\" 10.0)"]}])
(accounts.pay "alice" "bob" 10.0) ;; works as the cap matches the signature caps

(env-sigs [('key: "alice", 'caps: ["(accounts.PAY \"alice\" "\carol\" 10.0)"]}])
(expect-failure "payment to bob will no longer be able to enforce alice's keyset"
(accounts.pay "alice" "bob" 10.0))
```

Managed capabilities can also be installed by [_verifier plug-ins_](https://github.com/kadena-io/KIPs/pull/57).
Capabilities that are installed by verifier plug-ins are also scoped to the specific capabilities that they install.
Verifier plugins are external to Pact.
However, they are similar to signature capabilities in that they enable you to specify some type of trusted entity—for example, a signature or a generated proof—that grants the capabilities to perform some type of protected operation.
A signature capability can use the `(enforce-guard g)` function to check that the keyset guard `g` includes the signer's key.
A capability granted by a verifier plug-in can use the `(enforce-verifier 'name)` function to check that `"name"` is the name of the verifier plug-in.

### Managed capability events

Managed capabilities always emit events automatically with the parameters specified when the capability is first installed or acquired.
However, managed capabilities only emit events once.
Capabilities that aren't managed can emit events any number fo times.
For more information about events, see [Events](#events).

## Scope in Pact modules

In Pact, the functions and expressions that you execute outside of a module declaration are often referred to as top-level expressions. 
Functions and expressions that are defined within a module declaration are within the scope of that module.
For example, top-level expressions can include direct calls to built-in functions like the following:

```pact
(+ 1 2)
(map (- 1) [10 20 30])
```

In addition, there are several top-level expressions that set context for a module that must be defined outside of the module declaration.
For example, you use top-level expressions to define and enter a namespace, define keysets, create tables, and read messages from transaction data.

```pact
;; Before module declaration

(define-namespace dev-namespace (read-keyset "user-account" ) (read-keyset "dev-ks-account" ))
(define-keyset "dev-namespace.dev-ks-account" (read-keyset "dev-ks-account" ))

;; Module declaration
(
    ...
)

;; After module declaration

(if (read-msg 'upgrade)
  ["upgrade"]
  [
    (create-table order-table)
  ]
)
```

The functions and expressions that are defined in a module declaration are included in the scope of that module.
For example, if you define the `awards` function in the `league` module declaration, the function is within the scope of the `league` module.

```pact
(module league GOVERNANCE 
  (defcap GOVERNANCE () true)
   (defun awards (tier:integer)
     (+ tier 2) 
   )
)
```

In most cases, capabilities are defined within the scope of a module and you can acquire the access token from within the body of any function defined in the module if you meet the conditions specified in the body of the `defcap` declaration.

```pact
(module league GOVERNANCE
  (defcap GOVERNANCE ()
    (enforce-keyset league_admin))
  (defcap LEAGUE_OPS ()
    ;; one or more conditions that must pass
  )

  (defun awards (tier:integer)
     (with-capability (LEAGUE_OPS) (+ tier 2)) ; operation succeeds if the conditions for LEAGUE_OPS are met     
  )
)
```

For example, you can acquire the `league.LEAGUE_OPS` capability by using the `with-capability` call in any function declaration or `defpact` step in the `league` module where the `LEAGUE_OPS` capability is declared.

```pact
(module league GOVERNANCE
  (defcap GOVERNANCE ()
    (enforce-keyset league_admin))
  (defcap LEAGUE_OPS ()
    ;; one or more conditions that must pass
  )

  (defun awards (tier:integer)
     (with-capability (LEAGUE_OPS) (+ tier 2)) ; operation succeeds if the conditions for LEAGUE_OPS are met     
  )
  
  (defpact transfer-portal ()
    (step (with-capability (LEAGUE_OPS) ... )) ; operation succeeds if the conditions for LEAGUE_OPS are met
    (step ...)
  )
)
```

These examples demonstrate the most common way you acquire the privileges associated with a capability is by calling the `with-capability` built-in function within a `defun` or `defpact` declaration inside of a module declaration.
If the conditions specified in the body of the capability declaration are met, permissions are granted and the operation proceeds.
The conditions you specify in the body of the capability declaration can vary, but typically enforce some type of guard or key signature.

You should also note that you can't acquire a capability inside of a capability declaration.
For example, if you try to acquire a capability in the body of a capability declaration, you'll see an error similar to the following:

```pact
"Loading league.pact..."
league.pact:13:7: with-capability form not allowed within defcap
 13 |       ((with-capability (LEAGUE_OPS) (* tier 2)))
    |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

## Acquire a capability outside of a module

You can acquire a capability in the top-level—that is, outside of the scope of a module—or within the scope of another module if, and only if, you have the administrative privileges to control the module and satisfy the conditions to acquire the capability.

The following example illustrates a module declaration for the `west-conf` module that defines a GOVERNANCE capability and an UMPIRE capability with conditions set to true to always succeed:

```pact
(module west-conf GOVERNANCE
  (defcap GOVERNANCE () true)
  (defcap UMPIRE () true)
  ...
)
```

If you deploy this module or load it into the Pact REPL, the GOVERNANCE capability grants you the administrative privileges for the transactions immediately following the deployment of the module.
For example, after you load the `west-conf` module in the Pact REPL, you can acquire the `UMPIRE` capability to perform an operation:

```pact
(with-capability (west-conf.UMPIRE) (* 3 8))
24
```

Because deploying a module grants you administrative privileges for the module, you can perform other privileged operations—like upgrading modules and creating tables—in the same deployment transaction. 
In this example, there are no conditions that must be met to acquire the `UMPIRE` capability.
If there were conditions to enforce in the body of the `defcap` declaration for the `UMPIRE` capability, those conditions would need to be satisfied to perform the requested operation.

The previous example demonstrates the principle of using module administrator privileges to bring a capability into scope.
However, this example doesn't represent a typical use-case. 
In most cases, you want to carefully control and restrict access to capabilities to prevent unintended privilege elevation. 
If access to the module administrator privileges is managed in any way—for example, owned by a specific keyset or guard or if a module is not upgradable—you must be able to acquire the module administrator rights to bring a capability into scope.

To acquire module administrator rights for testing purposes in the Pact REPL, you can use the [`env-module-admin`](/pact-5/repl/env-module-admin) and [`acquire-module-admin`](/pact-5/general/acquire-module-admin) built-in functions.

The following example demonstrates using the `acquire-module-admin` function to access module administrator rights for `module-test` to upgrade a module:

```pact
pact> (module west-conf GOVERNANCE (defcap GOVERNANCE () (enforce false "non-upgradable")))
Loaded module west-conf, hash v4XXlmt7RI-HVZvPb69lQhFbh8k-luKCtWtm4OVJVU8
pact> (begin-tx "Begin a new transaction after deployment")
"Begin Tx 0 Begin a new transaction after deployment"
pact> (use west-conf)
Loaded imports from west-conf
pact> (with-capability (GOVERNANCE) (* 3 8))
(interactive):1:51: non-upgradable
 1 |  (with-capability (GOVERNANCE) (* 3 8))
   |                                                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  at(west-conf.GOVERNANCE.{v4XXlmt7RI-HVZvPb69lQhFbh8k-luKCtWtm4OVJVU8}):(interactive):0:1-0:39
pact> (acquire-module-admin west-conf)
"Module admin for module west-conf acquired"
pact> (with-capability (GOVERNANCE) (* 3 8))
24
```

To limit module administrator privileges for a capability to a specific transaction block, you can use the `env-module-admin` built-in function.

```pact
pact> (begin-tx "Get module admin privileges for a transaction")
"Begin Tx 1 Get module admin privileges for a transaction"
pact> (use west-conf)
Loaded imports from west-conf
pact> (with-capability (GOVERNANCE) (* 6 9))
(interactive):1:51: non-upgradable
 1 | (with-capability (GOVERNANCE) (* 6 9))
   |                                                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
pact> (env-module-admin west-conf)
"Acquired module admin for: west-conf"
pact> (with-capability (GOVERNANCE) (* 6 9))
54
```

## Reducing vulnerability and enforcing access controls

The code defined for the GOVERNANCE capability determines whether you are granted the module administrative privileges.
For simplicity in code examples, the body of the GOVERNANCE capability is often set to true. 
For example:

```pact
(namespace 'free)
(module YODA GOV
   (defcap GOV () true) ; Anyone can take over the governance of the module
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
  (defcap GOV () true) ; Anyone can take control of the module the true statement
  
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
    (enforce-keyset (read-keyset 'hello-world))) ; You can put any value into hello-world with no enforcement
  
  (defun hello-world:string (input:string)
    (format "Hello {}" [input]))
)
```

In this example, you haven't defined a `hello-world` keyset in the `free` namespace.
The `read-keyset` function doesn't verify that "hello-world" represents a valid keyset object or valid values.
With this pattern, you won't see an error but no enforcement is being performed. 

The following example is similar except that it identifies a specific keyset name to enforce—not just read—and specifies that the keyset exists within the `free` namespace:

```pact
(namespace 'free)

(module YODA2 GOV
  (defcap GOV () 
    (enforce-keyset "free.hello-world")) ; You must create the keyset on-chain in the same transaction
                                         ; used to deploy the module or the keyset and module can take over
  (defun hello-world:string (input:string)
    (format "Hello {}" [input]))
)
```

This example uses the correct syntax, but the `free.hello-world` keyset could be claimed by someone else if you don't create the keyset before deploying the module or in the message payload for the transaction used to deploy the module.

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

## Events

In Pact, events are emitted as part of transaction execution and are included in the transaction results.
With events, you can monitor transaction results to determine if a specific operation occurred and prove the outcome using a simple payment verification proof.

Events are treated as capabilities because they share the following characteristics:

- Events, like capabilities, allow arbitrary data to be published under a topic or a name.
  With capabilities, the capability name is the topic, and the arguments are the data.
- Granting permission to acquire a managed capability is, in itself, an event recorded for transaction.
  Events complete the managed capability lifecycle, where you might install or approve a capability of some quantity on the way in, but not necessarily see what quantity was used.
  With events, the output of the actually acquired capability is present in the transaction results.
- Capabilities are protected such that they can only be acquired in module code, which is appropriate for events as well.

Any capability can cause events to be emitted when the capability is acquired by using the `@event` metadata tag.
For example:

```pact
(defcap BURN(qty:decimal)
  @event
  ...
)
```

However, the `@event` metadata tag can't be used alongside `@managed` metadata tag, because managed capabilities emit events automatically with the parameters specified when the capability is acquired.
From an eventing point of view, managed capabilities are those capabilities that can only happen once.
Whereas, a non-managed, eventing capability can fire events an arbitrary amount of times.

You can use the [env-events](/pact-5/repl/env-events) function in the Pact REPL to test for emitted events in `.repl` scripts.
