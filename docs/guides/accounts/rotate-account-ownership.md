---
title: Rotate account ownership
id: howto-rotate-owners
---
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';

# Rotate account ownership

Update the keyset controlling the account.

```typescript
const HELP = 'Usage example: \n\nnode rotate {account} {new-guard}';
const Pact = require('pact-lang-api');
const NETWORK_ID = 'testnet04';
const CHAIN_ID = '1';
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
 
const KEY_PAIR = {
  publicKey: 'a5613bcbea7c5addcb55e8d59fab2b0ab9a792684977e2d3f682cce6f7d328e9',
  secretKey: 'f1031a628eb9a0467460130b406c5a6f95399d2d17585b341deb94e4182d36ff',
};
 
const creationTime = () => Math.round(new Date().getTime() / 1000);
 
if (process.argv.length !== 4) {
  console.info(HELP);
  process.exit(1);
}
 
if (KEY_PAIR.publicKey === '' || KEY_PAIR.secretKey === '') {
  console.error('Please set a key pair');
  process.exit(1);
}
 
rotate(process.argv[2], process.argv[3]);
 
async function rotate(account, newKey) {
  const cmd = {
    networkId: NETWORK_ID,
    keyPairs: [
      Object.assign(KEY_PAIR, {
        clist: [
          Pact.lang.mkCap(
            'GAS',
            'Capability to allow buying gas',
            'coin.GAS',
            [],
          ).cap,
          Pact.lang.mkCap(
            'Rotate',
            'Capability to allow rotating account guard',
            'coin.ROTATE',
            [account],
          ).cap,
        ],
      }),
    ],
    pactCode: `(coin.rotate  "${account}" (read-keyset "new-keyset"))`,
    envData: {
      'new-keyset': {
        keys: [newKey],
        pred: 'keys-all',
      },
    },
    meta: {
      creationTime: creationTime(),
      ttl: 600,
      gasLimit: 600,
      chainId: CHAIN_ID,
      gasPrice: 0.0000001,
      sender: account,
    },
  };
  console.log(cmd);
 
  const response = await Pact.fetch.send(cmd, API_HOST);
  console.log(response);
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

Safe rotate and drain
This sample code illustrates how to rotate keys and transfer funds in a single transaction. In this example, the account named rotest is owned by the public key 2993f795d133fa5d0fd877a641cabc8b28cd36147f666988cacbaa4379d1ff93. The transaction code:

Rotates ownership to the public key dea647009295dc015ba6e6359b85bafe09d2ce935a03c3bf83f775442d539025.
Transfers the whole balance from the rotest account to the croesus account. - Pays the transaction fee from the croesus account to drain the rotest account balance to zero.
This transaction must be signed by both the key that owns the rotest account at the beginning and the key that owns the croesus at the end. Because the transfer out of the rotest account occurs after the key is rotated, the transaction must be signed by the key you are rotating to. With this transaction, it's impossible to accidentally rotate to an incorrect key and lose control of the rotest account.

Rotate keys and drain an account. 
```yaml
code: |-
  (use coin)
  (let* ((acct:string "rotest")
         (bal:decimal (coin.get-balance acct))
        )
    (coin.rotate acct (read-keyset "ks"))
    (coin.transfer acct
      "croesus"
      bal)
  )
data:
  ks:
    keys: [dea647009295dc015ba6e6359b85bafe09d2ce935a03c3bf83f775442d539025]
    pred: "keys-all"
publicMeta:
  chainId: "0"
  sender: croesus
  gasLimit: 800
  gasPrice: 0.00001
  ttl: 86400
networkId: "testnet04"
signers:
  - public: 2993f795d133fa5d0fd877a641cabc8b28cd36147f666988cacbaa4379d1ff93
    caps:
      - name: coin.GAS
        args: []
      - name: coin.ROTATE
        args: ["rotest"]
  - public: dea647009295dc015ba6e6359b85bafe09d2ce935a03c3bf83f775442d539025
    caps:
      - name: coin.TRANSFER
        args: ["rotest","croesus",100]
type: exec
```