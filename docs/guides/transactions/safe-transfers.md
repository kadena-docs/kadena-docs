---
title: Transfer funds safely
description: ""
id: howto-safe-transfers
---

# Transfer funds safely

Transferring funds from one account to another involves a certain amount of risk because if you make a mistake in typing or copying a public key, you could lose access to the funds after they are transferred.

Pact allows you to construct safe transfer transactions that guarantee:

- Someone possesses the correct private key.
- The private key will be able to access the funds being transferred.

To provide this guarantee, you can construct a single transaction that executes two separate transfer operations.
For example, if Alice wants to transfer 200 coins to Bob, she can construct the transaction with one `transfer` operation for the desired 200 coins plus a small additional amount to use as a test transfer.
She then adds a second transfer operation to return the additional coin amount that is used to verify the account owner.
This type of transaction must be signed by both the Alice and Bob accounts and each signature must have the appropriate `coin.TRANSFER` capability. 
It's especially important to construct this type of transaction if you are using the `transfer-create` function because that is when you are defining the new account's keyset.

In this example:

The public key for the Alice account is 6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7.
The public key for the Bob account is 368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca.

To create the transaction for a safe transfer, you can create a YAML execution request that looks similar to the following example: 

```pact
code: |-
  (coin.transfer-create "alice" "bob" (read-keyset "ks") 200.1)
  (coin.transfer "bob" "alice" 0.1)
data:
  ks:
    keys: [368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca]
    pred: "keys-all"
publicMeta:
  chainId: "0"
  sender: alice
  gasLimit: 1200
  gasPrice: 0.00001
  ttl: 7200
networkId: "mainnet01"
signers:
  - public: 6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7
    caps:
      - name: "coin.TRANSFER"
        args: ["alice", "bob", 200.1]
      - name: "coin.GAS"
        args: []
  - public: 368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca
    caps:
      - name: "coin.TRANSFER"
        args: ["bob", "alice", 0.1]
type: exec
```