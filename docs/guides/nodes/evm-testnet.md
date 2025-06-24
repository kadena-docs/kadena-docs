---
title: Testnet deployment guide
description: "Deploy your Solidity and EVM-compatible smart contract the Kadena Chainweb EVM test network."
id: howto-evm
sidebar_position: 2
tags: [evm, chainweb, network, node operator]
---

# Kadena Chainweb EVM deployment 

If you are a smart contract developer used to building decentralized applications for Ethereum and EVM-compatible chains, deploying on the Kadena **Chainweb EVM Testnet** is no different that deploying on any other EVM-based chain.

At a high level, there are three basic steps:

- Get an EVM-compatible wallet and fund it with test KDA from the Chainweb EVM Testnet **faucet** application.
- Configure your development environment and wallet to use one or more Chainweb EVM Testnet chains.
- Deploy your application the way you would on any other chain.

This guide provides detailed instructions for each step.
Because Hardhat is one of the most common development environment for Ethereum, this guide focuses on configuring and deploying Solidity smart contracts on the Chainweb EVM testnet using the Hardhat development environment and the `@kadena/hardhat-chainweb` plugin. 
Additional guides that focus on other development tools might be provided later, if there's sufficient interest from the broader community.

## Get a wallet and tokens

Before you can deploy any smart contracts, you must have a **wallet** that supports EVM-compatible chains. 
You can add Kadena Chainweb EVM to any EVM-compatible wallet that supports adding custom networks. 
For example, you can add custom networks in MetaMask, Ledger, Trust Wallet, or Coinbase Wallet.

Note that wallets currently used for traditional Kadena development—such as Chainweaver, eckoWALLET, Enkrypt, Koala Wallet, or LinxWallet—only support **Pact** smart contracts at this time.
Chainweb EVM Testnet supports Pact smart contract on chains 0 through 19 and EVM-compatible smart contracts on chains 20 through 24.
You must have an EVM-compatible wallet to interact with chains 20 through 24.

### Add the Kadena network

Most EVM-compatible wallets provide an option to **Add a custom network** or a **Connect to a custom network** where you can specify details about the network you want to add or connect to.
However, navigating to the network settings will vary depending on the specific wallet and version you use.

To add network settings to a MetaMask wallet:

1. Open the MetaMask extension in your browser.

2. Expand **Ethereum Mainnet** to display the list of networks:

   ![Click Ethereum Mainnet to display the list of networks](/img/chainweb-evm/metamask-home.jpg)

3. Click **Add a custom network**.

   ![Search, select, or add a network in MetaMask](/img/chainweb-evm/select-network-metamask.png)

4. Add the network settings for Kadena Chainweb EVM.

   ![Add network details](/img/chainweb-evm/add-network-metamask.jpg)

   Use the following information to add Kadena Chainweb EVM Testnet **chain 20** to your wallet:    

   - Network Name: Kadena Chainweb EVM Testnet 20
   - RPC: https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
   - Chain ID: 5920 to deploy contracts on Chainweb EVM chain 20
   - Currency Symbol: KDA
   - Block Explorer URL: http://chain-20.evm-testnet-blockscout.chainweb.com
   
   Alternatively, you can connect to an existing MetMask wallet from the Blockscout explorer by clicking **Add to MetaMask**.

   Note that navigating to network settings will depend on the EVM-compatible wallet you choose. For example, if you choose Coinbase Wallet, you must click **Settings**, then **Networks** before you have the option to **Add or import a custom network**.
   If you have trouble finding the option to connect to a custom network, consult the documentation for your specific wallet.

### Fund the wallet account

After you connect your wallet account to Kadena Chainweb EVM Testnet chain 20, you need to fund the account with **testnet KDA** tokens to deploy contracts and pay transaction fees.
Testnet KDA tokens have no _monetary value_ but they are required to execute transactions on the network. 
In most cases, you can access the official Kadena EVM Faucet to fund your wallet account with enough KDA to deploy and interact with contracts on Chainweb EVM Testnet.    
<!--You have two options for funding wallet accounts that interact with Chainweb EVM Testnet:

