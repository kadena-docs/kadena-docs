---
title: Guards
description: "Guards are an important concept in Kadena that provide a flexible way for you to enforce authorization rules that grant or restrict access based on specific conditions."
id: guards
sidebar_position: 5
---

# Guards

In Pact, **guards** provide a flexible way for you to enforce authorization rules that grant or restrict access based on specific conditions. 
Guards generalize the behavior of keysets and capabilities to specify conditions that must be met before granting access to an account, a privileged operation, or any type of information that the guard is there to protect. 

Although Pact provides several types of guards to handle different scenarios and use cases, a guard is essentially a predicate function that enables you to test whether a condition is present (true) or not (false) with an `enforce-guard` function.

As you've already seen, a keyset is the most common type of guard.
It specifies a list of keys and a predicate function to verify how many keys were used to sign the current transaction.
The keyset predicate references a function that compares the public keys in the keyset to the key or keys used to sign the blockchain message. 
The function accepts two arguments—`count` and `matched`—where `count` is the number of keys in the keyset and `matched` is how many keys in the message signature match a keyset key.
The `enforce-keyset` function tests whether the required number of matching keys is true or false, determining whether the transaction succeeds with the required number of matched keys or fails because the required number of matched  weren't found in the signing set.

The following examples illustrate other use cases for guard predicate functions:

- Ensure that a user is a member of a privileged group that can execute a certain function.
- Verify that a user has provided some secret, such as the preimage data for a hash function, as is often done for atomic swaps.
- Enforce that a module is the only owner that can execute a specific function, for example, to debit a protected account.

Guards enable you combine all of these types of checks into a single, enforceable rule.
For example: 

Verify the user Alicia is a member of the Executive Board authorized to access the General Fund AND has provided the preimage data AND the transaction is only executable by the module `general-fy2025`".

## Supported guards

Guards can have different properties based on what they are intended to protect access to, but can also interoperate with each other seamlessly.
You can include any or all of the following Pact guards in a smart contract:

- Keyset guard
- KeysetRef guard
- User guard
- Capability guard
- Module guard (DEPRECATED)
- Pact guard (DEPRECATED)

Note that the module guard and Pact guard are DEPRECATED because they are considered unsafe.

You can store guards in the Pact database using the `guard` type. 
Although Pact defines these different guards to handle different use cases, the most important point to consider in selecting a guard is ensuring it enforces the appropriate conditions to allow or deny access to the appropriate entity, whether that entity is an account balance, a privileged operation, or a customizable user function.

## Guards and capabilities

Guards and capabilities provide similar functionality in terms of authorizing access based on specific conditions.
However, there are a few fundamental differences between guards and capabilities:

- Guards allow you to define a _rule_ that must be satisfied for an operation or transaction to proceed. 
  They simply provide a way to declare a pass-fail condition—the predicate function—without granting any type of privilege or authorized activity. 
  The Pact guard system is flexible enough to express any rule you can code.
  
- Capabilities allow you to declare how a rule is deployed to grant some _authority_. 
  In doing so, they enumerate the critical rights that are extended to users of the smart contract, and protect code from being called incorrectly.

In addition, you can only grant capabilities inside the module code that declares them.
Guards are simply data that can be tested anywhere. 
For capabilities, this is an important distinction because it ensures an attacker can't elevate privileges from outside of the module code.

## Keyset guards

The `keyset` guard is the backward-compatible `keyset` as originally defined in Pact. 
This guard is also referred to as a **concrete keyset** that's defined in the environment.
Using the `keyset` type is the one instance where you can restrict a guard subtype.
For all other guards, the `guard` type obscures the implementation type to discourage you from using guard-specific control flow, which would be against best practices. 
In general, you should use the `guard` type unless you have a specific need to use a keyset.

### Examples

To create a keyset guard with the name `admin-keyset`:

```json
{
  "admin-keyset": {
    "keys": [
      "58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c"
    ],
    "pred": "keys-all"
  }
}
```

To define a keyset by reading a keyset object:

```pact
(define-keyset "admin-keyset" (read-keyset "admin-keyset"))
(enforce-guard (read-keyset "admin-keyset"))
```

### Principal account prefix

Each type of principal and guard uses a unique prefix, so they are easy to recognize. 
If you use the `create-principal` function to a create principal account for a keyset guard, the principal account uses one of the following prefixes:

- k: for single key keysets
- w: for multiple keys keysets

## KeysetRef guard

You can install concrete keyset guards in the REPL environment by using the `define-keyset` function.
However, if you want to store a reference to a defined keyset, you must use a `string` type. 
To make REPL environment keysets interoperate with concrete keysets and other guards, you can use the KeysetRef guard to indicate that a defined keyset is used instead of a concrete keyset.

### Examples

```pact
(enforce-guard (keyset-ref-guard "foo"))

(update accounts user { "guard": (keyset-ref-guard "foo") })
```

## User guard

User guards allow you to design an arbitrary predicate function to enforce the guard, given some initial data.
With user guards, you can implement any type custom predicate logic that can't be expressed by other built-in guard types.

For example, you might want to customize the guard to allow one of two different keysets to sign:

- One keyset registers the keys for the members of a board of directors.
- A second keyset registers the keys for union representatives.
 
You can then design a user guard to require two separate keysets to be enforced:

```pact
(defun both-sign (board union)
  (enforce-keyset board)
  (enforce-keyset union))

(defun install-both-guard ()
  (write guard-table "both"
    { "guard":
      (create-user-guard
        (both-sign (read-keyset "board) (read-keyset "union")))
    }))


(defun enforce-both-guard ()
  (enforce-guard (at "guard" (read guard-table "both"))))
```

User guards can be very flexible and powerful.
They can be stored in the database and passed around like plain data.
However, user guards are pure functions that don't allow access to a database during evaluation of the guard.

### Examples

The following example illustrates how to write a custom hash timelock guard to implement atomic swaps.

```pact

(create-hashlock-guard (secret-hash timeout signer-ks)
  (create-user-guard (enforce-hashlock secret-hash timeout signer-ks)))

(defun enforce-hashlock (secret-hash timeout signer-ks)
  (enforce-one [
    (enforce (= (hash (read-msg "secret")) secret-hash))
    (and
      (enforce-keyset signer-ks)
      (enforce (> (at "block-time" (chain-data)) timeout) "Timeout not passed"))
      ]))
```

### Principal account prefix

Each type of principal and guard uses a unique prefix, so they are easy to recognize. 
If you use the `create-user-guard` function to create a principal account for a user guard, the principal account uses the following prefix:

- u: for user guards

## Capability guard

Capabilities are in-module rights that can only be enforced within the declaring module, and offer scoping and the other benefits. 

Because user guards are required to be pure functions, they can't take database state into account. 
If you need to access database state, you can define a guard that requires a capability to be brought into scope. 
With this type of guard, you can retrieve database state when you bring the capability into scope. 

## Principal account prefix

Each type of principal and guard uses a unique prefix, so they are easy to recognize. 
If you use the `create-capability-guard` function to create a principal account for a capability guard, the principal account uses the following prefix:

- c: for capability guards
