---
title: Accounts, keys, and principals
description: Learn about how public and secret keys are used in accounts and how accounts on Kadena blockchain differ from accounts and addresses on most blockchains.
id: accounts
sidebar_position: 2
---

# Accounts, keys, and principals

With most blockchains, accounts and account addresses that can send and receive funds are based on generating public and secret key pairs then using your public key as your account name. 
This “one-to-one” model keeps things simple, but runs into problems when you want to use multiple keys for a single account. 
For example, you might want an account to represent joint-ownership for partners in a relationship or the officers in a board of directors who must approve expenditures by a majority vote.

To handle situations where an account must represent more than one owner, Kadena makes a distinction between **keys** and **accounts**. 
This distinction enables multiple keys to be associated with the same account name.

In simple terms, an **account name** is a unique name on the blockchain that can hold funds with one or more public and secret key pairs that grant access to the account. 
The keys determine ownership of an account. 
The rules for how many keys are required to act on behalf of the account are defined in a construct called a **keyset**.

## Defining a keyset

A keyset is a specific type of **guard** that consists of one or more public keys and a **predicate function** that specifies how many of the keys are required to perform an operation. 
In JSON, a keyset object looks similar to the following example:

```json
{
  "keys": [
    "1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4",
    "4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0",
    "58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c"
    ],
  "pred": "keys-any"
}

```

In this keyset, there are three public keys defined as owners associated with this keyset.
The predicate function of `keys-any` means that any of the three public keys can sign transactions and act on the behalf of the account associated with this keyset.
To make this keyset usable for practical purposes in a smart contract, it's assigned a name.
You can then reference the name to check whether an action is valid by verifying at least one (keys-any) of these three public keys has authorized it.

```json
{
  "my-keyset-name": {
    "keys": [
      "1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4",
      "4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0",
      "58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c"
    ],
    "pred": "keys-any"
  }
}
```

In this example, you evaluate the keyset name `my-keyset-name` and, if the result is `true`, allow the action to be performed.
 
## Defining accounts

Keysets are important because they are one part what it takes to define an account.
An account is an entry in the Kadena `coin` contract, the ledger that keeps track of all transfers from one account to another.
In the `coin` contract, an account consists of the following parts:

- Key: An **account name** in the form of a string of 3 to 256 LATIN-1 characters (key).
- Vale: An **account object** that holds the **decimal balance** of funds in the account and the **keyset** that governs the account.

```text
key: "Valencia-HOA" -> value: { 0.0, { ["1d5a5e10...",""4fe7981d...",""58705e86..."], "keys-any" }}
```

As you saw in the previous example, the keyset consists of one or more public keys and the predicate function that specifies the number of keys that must sign a transaction for the account.

There are three built-in predicate options:

- keys-all
- keys-any
- keys-2

For most accounts—where there's only one public key with ownership of the account—the default predicate of `keys-all` works as you would expect it to, granting ownership of the account to a single party. 
However, the predicate function is important to consider when creating accounts that require multiple signatures or have multiple owners. 
For example, the `keys-2` predicate requires that at least two public keys defined in the keyset for the account must sign a transaction to authorize the execution of that transaction.

The following diagram illustrates the relationship between keys, keysets, and accounts:

![Keys, keysets, and accounts on the Kadena network](/img/kadena-account.png)

