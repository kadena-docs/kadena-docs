---
title: Verify a signature
id: howto-verify-signatures
---

<head>
  <title>Verify a signature</title>
  <meta name="description" content="A guide to crafting blockchain calls using Traditional API, Kadena CLI, and Kadena.js" />
</head>
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

# Verify a signature

Verify a key pair signature.

```typescript
const Pact = require('pact-lang-api');
 
const KEY_PAIR = Pact.crypto.genKeyPair();
 
verifySig();
 
function verifySig() {
  const msg = 'Hi from Kadena';
  const result = Pact.crypto.sign(msg, KEY_PAIR);
 
  const isValid = Pact.crypto.verifySig(
    Pact.crypto.hashBin(msg),
    Pact.crypto.hexToBin(result.sig),
    Pact.crypto.hexToBin(KEY_PAIR.publicKey),
  );
 
  isValid
    ? console.log('Signature is valid!')
    : console.log('Signature is invalid!');
}
```