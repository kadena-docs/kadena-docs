---
title: Deploy smart contracts
description: "A guide to deploying smart contracts using an API call, the Kadena CLI, and Kadena.js"
id: howto-deploy-contracts
---

# Deploy smart contracts

This guide provides instructions and examples for deploying a smart contract by using an API call, the Kadena CLI, or the Kadena client TypeScript library.

## Using a YAML request and curl

One way you can deploy a new smart contract is by constructing a YAML execution request, formatting the request as a JSON object, and sending the request to ann API endpoint using the `curl` command.
You could also submit the request using Postman or other tools that enable you to call API endpoints directly.
However, formatting an API request manually is typically an error-prone process and inserting full contract code—even for a simple contract—into a YAML configuration file can often lead to unexpected results or errors.

In most cases, constructing a transaction to deploy a smart contract is less error-prone if you use the Kadena CLI.
The Kadena CLI uses the Kadena client TypeScript libraries as a foundation for abstracting and simplifying interaction with the blockchain.

The following example illustrates what the `curl` command to deploy a smart contract would look like:

```bash
curl -X POST "https://api.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/send" \
     -H "Content-Type: application/json" \
     -d '{"cmds": [{
         "hash": "3Ax8wtCfA531HqL8ZUq05spI3mNEOHYvvvSNyyOUN5w",
         "sigs": ["pubKey": "58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c","sig": "2a382b5107cabf1311c6926550ace377524031f767d84fbe5a654dc163550f01a66955620ff3d6a676b8886a6ab09edd910f2d3c6d021966eab4f675f17ed30e"}],
         "cmd": "{\"networkId\":\"testnet04\",\"payload\":{\"exec\":{\"data\":{},\"code\":\"(namespace \'free)\n(define-keyset \'free.vote-testing-keyset 
         (read-keyset \'vote))\n(module vote-testing \'free.vote-testing-keyset\n  (defschema vote\n    voter:string\n    option:string)\n  (deftable votes:{vote})\n 
         (defun vote (poll-id:string option:string)\n    (insert votes (format \"{}-{}\" [poll-id (at \'sender (chain-data))])\n      { \"voter\": (at \'sender (chain-data))\n
                 \"option\": option\n      }\n    )\n  )\n)\"}},\"signers\":[{\"pubKey\":\"f1e12312e4ee8c156b041c3bcc7e422e7d15cb2ddce58c6ff16742770916cfaa\",\
                 "clist\":[{\"args\":[],\"name\":\"coin.GAS\"}]}],\"meta\":{\"creationTime\":1724384042,\"ttl\":7200,\"gasLimit\":100000,\"chainId\":\"1\",\
                 "gasPrice\":1.0e-7,\"sender\":\"k:f1e12312e4ee8c156b041c3bcc7e422e7d15cb2ddce58c6ff16742770916cfaa\"},\"nonce\":\"2024-08-23 03:34:02.198258 UTC\""}]}'
```

## Using kadena-cli

With the `kadena-cli`, you can construct a transaction template to deploy smart contracts.
You can then customize the transactions to deploy the same contract on different chains or different networks.
Depending on how you create your template, you can also use it to deploy different types of contracts with interactive prompting for values or by setting command-line options.

To deploy a smart contract using `kadena-cli`:

1. Create a `deploy-hello.ktpl` template file with the template variables for deploying a contract.
   
   Note that you can embed Pact code directly in a template or data file using the `code` key.
   Alternatively, you can use the `codeFile` key to specify the path to a Pact file. 
   For example, you might create a template file similar to the following:

   ```yaml
   # deploy-hello.yaml
   # YAML configuration for deploying a smart contract
   codeFile: |-
     "{{contract-filename}}"
   data:
     ks: {
       keys: [58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c],
       pred: "keys-all"
     }
   meta:
     chainId: "{{chain-id}}"
     sender: "{{{deployer-account}}}"
     gasLimit: 80300
     gasPrice: 0.000001
     ttl: 600
   signers:
     - public: "{{deployer-public-key}}"
       caps:
         - name: "coin.GAS"
           args: []
   networkId: "{{network-id}}"
   type: exec
   ```

