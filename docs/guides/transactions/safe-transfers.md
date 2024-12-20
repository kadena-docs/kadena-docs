---
title: Transfer funds safely
description: "Guarantee safe transfer operations."
id: howto-safe-transfers
---

# Transfer funds safely

Transferring funds from one account to another involves a certain amount of risk because if you make a mistake in typing or copying a public key, you could lose access to the funds after they are transferred.

Pact allows you to construct safe transfer transactions that guarantee:

- Someone possesses the correct private key.
- The private key will be able to access the funds being transferred.

To provide this guarantee, you can construct a single transaction that executes two separate transfer operations.
For example, if Alice wants to transfer coins to Bob, she can construct the transaction with one `transfer` operation for the desired coins plus a small additional amount to use as a test transfer.
She then adds a second transfer operation to return the additional coin amount that is used to verify the account owner.
This type of transaction must be signed by both the Alice and Bob accounts and each signature must have the appropriate `coin.TRANSFER` capability. 
It's especially important to construct this type of transaction if you are using the `transfer-create` function because that is when you are defining the new account's keyset.

## Using a YAML request file and curl

Wallets with front-end interfaces can make transfers, including safe transfers, transparent for end-users.
However, it's often useful to step through the process from the command-line to better understand the mechanics of how a safe transfer works.

In this example:

- Two key pairs are generated and saved to separate files for the transaction signers using `pact --genkey > alice-keys.yaml` and `pact --genkey > bob-keys.yaml`.
- The public key for the Alice (pact-random-key) account is 3c4fc4bcd59850704ba04704730140839ac0f0b65c1ba8fe2f3f6640475f8d67.
- The public key for the Bob account is 3fef2d008c1ba8c319dce5b5ce5d89ba4074fb3a3b333746420619135e305678.
- The keyset defined in the request is used to create the Bob account, so that public key is required.

To create the transaction for a safe transfer:

1. Create a YAML execution request that looks similar to the following example: 

   ```pact
   code: |-
     (coin.transfer-create "pact-random-key" "bob" (read-keyset "ks") 2.001)
     (coin.transfer "bob" "pact-random-key" 0.001)
   data:
     ks:
       keys: ["3fef2d008c1ba8c319dce5b5ce5d89ba4074fb3a3b333746420619135e305678"]
       pred: "keys-all"
   publicMeta:
     chainId: "5"
     sender: "pact-random-key"
     gasLimit: 1200
     gasPrice: 0.0000001
     ttl: 7200
   networkId: "development"
   signers:
     - public: "3c4fc4bcd59850704ba04704730140839ac0f0b65c1ba8fe2f3f6640475f8d67"
       caps:
         - name: "coin.TRANSFER"
           args: ["pact-random-key", "bob", 2.001]
         - name: "coin.GAS"
           args: []
     - public: "3fef2d008c1ba8c319dce5b5ce5d89ba4074fb3a3b333746420619135e305678"
       caps:
         - name: "coin.TRANSFER"
           args: ["bob", "pact-random-key", 0.001]
   type: exec
   ```

   Notice that this YAML file uses the `signers` attribute and not the `keyPairs` attribute.

2. Prepare the transaction for signing by using the --unsigned command-line option:
   
   ```bash
   pact --unsigned test-transfer.yaml > test-transfer-unsigned.yaml
   ```

3. Add the signature for the Alice account from the `alice-keys.yaml` file:
   
   ```bash
   cat test-transfer-unsigned.yaml | pact add-sig alice-keys.yaml > signed-alice.yaml 
   ```

4. Add the signature for the Bob account from the `bob-keys.yaml` file:
   
   ```bash
   cat test-transfer-unsigned.yaml | pact add-sig bob-keys.yaml > signed-bob.yaml
   ```

5. Combine the signatures from both accounts to create the final transaction file:
   
   ```bash
   pact combine-sigs signed-alice.yaml signed-bob.yaml > tx-transfer.json
   ```

6. Send the final transaction to the blockchain:
   
   ```bash
   curl -X POST -H "Content-Type: application/json" -d "@tx-transfer.json" http://localhost:8080/chainweb/0.0/development/chain/5/pact/api/v1/send
   ```

## Using kadena-cli commands

If you have installed the `kadena-cli` package in your development environment, you can use the `kadena tx add` and the `safe-transfer.ktpl` template to construct safe transfer transactions for the development, test, or main network.
With interactive prompting, the template guides you to provide the information required, so it is less error-prone than manually crafting and signing a transaction request.
