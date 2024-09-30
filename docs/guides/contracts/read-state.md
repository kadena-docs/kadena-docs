---
title: Read state
id: howto-read-state
---

<head>
  <title>Read state</title>
  <meta name="description" content="A guide to crafting blockchain calls using Traditional API, Kadena CLI, and Kadena.js" />
</head>
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

# Read state from the blockchain

Read the state of a contract. 

```typescript
const HELP = 'Usage example: \n\nnode read-state';
const Pact = require('pact-lang-api');
const NETWORK_ID = 'testnet04';
const CHAIN_ID = '1';
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
const creationTime = () => Math.round(new Date().getTime() / 1000);
 
if (process.argv.length !== 2) {
  console.info(HELP);
  process.exit(1);
}
 
getState();
 
async function getState() {
  const account =
    'f6b0e0d0bcae2e397104e0f6536492f01ce35977eb6fe5868a0efaff556bf80b';
  const cmd = {
    pactCode: `(coin.details "${account}")`,
    meta: {
      creationTime: creationTime(),
      ttl: 600,
      gasLimit: 20,
      gasPrice: 0,
      chainId: CHAIN_ID,
      sender: '',
    },
  };
  const result = await Pact.fetch.local(cmd, API_HOST);
  console.log(result);
}
```