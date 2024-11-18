---
title: Simple payments
description: "Build a simple contract that transfers value between two accounts, one of the most common and most important operations that smart contracts are use to perform."
id: transfers
sidebar_position: 3
---

# Simple payments

The _Simple payments_ project is designed to help you build a simple contract that transfers value between two accounts.
Because a blockchain acts as a digital ledger, transferring value between accounts is one of the most common blockchain operations.
Knowing how to create a smart contract that can be securely transfer assets is one of the most important building blocks that will enable you up to create more complex applications.

For this project, you'll create one Pact `payments` module smart contract that consists of three functions:

- `create-account`
- `get-balance`
- `pay` 
 
These functions store information in a `payments-table` database table.
The `payments-table` manages payments between two test accounts named `Sarah` and `James`.

![Simple payments project overview](/img/payments-overview.png)

## Before you begin

Before starting this project, verify your environment meets the following basic requirements:

- You have a GitHub account and can run `git` commands.
- You have installed the [Pact](/smart-contracts/install) programming language and command-line interpreter.
- You have installed the [`kadena-cli`](/smart-contracts/install/tooling#kadena-command-line-interface) package and have a working directory with initial configuration settings.
- You have a [local development](/smart-contracts/install/local-dev-node) node that you can connect to that runs the `chainweb-node` program, either in a Docker container or on a physical or virtual computer.
- You should be familiar with defining [modules](/smart-contracts/modules) and using keysets.
  
## Get the starter code

To get started:

1. Open a terminal shell on your computer.

2. Clone the `pact-coding-projects` repository by running the following command:

   ```bash
   git clone https://github.com/kadena-docs/pact-coding-projects.git
   ```

3. Change to the `01-simple-payment` directory by running the following command:

   ```bash
   cd pact-coding-projects/01-simple-payment
   ```

   If you list the contents of this directory, you'll see the following files:

   - `starter-simple-payment.pact` provides a starting point with the framework for the project code and comments for every challenge.
   - `simple-payment.pact` contains the final solution code that can be deployed.
   - `local-simple-payment.repl` provides a simplified example of a test file that illustrates using REPL-only functions for testing contracts locally.
   - `simple-payment.repl` provides a complete test file for testing the final `simple-payment.pact` contract.

4. Open and review the `starter-simple-payment.pact` file.
   
   This file describes all of the tasks that you need to complete for the _Simple payments_ coding project.
   You can follow the instructions embedded in the file to try to tackle this coding project on your own
   without looking at the solutions to each step, or follow the instructions in the next sections if you need additional guidance.

## Define a module and module owner

The module declaration is a core part of any Pact smart contract.
To define a module, you must also specify the administrative keyset or governance capability that owns the module. 
For this coding project, you need to define one module—the `payments` module—and the administrative keyset for the `payments` module.

1. Open the `starter-simple-payment.pact` file in your code editor and save it as `simple-payment.pact`.

2. Define and read an administrative keyset with the name `admin-keyset` to own the `payments` module.
   
   ```pact
   (define-keyset "admin-keyset" (read-keyset "admin-keyset"))
   ```
   
   In essence, this line creates an administrative keyset using the keyset name of `admin-keyset` that will have one or more public keys and a predicate function read from a message or as environment data.
   The `admin-keyset` data that needs to be passed into the environment looks similar to the following:

   ```pact
   {"admin-keyset":{ "keys": ["fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7"], "pred": "keys-all" } }
   ```
   
   Note that you can use the standard string notation with double quotation marks or symbol notation with a single quotation mark (`'admin-keyset`) for identifiers. 
   For more information about string literals used as identifiers, see [Symbols](/reference/syntax#symbols).

3. Create a module named `payments` that is governed by the `admin-keyset`.
   
   ```pact
   (module payments "admin-keyset"
     ;; Module declaration
   )
   ```

1. Save your changes.
   
   Now that you have a module, you need to add the code for this module inside of the `payments` declaration—that is, before the closing parenthesis that marks the end of the module declaration. 
   
   For more information about defining modules, see [Modules and references](/smart-contracts/modules) and the description of the [module](/reference/syntax#module) keyword.

## Define a schema and table

The `payments` modules stores information about accounts and balances in the `payments-table` database table.
This table keeps track of the balance of the accounts that are associated with the `Sarah` and `James` account keysets.
The schema for the `payments-table` looks like this:

| Field name | Field type |
| --------- | --------- |
| balance | decimal |
| keyset | guard |

1. Open the modified `simple-payment.pact` file in your code editor.

2. Define a `payments` schema for a table with the columns `balance` as type decimal and `keyset` as type guard.
   
   ```pact
     (defschema payments
        balance:decimal
        keyset:guard)
   ```

3. Define the `payments-table` to use the  `{payments}` schema you created in the previous step.
   
   ```pact
     (deftable payments-table:{payments})
   ```

4. Move the closing parenthesis that marks the end of the `payments` module declaration after the table definition to include the schema and table inside of the module.
   
   Without comments, your code should look similar to the following:
   
   ```pact
   (define-keyset "admin-keyset" (read-keyset "admin-keyset"))

   (module payments "admin-keyset"
   
     (defschema payments
       balance:decimal
       keyset:guard)
   
     (deftable payments-table:{payments})
   )
   ```

5. Save your changes.
   
   You now have a schema and table definition inside of the `payments` declaration.
   For more information about defining schemas and tables, see [Database model](/smart-contracts/databases).

## Define functions

For this coding project, the `payments` module provides three functions:

- `create-account` to allow the module administrator to create accounts. 
- `get-balance` to allow the module administrator and account owner to view account balances.
- `pay` to allow one account to pay another account.

### Define the create-account function

The `create-account` function allows the `payments` module administrator—identified by the `admin-keyset` keyset—to create any number of accounts. 

1. Open the modified `simple-payment.pact` file in your code editor.

1. Start the `create-account` function definition with the keyword `defun` and add the parameters `id`, `initial-balance`, and `keyset`.
   
   ```pact
   (defun create-account (id initial-balance keyset)
   
   )
   ```

2. Within the function, use `enforce-keyset` to ensure that all accounts are created by the `admin-keyset` administrator.
   
   ```pact
     (enforce-keyset "admin-keyset")
   ```

3. Within the function, use `enforce` to ensure that the `initial-balance` is zero and include optional documentation.
   
   ```pact
     (enforce (>= initial-balance 0.0) "Initial balances must be >= 0.")
   ```

1. Within the function, insert the `initial-balance` and `keyset` into the `payments-table` using the `id` parameter to set the **key-row** value.
   
   ```pact
     (insert payments-table id
            { "balance": initial-balance,
              "keyset": keyset })
   ```

2. Check that the closing parenthesis for the `create-account` function is after the last expression and move the closing parenthesis for the `payments` module declaration after the function.
   
   Without comments, your code should look similar to the following:
   
   ```pact
   (define-keyset "admin-keyset" (read-keyset "admin-keyset"))
   
   (module payments "admin-keyset"
   
     (defschema payments
       balance:decimal
       keyset:keyset)
   
     (deftable payments-table:{payments})

     (defun create-account (id initial-balance keyset)
        (enforce-keyset "admin-keyset")
        (enforce (>= initial-balance 0.0) "Initial balances must be >= 0.")
        (insert payments-table id
            { "balance": initial-balance,
              "keyset": keyset })
     )
   )
   ```

### Define the get-balance function

Now that you can create accounts, it is helpful to be able to view the balance of these accounts. 
The `get-balance` function allows account owners and the module administrator to view account balances.

1. Start the `get-balance` function definition with the keyword `defun` and the required argument to be the `id` key-row value.
   
   ```pact
     (defun get-balance (id)
     
     )
   ```

2. Within the function, use `with-read` to view the `id` from the `payments-table`.
   
   ```pact
       (with-read payments-table id   
   ```

3. Within the function, use `enforce-one` to check that the keyset calling the function is either the `admin-keyset` or the `id` keyset.
   
   ```pact
        (enforce-one "Access denied"
          [(enforce-keyset keyset)
           (enforce-keyset "admin-keyset")])
   ```

4. Within the function, return the `balance` for the specified `id` keyset.
   
   ```pact
        balance)
   ```

5. Check that the closing parenthesis for the `get-balance` function is after the last expression and move the closing parenthesis for the `payments` module declaration after the function.
   
   Without comments, your code should look similar to the following:

   ```pact
   (define-keyset "admin-keyset" (read-keyset "admin-keyset"))
   
   (module payments "admin-keyset"
   
     (defschema payments
       balance:decimal
       keyset:keyset)
   
     (deftable payments-table:{payments})

     (defun create-account (id initial-balance keyset)
        (enforce-keyset "admin-keyset")
        (enforce (>= initial-balance 0.0) "Initial balances must be >= 0.")
        (insert payments-table id
          { "balance": initial-balance,
            "keyset": keyset })
     )
    
     (defun get-balance (id)
        (with-read payments-table id
          { "balance":= balance, "keyset":= keyset }
        (enforce-one "Access denied"
          [(enforce-keyset keyset)
           (enforce-keyset "admin-keyset")])
        balance)
     )
   )
   ```

### Define the pay function

The `pay` function allows one account to transfer assets to another account defined in the `payments-table`.

1. Start the `pay` function definition with the keyword `defun` and specify the parameters as `from`, `to`, and `amount`.
   
   ```pact
     (defun pay (from to amount)
     
     )
   ```

2. Within the function, use `with-read` to view the `payments-table` for the `from` account and bind the `balance` and `keyset` of this account to the `from-bal` and `keyset` variables.
   
   ```pact
       (with-read payments-table from { "balance":= from-bal, "keyset":= keyset }
   ```

1. Within the function, enforce that the `keyset` is the keyset of the account.
   
   ```pact
         (enforce-keyset keyset)
   ```

2. Within the function, use `with-read` to get the balance of the `to` account, and bind this balance to the `to-bal` variable. 

   ```pact
        (with-read payments-table to { "balance":= to-bal }
   ```   

2. Within the function, enforce that the amount being transferred is greater than zero or return an error message.

   ```pact
        (enforce (> amount 0.0) "Negative transaction amount")
   ``` 

3. Within the function, enforce that `balance` for the `from` account is greater than what is being transferred or return an error message.

   ```pact
        (enforce (>= from-bal amount) "Insufficient funds")
   ```     

4. Within the function, update the `payments-table` to reflect the new balance for the `from` account.
   
   ```pact
        (update payments-table from
           { "balance": (- from-bal amount) })
   ```

4. Within the function, update the `payments-table` to reflect the new balance for the `to` account.

   ```pact
        (update payments-table to
           { "balance": (+ to-bal amount) })
   ```        

1. Within the function, return a formatted string to say that the `from` account has paid the `to` account and the `amount` paid.
   
   ```pact
        (format "{} paid {} {}" [from to amount])))
   ```

2. Check that the closing parenthesis for the `pay` function is after the last expression and move the closing parenthesis for the `payments` module declaration after the function.
   
   Without comments, your code should look similar to the following:

   ```pact
   (define-keyset "admin-keyset" (read-keyset "admin-keyset"))

   (module payments "admin-keyset"
   
     (defschema payments
        balance:decimal
        keyset:keyset)
   
     (deftable payments-table:{payments})

     (defun create-account (id initial-balance keyset)
        (enforce-keyset "admin-keyset")
        (enforce (>= initial-balance 0.0) "Initial balances must be >= 0.")
        (insert payments-table id
           { "balance": initial-balance,
             "keyset": keyset })
     )

     (defun get-balance (id)
        (with-read payments-table id
           { "balance":= balance, "keyset":= keyset }
        (enforce-one "Access denied"
           [(enforce-keyset keyset)
            (enforce-keyset "admin-keyset")])
        balance)
     )

     (defun pay (from to amount)
        (with-read payments-table from { "balance":= from-bal, "keyset":= keyset }
           (enforce-keyset keyset)
           (with-read payments-table to { "balance":= to-bal }
             (enforce (> amount 0.0) "Negative transaction amount")
             (enforce (>= from-bal amount) "Insufficient funds")
             (update payments-table from
                     { "balance": (- from-bal amount) })
             (update payments-table to
                     { "balance": (+ to-bal amount) })
             (format "{} paid {} {}" [from to amount])
           )
         )
      )
   )
   ```

3. Save your changes.
   
   The `pay` function is the last code that you need to include within the `payments` module. 

## Create the table

Although you defined a schema and a table inside of the `payments` module, tables are created outside of the module code.
This distinction between what you define inside of the module and outside of the module is important because the module acts as a guard to protect access to database functions and records. 
This separation also allows module code to be potentially updated without replacing the table in Pact state. 

To create the table:

1. Open the modified `simple-payment.pact` file in your code editor.

2. Locate the closing parenthesis for the `payments` module.

3. Create the table using the `create-table` keyword.
   
   ```pact
   (create-table payments-table)
   ```

## Create a file for local testing

At this point, you have completed all of the essential code for the `simple-payment.pact` contract. 
However, you can't test or deploy the code in its current state.
Because keysets are defined outside of contract code, the most common way to test a module locally is to create a test file that makes use of REPL-only built-in functions to simulate data that must be provided by the environment, like keysets and signatures.
In this part of the project, you'll see how to create a test file—the `local-simple-payment.repl` file—to call REPL-only functions and test the functions you've defined in the `payments` module.

To create the test file:

1. Copy the `simple-payment.pact` file and rename the file as `local-simple-payment.repl`.
2. Open the `local-simple-payment.repl` file in your code editor.
3. Add the `env-data` built-in function to set environment data to simulate keyset information.
   
   ```pact
   ;; Set keyset information
   (env-data
       { "admin-keyset" :
         { 'keys : [ 'admin-public-key ]
         , 'pred : 'keys-all
         }
       }
   )
   ```

1. Add a transaction using the `begin-tx` and `commit-tx` functions to define a namespace for your module.
   
   ```pact
   ;; Define a namespace
   (begin-tx)
     (define-namespace 'ns-dev-local (read-keyset "admin-keyset") (read-keyset "admin-keyset"))
   (commit-tx)
   ```

   Namespaces are required to define a context for modules when they are deployed on a network.
   For local testing, you must define a namespace before you can define a keyset.
   Keysets must be defined inside of a namespace.

2. Add a signature using the `env-sigs` function for signing transactions to your environment.
   
   ```pact
   ;; Add a signature for signing transactions
   (env-sigs
     [{ 'key  : 'admin-public-key
      , 'caps : []
     }]
   )
   ```

3. Add a transaction to define a keyset inside of the namespace.
   
   ```pact
   ;; Enter the namespace and define a keyset
   (begin-tx
     "Define a new keyset"
   )
   (namespace 'ns-dev-local)
   (expect
     "A keyset can be defined"
     "Keyset defined"
   (define-keyset "ns-dev-local.admin-keyset" (read-keyset "admin-keyset")))
   (commit-tx)
   ```

   This example uses the `expect` built-in function to test the assertion that the keyset can be defined.

4. Add the `begin-tx` function before the module declaration and modify the governing entity to be the `ns-dev-local.admin-keyset` defined in this namespace.
   
   ```pact
   (begin-tx
     "Update the module"
   )
     (module payments "ns-dev-local.admin-keyset"
      ...
     )
   ```

5. Scroll to the bottom of the file and add the closing `commit-tx` function.
   
   ```pact
   ;; ===================================================================
   ;;  4-Create-table
   ;; ===================================================================
   
   ;; Create the payments-table.
   (create-table payments-table)
   (commit-tx)
   ```

6. Save your changes.

7. Open a terminal shell on your computer and test execution by running the following command:
   
   ```bash
   pact local-simple-payment.repl --trace
   ```

   You should see output similar to the following:

   ```bash
   local-simple-payment.repl:2:0:Trace: Setting transaction data
   local-simple-payment.repl:11:0:Trace: Begin Tx 0
   local-simple-payment.repl:12:2:Trace: Namespace defined: ns-dev-local
   local-simple-payment.repl:13:0:Trace: Commit Tx 0
   local-simple-payment.repl:16:0:Trace: Setting transaction signatures/caps
   local-simple-payment.repl:23:0:Trace: Begin Tx 1: Define a new keyset
   local-simple-payment.repl:26:0:Trace: Namespace set to ns-dev-local
   local-simple-payment.repl:27:0:Trace: Expect: success: A keyset can be defined
   local-simple-payment.repl:31:0:Trace: Commit Tx 1: Define a new keyset
   local-simple-payment.repl:33:0:Trace: Begin Tx 2: Update the module
   local-simple-payment.repl:36:2:Trace: Loaded module payments, hash J9JQQ3Gi3fpgXTHm4j3wlbC2PFVVXifOXj6_lWicReM
   local-simple-payment.repl:122:0:Trace: TableCreated
   local-simple-payment.repl:124:0:Trace: Commit Tx 2: Update the module
   Load successful
   ```

   This sample test file only covers the most minimal steps for testing your module locally.
   For a more complete set of tests for the `simple-payment.pact` contract, including function calls, see the `simple-payment.repl` file.

## Deploy the contract

After testing the contract using the Pact interpreter and the REPL file, you can deploy the contract on your local development network or the Kadena test network.
Note that you can only define namespaces in the local development environment.
You must deploy to an existing namespace—such as the `free` namespace—or register a principal namespace to deploy on the Kadena test network or on a public production network.
To deploy in an existing namespace, you must also ensure that your module name and keyset name are unique across all of the modules that exist in that namespace.

For this coding project, you can deploy the `simple-payment.pact` contract using the Chainweaver desktop or web-based application and its integrated development environment. 

### Prepare to deploy

Because you're going to deploy the contract on the Kadena test network, you can update the contract code to use the `free` namespace, a unique keyset name, and a unique module name before you deploy the contract.

To prepare to deploy on the Kadena test network:

1. Open the contract you want to deploy in your code editor.

   For example, open the `simple-payment.pact` file in your code editor.

2. Add the `free` namespace before the module definition, define an administrative keyset inside of the namespace, and update the module name and governing keyset.

   For example:

   ```pact
   (namespace "free")
   (define-keyset "free.pistolas" (read-keyset 'pistolas))

   (module pistolas-simple-payment "free.pistolas"
      ...
   )
   ```

3. Update the other references to the `admin-keyset` to use the keyset you are defining for the namespace.
   
   For example, update the `enforce-keyset` lines in the `create-account` and `get-balance` functions:

   ```pact
       (enforce-keyset "free.pistolas")
   ```

4. Save the changes in the code editor.

### Load the module using Chainweaver

Because you must define the keyset keys and predicate function for your contract in the environment outside of the contract code, the Chainweaver integrated development environment provides the most convenient way to add the required keysets.

To load the contract using Chainweaver:

1. Open and unlock the Chainweaver desktop and web-based application, then select the **testnet** network.

2. Click **Accounts** in the Chainweaver navigation pane and verify that you have at least one account with funds on at least one chain in the test network. 
   
   If you don't have keys and at least one account on any chain on the test network, you need to generate keys, create an account, and fund the account on at least one chain before continuing.
   You'll use the public key for this account and the chain where you have funds in the account to deploy the contract and identify the contract owner.

3. Click **Contracts** in the Chainweaver navigation pane, then click **Open File** to select the `simple-payment.pact` contract that you want to deploy.

   After you select the contract and click **Open**, the contract is displayed in the editor panel on the left with contract navigation on the right.
   You'll also notice that the line where you define the keyset indicates an error, and the error message is `No such key in message` because your administrative keyset doesn't exist in the environment.

4. Under Data on the **Keysets** tab, type the name of your administrative keyset, click **Create**, then select the public key and predicate function for the administrative keyset.
   
   You'll see that adding the keyset dismisses the error message.

   ![Add your administrative keyset to the environment data](/img/simple-payment-admin.jpg)

5. Click **Load into REPL** to load the contract into the interactive Pact interpreter for testing its functions.
   
   You should see the following message:

   ```pact
   "TableCreated"
   ```

6. Click the **ENV** tab to add keysets for the test accounts Sarah and James.
   
   - Type `sarah-keyset`, click **Create**, then select a public key and predicate function for the Sarah account keyset.
   - Type `james-keyset`, click **Create**, then select a public key and predicate function for the James account keyset.
     
     ![Three keysets for testing your contract](/img/simple-payment-keysets.jpg)

7. Click the **REPL** tab to return to the loaded module to test its functions:
   
   - Call the `create-account` function to create test accounts in your uniquely-named module in the `free` namespace.
     For example, to create the accounts for Sarah and James:
     
     ```pact
     (free.pistolas-simple-payment.create-account "Sarah" 100.25 (read-keyset "sarah-keyset"))
     "Write succeeded"
     
     (free.pistolas-simple-payment.create-account "James" 250.0 (read-keyset "james-keyset"))
     "Write succeeded"
     ```

   - Call the `pay` function to pay 25.0 from Sarah to James:
     
     ```pact
     (free.pistolas-simple-payment.pay "Sarah" "James" 25.0)
     "Sarah paid James 25.0"
     ```

   - Call the `get-balance` function as Sarah and James:
     
     ```pact
     (format "Sarah's balance is {}" [(free.pistolas-simple-payment.get-balance "Sarah")])
     "Sarah's balance is 75.25"
     
     (format "James's balance is {}" [(free.pistolas-simple-payment.get-balance "James")])
     "James's balance is 275.0"
     ```

### Deploy using Chainweaver

Now that you've tested that the contract functions work as expected, you can use Chainweaver to deploy the contract on the test network in the `free` namespace.

To deploy the contract using Chainweaver:

1. Click **Deploy** to display the Configuration tab.
2. On the Configuration tab, update General and Advanced settings like this:
   
   - Select the **Chain identifier** for the chain where you want to deploy the contract.
   - Select a **Transaction Sender**.
   - Click **Advanced** and add the `free` namespace keyset to the environment.
     Because this transaction includes multiple keysets for the administrative and test accounts, select the administrative public key and the `keys-any` predicate function.

     ![Add namespace keyset to the transaction](/img/free-keyset-any.jpg)
   - Click **Next**.

3. On the Sign tab, select the public key for the administrative keyset as an **Unrestricted Signing Key**, then click **Next**.
   

3. On the Preview tab, scroll to see the Raw Response is "TableCreated", then click **Submit** to deploy the contract.

## View the deployed module

After you deploy a contract, you can view its details and call its functions using Chainweaver.

To view and call your contract:

1. Click **Contracts** in the Chainweaver navigation pane, then click **Module Explorer**.
2. Under Deployed Contracts, search for your module name in the **free** namespace and chain where you deployed, then click **Refresh** to update the list of deployed contracts to display only your just-deployed contract.
   
   In this example, the unique module name is **free.pistolas-simple-payment** and the contract was deployed on the testnet chain **1**. 
   
   ![Search for and view your deployed contract](/img/free-deployed-module.jpg)

3. Click **View** to display the functions and capabilities defined in your contract.

4. Click **Call** for the **create-account** function to display the function parameters.
   
   On the **Parameters** tab, set the parameters like this, then click **Next**:
  
   - For **id**, type "ben" in quotes.
   - For **initial-balance**, type 4.0.
   - For **keyset**, type (read-keyset "ben-keyset").
  
   On the **Configuration** tab, review and update the General settings, then click **Advanced**.
   
   - Under Data and Keysets, type `ben-keyset`, then click **Create**.
   - Select a public key and predicate, then click **Next**.

   On the **Sign** tab, select the public key for the contract owner you used to deploy the contract as an **Unrestricted Signing Key** , then click **Next**.

   On the **Preview** tab, scroll to see the **Raw Response** is "Write succeeded" for function.
   
   You can click **Submit** if you want to submit the transaction to the blockchain or close the function call without submitting the transaction.

## Next steps

Congratulations, you've just completed the _Simple payments_ coding project.
You'll see similar patterns in other coding projects, with each project introducing new features, Pact syntax, or alternative coding models.
The coding projects are also intended to complement and reinforce concepts and examples presented in other parts of the documentation.
Follow the links embedded in each project to learn more.