---
title: Transfer funds safely
id: howto-safe-transfers
---
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';

# Safe transfers

With many cryptocurrencies, users risk losing their funds if they make a mistake typing the public key they are transferring funds to because their private key can't access the funds after they are transferred using the incorrect public key.

Pact allows you to construct transfer transactions that guarantee:

Someone possesses the correct private key.
The private key will be able to access the funds being transferred.
To provide this guarantee, you can construct a single transaction to execute two separate transfer operations:

One transfer from alice to bob for the desired amount plus a small amount extra coins for a test transfer.
One transfer from bob to alice to return the extra coins used to verify the account owner.
This type of transaction must be signed by both the alice and bob accounts and each signature must have the appropriate coin.TRANSFER capability. It's especially important to construct this type of transaction when you are using the transfer-create function because that is when you are defining the new account's keyset.

In this example:

The public key for the account alice is 6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7.
The public key for bob is 368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca.
Transfer coins in a safe transaction. 

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