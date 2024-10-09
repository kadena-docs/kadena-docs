---
title: Create new accounts
description: "How to create a new Kadena account without transferring any digital assets into it using the coin contract function s, Kadena CLI, and Kadena client library functions."
id: howto-create-accounts
---

import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';

# Create new accounts

This guide provides instructions and examples for creating an on-chain account without an account balance.
If you want to create a new account without transferring any digital assets (KDA) into it, you can create the account with a zero balance by using an API call, Kadena CLI with YAML configuration, or the Kadena client TypeScript library.

These examples illustrate how you can construct calls to the blockchain to get create new accounts—an important operation if you're building a wallet, exchange, game, or other application where you need to register before creating transactions or interacting with your application.
If you're using Chainweaver or another wallet or front-end application, this information is typically available directly through the user interface, with the application performing an operation similar to these examples behind the scenes.

## Using a YAML request and curl

One way yu can create a new account without transferring any assets is by calling the `create-account` function that's defined in the `coin` contract deployed on the Kadena public main or test network.
To make this call, you need to know the following information:

-  The public and private key pair for the account you want to create.
-  The network identifier where you want to check the account balance.
-  The specific chain identifier where you want to create the account.

For this example, you can create the request using the YAML execution file format, convert the request to JSON, then submit the API request using a `curl` command.

You could also submit the request using Postman or other tools than enable you to call API endpoints.

To create a new account:

1. Open a terminal on your local computer.

2. Check that you have `curl` installed by running the following command:
   
   ```bash
   which curl
   ```

   You should see the path to the file similar to the following:
   
   ```bash
   /usr/bin/curl
   ```
   
3. Create a YAML execution request in a `create-account.yaml` file with content similar to the following:
   
   ```yaml
   
   ```

## Use Kadena client libraries

```typescript
const HELP = `Usage example: \n\nnode create-account.js k:{public-key} -- Replace {public-key} with an actual key`;
const Pact = require('pact-lang-api');
const NETWORK_ID = 'testnet04';
const CHAIN_ID = '1';
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
const KEY_PAIR = {
  publicKey: '',
  secretKey: '',
};

const creationTime = () => Math.round(new Date().getTime() / 1000);

if (process.argv.length !== 3) {
  console.log(process.argv);
  console.info(HELP);
  process.exit(1);
}

if (KEY_PAIR.publicKey === '' || KEY_PAIR.secretKey === '') {
  console.error('Please set a key pair');
  process.exit(1);
}

createAccount(process.argv[2]);

async function createAccount(newAccount) {
  const cmd = {
    networkId: NETWORK_ID,
    keyPairs: KEY_PAIR,
    pactCode: `(coin.create-account "${newAccount}" (read-keyset "account-keyset"))`,
    envData: {
      'account-keyset': {
        keys: [
          // Drop the k:
          newAccount.substr(2),
        ],
        pred: 'keys-all',
      },
    },
    meta: {
      creationTime: creationTime(),
      ttl: 600,
      gasLimit: 600,
      chainId: CHAIN_ID,
      gasPrice: 0.0000001,
      sender: KEY_PAIR.publicKey,
    },
  };

  const response = await Pact.fetch.send(cmd, API_HOST);
  console.log(`Request key: ${response.requestKeys[0]}`);
  console.log('Transaction pending...');
  const txResult = await Pact.fetch.listen(
    { listen: response.requestKeys[0] },
    API_HOST,
  );
  console.log('Transaction mined!');
  console.log(txResult);
}
```