If you would like to learn more about keys and accounts in Kadena, see [Beginner's Guide to Kadena: Accounts + Keysets](https://medium.com/kadena-io/beginners-guide-to-kadena-accounts-keysets-fb7f32104291).

## Accounts on a multi-chain network

The Kadena network is a scalable proof-of-work blockchain with a consensus model that weaves the transactions and blocks from multiple **parallel chains** into a single and consistent view of the blockchain state. 
For a visual introduction to how the Kadena Chainweb protocol weaves connections from multiple chains into a single view of state, watch the 3-minute video [How Chainweb Works: A Simple Animation](https://www.youtube.com/watch?v=hYvXxFbsN6I).

Ultimately, this single view of state is one network. 
However, each of the parallel chains in the network operates independently. 
When you create and fund an account on any chain, it only exists on that chain. 
You can create accounts on more than one chain, but they are essentially independent accounts, with separate account balances and potentially different keysets and owners. 
Because the chains operate independently, you should always pay close attention to the network and chain identifier you have selected when you are signing and submitting transactions.

It's also important to remember that the account name—on its own—doesn't determine the ownership of an account. 
The keyset associated with an account determines ownership.
You could own an account named Alice on chain 0, and someone else could own an account named Alice on chain 5. 
If you want to own a specific account name across all of the chains in the network, you would need to be the first person to create that account with your keys on each chain.
To create a one-to-one relationship between a specific account name and a specific keyset, Kadena introduced the concept of **principal accounts**.

## Account names and principals

As mentioned in [Defining accounts](#defining-accounts), an account name can be any string. 
Using an arbitrary string as an account name can be convenient. 
For example, you might want to create an account with a name that identifies it as a personal or primary account, for example, Lola-Pistola, so that it's easy to differentiate it from an account that you own jointly with another party or a group, for example, Las-Pistolas.

However, using arbitrary or vanity account names like these examples can make your account vulnerable to certain kinds of attacks. 
For example, an attacker might try to frontrun a transaction that creates an account or transfers funds by changing the keyset associated with the account name. 
One way to prevent an an attacker from trying to impersonate you with a frontrunning attack is to create **principal** account. 
A principal is a way to enforce a one-to-one relationship between a **guard** and a resource that the guard is there to protect, like an account name to protect the ownership of an account balance. 
If an attacker tries to intercept a transaction by changing an account keyset—the most common type of guard—the new keyset won't match the one defined in the underlying ledger, so the transaction would fail.

### Keysets and principals

Keysets represent the most-commonly used type of guard and are the most similar to how most blockchains protect access to accounts using public and secret keys. 
As you've already seen, a keyset holds a collection of one or more public keys and a predicate function that defines how many of those keys must sign to authorize an action. 
In Pact, a guard is an assertion of ownership, for example, the ownership of a particular keyset, capability, or user attribute.
By calling a function to enforce the guard, Pact produces a Boolean value that must return true for an associated action to take place.

By default, when you define a **principal account** with a **single** public key and the **keys-all** predicate, the result is an account name that starts with the `k:` prefix, followed by the public key for the account. This naming convention creates a principal account for an individual key.

You can use the `create-principal` built-in function to create a principal account name for a specified `keyset` guard.
The `create-principal` function returns a string that represents the principal identified by the specified `keyset` guard.
In the following example, the `create-principal` function creates a principal from the `keyset` guard with the name `valencia-keyset`:

```pact
(env-data {"valencia-keyset":{ "keys": ["fe4b6da3...27f608b7"], "pred": "keys-all" } })
"Setting transaction data"

(create-principal (read-keyset "valencia-keyset"))
"k:fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7"
```

You can also create principal accounts for keysets that have multiple keys and that use either built-in or custom predicate rules. 
For example, you can define a keyset with two public keys and the built-in predicate `keys-any`. 
If you create a principal for this account, the keyset information is used to generate a unique hash and the account is created using the `w:` prefix, followed by the hash for the guard.

In the following example, the `create-principal` function creates a principal from the `keyset` guard with the name `valencia-hoa`:

```pact
(env-data {"valencia-board":{ "keys": ["fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7","5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0"], "pred": "keys-any" } })
"Setting transaction data"

(create-principal (read-keyset "valencia-board"))
"w:kar3UPhvtWsLsn5cr5VtNde7CRykgAknLNlDD6BkOPI:keys-any"
```

### Other types of guards

In addition to keysets, Pact supports several other types of guards that you can implement in smart contracts. 
These guards give you flexibility for handling different types of authorization scenarios, and in general, you can use any type of guard to create a principal account by generating a unique hash.

Each type of principal and guard uses a unique prefix, so they are easy to recognize. 
If you create principal accounts for the guards, you'll see that the principal accounts use the following set of prefixes:

- k: for single key keysets
- w: for multiple keys keysets
- u: for user guards
- c: for capability guards

To learn more about different types of guards and how to use them, see [Guards](/smart-contracts/guards). 

## Transfers within and between chains

There are two main ways to move Kadena tokens (KDA) between accounts:

- Transfer coins between accounts on the same chain.
- Transfer coins between accounts on different chains

The primary different between these two types of transfers is who pays the transaction fee to have the transaction included in a block.

- With same-chain transfers, the sender must pay the transaction fee.
- With cross-chain transfers, the sender and the recipient must both pay a transaction fee.

With a cross-chain transfer, you interact with two different blockchains, which requires two separate transactions, one on each chain.

If you attempt to send a cross-chain transfer to a recipient with no funds on the destination chain, the transfer operation won't be able to complete. However, anyone with funds on the destination chain can help to pay the required fee, allowing the transfer to finish as intended. Kadena has also set up **gas stations** cover the cost of transaction fees for cross-chain transfers. If you have an incomplete cross-chain transfer, you can use the [Transfer assistant](https://transfer.chainweb.com) to finish the transaction on the destination chain.

To learn more about transfers in Kadena, see [Getting started with transfers](https://medium.com/kadena-io/kadena-public-blockchain-getting-started-with-transfers-153bf87d6824).
