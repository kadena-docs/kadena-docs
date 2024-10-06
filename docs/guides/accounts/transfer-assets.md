---
title: Transfer assets
id: howto-transfer-assets
---
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';

# Transfer assets

    **2. Transfer KDA**
    ```bash
    curl -X POST "https://api.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/send" \
     -H "Content-Type: application/json" \
     -d '{
       "cmds": [{
         "hash": "YOUR_TRANSACTION_HASH",
         "sigs": ["YOUR_SIGNATURE"],
         "cmd": "{\"networkId\":\"testnet04\",\"payload\":{\"exec\":{\"data\":{\"amount\":10.0,\"receiver\":\"k:receiver_public_key\"},\
         "code\":\"(coin.transfer \\\"k:f1e12312e4ee8c156b041c3bcc7e422e7d15cb2ddce58c6ff16742770916cfaa\\\" \\\"k:receiver_public_key\\\"
          10.0)\"}},\"signers\":[{\"pubKey\":\"f1e12312e4ee8c156b041c3bcc7e422e7d15cb2ddce58c6ff16742770916cfaa\",\"clist\":
          [{\"args\":[\"k:f1e12312e4ee8c156b041c3bcc7e422e7d15cb2ddce58c6ff16742770916cfaa\",\"k:receiver_public_key\",10.0],\"name\":
          \"coin.TRANSFER\"}]}],\"meta\":{\"creationTime\":1724384042,\"ttl\":7200,\"gasLimit\":100000,\"chainId\":\"1\",\"gasPrice\":
          1.0e-7,\"sender\":\"k:f1e12312e4ee8c156b041c3bcc7e422e7d15cb2ddce58c6ff16742770916cfaa\"},\"nonce\":\"2024-08-23 03:34:02.198258 UTC\"}"
       }]
     }'
    ```

**2. Transfer KDA**
    ```yaml
    # transfer-kda.yaml
    # YAML configuration for KDA transfer

  code: |-
    (coin.transfer "from k: account" "to k: account" 0.1)
  data:
  meta:
    chainId: "1"
    sender: "from k: account"
    gasLimit: 2300
    gasPrice: 0.000001
    ttl: 600
  signers:
    - public: "from public Key"
      caps:
        - name: "coin.TRANSFER"
          args: ["from k: account", "to k: account", 0.1]
        - name: "coin.GAS"
          args: []
  networkId: "mainnet01"
  type: exec
    ```
    To execute:
    ```bash
    kadena exec transfer-kda.yaml
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

    **2. Transfer KDA**

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
