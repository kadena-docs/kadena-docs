---
title: Testnet deployment guide
description: "Deploy your Solidity and EVM-compatible smart contract the Kadena Chainweb EVM test network."
id: howto-evm
sidebar_position: 2
tags: [evm, chainweb, network, node operator]
---

# Kadena EVM testnet deployment 

If you are a smart contract developer used to building decentralized applications for Ethereum and EVM-compatible chains, deploying on the Kadena **EVM Testnet** is no different that deploying on any other EVM-based chain.

At a high level, there are three basic steps:

- Get test tokens from the Kadena EVM Testnet **faucet** application.
- Configure your development environment or wallet to use one or more Chainweb EVM Testnet chains.
- Deploy your application the way you would on any other chain.

Because Hardhat is one of the most common development environment for Ethereum, this guide focuses on configuring and deploying Hardhat and the `@kadena/hardhat-chainweb` plugin to deploy Solidity smart contracts on the Chainweb EVM testnet. 

Additional guides that focus on other development tools will be provided later, it there's sufficient interest from the broader community.

## Get a wallet and tokens

Before you can deploy any smart contracts, you must have a **wallet** that supports EVM chains, and allows you to add new ones (MetaMask, Ledger, or Coinbase Wallet are fine).

Note that wallets currently used for traditional Kadena development—such as Chainweaver, Koala, Ecko, or Linx—only support **PACT** smart contracts at this time. Therefore, they are unable to interact with the EVM chains.
(**PACT** chains still run on chains 0 to 19, **EVM** chains are 20 to 24.)

For the EVM, most compatible wallets provide an **Add Network** or a **Connect** option where you can specify details about the network you want to add or connect to. We encourage partners to use testnet 20.

Navigating to the network settings will vary depending on the specific wallet and version you use.

For example, if you use MetaMask:

1. Expand **Ethereum Mainnet** to display the list of networks:

   ![Click Ethereum Mainnet to display the list of networks](/img/chainweb-evm/metamask-home.jpg)

2. Click **Add a custom network**.

   ![Search, select, or add a network in MetaMask](/img/chainweb-evm/select-network-metamask.png)

3. Add the network settings for Kadena Chainweb EVM.

   ![Add network details](/img/chainweb-evm/add-network-metamask.jpg)

   Use the following information to add chain 20 of EVM Testnet to your wallet:

   - Network Name: Kadena Testnet 20
   - RPC: https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
   - Chain ID: 5920
   - Currency Symbol: KDA
   - Block Explorer URL:  http://chain-20.evm-testnet-blockscout.chainweb.com/

After you connect your wallet account to the Kadena Chainweb EVM Testnet, you need to fund the account with **testnet KDA** to deploy contracts and pay transaction fees.

Testnet **KDA** tokens or have no _monetary value_, but they are required to execute transactions on the network. 

To get tokens for Chainweb EVM Testnet:

- **Official Kadena faucet** Kadena provides a public faucet interface for testnet KDA:   Open [faucet.evmtestnet.chainweb.com](https://faucet.evmtestnet.chainweb.com) in a browser, enter your account address, and select **Testnet**. The faucet contract will transfer 0.3 KDA to the account you specify. 
    
- **Alternate faucet:** You can opt to use third-party faucet services—coming soon—to obtain KDA tokens for Kadena Chainweb EVM Testnet.
  

The official faucet should be sufficient for most testing scenarios, if you are rate-limited and an alternate faucet is not yet live, contact the team.
    
**Important:** Your Chainweb EVM testnet account is now live and funded on EVM _chain 20_ in the network. 

We encourage partners to deploy on a this chain during the initial phase of deployment to Chainweb EVM. If you do however need access to the other chains, see [Multi-chain support](#multi-chain-support).

## Configure the development environment

After you have a Chainweb EVM testnet account with funds, the next step is to configure your development environment to use the Kadena Chainweb EVM Testnet network. 

These steps assume you are on using Hardhat, which a popular Ethereum development framework, and the Kadena Hardhat plugin [@kadena/hardhat-chainweb](https://github.com/kadena-io/hardhat-kadena-plugin) for multi-chain support.

### Before you begin

Verify that your development environment meets the following basic requirements:

- You have the [Node.js](https://nodejs.org) runtime environment, [npm](https://www.npmjs.com) or [yarn](https://yarnpkg.com/) package manager, and [npx](https://docs.npmjs.com/cli/v8/commands/npx) installed.
- You have [Git](https://git-scm.com/downloads) installed for managing your project.

### Configure Hardhat settings

To configure the development environment:

**Testnet instructions**  

1.  Clone the [Sandbox repo](https://github.com/kadena-io/kadena-evm-sandbox)

	`git clone  https://github.com/kadena-io/kadena-evm-sandbox.git`

2. Move to the Solidity directory

	`cd kadena-evm-sandbox/solidity`
	
3.  Install Dependancies

		`npm install`
4.  Get some test KDA from the EVM Faucet in the [Kadena Developer Tools]([https://tools.kadena.io/](https://tools.kadena.io/)) (if you haven't already)
5.  Configure your .env. Make a copy of the example and input your key.

	`cp .env.example .env`
6. Deploy your sample contract

	`npm run deploy testnet`


A more in depth README is located at:  [https://github.com/kadena-io/kadena-evm-sandbox/blob/main/README.md](https://github.com/kadena-io/kadena-evm-sandbox/blob/main/README.md)

## Multi-chain support

Although chain 20 is the 'main' chain, testnet supports **5 chains**. Add any or all of them to MetaMask:

### Testnet (Production Testing For Partners)
- **Chain 20**:
  - **Chain ID**: `5920`
  - **RPC**: `https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc`
  - **Block Explorer**: `http://chain-20.evm-testnet-blockscout.chainweb.com/`

### Other Chains

- **Chain 21**:
  - **Chain ID**: `5921`
  - **RPC**: `https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/21/evm/rpc`
  - **Block Explorer**: `http://chain-21.evm-testnet-blockscout.chainweb.com/`

- **Chain 22**:
  - **Chain ID**: `5922`
  - **RPC**: `https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/22/evm/rpc`
  - **Block Explorer**: `http://chain-22.evm-testnet-blockscout.chainweb.com/`

- **Chain 23**:
  - **Chain ID**: `5923`
  - **RPC**: `https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/23/evm/rpc`
  - **Block Explorer**: `http://chain-23.evm-testnet-blockscout.chainweb.com/`

- **Chain 24**:
  - **Chain ID**: `5924`
  - **RPC**: `https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/24/evm/rpc`
  - **Block Explorer**: `http://chain-24.evm-testnet-blockscout.chainweb.com/`


### Troubleshooting

If the deployment script times out or cannot connect to the network, check that the RPC URL is correct and verify internet connectivity.

If you see an **insufficient funds** error, make sure the account you are using has enough testnet KDA tokens on the chain where you are deploying the contract.
The transaction fee for deploying a simple contract typically costs less than 0.001 KDA, so you should have enough funds from the official faucet to deploy as many contracts as you need. 

If you see a nonce or chainId error, check that the chainId in Hardhat configuration file matches the network you are deploying to.

Congrats – you have deployed a Solidity smart contract on Kadena’s testnet! Your contract lives on Chainweb EVM chain 20!
