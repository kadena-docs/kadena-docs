---
title: Chainweb EVM and Foundry integration
description: "Deploy a private Chainweb EVM node to set up a local development network for testing."
id: evm-foundry-quickstart
sidebar_position: 2
tags: [evm, foundry, Solidity, chainweb, network, node operator]
---

# Chainweb EVM and Foundry integration

This section provides a quick reference of how to integrate Chainweb EVM multi-chain support into a Foundry project at a glance.

## 🔧 Updated core files

- Counter.t.sol - Imports the ChainwebTest contract to support testing on multiple chains.
- foundry.toml - Enables support for the Foreign Function Interface (FFI) and read permissions for the `chainweb.config.json` configuration file.
- Counter.s.sol - Imports the ChainwebScript contract and methods to support contract deployment on multiple chains.

## 📁 New configuration files

- `chainweb.config.json` - Enables you to configure settings for support multiple target deployment networks, such as anvil, testnet, mainnet, and development.
- `remappings.txt` - Defines required dependency mapping for `foundry-chainweb` integration.

## 🚀 Enhanced testing features

The `ChainwebTest` contract supports multi-chain testing

- `testMultiChainDeployment()` - Deploy and test contracts on different chains
- `testCrossChainWorkflow()` - End-to-end multi-chain token distribution
- `testChainIsolation()` - Verify contracts are independent per chain
- `testMultiChainGasUsage()` - Compare gas usage across chains

## Deployment features

- Deploys different token configurations per chain
- Automatic token distribution to treasury/marketing wallets
- Comprehensive deployment verification
- Environment-specific configurations

## Command abstraction features

```bash
# Install and add dependencies project
make setup

# Test multi-chain functionality  
make test-multi

# Deploy to local anvil
make deploy-local

# Deploy to testnet (requires PRIVATE_KEY env var)
PRIVATE_KEY=your_key make deploy-testnet

# Interactive testing
make anvil    # Start local node
make console  # Start Chisel REPL
```

## Next steps

1. Clone and install dependencies:
   
   ```bash
   git clone <your-repo> && cd <your-project>
   make setup
   ```

1. Test locally:
   
   ```bash
   make anvil           # Terminal 1: Start local node
   make deploy-local    # Terminal 2: Deploy contracts
   make test-multi      # Test multi-chain functionality
   ```

1. Deploy to testnet:
   
   ```bash
   PRIVATE_KEY=<your_testnet_key> make deploy-testnet

1. Interact with contracts:
   
   ```bash
   # Update contract addresses in Interact.s.sol first
   forge script script/Interact.s.sol:SimpleTokenInteractionScript --broadcast
   ```

The integration transforms your simple token contract into a sophisticated multi-chain application ready for Kadena's Chainweb network, with comprehensive testing, deployment automation, and interaction capabilities.