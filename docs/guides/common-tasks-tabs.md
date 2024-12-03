---
title: Common task quick reference
description: "Quick reference for common tasks"
id: howto-quick-ref
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

# Common task quick reference

This guide provides a quick reference for the most common API calls:

- Check account balances
- Transfer coins
- Deploy a smart contract
- Call a smart contract function

## Check account balances

<Tabs>
  <TabItem value="api" label="API" default>
Call the `coin.get-balance` function with the account name string as an argument.
For principal accounts, the account name starts with a prefix.
For example, the `k:` prefix for single key accounts or the `w:` prefix for accounts with multiple keys.

    ```bash
    curl -X POST "https://api.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local" \
     -H "Content-Type: application/json" \
     -d '{
       "exec": {
         "data": {},
         "code": "(coin.get-balance \"k:<account-public-key>\")"
       },
       "meta": {
         "chainId": "1",
         "sender": "k:<account-public-key>",
         "gasLimit": 100000,
         "gasPrice": 0.0000001,
         "ttl": 7200
       }
     }'
    ```
  </TabItem>

  <TabItem value="cli" label="Kadena CLI">
    
    The `kadena-cli` package provides commands to perform many common operations like viewing balances.
    You can also use `kadena-cli` to construct transactions using YAML request files.

    ```yaml
   kadena account details --account="k-bbccc9" --network="devnet" --chain-ids="all" 
    ```
  </TabItem>

<TabItem value="js" label="Kadena.js">
  
  Use the @kadena/client package to create Pact transactions and client connections.

  ```javascript
  import {Pact, createClient} from '@kadena/client'

    async function getBalance(account) {
  // `Pact.builder.execution` accepts a number of `Pact.modules.<module>.<fun>` calls
    const transaction = Pact.builder
      .execution(Pact.modules.coin['get-balance'](account))
      .setMeta({ chainId: '1' })
      .createTransaction();

    // client creation is separate from the transaction builder
    const staticClient = createClient('https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact');

    const res = await staticClient.local(transaction, {
      preflight: false,
      signatureVerification: false,
    });

}

getBalance(account).catch(console.error);
```

</TabItem>
</Tabs>

## Transfer coins

<Tabs>
  <TabItem value="api" label="API" default>
  ```bash
    curl -X POST "https://api.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/send" \
     -H "Content-Type: application/json" \
     -d '{
       "cmds": [{
         "hash": "TRANSACTION_HASH",
         "sigs": ["YOUR_SIGNATURE"],
         "cmd": "{\"networkId\":\"testnet04\",\"payload\":{\"exec\":{\"data\":{\"amount\":10.0,\"receiver\":\"k:RECEIVER_PUBLIC_KEY\"},\
         "code\":\"(coin.transfer \\\"k:SENDER_PUBLIC_KEY\",\"clist\":
          [{\"args\":[\"k:SENDER_PUBLIC_KEY\",\"k:RECEIVER_PUBLIC_KEY\",10.0],\"name\":
          \"coin.TRANSFER\"}]}],\"meta\":{\"creationTime\":1724384042,\"ttl\":7200,\"gasLimit\":100000,\"chainId\":\"1\",\"gasPrice\":
          1.0e-7,\"sender\":\"k:SENDER_PUBLIC_KEY\"},\"nonce\":\"2024-08-23 03:34:02.198258 UTC\"}"
       }]
     }'
    ```
</TabItem>

<TabItem value="cli" label="Kadena CLI">

1. Create a `transfer-coins.yaml` file with the transfer information similar to the following:

   ```yaml
   account:from: 'k:99d30af3fa91d78cc06cf53a0d4eb2d7fa2a5a72944cc5451311b455a67a3c1c'
   account:to: 'k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c'
   decimal:amount: '1.0'
   chain-id: '3'
   key:from: '99d30af3fa91d78cc06cf53a0d4eb2d7fa2a5a72944cc5451311b455a67a3c1c'
   network:networkId: 'development'
   ```     

2. Create an unsigned transaction using the `transfer.ktpl` template and the `transfer-coins.yaml` data file, and save the transaction to a file:
   
   ```bash
   kadena tx add
   ```
   
3. Sign the transaction created with a wallet or key pair:
   
   ```bash
   kadena tx sign
   ```

4. Test the execution:
   
   ```bash
   kadena tx test
   ```
    
5. Send the signed transaction file to the blockchain:
   
   ```bash
   kadena tx send
   ```
  </TabItem>

  <TabItem value="js" label="Kadena.js">
  
  ```javascript
  import { Pact, createClient } from '@kadena/client';

  const transferKDA = async (from, to, amount, pubKey) => {
    const client = createClient('https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact');

    const transaction = Pact.builder
      .execution(`(coin.transfer "${from}" "${to}" ${amount})`)
      .addSigner(pubKey, (signFor) => [
        signFor('coin.TRANSFER', from, to, amount),
        signFor('coin.GAS'),
      ])
      .setMeta({
        chainId: '1',
        gasLimit: 2500,
        gasPrice: 0.000001,
        sender: from,
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
      console.log('Transaction submitted:', res);
      return res;
    } catch (error) {
      console.error('Error transferring KDA:', error);
    }
  };
transferKDA('your-from-account', 'your-to-account', 0.1).catch(console.error);
```

  </TabItem>
</Tabs>

## Deploy smart contracts

<Tabs>
  <TabItem value="api" label="API" default>
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
  </TabItem>

  <TabItem value="cli" label="Kadena CLI">
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
  </TabItem>

  <TabItem value="js" label="Kadena.js">
  </TabItem>
</Tabs>

## Execute contract functions

<Tabs>
  <TabItem value="api" label="API" default>
  ```bash
  curl -X POST "https://api.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local" \
     -H "Content-Type: application/json" \
     -d '{
       "exec": {
         "data": {
           "vote": {
             "keys": ["f1e12312e4ee8c156b041c3bcc7e422e7d15cb2ddce58c6ff16742770916cfaa"],
             "pred": "keys-all"
           }
         },
         "code": "(free.vote-testing.vote \"vote1\" \"optionb\")"
       },
       "meta": {
         "chainId": "1",
         "sender": "k:f1e12312e4ee8c156b041c3bcc7e422e7d15cb2ddce58c6ff16742770916cfaa",
         "gasLimit": 100000,
         "gasPrice": 0.0000001,
         "ttl": 7200
       },
       "networkId": "testnet04"
     }'
    ```
  </TabItem>

  <TabItem value="cli" label="Kadena CLI">

  </TabItem>

  <TabItem value="js" label="Kadena.js">
  </TabItem>
</Tabs>