- Official Kadena EVM Faucet: Kadena provides a public faucet interface for testnet KDA.     
- Alternate faucet: You can opt to use third-party faucet services—such as [Tatum](https://tatum.io/)—to obtain KDA tokens for Kadena Chainweb EVM Testnet.
  The Tatum faucet can transfer up to 100 KDA tokens to your wallet address.
  However, you might be required to sign up for services to access the Tatum Dashboard.-->

The funds provided by the official Kadena EVM Faucet should be sufficient for most testing scenarios.
However, if the official faucet limits your ability to test because you are low on funds, contact the [Kadena team](https://t.me/KadenaEarlyAccessEVM) to find out if there are other funding services or resources available.

To fund your wallet account using the official Chainweb EVM faucet:

1. Open [Developer Tools EVM faucet](https://tools.kadena.io/faucet/evm) in a browser.
2. Select **Testnet** from the network menu, if it isn't already selected.
   
   ![Kadena EVM Faucet](/img/chainweb-evm/evm-faucet.jpg)

3. Enter your Ethereum account name or account address (0x...).
4. Click **Fund 0.5 Coins**. 
  
   The faucet contract will transfer 0.5 KDA to the account you specify. 
    
**Important** The Ethereum wallet account you use to connect to Chainweb EVM Testnet is on **chain 20** in the Chainweb EVM Testnet network.
The Ethereum chain identifier for this Chainweb EVM chain is 5920. 

You should only deploy smart contracts on this chain during the initial phase of testing using Chainweb EVM Testnet. 
Most applications only need to be deployed on a single chain for testing purposes.
However, if you need access to other chains, you must provide different network details to connect to those chains.
For more information, see [Multi-chain support](#multi-chain-support).

## Configure the development environment

After you have a Chainweb EVM testnet account with funds, the next step is to configure your development environment to use the Kadena Chainweb EVM Testnet network. 
These steps assume you are on using Hardhat, which is a popular Ethereum development framework, and the Kadena Hardhat plugin [@kadena/hardhat-chainweb](https://github.com/kadena-io/hardhat-kadena-plugin) for multi-chain support.

### Before you begin

Verify that your development environment meets the following basic requirements:

- You have the [Node.js](https://nodejs.org) runtime environment, [npm](https://www.npmjs.com) or [yarn](https://yarnpkg.com/) package manager, and [npx](https://docs.npmjs.com/cli/v8/commands/npx) installed.
- You have [Git](https://git-scm.com/downloads) installed for managing your project.

### Configure Hardhat settings

For completeness, these steps assume you're creating a new Hardhat project.
If you already have a Hardhat project, you can skip the first two steps.

To configure the development environment using Hardhat:

1. Create a new project directory by running a command similar to the following:
   
   ```bash
   mkdir kadena-testnet && cd kadena-testnet
   ```

2. Initialize the Hardhat project in the directory by running the following commands:
   
   ```bash
   npm init -y
   npm install --save-dev hardhat
   npx hardhat init
   ```
   
   Follow the prompts displayed to generate a default `hardhat.config.js` or `hardhat.config.ts` file and a sample project structure.

3. Install the `@kadena/hardhat-chainweb` plugin in the root directory of your project using `npm`, `pnpm`, or `yarn`.
   
   For example:
   
   ```sh
   npm install @kadena/hardhat-chainweb
   ```

4. Install dependencies for the project.

   ```sh
   npm install
   ```

5. Open the `hardhat.config.js` or `hardhat.config.ts` file in your code editor and import the `@kadena/hardhat-chainweb` plugin.
   
   For example:

   ```javascript
   import "@nomicfoundation/hardhat-toolbox";
   import "@kadena/hardhat-chainweb";
   import "hardhat-deploy";
   import "hardhat-deploy-ethers";
   import "dotenv/config";
   import { HardhatUserConfig } from "hardhat/config";

7. Add Chainweb EVM network settings provided by the `@kadena/hardhat-chainweb` plugin.
   
   For example, the following settings configure `testnet20` network settings:

   ```javascript
     defaultChainweb: "testnet20",

     chainweb: {
       hardhat: { chains: 2 },
       
       testnet20: {
         type: "external",
         chains: 2,
         accounts,
         chainIdOffset: 5920,
         chainwebChainIdOffset: 20,
         externalHostUrl: "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet",
         etherscan: {
           apiKey: "abc",
           apiURLTemplate: "http://chain-{cid}.evm-testnet-blockscout.chainweb.com/api/",
           browserURLTemplate: "http://chain-{cid}.evm-testnet-blockscout.chainweb.com",
         },
       },
     },
   ```
   
   For a complete example of the Hardhat configuration file, see [scaffold-kadena](https://github.com/0xTrip/scaffold-kadena/blob/main/packages/hardhat/hardhat.config.ts).
   The repository also provides sample scripts for performing many common tasks that simplify project deployment and interacting with a contract after its deployed.

   For more information about the configuration settings and options provided by the Hardhat Chainweb plugin, see [hardhat-kadena-plugin](https://github.com/kadena-io/hardhat-kadena-plugin/blob/main/packages/hardhat-kadena/README.md) or [@kadena/hardhat-chainweb](https://www.npmjs.com/package/@kadena/hardhat-chainweb).

   ### Deployer account

   When you connect to Chainweb EVM Testnet to deploy, use the account you funded with testnet KDA. 
   Consider using environment variables for private keys—for example, use the `dotenv` package and `process.env.PRIVATE_KEY`—to avoid hardcoding secret keys in your configuration file. 
   
   If you prefer not to expose your private keys, you can configure Hardhat to use a wallet provider and enter your keys manually when you deploy.
   However, using Hardhat scripts is more automation-friendly.
  
## Deploy a smart contract using Hardhat

After you configure your development environment to connect to Chainweb EVM Testnet, you are ready to deploy smart contracts on the network. 

To deploy using Hardhat:

1. Run the deployment script and specify the `--chainweb` command-line option: 
   
   ```bash
   npx hardhat run scripts/deploy.js --chainweb evm-testnet
   ```
    
    With this command, Hardhat attempts to connect to the `evm-testnet` RPC endpoint for chain 20 and send the transaction from your account. 
    If the contract is deployed successfully, the console will display the contract address and the transaction hash.
    
2. Wait for confirmation that the transaction has been mined into a block.
   
   As a proof-of-work network, it takes 30 seconds on average to produce a block.
   You should allow time for the transaction to be mined into a block and for the block to be confirmed by consensus and added to the chain.
   If Hardhat doesn't report errors during deployment, it's likely that the contract will be successfully deployed. 
   You can double-check by querying the contract or looking up the transaction in a block explorer.

Congratulations! 
You have successfully deployed a Solidity smart contract on Kadena Chainweb EVM Testnet chain 20! 

### Troubleshooting

If the deployment script times out or cannot connect to the network, check that the RPC URL is correct and verify internet connectivity.

If you see an **insufficient funds** error, make sure the account you are using has enough testnet KDA tokens on the chain where you are deploying the contract.
For example, verify that you've configured the network settings for chain 20, funded the account on chain 20, and are attempting to deploy your contact on chain 20. 
The transaction fee for deploying a simple contract typically costs less than 0.001 KDA, so you should have enough funds from the official faucet to deploy multiple contracts. 

If you see a nonce or chainId error, check that the chainId in the Hardhat configuration file matches the network you are deploying to.

### Contract verification

You can use Blockscout or the `@kadena/hardhat-chainweb` plugin to verify contracts on the Kadena Chainweb EVM Testnet.    

## Multi-chain support

During the initial rollout of Chainweb EVM on the EVM Testnet, there will be twenty Pact chains—chains 0 through 19—and five EVM chains—chains 20 through 24.
However, Kadena recommends that you only deploy contracts and test transaction execution on a single chain to ensure operations work as expected without any significant changes to your contracts or development environment.

Limiting deployments to a single chain is intended to be a temporary constraint so that network stability and data persistence can be evaluated and, potentially, improved before rolling out the additional complexities involved in multi-chain contract deployments. 

The instructions for adding a custom network to your wallet provided the network information to use for Chainweb EVM chain 20. 
If you want to use any of the other chains, you must add the appropriate network information for that chain to the wallet.

### Chainweb EVM Testnet chain 20 (Production testing)

Use the following information when adding this chain as a custom network:  

- **Chain ID**: `5920`
- **RPC**: `https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc`
- **Block Explorer**: `http://chain-20.evm-testnet-blockscout.chainweb.com/`

### Chainweb EVM Testnet chain 21

Use the following information when adding this chain as a custom network:  

- **Chain ID**: `5921`
- **RPC**: `https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/21/evm/rpc`
- **Block Explorer**: `http://chain-21.evm-testnet-blockscout.chainweb.com/`

### Chainweb EVM Testnet chain 22

Use the following information when adding this chain as a custom network:  

- **Chain ID**: `5922`
- **RPC**: `https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/22/evm/rpc`
- **Block Explorer**: `http://chain-22.evm-testnet-blockscout.chainweb.com/`

### Chainweb EVM Testnet chain 23

Use the following information when adding this chain as a custom network:  

- **Chain ID**: `5923`
- **RPC**: `https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/23/evm/rpc`
- **Block Explorer**: `http://chain-23.evm-testnet-blockscout.chainweb.com/`

### Chainweb EVM Testnet chain 24

Use the following information when adding this chain as a custom network:  
- **Chain ID**: `5924`
- **RPC**: `https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/24/evm/rpc`
- **Block Explorer**: `http://chain-24.evm-testnet-blockscout.chainweb.com/`

## Known issues

If you attempt to add the network settings for Chainweb EVM to MetaMask from Blockscout, the Block Explorer URL isn't automatically populated. 
You should add the URL to the network settings manually in MetaMask to ensure that the links to the transactions that are displayed in Blockscout work as expected.