---
title: Developing for Chainweb EVM with Foundry
description: "Develop smart contract applications using the Foundry toolchain to run on multiple Chainweb EVM-compatible chains."
id: evm-foundry-dev
sidebar_position: 2
tags: [evm, foundry, Solidity, chainweb, network, node operator]
---

# Chainweb EVM Foundry integration

The [foundry-chainweb](https://github.com/kadena-io/foundry-chainweb) package provides utilities to help you use the Foundry smart contract development toolchain to develop, test, and deploy projects on the Kadena Chainweb EVM blockchain.
These utilities extend the Foundry toolchain to support the Kadena multi-chain network, where transactions can be processed by multiple, parallel, EVM-compatible chains.

For information about installing the Foundry smart contract development toolchain and getting started with Solidity smart contract development, see the [Foundry](https://getfoundry.sh/introduction/overview) documentation.

## Before you begin

Verify that your development environment meets the following basic requirements:

- You have the Foundry toolchain—with the `forge`, `cast`, `anvil`, and `chisel` binaries—installed locally or running in a Docker container.
- You have Git installed for managing your project.
- You have cloned the [kadena-evm-sandbox](https://github.com/kadena-io/kadena-evm-sandbox) so that you have access to public and private keys for test accounts with default allocations.

If you want to deploy projects on the Kadena Chainweb EVM test network, you must have an EVM-compatible wallet and the private key for an account holding testnet KDA funds.
For more information about deploying projects on the Chainweb EVM test network, see [Kadena Chainweb EVM deployment](/guides/nodes/howto-evm).

## Quick start

If you have the Foundry toolchain installed, you can clone the [foundry-chainweb](https://github.com/kadena-io/foundry-chainweb) repository, navigate to the `/examples/Counter` folder, and begin experimenting with building, testing, and running scripts without first creating and configuring your own project.

To explore the sample `Counter` project:

1. Clone the `foundry-chainweb` repository:
   
   ```bash
   https://github.com/kadena-io/foundry-chainweb.git && cd foundry-chainweb
   ```
  
2. Change to the `examples/Counter` directory:
   
   ```bash
   cd examples/Counter
   ```

3. Build the sample `Counter` project:
   
   ```bash
   forge build
   ```
   
   You should see that the sample project compiles successfully:

   ```bash
   [⠊] Compiling...
   [⠒] Compiling 1 files with Solc 0.8.30
   [⠑] Solc 0.8.30 finished in 568.10ms
   Compiler run successful!
   ```

4. Test the sample `Counter` project:
   
   ```bash
   forge test
   ```

   You should see that the tests for the sample project are successful:

   ```bash
   [⠊] Compiling...
   No files changed, compilation skipped
   
   Ran 2 tests for test/Counter.t.sol:CounterTest
   [PASS] test_ActiveChainId() (gas: 67072)
   [PASS] test_MultiChains() (gas: 958675)
   Suite result: ok. 2 passed; 0 failed; 0 skipped; finished in 362.84ms (2.75ms CPU time)
   
   Ran 1 test suite in 366.60ms (362.84ms CPU time): 2 tests passed, 0 failed, 0 skipped (2 total tests)
   ```

5. Review the sample project configuration files and contracts for an overview of changes before configuring your own projects:
   
   - foundry-chainweb/chainweb.config.json
   - foundry-chainweb/foundry.toml
   - foundry-chainweb/examples/Counter/script/Counter.s.sol
   - foundry-chainweb/examples/Counter/src/Counter.sol
   - foundry-chainweb/examples/Counter/test/Counter.t.sol

## Install foundry-chainweb

To configure your development environment to use Foundry with Chainweb EVM:

1. Create a new project directory with template files by running a command similar to the following:
   
   ```bash
   forge init myKadenaCounter && cd myKadenaCounter
   ```

   If you already have a Foundry project, navigate to the root directory for that project.

2. Install the `foundry-chainweb` package by running the following command:

   ```bash
   forge install kadena-io/foundry-chainweb
   ```

3. Create a `remappings.txt` file in the root of your project.

4. Add the following to the `remappings.txt` file to override the default dependency mapping:

   ```text
   kadena-io/foundry-chainweb/=lib/foundry-chainweb/src/
   ```

5. Open the `foundry.toml` configuration file for your project and enable the Foreign Function Interface (FFI) support by setting the `ffi` option to `true` in your profile.
   
   For example:

   ```toml
   [profile.default]
   ffi = true
   ```

   The FFI feature allows Solidity tests and scripts to execute external commands or interact with the file system.

6. Enable `read` access to the `chainweb.config.json` file by adding the `fs_permissions` option to the `foundry.toml` file:

   ```toml
   fs_permissions = [{ access = "read", path = "./chainweb.config.json" }]
   ```

   By default, projects have no file system permissions, and can't read or write to any file system files or directories.
   The `fs_permissions` option enables you to configure specific file system permissions for specific files or directories.
   In this case, you're only allowing the project to read the `chainweb.config.json` file.
   You'll use the `chainweb.config.json` file to configure the settings to use for different network environments.

## Configure environment settings

A sample `chainweb.config.json` configuration file is installed by default in the `lib/foundry-chainweb` directory when you add `foundry-chainweb` to your project.
You can copy the sample  `chainweb.config.json` file to the root directory for your project or create a new `chainweb.config.json` file in the root directory.

You can use the `chainweb.config.json` file to configure different Chainweb EVM network settings to deploy and run contracts on multiple Chainweb EVM chains.
For example, you can modify the configuration file to define the number of EVM-compatible chains and the chain identifiers to use for different target networks, including `anvil`, a local Chainweb EVM node, the Chainweb EVM testnet, and Kadena mainnet.

The following sample `chainweb.config.json` file configures three deployment targets, the `anvil` target, the `sandbox` target, and the `testnet` target, each with multiple EVM-compatible chains and with different Ethereum base chain identifiers:

```json
{
  "anvil": {
    "numberOfChains": 5,
    "chainwebChainIdOffset": 20,
    "chainIdOffset": 62600
  },
  "sandbox": {
        "numberOfChains": 2,
        "chainwebChainIdOffset": 20,
        "chainIdOffset": 1789,
        "externalHostUrl": "http://localhost:1848/chainweb/0.0/evm-development"
  },
  "testnet": {
    "numberOfChains": 5,
    "chainwebChainIdOffset": 20,
    "chainIdOffset": 5920,
    "externalHostUrl": "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet"
  }
}
```

As you see in this example, you can set the following configuration parameters in the `chainweb.config.json` file:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `numberOfChains` | `number` | Number of Chainweb EVM chains to initialize and fork in the target environment. |
| `chainwebChainIdOffset` | `number` | Index to start mapping Chainweb EVM chain identifiers to prevent collisions between Chainweb Pact and EVM chains. The Chainweb chain identifiers 0 through 19 are reserved for Pact chains. |
| `chainIdOffset` | `number` | Base Ethereum chain identifier to use as the starting point for Chainweb EVM chain identifiers. For example, if you set the base `chainIdOffset` to 1000, `numberOfChains` to three, and the `chainwebChainIdOffset` index to zero, the resulting chain identifiers would be 1000, 1001, and 1002. |
| `externalHostUrl` | `string` | Base URL for external Chainweb network access. |

You should note that the `chainid` used in Chainweb EVM tests and scripts for Foundry projects is computed using the `chain-id` defined in the project `foundry.toml` file (by default,`31337`).
This chain identifier is used as the base and incremented for each chain where a test or script runs:

```text
Chainweb-EVM-chainid = Foundry-chain-id + chainwebChainIdOffset
```

**Important**: The  `chainweb.config.json` configuration file is only used when running scripts with `ChainwebScript`. 
When running tests with `ChainwebTest`, the configuration parameters are passed directly to the constructor and the configuration file is ignored.

After you configure the settings for different deployment targets, you are ready to update the tests and scripts for your project to run on multiple chains.

## Add multi-chain tests

To write tests that run on Chainweb EVM and support the multi-chain network, you should extend the `ChainwebTest` contract that's defined in the `lib/foundry-chainweb/src/Chainweb.sol` file instead of using the default Foundry `Test` base contract.

The `ChainwebTest` constructor takes the following parameters to set up multi-chain testing:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `numberOfChains` | `uint24` | Number of chains to initialize and fork. |
| `chainwebChainIdOffset` | `uint24` | Index to start mapping Chainweb EVM chain identifiers to prevent collisions between Chainweb Pact and EVM chains.|

The following example demonstrates using `ChainwebTest` with the `switchChain` method to test the `setNumber` and `increment` functions from the `Counter` contract on two chains:

```Solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {console} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";
import {ChainwebTest} from "kadena-io/foundry-chainweb/Chainweb.sol";

// numberOfChains is 2 and chainwebChainIdOffset index is 0
contract CounterTest is ChainwebTest(2, 0) {
    function test_MultiChains() public {
        chainweb.switchChain(0);
        Counter counter0 = new Counter();
        console.log("msg.sender in test:", msg.sender);
        console.log("Running script on chain:", block.chainid);
        counter0.setNumber(10);
        console.log("After setNumber(10):");
        console.log("  counter.number():", counter0.number());
        
        chainweb.switchChain(1);
        Counter counter1 = new Counter();
        console.log("msg.sender in test:", msg.sender);
        console.log("Running script on chain:", block.chainid);
        counter1.setNumber(11);
        console.log("After setNumber(11):");
        console.log("  counter.number():", counter1.number());

        chainweb.switchChain(0);
        counter0.increment();
        console.log("After incrementing on Chain 31337:");
        console.log("  counter.number():", counter0.number());
        assertEq(block.chainid, 31337);
        assertEq(counter0.number(), 11);

        chainweb.switchChain(1);
        counter1.increment();
        console.log("After incrementing on Chain 31338:");
        console.log("  counter.number():", counter1.number());
        assertEq(block.chainid, 31338);
        assertEq(counter1.number(), 12);
    }
}
```

You can execute the tests defined for your contract by running the `forge test` command.
For example, you can run the following command to display test results with additional details about test execution:

```bash
forge test -vv
```

This command displays information about the tests executed similar to the following:

```bash
[⠊] Compiling...
[⠔] Compiling 1 files with Solc 0.8.30
[⠒] Solc 0.8.30 finished in 448.41ms
Compiler run successful!

Ran 1 test for test/Counter.t.sol:CounterTest
[PASS] test_MultiChains() (gas: 361049)
Logs:
  Setting up Chainweb for tests...
  TEST: Setting main RPC node for 2 chains
  Forking http://127.0.0.1:25170
  Switched to chain: 0
  Switched to chain: 1
  Switched to chain: 0
  Switched to chain: 0
  msg.sender in test: 0x1804c8AB1F12E6bbf3894d4083f33e07309d1f38
  Running script on chain: 31337
  After setNumber(10):
    counter.number(): 10
  Switched to chain: 1
  msg.sender in test: 0x1804c8AB1F12E6bbf3894d4083f33e07309d1f38
  Running script on chain: 31338
  After setNumber(11):
    counter.number(): 11
  Switched to chain: 0
  After incrementing on Chain 31337:
    counter.number(): 11
  Switched to chain: 1
  After incrementing on Chain 31338:
    counter.number(): 12

Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 230.62ms (912.92µs CPU time)

Ran 1 test suite in 233.24ms (230.62ms CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)
```

## Write multi-chain scripts

To write scripts that run on Chainweb EVM and support the multi-chain network, you should extend the `ChainwebScript` contract that's defined in the `lib/foundry-chainweb/src/Chainweb.sol` file instead of using the default Foundry `Script` contract. 

The following example demonstrates using `ChainwebScript` with the `getChainIds` and `switchChain` methods to deploy the `Counter` contract on multiple chains:

```Solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {console} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";
import {ChainwebScript} from "kadena-io/foundry-chainweb/Chainweb.sol";

contract CounterScript is ChainwebScript {
    Counter public counter;

    function run() public {
        uint256[] memory chainIds = chainweb.getChainIds();
        // loop over chains and deploy the contract
        for (uint256 i = 0; i < chainIds.length; i++) {
            chainweb.switchChain(chainIds[i]);
            console.log("Running script on chain:", block.chainid);
            vm.startBroadcast();
            Counter counter1 = new Counter();
            counter1.setNumber(1);
            vm.stopBroadcast();
        }
    }
}
```

### Reading configuration settings

The script automatically reads configuration settings from the `chainweb.config.json` file and uses the `CHAINWEB` environment variable, if specified, to determine which configuration settings to apply.
If you don't specify the `CHAINWEB` environment variable, the script uses the `anvil` environment by default.

For example, you can deploy the `Counter` contract with the default configuration that uses the `anvil` node environment and the private key for a test account by running the `Counter.s.sol` script like this:

```bash
forge script --multi script/Counter.s.sol:CounterScript \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast
```

```bash
[⠊] Compiling...
[⠒] Compiling 1 files with Solc 0.8.30
[⠑] Solc 0.8.30 finished in 505.24ms
Compiler run successful!
Script ran successfully.
Gas used: 201779

== Logs ==
  Setting up Chainweb for scripts...
  SCRIPT: Setting main RPC node for 1 chains
  Forking http://127.0.0.1:29649
  Switched to chain: 0
  Switched to chain: 0
  Running script on chain: 31337

## Setting up 1 EVM.

==========================

Chain 31337

Estimated gas price: 2.000000001 gwei

Estimated total gas used for script: 264211

Estimated amount required: 0.000528422000264211 ETH

==========================

##### anvil-hardhat
✅  [Success] Hash: 0x80bb1c80bb65530c0cb1c0f0674132525fec7e018d69e300d6c372d4731b2303
Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Block: 1
Paid: 0.000156813000156813 ETH (156813 gas * 1.000000001 gwei)


##### anvil-hardhat
✅  [Success] Hash: 0xdf1c70f78b786dcbe65862dfc2efe8fc5e882514b124d0d649b3288a195a8c09
Block: 2
Paid: 0.000038291100884096 ETH (43696 gas * 0.876306776 gwei)

✅ Sequence #1 on anvil-hardhat | Total Paid: 0.000195104101040909 ETH (200509 gas * avg 0.938153388 gwei)
                                                                                         

==========================

ONCHAIN EXECUTION COMPLETE & SUCCESSFUL.

Transactions saved to: /Users/pistolas/myKadenaCounter/broadcast/Counter.s.sol/31337/run-latest.json

Sensitive values saved to: /Users/pistolas/myKadenaCounter/cache/Counter.s.sol/31337/run-latest.json
```

You can run the deployment script using the `sandbox` configuration from the `chainweb.config.json` file as the target environment by running a command similar to the following:

```bash
CHAINWEB=sandbox forge script --multi script/Counter.s.sol:CounterScript \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast --legacy
```

### Methods

The `ChainwebScript` code extends the default Foundry `Script` contract by adding a `chainweb` property that provides two additional methods—the `getChainIds` and `switchChain` methods—to support the multi-chain network.

- `chainweb.getChainIds` returns a list of available Chainweb chain identifiers
- `chainweb.switchChain` switches from the current active chain to a specified chain identifier in the Chainweb network.

For more information about these methods and other functions defined in the Chainweb.sol contract,see [Foundry Chainweb EVM - Chainweb.sol](/reference/foundry-integration/foundry-chainweb-sol). 

## Sample configuration and deployment

The following sample `chainweb.config.json` file demonstrates the configuration settings for the default `anvil` environment, a local development `sandbox` environment, and the Chainweb EVM `testnet` network.

```json
{
    "anvil": {
        "numberOfChains": 5,
        "chainwebChainIdOffset": 20,
        "chainIdOffset": 62600
    },
    "sandbox": {
        "numberOfChains": 2,
        "chainwebChainIdOffset": 20,
        "chainIdOffset": 1789,
        "externalHostUrl": "http://localhost:1848/chainweb/0.0/evm-development"
    },
    "testnet": {
        "numberOfChains": 5,
        "chainwebChainIdOffset": 20,
        "chainIdOffset": 5920,
        "externalHostUrl": "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet"
    }
}
```

To deploy the Counter contract using the `sandbox` configuration settings and the private key for one of the predefined development wallet accounts:

```bash
CHAINWEB=sandbox forge script --multi script/Counter.s.sol:CounterScript \
  --private-key "0xe711c50150f500fdebec57e5c299518c2f7b36271c138c55759e5b4515dc7161" \
  --broadcast --legacy
```

This deployment script deploys the contract on two Chainweb EVM chains with output similar to the following:

```bash
[⠒] Compiling...
No files changed, compilation skipped
Warning: Multi chain deployment is still under development. Use with caution.
Script ran successfully.
Gas used: 528888

== Logs ==
  Setting main RPC node for 2 chains
  Using custom RPC URL: http://localhost:1848/chainweb/0.0/evm-development/chain/20/evm/rpc
  Using custom RPC URL: http://localhost:1848/chainweb/0.0/evm-development/chain/21/evm/rpc
  Switching to chain: 20 _chainIdOffset 20
  Switched to chain: 20
  Running script on chain: 31337
  Switching to chain: 21 _chainIdOffset 20
  Switched to chain: 21
  Running script on chain: 31338
  Switching to chain: 20 _chainIdOffset 20
  Switched to chain: 20
  Active chain ID: 20
  Switching to chain: 21 _chainIdOffset 20
  Switched to chain: 21
  Active chain ID: 21

## Setting up 2 EVMs.

==========================

Chain 1789

Estimated gas price: 1.000000007 gwei

Estimated total gas used for script: 359596

Estimated amount required: 0.000359596002517172 ETH

==========================

==========================

Chain 1790

Estimated gas price: 1.000000007 gwei

Estimated total gas used for script: 359596

Estimated amount required: 0.000359596002517172 ETH

==========================

==========================

##### 1789
✅  [Success] Hash: 0xbf3f70fea5dd56ad315a107c8c1e0fb3c506e5865e0ec0e709ead281014fb138
Block: 3
Paid: 0.000123489375 ETH (65861 gas * 1.875 gwei)


##### 1789
✅  [Success] Hash: 0x2aa511372b226b311584d2d0430d585a95c7ab22ef96f80d581132330db427d3
Contract Address: 0x5c8B984DEb026110310f617c5DBa96Fd39704835
Block: 3
Paid: 0.0003874425 ETH (206636 gas * 1.875 gwei)


##### 1790
✅  [Success] Hash: 0xb13ce3e98575106f65aad3ece8ee4d470b4a441234c41b6fab0c7f90b8cff167
Contract Address: 0x5c8B984DEb026110310f617c5DBa96Fd39704835
Block: 4
Paid: 0.0003450659765625 ETH (206636 gas * 1.669921875 gwei)


##### 1790
✅  [Success] Hash: 0x64a60d8fd1a80abc3955cc439a7628cf4d053fb16824af4f790b5ce044512b5b
Block: 4
Paid: 0.000109982724609375 ETH (65861 gas * 1.669921875 gwei)

✅ Sequence #1 on 1789 | Total Paid: 0.000510931875 ETH (272497 gas * avg 1.875 gwei)

✅ Sequence #2 on 1790 | Total Paid: 0.000455048701171875 ETH (272497 gas * avg 1.669921875 gwei)
                                                                              
==========================

ONCHAIN EXECUTION COMPLETE & SUCCESSFUL.

Transactions saved to: /Users/pistolas/myKadenaCounte/broadcast/multi/Counter.s.sol-latest/run.json

Sensitive details saved to: /Users/pistolas/myKadenaCounte/cache/multi/Counter.s.sol-latest/run.json
```

In the sample output for deploying the contract on multiple chains, you'll notice that the Foundry chain identifiers are computed using the default value from the `foundry.toml` file (`31337`) as a base value and incremented for each Chainweb EVM chain.
As a result of the computation, Chainweb EVM chain 20 (index 0) maps to the Foundry chain identifier 31337, Chainweb EVM chain 21 (index 1) maps to the Foundry chain identifier 31338, and so on.
