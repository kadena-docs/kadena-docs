---
title: Check transaction status
description: "A guide to crafting blockchain calls using Traditional API, Kadena CLI, and Kadena.js"
id: howto-check-tx-status
---

# Check transaction status


Get transaction status using the transaction request key. 

```typescript
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