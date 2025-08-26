---
title: Get started with Kadena TypeScript client
description: "The _Get started with @kadena/client_ library provides a beginner's guide to using the @kadena/client TypeScript API for interacting with Pact smart contracts and Chainweb nodes using JavaScript or TypeScript frontend frameworks."
id: kadena-client-quickstart
sidebar_position: 3
tags: ['TypeScript', 'Kadena', 'Kadena client', 'frontend']
---

# Get started with @kadena/client

Welcome to the _Quick Start Beginners Guide_ for the Kadena client TypeScript library. 
The `@kadena/client` library is a Node package that you can install and manage using the `npm` package manager.
This library enables you to connect to and interact with the Kadena blockchain using JavaScript or TypeScript programs. 
If you're new to programming, this guide provides everything you need to know to get started.
If you're an experienced JavaScript or TypeScript developer, you can skip this guide and go directly to the [Kadena TypeScript client](/reference/kadena-client) reference information.

## What is @kadena/client?

Think of @kadena/client as a translator that helps your web applications talk to the Kadena blockchain. It's like having a helpful assistant that knows how to:
- Send transactions (like transferring coins)
- Check account balances
- Interact with smart contracts
- Handle digital signatures

## Create an account

```typescript
// Import basic functions to interact with the blockchain from the Kadena client library.
import { Pact, createClient, createSignWithKeypair, isSignedTransaction } from '@kadena/client';

// Create a client to connect to the Kadena network. In this example, the client connects to
// chain 3 in the Kadena development network.
const client = createClient('http://127.0.0.1:8080/chainweb/0.0/development/chain/3/pact');

// To create a client to interact with the Kadena test (testnet04) network, replace the  
// client URL with one similar to the following:
// https://api.testnet.chainweb.com//chainweb/0.0/testnet04/chain/3/pact

// Return an error if the required argument is missing:
if (!process.argv[2]) {
  console.error('Specify a public key or Kadena account name.');
  process.exit(1);
}

// Use a well-known test account to create a new account.
const FUNDING_ACCOUNT = 'sender00';
const FUNDING_ACCOUNT_PUBLIC_KEY = '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca';
const FUNDING_ACCOUNT_PRIVATE_KEY = '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898';

// Function to prepend "k:" if not already present
const formatAccount = (account: string): string => {
  return account.startsWith('k:') ? account : `k:${account}`;
};

// Function to extract the key part (after "k:")
const accountKey = (account: string): string => {
  const formatted = formatAccount(account);
  return formatted.split(':')[1];
};

main(FUNDING_ACCOUNT, FUNDING_ACCOUNT_PUBLIC_KEY, FUNDING_ACCOUNT_PRIVATE_KEY, process.argv[2]);

async function main(sender: string, senderPublicKey: string, senderPrivateKey: string, inputAccount: string) {
  const account = formatAccount(inputAccount);

  // Construct a transaction that creates a new account.
  try {
    const transaction = Pact.builder
      .execution(Pact.modules.coin['create-account'](account, () => '(read-keyset "ks")'))
      .addData('ks', {
        keys: [accountKey(account)],
        pred: 'keys-all',
      })
      .addSigner(senderPublicKey, (withCap) => [withCap('coin.GAS')])
      // For this example, chain '3' on the 'development' network.
      .setMeta({ chainId: '3', senderAccount: sender })
      .setNetworkId('development')
      .createTransaction();

    // Sign this transaction with the well-known public key.
    const signWithKeypair = createSignWithKeypair({
      publicKey: senderPublicKey,
      secretKey: senderPrivateKey,
    });

    const signedTx = await signWithKeypair(transaction);
    if (isSignedTransaction(signedTx)) {
      console.log(`Creating account: ${account}`);
      const transactionDescriptor = await client.submit(signedTx);
      const response = await client.listen(transactionDescriptor);
      if (response.result.status === 'failure') {
        throw response.result.error;
      } else {
        console.log('Account created successfully:', response.result);
      }
    }
  } catch (error) {
    console.error('Error creating account:', error);
    process.exit(1);
  }
}
```

### Execute the file

The main changes:

Removed all TypeScript type annotations (: string, etc.)
Changed import extension to .js for the configuration file (assuming it's also JavaScript)

Alternative solutions if you want to keep TypeScript:

Install and use tsx:
bashnpm install -g tsx
tsx kadena-account-creator.ts

Install and use ts-node:
bashnpm install -g ts-node
ts-node kadena-account-creator.ts

Compile TypeScript first:
bashtsc kadena-account-creator.ts
node kadena-account-creator.js


The JavaScript version above should run directly with:
bashnode kadena-account-creator.js 2084ce886c203b38944ebc16c4ac3714f379f81bcacae6e41be2dd4edc91971b