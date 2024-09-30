---
title: Check transaction status
id: howto-check-tx-status
---

<head>
  <title>Check transaction status</title>
  <meta name="description" content="A guide to crafting blockchain calls using Traditional API, Kadena CLI, and Kadena.js" />
</head>

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

# Check transaction status

Get transaction status using Tx request key.

Get transaction status using the transaction request key. 

```typescript
const HELP = 'Usage example: \n\nnode get-status {request-key}';
const Pact = require('pact-lang-api');
const NETWORK_ID = 'testnet04';
const CHAIN_ID = '1';
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
 
if (process.argv.length !== 3) {
  console.info(HELP);
  process.exit(1);
}
 
getTxStatus(process.argv[2]);
 
async function getTxStatus(requestKey) {
  const txResult = await Pact.fetch.listen({ listen: requestKey }, API_HOST);
  console.log(txResult);
}
```