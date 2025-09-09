---
title: Foundry Chainweb EVM - Chainweb.sol
description: "Technical reference information for the core components of the Chainweb.sol contract that provides the core features for testing and deploying Solidity projects on the Kadena Chainweb EVM multi-chain network."
id: foundry-chainweb-sol
sidebar_position: 2
tags: [evm, foundry, Solidity, chainweb, network, node operator]
---

# Foundry Chainweb EVM - Chainweb.sol

The `Chainweb.sol` contract in the `foundry-chainweb` package provides the core features that enable you to test and deploy Solidity projects on the Kadena Chainweb EVM multi-chain network with minmal manual configuration. 
The core components of `Chainweb.sol`  manage chain identifier mapping, switching between chains, fork creation, and testing multiple forks within a single testing environment.
The features are provided through the following base contracts:

- `Chainweb`
- `ChainwebConfigReader`
- `ChainwebTest`
- `ChainwebScript`

## Chainweb

The main `Chainweb` constructor initializes the core configuration parameters for chain management.
The constructor parameters correspond with the configuration settings defined in the `chainweb.config.json` file:

- `numberOfChains` (uint24): Number of chains to manage.
- `chainIdOffset` (uint256): Starting offset for EVM network chain identifiers.
- `chainwebChainIdOffset` (uint24): Starting offset for Chainweb-specific chain identifiers.  
- `hostUrl` (string): Custom RPC host URL (optional).

### Key methods

**getActiveChainId()**
- Uses a static call to the CHAIN_ID_PRECOMPILE address.
- Returns the currently active chain identifier from the precompile.

**getChainIds()**
- Returns an array of all configured chain identifiers.
- Useful for iterating over available chains.

**getHostUrl()**
- Returns the host URL for the current chain identifier.

**setupChainsForScript()**
- Initializes chain forks for script execution.
- Creates RPC connections for each configured chain.
- Uses a custom host URL, if provided, or generates local node URLs.

**setupChainsForTest()**
- Initializes chain forks for testing.
- Deploys the ChainwebChainId precompile contract on each chain.
- Creates a single RPC connection and forks it for multiple chains.

**switchChain(uint256 chainId)**
- Switches the active fork to the specified chain identifier.
- Updates the VM's chain context.
- Validates chain identifier against configured ranges.

### getChainIds

Use `getChainIds` to retrieve a list of the valid Chainweb chain identifiers for the current network context.

| Output     | Type        | Description                                  |
| ---------- | ----------- | -------------------------------------------- |
| `chainIds` | `uint256[]` | Returns an array containing all of the valid Chainweb chain identifiers. identifiers. |

Keep in mind that the Chainweb `chainid` used in tests and scripts is computed from the `chain-id` specified in the `foundry.toml` file, by default `31337`, plus the Chainweb offset.
Each test or script chain increments from this base value.
For example, if the Foundry base chain is 31337 and the chainwebChainIdOffset is zero, the `chainid` is `31337`.

### switchChain

Use `switchChain` to switch from the current active chain to a specified chain identifier in the Chainweb EVM network.

| Parameter | Type      | Description                               |
| --------- | --------- | ----------------------------------------- |
| `chainId` | `uint256` | Specifies the target Chainweb chain identifier to switch to. |

Keep in mind that the Chainweb `chainid` in tests and scripts is computed from the `chain-id` specified in the `foundry.toml` file, by default `31337`, plus the Chainweb offset.
Each test or script chain increments from this base value.
For example, if the Foundry base chain is 31337 and the chainwebChainIdOffset is zero, the `chainid` is `31337`.

### Constants

**CHAIN_ID_PRECOMPILE**
- Precompile contract that provides chain identifier functionality.
- Address: `0x9b02c3e2dF42533e0FD166798B5A616f59DBd2cc`

### ChainwebConfig structure

Defines the configuration structure for environment-specific settings:

```solidity
struct ChainwebConfig {
    uint256 numberOfChains;
    uint256 chainIdOffset;
    uint256 chainwebChainIdOffset;
    string externalHostUrl;
}
```

## ChainwebConfigReader

The `ChainwebConfigReader` contract reads the configuration settings from the `chainweb.config.json` file.

### Methods

**readChainwebConfig(string memory environment)**
- Reads configuration for the specified environment.
- Returns ChainwebConfig struct with parsed values.
- Uses default values if configuration keys are missing.

**readOptionalJsonString**
- Parses JSON string values with fallback defaults.
- Uses default values if configuration keys are missing.

**readOptionalJsonUint/readOptionalJsonString**
- Parses JSON integer values with fallback defaults.
- Uses default values if configuration keys are missing.

### Default values

- `numberOfChains`: 1
- `chainIdOffset`: 31337
- `chainwebChainIdOffset`: 0
- `externalHostUrl`: "" (empty string)

## ChainwebTest

The `ChainwebTest` constructor enables simplified multi-chain testing with automatic initialization by extending the forge `Test` contract, so that you can test cross-chain interactions within a single test environment.
The following constructor parameters define the testing environment:

- `numberOfChains` (uint24): Number of chains to create.
- `chainwebChainIdOffset` (uint24): Starting offset for Chainweb-specific chain identifiers. 

The following example demonstrates using `ChainwebTest` and these parameters to specify a testing environment with three chains and an offset of zero for the Chainweb chain identifier:

```solidity
contract CrossChainTest is ChainwebTest(3, 0) {
    function testCrossChainTransfer() public {
        // Test on chain 0
        chainweb.switchChain(0);
        // Deploy and interact with contracts
        
        // Test on chain 1
        chainweb.switchChain(1);
        // Verify state changes
    }
}
```

## ChainwebScript

The ChainwebScript constructor extends the forge Script contract to automatically handle environment-based configuration. 
When you import this contract in a script, the script reads the CHAINWEB environment variable to determine which configuration settings to load from the `chainweb.config.json` file. 
If you don't specify a target environment, the script uses the default `anvil` settings. 
The constructor then creates and configures the Chainweb instance based on these settings.

- Reads the value of the `CHAINWEB` environment variable to determine the target network.
- Loads the configuration settings that correspond to the CHAINWEB environment variable from `chainweb.config.json` file.
- Defaults to `anvil` settings if you don't specify the CHAINWEB environment variable.

For example, the following `chainweb.config.json` defines the configuration settings for the `anvil` and `testnet` target networks:

```json
{
  "anvil": {
    "numberOfChains": 3,
    "chainIdOffset": 31337,
    "chainwebChainIdOffset": 0,
    "externalHostUrl": ""
  },
  "testnet": {
    "numberOfChains": 5,
    "chainIdOffset": 1000,
    "chainwebChainIdOffset": 10,
    "externalHostUrl": "https://testnet.example.com"
  }
}
```

You can then use the `CHAINWEB` environment variable to load the configuration settings for the `testnet` environment:

```bash
CHAINWEB=testnet forge script --multi script/Counter.s.sol:CounterScript \
  --private-key <your_private_key> \
  --broadcast --legacy
```

The following example demonstrates using `ChainwebScript` in a deployment script:

```solidity
contract DeployScript is ChainwebScript {
    function run() public {
        uint256[] memory chains = chainweb.getChainIds();
        
        for (uint256 i = 0; i < chains.length; i++) {
            chainweb.switchChain(chains[i]);
            // Deploy contracts on each chain
        }
    }
}
```

## Custom RPC configuration

If you use a custom host for the RPC URL, you should note that RPC endpoints are expected to follow the following format:

```bash
{hostUrl}/chain/{chainwebChainId}/evm/rpc
```
