---
title: Define principal namespaces
description: "How to define a principal namespace using a transaction template and the Kadena CLI."
id: howto-namespace-tx
---

# Define principal namespaces

As discussed in[ Basic concepts](/smart-contracts/basic-concepts), Kadena namespaces provide a static prefix and a secure boundary for all of the contracts, modules, functions, and keyset definitions that you control.
When you are building, testing, and deploying smart contracts on your local development network, you can work directly in the root namespace without defining this boundary. 
For local development, your work is isolated from others because your blockchain—and any smart contracts you deploy—run exclusively on your local computer.

However, if you want to deploy a smart contract on a public blockchain network, like the Kadena test network or main production network, the contract must have a unique name that distinguishes your Pact module from all the others. 
If you try to deploy a Pact module with a name that's already being used on the network where you are trying to deploy, the deployment will fail with an error and you'll pay a transaction fee for the failed attempt.

To prevent name collisions on the same network, Kadena allows you to define your own unique namespace on the blockchain. 
The namespace segregates your work—your smart contracts, keyset definitions, and Pact modules—from applications and modules created and deployed by others. 
Within your namespace, you can control who has access to which features and who can update the namespace with changes. 
As long as the namespace has a unique name, everything you define inside of that namespace is automatically unique, too.

To ensure every namespace has a unique name, Kadena provides a built-in `ns` module on the main, test, and development networks.
You can use the `ns` module to create a uniquely-named and cryptographically-secure **principal namespace** on any Kadena network. 

The `ns` module includes a `create-principal-namespace` function specifically for this purpose. 
The `create-principal-namespace` function enables you to create a namespace using the prefix `n_` followed by the hash of a keyset. 
This naming convention ensures that your principal namespace won't conflict with any other namespaces defined in the same network.

The following example demonstrates how to define a principal namespace in your development environment by using the Kadena CLI and a transaction template.

## Create a transaction request

To define a principal namespace:

1. Open the code editor on your computer and create a new transaction template (`.ktpl`) file in the `~/.kadena/transaction-templates` folder.
   
   For example, create a `namespace.ktpl` file in the `~/.kadena/transaction-templates` folder.

1. Create a transaction request using the YAML API request format with content similar to the following:
   
   ```yaml
   code: |-
     (let ((ns-name (ns.create-principal-namespace (read-keyset "dev-account" ))))
         (define-namespace ns-name (read-keyset "dev-account" ) (read-keyset "dev-account" ))
     )
   data:
     dev-account:
       keys: [fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7]
       pred: "keys-all"
   meta:
     chainId: "3"
     sender: "k:fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7"
     gasLimit: 80300
     gasPrice: 0.000001
     ttl: 600
   signers:
     - public: "fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7"
       caps:
         - name: "coin.GAS"
           args: []
   networkId: "development"
   ```