2. Create a new unsigned transaction using the `kadena tx add` command and the `deploy-hello.ktpl` template and follow the prompts displayed to set the appropriate information.

   - For the `contract-filename` template value, specify the path to the Pact file you want to deploy. 
     The path should be relative to the `.kadena/transaction-templates` directory.
   - For the `deployer-account` template value, specify the account name of the contract owner. 
     In this example, it's the Chainweaver wallet account `k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c`
     and the public key is `58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c`.
   - For the `chain-id` and `network-id` template values, specify the chain and network where you want to deploy the contract.
     In this example, the contract is deployed on chain `3` in the `development` network.

   For example, the prompts and output for creating the transaction look similar to the following:
   ```bash
   kadena tx add
   ? Which template do you want to use: deploy-hello.ktpl
   ? File path of data to use for template .json or .yaml (optional):
   ? Template value contract-filename: deploy-hello.pact
   ? Template value chain-id: 3
   ? Template value deployer-account:
   k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c
   ? Template value deployer-public-key:
   58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c
   ? Template value network-id: development
   ? Where do you want to save the output: test-hello
   {
     "cmd": "{\"payload\":{\"exec\":{\"code\":\"(namespace 'free)\\n    (module simplemodule GOV\\n    (defcap GOV () true)\\n      (defconst TEXT:string \\\"Hello World\\\")\\n      (defun greet:string () TEXT)\\n)\\n\",\"data\":{\"ks\":{\"keys\":[\"58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\"],\"pred\":\"keys-all\"}}}},\"nonce\":\"\",\"networkId\":\"development\",\"meta\":{\"sender\":\"k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\",\"chainId\":\"3\",\"creationTime\":1733266205,\"gasLimit\":80300,\"gasPrice\":0.000001,\"ttl\":600},\"signers\":[{\"pubKey\":\"58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\",\"clist\":[{\"name\":\"coin.GAS\",\"args\":[]}]}]}",
     "hash": "B-j2_RSbfNixi3tAP6yl3PAGG1WU2RuGV4Wy9x4pcS8",
     "sigs": [
       null
     ]
   }
   
   transaction saved to: ./test-hello.json
   ```

3. Sign the unsigned transaction using the `kadena tx sign` command and the transaction file name generated by the `kadena tx add` command.
   
   For example, the prompts and output for the transaction look similar to the following:

   ```bash
   kadena tx sign
   ? Select an action: Sign with wallet
   ? Select a transaction file: Transaction: test-hello.json
   ? 1 wallets found containing the keys for signing this transaction, please 
   select a wallet to sign this transaction with first: Wallet: chainweaver-web
   ? Enter the wallet password: ********
   Command 1 (hash: B-j2_RSbfNixi3tAP6yl3PAGG1WU2RuGV4Wy9x4pcS8) will now be signed with the following signers:
   Public Key                                                       Capabilities
   58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c coin.GAS()  
   Transaction executed code: 
   "(namespace 'free)\n    (module simplemodule GOV\n    (defcap GOV () true)\n      (defconst TEXT:string \"Hello World\")\n      (defun greet:string () TEXT)\n)\n"
   
   Transaction with hash: B-j2_RSbfNixi3tAP6yl3PAGG1WU2RuGV4Wy9x4pcS8 was successfully signed.
   Signed transaction saved to /Users/lisagunn/KADENA-DOCS-NextGen/pact-coding-projects/transaction-B-j2_RSbfN-signed.json
   ```

4. Send the signed transaction using the `kadena tx send` command and the signed transaction file name generated by the `kadena tx sign` command.
   
   For example, the prompts and output for the transaction look similar to the following:

   ```bash
   kadena tx send
   ? Select a transaction file: Transaction: transaction-B-j2_RSbfN-signed.json
   ⠋ Sending transactions...
   
   Transaction detail for command with hash: B-j2_RSbfNixi3tAP6yl3PAGG1WU2RuGV4Wy9x4pcS8
   Network ID  Chain ID
   development 3       
   
   
   ✔ Completed
   Transaction: B-j2_RSbfNixi3tAP6yl3PAGG1WU2RuGV4Wy9x4pcS8 submitted with request key: B-j2_RSbfNixi3tAP6yl3PAGG1WU2RuGV4Wy9x4pcS8
   ```

   After the transaction is sent to the blockchain, you can verify deployment in the block explorer by using the request key.

## Using the Kadena client library

If you prefer to work with JavaScript, you can use the `@kadena/client` library to write you own scripts to deploy contracts and perform other tasks. 
The `@kadena/client` library implements a TypeScript-based API for interacting with smart contracts and Chainweb nodes. 
The library provides functions that simplify building transactions with Pact commands and connecting to blockchain nodes.
You should note that creating the client connection is separate from using the `Pact.builder` function to construct transactions.

The following example illustrates what a script using `@kadena/client` to deploy a smart contract would look like.

```javascript
import { Pact, createClient, signWithChainweaver } from '@kadena/client';

  async function deployContract(deployer, pubKey) {
     const pactClient = createClient('https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/pact');

     const tx = Pact.builder
        .execution(`
                  (namespace 'free)
                  (module simplemodule GOV
                    (defcap GOV () true)
                    (defconst TEXT:string "Hello World")
                    (defun greet:string () TEXT)
                  )`)
        .addSigner(pubKey, (signFor) => [signFor('coin.GAS')])
        .setMeta({
          chainId: '1',
          gasLimit: 80300,
          gasPrice: 0.000001,
          sender: deployer,
        })
        .setNetworkId('mainnet01')
        .createTransaction();

    try {
      const signedTx = await signWithChainweaver(transaction); // Pick your preferred signing method
      const preflightResult = await client.preflight(signedTx);
      console.log('Preflight result:', preflightResult);

      if (preflightResult.result.status === 'failure') {
        console.error('Preflight failed:', preflightResult.result.error.message);
        return preflightResult;
      }

      const res = await client.submit(signedTx);
      console.log('Contract deployed:', res);
      return res;
    } catch (error) {
      console.error('Error deploying contract:', error);
    }
};
deployContract('your-deployer-account', contractCode).catch(console.error);
```
   
