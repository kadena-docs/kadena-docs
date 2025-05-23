---
title: Chainweb EVM testnet deployment guide
description: "Deploy your Solidity and EVM-compatible smart contract the Kadena Chainweb EVM test network."
id: howto-evm
sidebar_position: 2
tags: [evm, chainweb, network, node operator]
---

# Chainweb EVM testnet deployment 

If you are a smart contract developer used to building decentralized applications for Ethereum and EVM-compatible chains, deploying on the Kadena **Chainweb EVM Testnet** is no different that deploying on any other EVM-based chain.

At a high level, there are three basic steps:

- Get test tokens from the Chainweb EVM Testnet **faucet** application.
- Configure your development environment or wallet to use one or more Chainweb EVM Testnet chains.
- Deploy your application the way you would on any other chain.

This guide provides detailed instructions for each step.
Because Hardhat is one of the most common development environment for Ethereum, this guide focuses on configuring and deploying Hardhat and the `@kadena/hardhat-chainweb` plugin to deploy Solidity smart contracts on the Chainweb EVM testnet. 
Additional guides that focus on other development tools might be provided later, it there's sufficient interest from the broader community.

## Get a wallet and tokens

Before you can deploy any smart contracts, you must have a **wallet** that supports the Kadena network and Chainweb EVM nodes. 
You can add the Kadena Chainweb EVM network to any EVM-compatible wallet, such as MetaMask, Ledger, or Coinbase Wallet.

Note that you must use an EVM-compatible wallet to deploy on Chainweb EVM.
Wallets that are used for traditional Kadena development—such as Chainweaver, Koala, Ecko, or Linx—only support **Pact** smart contracts at this time.

Most EVM-compatible wallets provide an **Add Network** or a **Connect** option where you can specify details about the network you want to add or connect to.
However, navigating to the network settings will vary depending on the specific wallet and version you use.
For example, if you use MetaMask:

1. Expand **Ethereum Mainnet** to display the list of networks:

   ![Click Ethereum Mainnet to display the list of networks](/img/chainweb-evm/metamask-home.jpg)

2. Click **Add a custom network**.

   ![Search, select, or add a network in MetaMask](/img/chainweb-evm/select-network-metamask.png)

3. Add the network settings for Kadena Chainweb EVM.

   ![Add network details](/img/chainweb-evm/add-network-metamask.jpg)

   Use the following information to add Kadena Chainweb EVM Testnet to your wallet:    

   - Network Name: Kadena
   - RPC: https://testnet.kadena.io (placeholder)
   - Chain ID: 4269 (placeholder)
   - Currency Symbol: KDA
   - Block Explorer URL:  https://kadenascan.io (placeholder)

After you connect your wallet account to the Kadena Chainweb EVM Testnet, you need to fund the account with **testnet KDA** token to deploy contracts and pay transaction fees.
Testnet KDA tokens or **tKDA** have no _monetary value_ but they are required to execute transactions on the network. 

To get tokens for Chainweb EVM Testnet:

