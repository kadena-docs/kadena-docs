---
title: Fund on-chain accounts
description: "How to create a new Kadena account by transferring digital assets into it using the coin contract function, Kadena CLI, and Kadena client library."
id: howto-fund-accounts
---
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';

# Fund on-chain accounts

The Kadena `coin` contract provides two functions for funding an on-chain account:

- `transfer-create`
- `transfer`

You can use the `transfer-create` function to create and fund new accounts in a single step if you have access to funds and control a keyset with access to the funds.
You can use the `transfer` function any time you want to transfer assets between existing accounts.
This guide provides instructions and examples for creating an on-chain account by transferring digital assets (KDA) into the account using an API call, Kadena CLI with YAML configuration, and the Kadena client TypeScript library.

## Using a YAML request and curl

One way you can create and fund a new account is by calling the `transfer-create` function that's defined in the `coin` contract deployed on the Kadena development, test, and main network.
To make this call, you need to know the following information:

-  The account name for a **funding account** with funds that you control.
-  The **public key** for the **receiving account** you want to create.
-  The guard for the **receiving account** and the amount to transfer.

For this example, you can create the request using the YAML execution file format, convert the request to JSON, then submit the API request using a `curl` command.
You could also submit the request using Postman or other tools that enable you to call API endpoints.

To create and fund a new account:

1. Open a terminal on your local computer.

2. Check that you have `curl` installed by running the following command:
   
   ```bash
   which curl
   ```

   You should see the path to the file similar to the following:
   
   ```bash
   /usr/bin/curl
   ```
   
3. Create a YAML execution request in a `fund-new-account.yaml` file with content similar to the following:
   
   ```yaml
   code: |-
     (coin.transfer-create "k:3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59" "9a23bf6a61f753d3ffa45c02b33c65b9dc80b8fb63857debcfe21fdb170fcd99"(read-keyset "receiver-guard") 1.0)
   data:
     receiver-guard:
       keys: [9a23bf6a61f753d3ffa45c02b33c65b9dc80b8fb63857debcfe21fdb170fcd99]
       pred: "keys-all"
   sigs:
     - public: 3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59
       caps: []
   networkId: development
   publicMeta:
       chainId: "3"
       sender: "k:3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59"
       gasLimit: 100000,
       gasPrice: 0.0000001,
       ttl: 7200,
   type: exec
   ```

   As you can see in this example:
   
   - The transaction request calls the `coin.transfer-create` function.
   - The funding account name is `k:3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59`.
   - The receiving account is `9a23bf6a61f753d3ffa45c02b33c65b9dc80b8fb63857debcfe21fdb170fcd99`.
   - The network identifier is `development`.
   - The chain identifier for the account balance is chain `3`.
   
   The `gasLimit`, `gasPrice`, and `ttl` values represent reasonable settings.

4. Convert the YAML execution request to a JSON object with proper formatting using the `pact --apireq` command with a command similar to the following:
   
   ```bash
   pact --apireq fund-new-account.yaml --local
   ```
   
   This command displays the resulting JSON as standard output.
   For example:
   
   ```bash
   {"hash":"ZVNycZjGYzovTKtIKuPxlGd6SvnzoqLTva7QDrdDcEw","sigs":[],"cmd":"{\"networkId\":\"development\",\"payload\":{\"exec\":{\"data\":{\"dev-account\":{\"pred\":\"keys-all\",\"keys\":[\"3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59\"]}},\"code\":\"(coin.transfer-create \\\"k:3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59\\\" (read-keyset \\\"dev-account\\\"))\"}},\"signers\":[],\"meta\":{\"creationTime\":1732575822,\"ttl\":7200,\"gasLimit\":100000,\"chainId\":\"3\",\"gasPrice\":1.0e-7,\"sender\":\"k:3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59\"},\"nonce\":\"2024-11-25 23:03:42.968111 UTC\"}"}
   ```

5. Connect to the Pact `/local` endpoint for the appropriate network with a command similar to the following:

   ```bash
   curl -X POST "localhost:8080/chainweb/0.0/development/chain/3/pact/api/v1/local" \
     -H "Content-Type: application/json" \
     -d '{"hash":"ZVNycZjGYzovTKtIKuPxlGd6SvnzoqLTva7QDrdDcEw","sigs":[],"cmd":"{\"networkId\":\"development\",\"payload\":{\"exec\":{\"data\":{\"dev-account\":{\"pred\":\"keys-all\",\"keys\":[\"3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59\"]}},\"code\":\"(coin.transfer-create \\\"k:3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59\\\" (read-keyset \\\"dev-account\\\"))\"}},\"signers\":[],\"meta\":{\"creationTime\":1732575822,\"ttl\":7200,\"gasLimit\":100000,\"chainId\":\"3\",\"gasPrice\":1.0e-7,\"sender\":\"k:3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59\"},\"nonce\":\"2024-11-25 23:03:42.968111 UTC\"}"}'
   ```

You can follow similar steps to fund an existing on-chain account using the `transfer` function.

## Using kadena-cli commands

If you have installed the `kadena-cli` package in your development environment, you can use the `kadena account fund` command to fund an existing local or testnet account that you have previously added to the local development environment.

To fund an on-chain account balance using `kadena-cli`:

1. Open a terminal on your local computer.

2. Check that you have `kadena` installed by running the following command:
   
   ```bash
    which kadena
   ```

   You should see the path to the file similar to the following:
   
   ```bash
   /usr/local/bin/kadena
   ```

3. Fund the account with interactive prompting by running the following command:
   
   ```bash
   kadena account fund
   ```
   
   Follow the prompts displayed to select an account alias, network, chain identifier, and amount.

## Using Kadena client TypeScript libraries

For an example of creating a new account using the Kadena client (@kadena) library functions in a TypeScript program, see
the [create-account](https://github.com/kadena-community/voting-dapp/blob/main/snippets/create-account.ts) sample code.

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
