---
title: Create new accounts
description: "How to create a new Kadena account without transferring any digital assets into it using the coin contract function s, Kadena CLI, and Kadena client library functions."
id: howto-create-accounts
---

import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';

# Create new accounts

This guide provides instructions and examples for creating an on-chain account without an account balance.
If you want to create a new account without transferring any digital assets (KDA) into it, you can create the account with a zero balance by using an API call, the Kadena CLI, or the Kadena client TypeScript library.

These examples illustrate how you can construct calls to the blockchain to create new accounts—an important operation if you're building a wallet, exchange, game, or other application where you need to register before creating transactions or interacting with your application.
If you're using Chainweaver or another wallet or front-end application, this information is typically available directly through the user interface, with the application performing an operation similar to these examples behind the scenes.

Note that regardless of the method you use to create new accounts, accounts must be funded on at least one network chain before you can do more than list account names and keys.

## Using a YAML request and curl

One way you can create a new account without transferring any assets is by calling the `create-account` function that's defined in the `coin` contract deployed on the Kadena development, test, or main network.
To make this call, you need to know the following information:

-  The **account name** for the account you want to create.
   In most cases, the account name is a public key with either the `k:` prefix for accounts with a single key or the `w:` prefix for accounts with more than one key.
-  The account **guard** for the account you want to create.

For this example, you can create the request using the YAML execution file format, convert the request to JSON, then submit the API request using a `curl` command.
You could also submit the request using Postman or other tools that enable you to call API endpoints.

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
   
3. Create a YAML execution request in a `create-new-account.yaml` file with content similar to the following:
   
   ```yaml
   code: |-
     (coin.create-account "k:3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59" (read-keyset "dev-account"))
   data:
     dev-account:
       keys: [3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59]
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
   
   - The transaction request calls the `coin.create-account` function.
   - The account name is `k:3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59`.
   - The network identifier is `development`.
   - The chain identifier for the account balance is chain `3`.
   
   The `gasLimit`, `gasPrice`, and `ttl` values represent reasonable settings.

4. Convert the YAML execution request to a JSON object with proper formatting using the `pact --apireq` command with a command similar to the following:
   
   ```bash
   pact --apireq create-new-account.yaml --local
   ```
   
   This command displays the resulting JSON as standard output.
   For example:
   
   ```bash
   {"hash":"mEwOLFgd1rpFQVywNrFU5uDr6vu6nNuYe76Sy30yZks","sigs":[],"cmd":"{\"networkId\":\"development\",\"payload\":{\"exec\":{\"data\":{\"dev-account\":{\"pred\":\"keys-all\",\"keys\":[\"3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59\"]}},\"code\":\"(coin.create-account \\\"k:3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59\\\" (read-keyset \\\"dev-account\\\"))\"}},\"signers\":[],\"meta\":{\"creationTime\":1731622872,\"ttl\":7200,\"gasLimit\":100000,\"chainId\":\"3\",\"gasPrice\":1.0e-7,\"sender\":\"k:3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59\"},\"nonce\":\"2024-11-14 22:21:12.353978 UTC\"}"}
   ```

5. Connect to the Pact `/local` endpoint for the appropriate network with a command similar to the following:

   ```bash
   curl -X POST "localhost:8080/chainweb/0.0/development/chain/3/pact/api/v1/local" \
     -H "Content-Type: application/json" \
     -d '{"hash":"M0QiiKfHiqQxTjjac42ogaOZRq5ayJ3gJzaa-zSO8dY","sigs":[],"cmd":"{\"networkId\":\"development\",\"payload\":{\"exec\":{\"data\":{\"ks\":{\"pred\":\"keys-all\",\"keys\":[\"3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59\"]}},\"code\":\"(coin.create-account \\\"k:3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59\\\" (read-keyset \\\"dev-account\\\"))\"}},\"signers\":[],\"meta\":{\"creationTime\":1731622251,\"ttl\":7200,\"gasLimit\":100000,\"chainId\":\"3\",\"gasPrice\":1.0e-7,\"sender\":\"k:3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59\"},\"nonce\":\"2024-11-14 22:10:51.406013 UTC\"}"}'
   ```
   
   The command returns JSON output similar to the following:

    ```json
    {"gas":207,"result":{"status":"success","data":"Write succeeded"},"reqKey":"mEwOLFgd1rpFQVywNrFU5uDr6vu6nNuYe76Sy30yZks","logs":"wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8","metaData":{"publicMeta":{"creationTime":1731622872,"ttl":7200,"gasLimit":100000,"chainId":"3","gasPrice":1.0e-7,"sender":"k:3e7e7db00e2e575a5260b8705ab7663574b186657451d6990316af6bc5108b59"},"blockTime":1731623003519300,"prevBlockHash":"RwovCQazuph9FHvpUKRO8eUNfWHuabpgXBrDFWB0m3g","blockHeight":240},"continuation":null,"txId":null}
    ```

## Using kadena-cli commands

If you have installed the `kadena-cli` package in your development environment, you can use the `kadena account add` command to add a new account to the local development environment for interacting with the development, test, or main network.

To add an account balance using `kadena-cli`:

1. Open a terminal on your local computer.

2. Check that you have `kadena` installed by running the following command:
   
   ```bash
    which kadena
   ```

   You should see the path to the file similar to the following:
   
   ```bash
   /usr/local/bin/kadena
   ```

3. Add the account with interactive prompting by running the following command:
   
   ```bash
   kadena account add
   ```
   
   You can add the account by manually providing a public key or add an account from a wallet.
   Follow the prompts displayed to enter an account alias, account name, fungible type, public key, network, and chain.
   After you provide the information required, the command returns confirmation of the account.
   For example:

   ```bash
   The account configuration "sf-devnet" has been saved in /Users/pistolas/.kadena/accounts/sf-devnet.yaml
   ```

## Using Kadena client TypeScript libraries

For an example of creating a new account using the Kadena client (@kadena) library functions in a TypeScript program, see
the [create-account](https://github.com/kadena-community/voting-dapp/blob/main/snippets/create-account.ts) sample code.