- Official Kadena faucet: Kadena provides a public faucet interface for testnet KDA. 
  Open [faucet.evmtestnet.chainweb.com](https://faucet.evmtestnet.chainweb.com) in a browser, enter your account address, and select **Testnet**. The faucet contract will transfer 20 tKDA to the account you specify. 
    
- Alternate faucet: You can opt to use third-party faucet services—such as [Tatum](https://tatum.io/)—to obtain tKDA tokens for Kadena Chainweb EVM Testnet.
  The Tatum faucet can transfer up to 100 tKDA tokens to your wallet address.
  However, you might be required to sign up for services to access the Tatum Dashboard. 

The official faucet should be sufficient for most testing scenarios, but an alternate faucet can be a useful resource if the official faucet rate-limits your usage.
    
**Important:** Your Chainweb EVM testnet account is on EVM _chain 0_ in the network. 
By default, all smart contract will be deployed on a single chain during the initial phase of deployment to Chainweb EVM. 
For more information about the Kadena multi-chain ecosystem, see [Multi-chain support](#multi-chain-support).

## Configure the development environment

After you have a Chainweb EVM testnet account with funds, the next step is to configure your development environment to use the Kadena Chainweb EVM Testnet network. 
These steps assume you are on using Hardhat, which a popular Ethereum development framework, and the Kadena Hardhat plugin [@kadena/hardhat-chainweb](https://github.com/kadena-io/hardhat-kadena-plugin) for multi-chain support.

### Before you begin

Verify that your development environment meets the following basic requirements:

- You have the [Node.js](https://nodejs.org) runtime environment, [npm](https://www.npmjs.com) or [yarn](https://yarnpkg.com/) package manager, and [npx](https://docs.npmjs.com/cli/v8/commands/npx) installed.
  This tooling is required to deploy Solidity contracts with Hardhat.
- Yoy have Git installed for managing your project.

### Configure Hardhat settings

To configure the development environment to deploy to one chain:

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
   
   Follow the prompts displayed to generate a default `hardhat.config.js` file and a sample project structure.

3. Modify the default `hardhat.config.js` file to configure Hardhat to connect to Kadena Chainweb EVM testnet chain 0:
   
   ```javascript
    const activeChain = "0";
    
    const RPC_URL_CHAIN0 =
      "https://evm-devnet.kadena.network/chainweb/0.0/evm-development/chain/0/evm/rpc";
    
    const config: HardhatUserConfig = {
      solidity: {
        compilers: [
          {
            version: "0.8.20",
            settings: {
              optimizer: {
                enabled: true,
                runs: 200,
              },
            },
          },
        ],
      },
      defaultNetwork: `kadenaDevnet${activeChain}`,
      namedAccounts: {
        deployer: {
          default: 0,
          kadenaDevnet0: 0,
          kadenaDevnet1: 0,
        },
      },
      networks: {
        // Kadena Devnet Chain 0
        kadenaDevnet0: {
          url: RPC_URL_CHAIN0,
          chainId: 1789,
          accounts: [deployerPrivateKey],
          timeout: 60000,
          gas: 8000000,
          gasPrice: "auto",
          httpHeaders: {
            "Content-Type": "application/json",
          },
        },
    };
   ```
   
   When you connect to Chainweb EVM Testnet to deploy, use the account you funded with testnet KDA. 
   Consider using environment variables for private keys—for example, use the `dotenv` package and `process.env.PRIVATE_KEY`—so to avoid hardcoding secret keys in your configuration file. 
   If you prefer not to expose your private keys, you can configure Hardhat to use a wallet provider and enter your keys manually when you deploy.
   However, using Hardhat scripts is more automation-friendly.
  
## Deploy a smart contract using Hardhat

After you configure your development environment to connect to Chainweb EVM Testnet, you are ready to deploy smart contracts on the network. 

To deploy using Hardhat:

1. Run the deployment script and specify the `--chainweb` and `--network` command-line options: 
   
   ```bash
   npx hardhat run scripts/deploy.js --chainweb testnet --network chainweb_testnet0
   ```
    
    With this command, Hardhat attempts to connect to the `testnet` RPC endpoint for chain 0 and send the transaction from your account. 
    If the contract is deployed successfully, the console will display the contract address and the transaction hash.
    
1. Wait for confirmation that the transaction has been mined into a block.
   
   As a proof-of-work network, it takes 30 seconds on average to produce a block.
   You should allow time for the transaction to be mined into a block and for the block to be confirmed by consensus and added to the chain.
   If Hardhat doesn't report errors during deployment, it's likely that the contract will be successfully deployed. 
   You can double-check by querying the contract or looking up the transaction in a block explorer.

### Troubleshooting

If the deployment script times out or cannot connect to the network, check that the RPC URL is correct and verify internet connectivity.

If you see an **insufficient funds** error, make sure the account you are using has enough testnet KDA tokens on the chain where you are deploying the contract.
The transaction fee for deploying a simple contract typically costs less than 0.1 KDA, so you should have enough funds from the official faucet to deploy multiple contracts. 

If you see a nonce or chainId error, check that the chainId in Hardhat configuration file matches the network you are deploying to.
    
Unlike Ethereum, the Kadena Chainweb EVM testnet doesn’t yet have an Etherscan type of service to verify contracts. 
Because Chainweb EVM doesn't have an official contract verification tool at this time, you can't upload your Solidity source and have an explorer show “Verified” code. 
Contract verification tooling is in early stages of development.    

Congrats – you have deployed a Solidity smart contract on Kadena’s testnet! Your contract lives on Chainweb EVM chain 0.

## Multi-chain support

