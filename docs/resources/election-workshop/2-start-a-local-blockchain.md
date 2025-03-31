---
title: "Start a local blockchain"
description: "Start the development network blockchain on your local computer and explore the smart contracts available by default."
id: workshop-start
sidebar_position: 3
---

# Start a local blockchain

In this workshop, you are going to implement the backend of the election website using **smart contracts** on the Kadena blockchain.
The smart contract you'll be writing for the election application defines rules for:

- Nominating candidates.
- Casting and counting votes.
- Storing the nominated candidates and the votes for each candidate.

Before you publish any smart contract on a public network, like the Kadena test network or the Kadena main network, you should always test that the contract works as expected on your local computer.
In this tutorial, you'll set up a local **development** network to run a blockchain inside of a Docker container on your local computer.
You can use this development network to test your smart contracts and experiment with code in an isolated environment that you can reset to a clean state at any time.

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local computer.
- You have a code editor, such as [Visual Studio Code](https://code.visualstudio.com/download), access to an interactive terminal shell, and are generally familiar with using command-line programs.
- You have cloned the [voting-dapp](https://github.com/kadena-community/voting-dapp.git) repository to create your project directory as described in [Prepare your workspace](/resources/election-workshop/1-prepare-your-workspace) and have checked out the `01-getting-started` branch.
- You have [Docker](https://docs.docker.com/get-docker/) installed and are generally familiar with using Docker commands for containerized applications.

## Run the development network in Docker

The Kadena **development** network is a fully functional Kadena blockchain network that runs inside of a Docker application container.
For this tutorial, you'll want to start the blockchain with a clean slate every time you stop and restart the container.
Because you don't need to maintain the state of the local blockchain between restarts, you can start the container without creating a persistent volume.

To start the local development network:

1. Open a terminal shell on your computer.

2. Start the Docker service if it isn't configured to start automatically in your local environment.

   You can run the `docker info` command to check whether Docker is currently running.

3. Pull the latest image and start the `devnet` container without a persistent volume by running the following command:

   ```shell
   docker run --interactive --tty --publish 8080:8080 kadena/devnet:latest
   ```

   You can stop the network at any time—and reset the blockchain state—by pressing Ctrl-c in the terminal. 
   After you stop the network, restart it using the previous command or one of the commands that follow.

   If you encounter an error where the version of Chainweb is invalid after a certain date (typically after a service update), run the following command to pull the latest version:

   ```shell
   docker run --pull=always --interactive --tty --publish 8080:8080 kadena/devnet:latest
   ```

   If you can't run the Pact executable on your local computer, you can mount the `./pact` folder in the Docker container by running the following command:

   ```bash
   docker run --interactive --tty \
    --publish 8080:8080 \
    --volume ./pact:/pact-cli:ro \
    kadena/devnet:latest
   ```

   If you mount the `pact` folder in the Docker container, you can execute `pact` commands using an interactive `pact>` shell in your browser at [http://localhost:8080/ttyd/pact-cli/](http://localhost:8080/ttyd/pact-cli/).

   After you start the development network, you'll see information about the network processes displayed in a terminal console.

   ![Development network (devnet) console](/img/election-workshop/devnet-console.jpg)

## Create an account

As you might have seen in [Create new accounts](/guides/accounts/howto-create-accounts), there are several ways to create Kadena accounts, including Kadena command-line interface commands.
You can also create accounts using wallet applications like Kadena SpireKey and Chainweaver.
Wallet applications provide often make interacting with blockchain networks, accounts, and keys easier.

You must have at least one account on the development network to complete the election workshop.
If you have public and private keys for testing, you can add them to the development environment using the `kadena account add` commands.

If you don't already have an account, you can create one using the [Chainweaver desktop application](https://github.com/kadena-io/chainweaver/releases), the [Chainweaver web application](https://chainweaver.kadena.network/), or `kadena-cli` commands.

To create an account using `kadena-cli` commands:

1. Open a terminal shell on your computer.
2. Install the `kadena-cli` library by running the following command:
   
   ```bash
   npm install --global @kadena/kadena-cli
   ```

3. Initialize the development environment with a configuration folder, wallet, and account by running the following command

   ```bash
   kadena config init
   ```

   This command creates the `.kadena` configuration folder location in your current working directory. adds default network settings to a `networks` subfolder, and prompts you to create a wallet.

4. Follow the prompts displayed to create a wallet and an account public and private key pair for the development network.

   After you provide the required information, you should see details about the new account  similar to the following:

   ```bash
   ====================================================
   == 🚨 IMPORTANT: Mnemonic Phrase 🚨 ==
   ====================================================
   Mnemonic Phrase:
   prize select sad post topic install found spend cable feature nest room
   
   Please store the mnemonic phrase in a SAFE and SECURE place. 
   This phrase is the KEY to recover your wallet. Losing it means losing access to your assets.
   
   ====================================================
   
   First keypair generated
   publicKey: e1ea3b130881ec420badfde86ba518751d4c575874399452aa7aed476807d68c
   
   Wallet Storage Location
   .kadena/wallets/pistolas-dev.yaml
   
   Account created
   accountName: k:e1ea3b130881ec420badfde86ba518751d4c575874399452aa7aed476807d68c
   
   Account Storage Location
   .kadena/accounts/pistolas-dev.yaml 
   ```

   Be sure to copy and store the mnemonic phrase in a safe place.
   This 12-word secret phrase is required if you ever need to recover your wallet.

## Connect to the development network

You now have a local wallet with the basic account information required to sign transactions: a public key, an account name, and a predicate.
However, the local account isn't yet associated with any network or chain identifiers.The first wallet and default account information provide you with the basics for signing transactions: a public key, an account name, and a predicate.
Because there aren't many practical applications that involve signing transactions using a local account, you'll want to choose a network and one or more chains to make the account available on-chain within that network.

Before you can use an account to transfer assets and sign the most common types of transactions, it must exist on a network and have funds on one or more chains.
For the workshop, you'll connect the local account to the development network, but you could follow similar steps to make it available on the Kadena test network or the Kadena main production network.

To add funds on the development network using `kadena-cli` commands:

1. Verify that the development network is currently running.
2. Open a terminal shell on your computer.
3. Fund the first account you created for the wallet by running the following command:
   
   ```bash
   kadena account fund
   ```

4. Follow the prompts displayed to add an account for the development network.




## Use TypeScript and Kadena client

Chainweaver is one way to interact with your smart contract code.
Another common way to interact with smart contracts is by using the Kadena client and TypeScript files.

To explore using TypeScript and Kadena client:

1. Open the `election-workshop` folder in your code editor and expand the `./snippets` folder.

2. Select the `package.json` file and review the list of scripts.

   For example:

   ```json
   "scripts": {
    "coin-details:devnet": "KADENA_NETWORK=devnet ts-node ./coin-details.ts",
    "create-account:devnet": "KADENA_NETWORK=devnet ts-node ./create-account.ts",
    "create-namespace:devnet": "KADENA_NETWORK=devnet ts-node ./principal-namespace.ts",
    "define-keyset:devnet": "KADENA_NETWORK=devnet ts-node ./define-keyset.ts",
    "deploy-gas-station:devnet": "KADENA_NETWORK=devnet ts-node ./deploy-gas-station.ts",
    "deploy-module:devnet": "KADENA_NETWORK=devnet ts-node ./deploy-module.ts",
    "format": "prettier --write .",
    "generate-types:coin:devnet": "pactjs contract-generate --contract coin --api http://localhost:8080/chainweb/0.0/development/chain/1/pact",
    "list-modules:devnet": "KADENA_NETWORK=devnet ts-node ./list-modules.ts",
    "transfer-create:devnet": "KADENA_NETWORK=devnet ts-node ./transfer-create.ts",
    "transfer:devnet": "KADENA_NETWORK=devnet ts-node ./transfer.ts"
   },
   ```

   These `npm` scripts call the corresponding TypeScript files in the `./snippets` folder.
   Before you execute any of these scripts, you need to:

   - Install package dependencies.
   - Check the configuration of the `KADENA_NETWORK` environment variable.

1. Open a terminal in the code editor, change to the `snippets` folder, then install the package dependencies by running the following commands:

   ```bash
   cd ./snippets
   npm install
   ```

2. Open the `configuration.ts` file in your code editor.

   Notice that when the environment variable `KADENA_NETWORK` is set to `devnet`, the functions exported from this file return the following:

   - The network identifier `development`.
   - The chain identifier `1`.
   - The API base URL `localhost:8080`—the host and port for the node you previously specified for the development network—and appended with the network id and chain id.

   These configuration settings are loaded into the `list-modules.ts` file to configure the transaction that is sent to your local blockchain using the Kadena client.

3. Open the `list-modules.ts` file in your code editor.

   ```typescript
   import { Pact, createClient } from '@kadena/client';
   import { getApiHost, getChainId, getNetworkId } from './configuration';

   const client = createClient(getApiHost());

   main();
   async function main() {
     const transaction = Pact.builder
       .execution('(list-modules)')
       .setMeta({ chainId: getChainId() })
       .setNetworkId(getNetworkId())
       .createTransaction();
     try {
       const response = await client.dirtyRead(transaction);

       const { result } = response;

       if (result.status === 'success') {
         console.log(result.data);
       } else {
         console.error(result.error);
       }
    } catch (e: unknown) {
      console.error((e as Error).message);
    }
   }
   ```

   Let's take a closer look at this code:

   - In the `main` function, the `Pact.builder` creates a transaction for executing the Pact code `(list-modules)`.
   - The `(list-modules)` function is a globally available function that isn't tied to a particular contract.
   - Because the `(list-modules)` function is a read-only operation, you can execute the transaction without paying any transaction fees using the `dirtyRead` method of the Kadena client.
   Internally, the `dirtyRead` method transforms the transaction object into a JSON object that is posted to an HTTP API endpoint of your development node.

   The rest of the `main` function processes the response from the API.

4. Execute the `(list-modules)` script in the terminal by running the following command:

   ```bash
   npm run list-modules:devnet
   ```

   The script output lists the modules deployed on your local development network.
   For example:

   ```bash
   > snippets@1.0.0 list-modules:devnet
   > KADENA_NETWORK=devnet ts-node ./list-modules.ts
   [
    'coin',
    'fungible-v1',
    'fungible-v2',
    'fungible-xchain-v1',
    'gas-payer-v1',
    'ns'
   ]
   ```

   This list is the same as the list displayed in the Chainweaver Module Explorer.
   You can use either Chainweaver or Kadena client to interact with the Kadena blockchain. 
   These tools support both simple read operations and complex multi-step transactions.
   You'll learn more about using Chainweaver and Kadena client to test smart contracts in later tutorials as you develop functionality for the election backend.

## Next steps

At this point, you have a functioning Kadena blockchain development network—**devnet**—running on your local computer.
In this tutorial, you learned:

-  How to start and stop a development network running on your local computer.
-  How to create a Chainweaver account and connect Chainweaver to the development network running on a local node.
-  How to explore the contracts that are deployed by default using Chainweaver.
-  How you can explore contracts using TypeScript files and the Kadena client.

In the next tutorial, you'll learn how you can use accounts and permissions to control who is allowed to perform different tasks on the development network.
In creating accounts, you'll learn about core concepts—including namespaces, keysets, and
modules—and how to use them to grant or restrict access to specific functions.
For example, you'll learn how to use an account, namespace, and keyset definition to control the permission to add candidates to the ballot in an election.
