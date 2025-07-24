---
title: Estimate gas
description: "Calculate the approximate cost to execute a specific transaction."
id: estimate-gas
---

# Estimate gas

Because transaction fees vary depending on the resources required to execute specific operations, it can use useful to calculate potential fees by testing contract functions using the Pact REPL and `.repl` files.
This coding project demonstrates the basic steps for calculating the gas required to execute any method in a `.repl` file.

This coding project assumes you're familiar with the basic built-in functions for testing smart contracts in your local development environment using `.repl` files.
As an extension of the [Local testing](/coding-projects/local-testing), the project demonstrates how to gas-related built-in functions with the `loans-estimate.pact` module as the sample smart contract to test.

In this coding project, you'll learn about:

- Using the built-in environment configuration functions.
- Setting and updating gas limits.
- Testing the gas consumed for individual functions.
- Combining functions in transaction blocks.

## Before you begin

Before starting this project, verify your environment meets the following basic requirements:

- You have a GitHub account and can run `git` commands.
- You have installed the [Pact](/smart-contracts/install) programming language and command-line interpreter.
- You have installed the [`kadena-cli`](/smart-contracts/install/tooling#kadena-command-line-interface) package and have a working directory with initial configuration settings.
- You have a [local development](/smart-contracts/install/local-dev-node) node that you can connect to that runs the `chainweb-node` program, either in a Docker container or on a physical or virtual computer.
- You must have at least one [account](/guides/accounts/howto-fund-accounts) that's funded with KDA on at least one chain for deployment on the local development network or the Kadena test network.
- You should be familiar with the basics for defining [modules](/smart-contracts/modules) and using keysets.

## Get the starter code

To get started:

1. Open a terminal shell on your computer.

2. Clone the `pact-coding-projects` repository by running the following command:

   ```bash
   git clone https://github.com/kadena-docs/pact-coding-projects.git
   ```

3. Change to the `07-estimate-gas` directory by running the following command:

   ```bash
   cd pact-coding-projects/07-estimate-gas
   ```

   If you list the contents of this directory, you'll see the following files:

   - `starter-estimate-gas.repl` provides a starting point testing the `loans` module.
   - `loans-estimate.pact` provides the final code for the `loans` module with the functions that you'll estimate gas consumption for.
   - `loans-estimate.repl` provides the final version of the test cases for estimating the gas consumed by functions defined in the `loans` module.

4. Open and review the `starter-estimate-gas.repl` file.

   This file outlines the tasks you need to complete for the _Estimate gas_ project.
   Follow the embedded instructions to work through the coding challenges on your own or use the detailed instructions and code provided in the next sections.

5. (Optional) Copy the `starter-estimate-gas.repl` file or create a new `estimate-gas.repl` file in your code editor to use for this coding project.

## Set environment data

As you learned in [Local testing](/coding-projects/local-testing), most smart contracts require some information to be defined in the testing environment so that it's available for module functions to use.

To prepare environment data for testing:

1. Open the `estimate-gas.repl` file in your code editor.
2. Add the `env-sigs` built-in function to enable the `loans-admin-keyset` to sign transactions and have unrestricted capabilities.
   
   ```pact
   (env-sigs [{"key": "loan-admin-keyset", "caps": []}])
   ```

3. Add the `env-data` built-in function to define the `loans-admin-keyset` key and predicate function.
   
   ```pact
   (env-data {"loans-admin":
     { "keys": ["loan-admin-keyset"], "pred": "keys-all" } })
   ```

1. Add a transaction to define the `free` namespace for the module.
   
   ```pact
   (begin-tx "Define namespace")
     (define-namespace "free" (read-keyset "loans-admin" ) (read-keyset "loans-admin" ))
   (commit-tx)
   ```

2. Add a transaction to initialize gas modeling by setting the `env-gasmodel` built-in function to `table` and the `env-gaslimit` built-in function to `150000` or a similar value.
   
   ```pact
   (begin-tx "Initialize gas modeling for testing")
     (env-gasmodel "table")
     (env-gaslimit 150000)
   (commit-tx)
   ```

## Load the module and call functions

After you initialize gas modeling, you are ready to begin calling the `env-gas` built-in function to report the gas consumed by individual function calls or by transactions that call multiple functions.
This coding project demonstrates both how to calculate the gas consumption for specific function calls and how to combine multiple function calls into a single transaction and estimate the gas required to complete the transaction.

To load the module and call functions:

1. Begin a transaction.
   
   ```pact
   (begin-tx "Call the inventory-key function to estimate gas")
   ```

2. Load the `loans-estimate.pact` file into the REPL.
   
   ```pact
     (load "loans-estimate.pact")
   ```

3. Call the `inventory-key` function with the `loanId:string` and `owner:string` parameters.
   
   ```pact
     (inventory-key "loanId-1" "Las Pistolas")
   ```

4. Retrieve the gas consumed using the `env-gas` built-in function.
   
   ```pact
     (env-gas)
   ```

5. Commit the transaction.
   
   ```pact
   (commit-tx)
   ```

6. Reset the gas retrieved to zero before calling the next function.
   
   ```pact
   (env-gas 0)
   ```

   At this point, you have a loans-estimate.repl file that looks similar to the following to estimate gas consumption of one function:

   ```pact
   ;; ===================================================================
   ;;  1 Set environment data
   ;; ===================================================================
   
   (env-sigs [{"key": "loan-admin-keyset", "caps": []}])
   (env-data { "loans-admin":
     { "keys": ["loan-admin-keyset"], "pred": "keys-all" } })
   
   (begin-tx "Define namespace")
     (define-namespace "free" (read-keyset "loans-admin" ) (read-keyset "loans-admin" ))
   (commit-tx)
   
   (begin-tx "Initialize gas modeling for testing")
     (env-gasmodel "table")
     (env-gaslimit 150000)
   (commit-tx)
   
   ;; ===================================================================
   ;;  2 Load the loans-estimate.pact file and call a function
   ;; ===================================================================

   (begin-tx "Call inventory-key function to estimate gas")
     (load "loans-estimate.pact")
     (inventory-key "loanId-1" "Las Pistolas") ;; loanId, owner
     (env-gas)      ;; Retrieve the gas consumed.
   (commit-tx)
   (env-gas 0)      ;; Reset the gas consumed to zero.
   ```

1. Test that the gas consumed is returned by running the following command:

   ```pact
   pact --trace loans-estimate.repl
   ```
   
   You should see output similar to the following:
   
   ```pact
   loans-estimate.repl:0:0-0:53: "Setting transaction signatures/caps"
   loans-estimate.repl:1:0-2:58: "Setting transaction data"
   loans-estimate.repl:4:0-4:29: "Begin Tx 0 Define namespace"
   loans-estimate.repl:5:2-5:85: "Namespace defined: free"
   loans-estimate.repl:6:0-6:11: "Commit Tx 0 Define namespace"
   loans-estimate.repl:7:0-7:48: "Begin Tx 1 Initialize gas modeling for testing"
   loans-estimate.repl:8:2-8:24: "Set gas model to table-based cost model"
   loans-estimate.repl:9:2-9:23: "Set gas limit to 150000"
   loans-estimate.repl:10:0-10:11: "Commit Tx 1 Initialize gas modeling for testing"
   loans-estimate.repl:12:0-12:56: "Begin Tx 2 Call inventory-key function to estimate gas"
   loans-estimate.repl:13:2-13:30: "Loading loans-estimate.pact..."
   loans-estimate.pact:4:0-4:18: "Namespace set to free"
   loans-estimate.pact:5:3-5:65: "Keyset write success"
   loans-estimate.pact:7:3-175:1: Loaded module free.loans, hash 1dh4D_KYqbDxW6L-WECJC71HUyq2wpmC7wy_ztsUxiQ
   loans-estimate.pact:181:0-181:20: "TableCreated"
   loans-estimate.pact:182:0-182:35: "TableCreated"
   loans-estimate.pact:183:0-183:33: "TableCreated"
   loans-estimate.repl:13:2-13:30: ()
   loans-estimate.repl:14:2-14:43: "loanId-1:Las Pistolas"
   loans-estimate.repl:15:2-15:11: 6031
   loans-estimate.repl:16:0-16:11: "Commit Tx 2 Call inventory-key function to estimate gas"
   loans-estimate.repl:17:0-17:11: "Set gas to 0"
   Load successful
   ```

   In this example, the gas consumed by the `inventory-key` function is 6031.

## Call each function separately

You can add similar transactions to retrieve the gas consumed for each function defined in a module.
In the following example, each transaction imports the `free.loans` module and calculates the gas consumed for a specific function:

```pact
;; ===================================================================
;;  3 Call each function to retrieve the gas consumed
;; ===================================================================

(begin-tx "Call create-a-loan to estimate gas")
  (use free.loans)
  (create-a-loan "loanId-1" "Ponderosa" "Valley Credit" 16000) ;; loanId, loanName, entity, amount
  (env-gas) 
(commit-tx)
(env-gas 0)

(begin-tx "Call assign-a-loan to estimate gas")
  (use free.loans)
  (assign-a-loan "txid-1" "loanId-1" "Studio Funding" 10000) ;; txid, loanId, buyer, amount
  (env-gas) 
(commit-tx)
(env-gas 0)

(begin-tx "Call sell-a-loan to estimate gas")
  (use free.loans)
  (sell-a-loan "txid-2" "loanId-1" "buyer2" "Studio Funding" 2000) ;; txid, loanId, seller, buyer, amount
  (env-gas)
(commit-tx)
(env-gas 0)

(begin-tx "Call read-a-loan to estimate gas")
  (use free.loans)
  (read-a-loan "loanId-1") ;; loanId
  (env-gas) 
(commit-tx)
(env-gas 0)

(begin-tx "Call read-all-loans to estimate gas")
  (use free.loans)
  (read-all-loans)
  (env-gas) 
(commit-tx)
(env-gas 0)
```

As before, you can test that the gas consumed is returned for each function by running the following command:

```pact
pact --trace loans-estimate.repl
```

In this example, the functions from the `loans` module returned the following results:

```pact
...
..."Begin Tx 3 Call create-a-loan to estimate gas"
loans-estimate.repl:26:2-26:11: 88
...Begin Tx 4 Call assign-a-loan to estimate gas"
loans-estimate.repl:33:2-33:11: 168
..."Begin Tx 5 Call sell-a-loan to estimate gas"
loans-estimate.repl:40:2-40:11: 132
..."Begin Tx 6 Call read-a-loan to estimate gas"
loans-estimate.repl:47:2-47:11: 19
..."Begin Tx 7 Call read-all-loans to estimate gas"
loans-estimate.repl:54:2-54:11: 40004
...
```

## Combine multiple functions

In some cases, you might want to estimate the gas required to execute a set of functions instead of individual functions.
You can do so by combining the functions into a single transaction.
The following example demonstrates combining several function into a single transaction then retrieving the gas consumed.
Note that you might need to increase the value you set for the `env-gaslimit` built-in function when you are returning the gas for multiple functions in a single transaction.

The following example demonstrates combining multiple functions into a single transaction, increasing the gas limit value, and returning the gas consumed for all of the functions executed:

```pact
;; ===================================================================
;;  4 Combine multiple functions in a transaction and retrieve gas
;; ===================================================================

(begin-tx "Call multiple functions in a transaction")
   (use free.loans)
   (create-a-loan "loanId-2" "Renovation" "RiverBank" 140000)
   (read-a-loan "loanId-2")
   (read-all-loans)
   (read-loan-inventory)
   (read-loans-with-status INITIATED)
   (env-gaslimit 280000)
   (read-loans-with-status ASSIGNED)
   (env-gas)
(commit-tx)
```

## Review

This project introduced several of the built-in REPL-only functions for calculating gas.
The project included examples of the following use-cases:

- Calculating the gas required to execute individual functions.
- Calculating the gas required to execute a transaction that combined multiple functions.

Through these examples, you learned how to:

- Initiate table-based gas modeling.
- Set an initial gas limit.
- Report the gas consumed.
- Reset the gas to zero.

You also learned that you can update the gas limit, if needed.