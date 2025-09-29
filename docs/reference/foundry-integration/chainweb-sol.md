---
title: Foundry Chainweb EVM - Chainweb.sol
description: "Technical reference information for the core components of the Chainweb.sol contract that provides the core features for testing and deploying Solidity projects on the Kadena Chainweb EVM multi-chain network."
id: foundry-chainweb-sol
sidebar_position: 2
tags: [evm, foundry, Solidity, chainweb, network, node operator]
---

# Foundry Chainweb EVM - Chainweb.sol

The `Chainweb.sol` contract in the `foundry-chainweb` package provides the core features that enable you to test and deploy Solidity projects on the Kadena Chainweb EVM multi-chain network with minimal manual configuration. 
The core components of `Chainweb.sol` manage chain identifier mapping, switching between chains, fork creation, and testing multiple forks within a single testing environment.
The features are provided through the following base contracts:

- `Chainweb`
- `ChainwebConfigReader`
- `ChainwebTest`
- `ChainwebScript`

## Chainweb

The main `Chainweb` constructor initializes the core configuration parameters for chain management.
The constructor parameters correspond with the configuration settings defined in the `chainweb.config.json` file:

- `numberOfChains` (uint24): Number of chains to manage for a deployment target.
- `chainIdOffset` (uint256): Starting offset value for incrementing EVM base network chain identifiers on a deployment target.
- `chainwebChainIdOffset` (uint24): Starting offset value for Chainweb-specific chain identifiers on a deployment target.  
- `hostUrl` (string): Custom RPC host URL (optional).

These parameters are defined in the `ChainwebConfig` structure for each target deployment network specified in the `chainweb.config.json` file:

```solidity
struct ChainwebConfig {
    uint256 numberOfChains;
    uint256 chainIdOffset;
    uint256 chainwebChainIdOffset;
    string externalHostUrl;
}
```

### Key methods

**getActiveChainId()**
- Uses a static call to the CHAIN_ID_PRECOMPILE address.
- Returns the currently active chain identifier from the precompile.

**getChainIds()**
- Returns an array of all configured chain identifiers.
- Useful for iterating over available chains.

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
- Validates the chain identifier against configured ranges.

### deployChainWebChainIdContract

Use `deployChainWebChainIdContract` to deploy the Chainweb chain identifier precompile contract for a given chain.

| Parameter | Type      | Description                               |
| --------- | --------- | ----------------------------------------- |
| `chainId` | `uint256` | Specifies the Chainweb chain identifier to deploy the precompile contract to. |

### getActiveChainId

Use `getActiveChainId` to return the currently active **Chainweb chain identifiers** for the current network context.

| Output     | Type        | Description                                  |
| ---------- | ----------- | -------------------------------------------- |
| `chainId` | `uint256[]` | Returns the Chainweb chain identifier for the currently active chain. |

### getChainIds

Use `getChainIds` to retrieve a list of the valid **Chainweb chain identifiers** for the current network context.

| Output     | Type        | Description                                  |
| ---------- | ----------- | -------------------------------------------- |
| `chainIds` | `uint256[]` | Returns an array containing all of the valid Chainweb chain identifiers. |

You should note that Chainweb chain identifiers 0 through 19 are reserved for chains that support Pact, so Kadena public networks use the `chainwebChainIdOffset` to set the starting point for Chainweb-specific chain identifiers.
For example, the Chainweb EVM testnet consists of five chains with the Chainweb chain identifiers 20, 21, 22, 23, and 24. 
This starting point value is configured in the `chainweb.config.json` file for each project and for each deployment target. 
In the sample `chainweb.config.json` file, the `anvil` deployment target is also configured to use 20 as the starting point for Chainweb EVM chain identifiers.
However, if you spin up internal `anvil` instances for testing, you'll see Chainweb chain identifiers starting with 0. 

The `chainIdOffset` in the `chainweb.config.json` file is the starting point for the **Ethereum network chain identifier**, similar to 1 for the Ethereum mainnet. 

For Chainweb EVM testnet chains, the starting value for the Ethereum network chain identifier is 5920.
The network chain identifier for the Chainweb EVM testnet chain 20 is 5920. 
Chainweb EVM testnet chain 21 has network chain identifier 5921, and so on.

### setupChainsForTest

Use `setupChainsForTest` to initialize chain forks and deploy precompile contracts on each chain for use when running Foundry tests.

### setupChainsForScript

Use `setupChainsForScript` to initialize chain forks and RPC nodes for use when running Foundry scripts.
This method also deploys precompile contracts if you are using the `anvil` deployment target.

### switchChain

Use `switchChain` to switch from the current active chain to a specified chain identifier in the Chainweb EVM network.
This method enables you to loop through a set of Chainweb chain identifiers when executing tests or running scripts.
You can also use the method to explicitly set the active chain using its Chainweb-specific chain identifier.

| Parameter | Type      | Description                               |
| --------- | --------- | ----------------------------------------- |
| `chainId` | `uint256` | Specifies the target Chainweb chain identifier to switch to. |

### Constants

**CHAIN_ID_PRECOMPILE**
- Precompile contract that provides chain identifier functionality.
- Address: `0x9b02c3e2dF42533e0FD166798B5A616f59DBd2cc`

## ChainwebConfigReader

The `ChainwebConfigReader` contract reads the configuration settings from the `chainweb.config.json` file.

### Key method

**readChainwebConfig(string memory environment)**

- Reads configuration settings for the target network specified by the environment parameter.
- Uses the `readOptionalJsonUint` function to parse JSON integer values from the configuration file and define default values to use if configuration keys are missing.
- Uses the `readOptionalJsonString` function to parse JSON string values from the configuration file and define default values to use if configuration keys are missing.
- Returns `ChainwebConfig` structure with parsed values.
- Uses default values if configuration keys are missing.

### Default values

- `numberOfChains`: 1
- `chainIdOffset`: 31337
- `chainwebChainIdOffset`: 0
- `externalHostUrl`: "" (empty string)

## ChainwebTest

The `ChainwebTest` constructor enables simplified multi-chain testing with automatic initialization by extending the default Foundry `Test` contract, so that you can test cross-chain interactions within a single test environment.
The following constructor parameters define the testing environment:

- `numberOfChains` (uint24): Number of chains to create for a target network.
- `chainwebChainIdOffset` (uint24): Starting offset for Chainweb-specific chain identifiers in the target network. 

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

        // Test on chain 2
        chainweb.switchChain(2);
        // Verify state changes
    }
}
```

## ChainwebScript

The `ChainwebScript` constructor extends the default Foundry Script contract to automatically handle environment-based configuration settings. 
When you import this contract in a script, the script reads the `CHAINWEB` environment variable to determine which set of configuration settings to load from the `chainweb.config.json` file. 
If you don't specify a target environment, the script uses the default `anvil` settings. 
The constructor then creates and configures the Chainweb instance based on these settings.

- Reads the value of the `CHAINWEB` environment variable to determine the target network.
- Loads the configuration settings that correspond to the `CHAINWEB` environment variable from `chainweb.config.json` file.
- Defaults to `anvil` settings if you don't specify the `CHAINWEB` environment variable.

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

If you use a custom host for the RPC URL, you should note that RPC endpoints are expected to conform to the following format:

```bash
{hostUrl}/chain/{chainwebChainId}/evm/rpc
```
