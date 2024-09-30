---
title: Check account balances
description: "How to check account balances for existing account using an API call to the coin contract get-balance function, Kadena command-line interface, and Kadena client library functions."
id: howto-get-balances
---
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';

# Check account balances

This guide provides instructions and examples for checking an account balance using an API call, Kadena CLI with YAML configuration, and the Kadena client TypeScript library.

## Using a YAML request and curl

One way yu can get an account balance is by calling the `get-balance` function that's defined in the `coin` contract deployed on the Kadena public main or test network.
To make this call, you need to know the following information:

-  The account name for the account you want to look up.
-  The network identifier where you want to check the account balance.
-  The specific chain identifier for the balance you want to check.

For this example, you can create the request using the YAML execution file format, convert the request to JSON, then submit the API request using a `curl` command.

You could also submit the request using Postman or other tools than enable you to call API endpoints.

To get an account balance:

1. Open a terminal on your local computer.

2. Check that you have `curl` installed by running the following command:
   
   ```bash
   which curl
   ```

   You should see the path to the file similar to the following:
   
   ```bash
   /usr/bin/curl
   ```
   
3. Create a YAML execution request in a `get-balance.yaml` file with content similar to the following:
   
   ```yaml
   code: (coin.get-balance "k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0")
   data: {}
   sigs:
     - public: "4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0"
       caps: []
   
   networkId: testnet04
   publicMeta:
       chainId: "1"
       sender: "k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0"
       gasLimit: 100000,
       gasPrice: 0.0000001,
       ttl: 7200,
   type: exec
   ```

   As you can see in this example:
   
   - The transaction request calls the `coin.get-balance` function.
   - The account name is `k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0`.
   - The network identifier is `testnet04`.
   - The chain identifier for the account balance is chain `1`.
   
   The `gasLimit`, `gasPrice`, and `ttl` values represent reasonable settings.

4. Convert the YAML execution request to a JSON object with proper formatting using the `pact --apireq` command with a command similar to the following:
   
   ```bash
   pact --apireq get-balance.yaml --local
   ```
   
   This command displays the resulting JSON as standard output.
   For example:
   
   ```bash
   {"hash":"8bZdo6EG-WVl5CqQLcsAkYOchf_dujjdqsrsNYRQDXw","sigs":[],"cmd":"{\"networkId\":\"testnet04\",\"payload\":{\"exec\":{\"data\":{},\"code\":\"(coin.get-balance \\\"k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0\\\")\"}},\"signers\":[],\"meta\":{\"creationTime\":1726864470,\"ttl\":7800,\"gasLimit\":100000,\"chainId\":\"1\",\"gasPrice\":1.0e-7,\"sender\":\"k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0\"},\"nonce\":\"2024-09-20 20:34:30.276972 UTC\"}"}
   ```

   Alternatively, you can save the result from the `pact --apireq` command in a file with a command similar to the following:

      ```bash
   pact --apireq get-balance.yaml --local > get-balance.json
   ```

   Copy the output from the `pact --apireq` command to pass as the request body in the next step.

5. Connect to the Pact `/local` endpoint for the appropriate network with a command similar to the following:

   ```bash
   curl -X POST "https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local" \
     -H "Content-Type: application/json" \
     -d '{"hash":"8bZdo6EG-WVl5CqQLcsAkYOchf_dujjdqsrsNYRQDXw","sigs":[],"cmd":"{\"networkId\":\"testnet04\",\"payload\":{\"exec\":{\"data\":{},\"code\":\"(coin.get-balance \\\"k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0\\\")\"}},\"signers\":[],\"meta\":{\"creationTime\":1726864470,\"ttl\":7800,\"gasLimit\":100000,\"chainId\":\"1\",\"gasPrice\":1.0e-7,\"sender\":\"k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0\"},\"nonce\":\"2024-09-20 20:34:30.276972 UTC\"}"}'
    ```

    The command returns output similar to the following:

    ```json
    {
      "gas":20,
      "result":{
        "status":"success",
        "data":20
        },
      "reqKey":"8bZdo6EG-WVl5CqQLcsAkYOchf_dujjdqsrsNYRQDXw","logs":"wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8",
      "metaData":{
        "publicMeta":{
          "creationTime":1726864470,
          "ttl":7800,
          "gasLimit":100000,
          "chainId":"1",
          "gasPrice":1.0e-7,"sender":"k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0"},
      "blockTime":1726864883870724,"prevBlockHash":"mBRDF6NQwF_bvo4vHaF-5aS384lCYx1UB2Nj1pBfaeM",
      "blockHeight":4662494},
      "continuation":null,
      "txId":null
    }
    ```
    
    In this example, the account `k:4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0` has a balance of `20` coins on chain `1` of the Kadena `testnet04` network.

## Using a YAML request and kadena-cli commands

You can also use YAML execution requests and transaction templates to check account balances using Kadena CLI commands.
Here's the structure for different operations:

    ```yaml
    # balance-check.yaml
    # YAML configuration for checking balance
    code: |-
      (coin.get-balance "your k: address")
    meta:
      chainId: "1"
      sender: "your k: address"
      gasLimit: 2000
      gasPrice: 0.00000001
      ttl: 7200
    networkId: "mainnet01"
    type: exec
    ```

    To execute:
    ```bash
    kadena exec balance-check.yaml
    kadena tx add
    ```
    select the YAML file path then
    ```bash
    kadena tx test
    ```
    And select the transaction you just added. now you shall see the data with your account Balance

    
## Using the Kadena client library

Here's the basic structure for using Kadena.js:

    ```javascript
  import {Pact, createClient} from '@kadena/client'

    async function getBalance(account) {
  // `Pact.builder.execution` accepts a number of `Pact.modules.<module>.<fun>` calls
    const transaction = Pact.builder
      .execution(Pact.modules.coin['get-balance'](account))
      .setMeta({ chainId: '1' })
      .createTransaction();

    // client creation is separate from the transaction builder
    const staticClient = createClient('https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact');

    const res = await staticClient.local(transaction, {
      preflight: false,
      signatureVerification: false,
    });

}

getBalance(account).catch(console.error);
```

