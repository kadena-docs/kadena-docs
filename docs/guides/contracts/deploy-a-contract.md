---
title: Deploy a smart contract
id: howto-deploy-contracts
---

<head>
  <title>Deploy a smart contract</title>
  <meta name="description" content="A guide to crafting blockchain calls using Traditional API, Kadena CLI, and Kadena.js" />
</head>
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

# Deploy a smart contract
    ```bash
    curl -X POST "https://api.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/send" \
     -H "Content-Type: application/json" \
     -d '{
       "cmds": [{
         "hash": "YOUR_TRANSACTION_HASH",
         "sigs": ["YOUR_SIGNATURE"],
         "cmd": "{\"networkId\":\"testnet04\",\"payload\":{\"exec\":{\"data\":{},\"code\":\"(namespace \'free)\n(define-keyset \'free.vote-testing-keyset 
         (read-keyset \'vote))\n(module vote-testing \'free.vote-testing-keyset\n  (defschema vote\n    voter:string\n    option:string)\n  (deftable votes:{vote})\n 
         (defun vote (poll-id:string option:string)\n    (insert votes (format \"{}-{}\" [poll-id (at \'sender (chain-data))])\n      { \"voter\": (at \'sender (chain-data))\n
                 \"option\": option\n      }\n    )\n  )\n)\"}},\"signers\":[{\"pubKey\":\"f1e12312e4ee8c156b041c3bcc7e422e7d15cb2ddce58c6ff16742770916cfaa\",\
                 "clist\":[{\"args\":[],\"name\":\"coin.GAS\"}]}],\"meta\":{\"creationTime\":1724384042,\"ttl\":7200,\"gasLimit\":100000,\"chainId\":\"1\",\
                 "gasPrice\":1.0e-7,\"sender\":\"k:f1e12312e4ee8c156b041c3bcc7e422e7d15cb2ddce58c6ff16742770916cfaa\"},\"nonce\":\"2024-08-23 03:34:02.198258 UTC\"}"
       }]
     }'
    ```

    **3. Deploy a Smart Contract**
    ```yaml
    # deploy-contract.yaml
    # YAML configuration for deploying a smart contract

    code: |-
    (namespace 'free)
    (module simplemodule GOV
    (defcap GOV () true)
      (defconst TEXT:string "Hello World")
      (defun greet:string () TEXT)
    )
  data:
    ks: {
     keys`:` ["deployer-public-Key"],
     pred`:` `"keys-all"`
    }
  meta:
    chainId: "1"
    sender: "senders k: account"
    gasLimit: 80300
    gasPrice: 0.000001
    ttl: 600
  signers:
    - public: "deployer-public-Key"
      caps:
        - name: "coin.GAS"
          args: []
  networkId: "mainnet01"
  type: exec
      ```
    To execute:
    ```bash
    kadena exec deploy-contract.yaml
    kadena tx add
    ```
    select the YAML file path then
    ```bash
    kadena tx sign
    ```
    then sign the transaction with wallet or key pair and it will generate a signed tx json file
    then
    ```bash
    kadena tx test
    ```
    select the signed tx file to test if its showing success then
    ```bash
    kadena tx send
    ```
    and it will send the transaction to the blockchain

