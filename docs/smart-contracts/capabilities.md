---
title: Capabilities and events
description: "Capabilities are the primary means by which you can grants granular permission to perform tasks that you wan to control access to."
id: capabilitiess
sidebar_position: 8
---

# Capabilities and events

Capabilities are a core feature in the Pact smart contract programming language.
Drawing from capability-based access control models, Pact capabilities provide fine-grained control over how permissions are granted to users of smart contracts.
With capabilities, you can manage permissions and authorize actions based on specific conditions in an explicit, transparent, and principled way. 
Because capabilities typically grant elevated privileges that users must authorize, they also provide a convenient way to report on [events](#events) emitted by executing transactions.

## Traditional and Pact security models

To understand the Pact security model and capabilities as an authorization method, it's useful to consider how users authorize a privileged operation—like transferring tokens from one account to another—in the traditional security model.
The transfer operation is one the most important privileged operations for any token contract.
This operation should only ever be allowed under conditions set by the account owner and explicitly authorized in some way.
In the traditional security model, accounts are controlled by the public key of the account owner and only transactions that are signed with the corresponding private key can withdraw from the account.

In Pact, privileged operations can have another layer of security that requires all parties signing a transaction to specify the actions they are authorizing with their signature. 
These explicitly authorized actions are called **signer capabilities**, and they are separate from the Pact code that's executed in the transaction. 
Regardless of the code thats runs during the transaction, the signer capabilities ensure that only the authorized actions can be performed on the user's behalf.

In general, you can think of a _capability_ as a _ticket_ that, when _acquired_, allows the user to perform a privileged operation. 
If the user is unable to acquire the ticket, any part of the transaction that requires the ticket fails.
For the Kadena `coin` contract, the privileged operation is the `transfer` function and the corresponding capability is the `coin.TRANSFER` capability.
The user acquires the `coin.TRANSFER` capability with a signature to authorize the `transfer` operation.

## Expressing capabilities

As a system for managing rights during the execution of a transaction, capabilities consist of a name, a list of arguments, optional metadata, and a function body that returns a boolean.

You can define capabilities in Pact modules by using the `defcap` reserved keyword and specifying the following attributes:

- A capability _name_ or _domain_ that identifies the operation being protected.
- One or more _parameters_ to specify properties or conditions for the capability to be granted.
- A _predicate function_ to determine whether the capability is acquired or not.

For example, the following sample code defines an ALLOW_ENTRY capability:

```pact
(defcap ALLOW_ENTRY (user-id:string)
  "Govern entry operation."
  (with-read table user-id
    { "guard" := guard, "active" := active }
    (enforce-guard guard)
    (enforce active "Only active users allowed entry"))
)
```

In this example:

- `ALLOW_ENTRY` is the _name_ or _domain_ of the capability. 

- `user-id` is a _parameter_. 
  Together, the name and parameter attributes form the _specification_ of the capability. 
  Therefore, `(ALLOW_ENTRY 'dave)` and `(ALLOW_ENTRY 'carol)` describe separate capabilities.

- The remaining body implements the _predicate function_ for the capability. 
  In its simplest form, the predicate function accesses whatever data it needs to perform the tests necessary to protect against improper granting of the capability. 
  The body can also do more, including import or _compose_ additional capabilities or modify database state. This might be used to ensure a capability cannot be granted ever again after the first time it is acquired, for example.

Because `defcap` declarations both _specify_ a domain of capability instances, and _implement_ the guard function, the capability grant doesn't need to be called when invoked in `with-capability` or `require-capability` function calls.
You can only grant a capability within the module where it's defined.

### Acquire a capability

You can grant a capability to a function by using the `(with-capability)` function.
For example, to acquire the `ALLOW_ENTRY` capability, you would call the `with-capability` function like this:

```pact
(defun enter (user-name)
  (with-capability (ALLOW_ENTRY user-name)
    (do-entry user-name)            ;; call "protected" function
    (update-entry-status user-name) ;; update database
  )
  (record-audit "ENTRY" user-name)  ;; some "unsafe" operation
)
```

When capabilities are granted, they are installed into the Pact environment for the scope of the call to the `with-capability` function.
After the code exits the call to the `with-capability` function, the capability is removed. 
This scoping prevents duplicate testing of the predicate.
Capabilities that have already been acquired and are in-scope are not re-evaluated.

### Require a capability

You can protect sensitive code with the `(require-capability)` function. 
With the  `(require-capability)` function, code can demand that a capability be already granted, that is, make no attempt to acquire the ticket, but fail if it was not acquired somewhere else.
To demand or _require_ the capability, you would call the `require-capability` function like this:

```pact
(defun do-entry (user-name)
  (require-capability (ALLOW_ENTRY user-name))
  ...
)
```

By requiring a capability, you can define private or restricted functions than cannot be called directly. 
In this example, the `do-entry` function can only be called by code inside the module somewhere and can only be called in an outer operation for this user in particular, restricting it to that user.

## Composing capabilities

A `defcap` can import other capabilities, for modular factoring of guard code, or to compose an outer capability from smaller, inner capabilities.
For example:

```pact
(defcap ALLOW_ENTRY (user-id:string)
  "Govern entry operation."
  (with-read table user-id
    { "guard" := guard, "active" := active }
    (enforce-guard guard)
    (enforce active "Only active users allowed entry")
    (compose-capability DB_LOG) ;; allow db logging while ALLOW_ENTRY is in scope
    )
)
```

Composed capabilities are only in scope when their parent capability is granted.

## Signature capabilities

In Pact transaction messages, transaction signers can **scope** their signature to one or more specific capabilities. 
By scoping signature to specific capabilities, you can restrict keyset guard operations based on that signature.
Keysets that require the scoped signature only succeed if the capability has been acquired or is in the process of being acquired.

Scoped capabilities enable transaction signers to safely call untrusted code. 
For example, the `sender` of a transaction can specify the `GAS` capability to authorize gas payments in the `coin` contract.
By scoping the signature to this capability, the account signature can't be used to access any other code that might be called by the transaction.

## Managed capabilities

Whereas most capabilities act as tickets you show to authorize a protected operation, Pact also supports **managed capabilities**.
Managed capabilities can change the state of a capability as it is brought into and out of scope. 
Managed capabilities are dynamic objects that mediate whether capabilities are acquired.
Managed capabilities are _installed_ by attaching them to the signature list for a transaction.
If the predicate function for a managed capability allows the signer to install the capability, the installed capability then governs the code required to unlock protected operations through the use of a **management function**.

Managed capabilities can also be installed by [_verifier plug-ins_](https://github.com/kadena-io/KIPs/pull/57).
Capabilities that are installed by verifier plug-ins are also scoped to the specific capabilities that they install. 
Verifier plugins are external to Pact.
However, they are similar to signature capabilities in that they enable you to specify some type of trusted entity—for example, a signature or a generated proof—that grants the capabilities to perform some type of protected operation. 
A signature capability can use the `(enforce-guard g)` function to check that the keyset guard `g` includes the signer's key.
A capability granted by a verifier plug-in can use the `(enforce-verifier 'name)` function to check that `"name"` is the name of the verifier plug-in.

## Dynamic capability management with a management function

A managed capability allows for safe inter-operation with otherwise untrusted code. 
By signing with a managed capability, you are _allowing_ some untrusted code to _request_ the grant of the capability.
If the capability is not in the signature list, the untrusted code cannot request it.

If the capability _management function_ doesn't grant the request, the untrusted code fails to execute. 
The common usage of this is to grant a payment to third-party code, such that the third-party code can directly transfer on behalf of the user some amount of coin, but only up to the indicated amount.

The following example illustrates this use case with the `TRANSFER` managed capability:

```pact
(defcap TRANSFER (sender:string receiver:string amount:decimal)
  @managed amount TRANSFER_mgr
  (compose-capability (DEBIT sender))
  (compose-capability (CREDIT receiver)))

(defun TRANSFER_mgr:decimal (managed:decimal requested:decimal)
  (enforce (>= managed requested) "Transfer quantity exhausted")
  (- managed requested) ;; update managed quantity for next time
)
```

In this example, the `TRANSFER` capability allows the `sender` to approve any number of payments to `receiver` up to some `amount`. 
After the amount is exceeded, the capability can no longer be brought into scope.

This allows third-party code to directly enact payments. 
Managed capabilities are an important feature to allow smart contracts to directly call other trusted code in a tightly-constrained context.

### Automatic capability management

A managed capability that does not specify a management function is **automatically managed** so that it can only be used once.
After the capability is installed, it can be granted exactly once for the given parameters. 
Further attempts will fail after the initial grant goes out of scope.

In the following example, the VOT capability is automatically managed:

```pact
(defcap VOTE (member:string)
  @managed
  (validate-member member))
```

## Modeling capabilities with compose-capability

In many cases, you can use the compose-capability function to improve code logic with clear separation of concerns.
The following example illustrates separating the `transfer`, `debit`, and `credit` functions—and corresponding capabilities—so that `debit` is always called with a corresponding `credit` operation with the `TRANSFER` capability being a "no-guard" capability that simply encloses the `debit` and `credit` calls:

```pact
(defcap TRANSFER (from to amount)
  (compose-capability (DEBIT from))
  (compose-capability (CREDIT to)))

(defcap DEBIT (from)
  (enforce-guard (at 'guard (read table from))))

(defcap CREDIT (to)
  (check-account-exists to))

(defun transfer (from to amount)
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

## Testing scoped signature capabilities

You can test scoped signatures using the `env-sigs` REPL-only function as follows:

```pact
(module accounts GOV
  ...
  (defcap PAY (sender receiver amount)
    (enforce-keyset (at 'keyset (read accounts sender))))

  (defun pay (sender receiver amount)
    (with-capability (PAY sender receiver amount)
      (transfer sender receiver amount)))
  ...
)

(env-sigs [{'key: "alice", 'caps: ["(accounts.PAY \"alice\" \"bob\" 10.0)"]}])
(accounts.pay "alice" "bob" 10.0) ;; works as the cap match the signature caps

(env-sigs [('key: "alice", 'caps: ["(accounts.PAY \"alice\" "\carol\" 10.0)"]}])
(expect-failure "payment to bob will no longer be able to enforce alice's keyset"
  (accounts.pay "alice" "bob" 10.0))
```

## Capabilities and guards

Guards and capabilities can be confusing: given we have guards like keysets, what do we need the capability concept for?

Guards allow us to define a _rule_ that must be satisfied for the transaction to proceed. As such, they really are just a way to declare a pass-fail condition or predicate. The Pact guard system is flexible enough to express any rule you can code.

Capabilities allow us to declare how that rule is deployed to grant some authority. In doing so, they enumerate the critical rights that are extended to users of the smart contract, and "protect" code from being called incorrectly.

Note also that **capabilities can only be granted inside the module code that declares them**, whereas guards are simply data that can be tested anywhere. This is an important security property, as it ensures an attacker cannot elevate their privileges from outside the module code.

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

You can use the [env-events](/reference/functions/repl-only-functions#env-events) function in the Pact REPL to test for emitted events in `.repl` scripts.
