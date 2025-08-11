---
title: Simple payments
description: "Build a simple contract that transfers value between two accounts, one of the most common and most important operations that smart contracts are use to perform."
id: transfers
sidebar_position: 3
---

# Simple payments

The _Simple payments_ project is designed to help you build a simple contract that transfers value between two accounts.
Because a blockchain acts as a digital ledger, transferring value between accounts is one of the most common blockchain operations.
Knowing how to create a smart contract that can securely transfer assets is one of the most important building blocks that will enable you to create more complex applications.

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
- You must have at least one [account](/guides/accounts/howto-fund-accounts) that's funded with KDA on at least one chain for deployment on the local development network or the Kadena test network.
- You should be familiar with the basics for defining [modules](/smart-contracts/modules) and using keysets.
  
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
   - `test-simple-payment.repl` provides a simplified example of a test file that illustrates using REPL-only functions for testing contracts locally.
   - `simple-payment.repl` provides a complete test file for testing the final `simple-payment.pact` contract.

4. Open and review the `starter-simple-payment.pact` file.
   
   This file describes all of the tasks that you need to complete for the _Simple payments_ coding project.
   You can follow the instructions embedded in the file to try to tackle this coding project on your own
   without looking at the solutions to each step, or follow the instructions in the next sections if you need additional guidance.

## Define a namespace, keyset, and module

The module declaration is a core part of any Pact smart contract.
To define a module, you must also specify the administrative keyset or governance capability that owns the module.

For local development, you can define a module without using the context of a [namespace](/resources/glossary#namespace).
However, if you want to deploy modules, you should learn how to work with namespaces and namespace keysets. 

For this coding project, you'll define a custom namespace to serve as context for one Pact module—the `payments` module—and the administrative keyset to use in the namespace as the owner of the `payments` module.

To start the module declaration:

1. Open the `starter-simple-payment.pact` file in your code editor and save it as `simple-payment.pact`.

2. Define a custom local namespace that can only be controlled and accessed by the `admin-keyset` you define.
   
   ```pact
   (define-namespace "dev" (read-keyset "admin-keyset") (read-keyset "admin-keyset"))
   ```

3. Set the namespace you defined to be the active namespace.
   
   ```pact
   (namespace "dev")
   ```

4. Define namespace administrative keyset by reading the `admin-keyset`.
   
   ```pact
   (define-keyset "dev.admin-keyset" (read-keyset "admin-keyset"))
   ```
   
   In essence, this line creates an administrative keyset by reading the `admin-keyset` data—one or more public keys and a predicate function—from a message payload or passed in as environment data.
   The `admin-keyset` data looks similar to the following:

   ```pact
   {"admin-keyset":{ "keys": ["fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7"], "pred": "keys-all" } }
   ```
   
   Note that you can use the standard string notation with double quotation marks(`"admin-keyset"`) or symbol notation with a single quotation mark (`'admin-keyset`) for identifiers. 
   For more information about string literals used as identifiers, see [Symbols](/reference/syntax#symbols).

5. Create a module named `payments` that is governed by the `dev.admin-keyset`.
   
   ```pact
   (module payments "dev.admin-keyset"
     ;; Module declaration
   )
   ```

6. Save your changes.
   
   Now that you have a module, you need to add the code for this module inside of the `payments` declaration—that is, before the closing parenthesis that marks the end of the module declaration. 
   
   For more information about defining modules, see [Modules and references](/smart-contracts/modules) and the description of the [module](/reference/syntax#module) keyword.

## Define a schema and table

The `payments` module stores information about accounts and balances in the `payments-table` database table.
This table keeps track of the balance of the accounts that are associated with the `Sarah` and `James` account keysets.
The schema for the `payments-table` looks like this:

| Field name | Field type |
| --------- | --------- |
| balance | decimal |
| keyset | guard |

To define the schema and table:

1. Open the modified `simple-payment.pact` file in your code editor.

2. Define a `payments` schema for a table with the columns `balance` as type decimal and `keyset` as type guard.
   
   ```pact
     (defschema payments
        balance:decimal
        keyset:guard)
   ```

   It's worth noting that the row key for the table isn't defined in the schema for the table.

3. Define the `payments-table` to use the  `{payments}` schema you created in the previous step.
   
   ```pact
     (deftable payments-table:{payments})
   ```

4. Move the closing parenthesis that marks the end of the `payments` module declaration after the table definition to include the schema and table definitions inside of the module.
   
   Without comments, your code should look similar to the following:
   
   ```pact
   (define-namespace "dev" (read-keyset "admin-keyset") (read-keyset "admin-keyset"))
     (namespace "dev")
   
     (define-keyset "dev.admin-keyset" (read-keyset "admin-keyset"))
 
   (module payments "dev.admin-keyset"
   
     (defschema payments
       balance:decimal
       keyset:guard)
   
     (deftable payments-table:{payments})
   )
   ```

1. Save your changes.
   
   You now have a schema and table definition inside of the `payments` declaration.

   For more information about defining schemas and tables, see [Database model](/smart-contracts/databases).

## Define functions

For this coding project, the `payments` module provides three functions:

- `create-account` to allow the module administrator to create accounts. 
- `get-balance` to allow the module administrator and account owner to view account balances.
- `pay` to allow one account to pay another account.

### Define the create-account function

The `create-account` function allows the `payments` module administrator—identified by the `dev.admin-keyset` keyset—to create any number of accounts. 

To define the `create-account` function:

1. Open the modified `simple-payment.pact` file in your code editor.

1. Start the `create-account` function definition with the keyword `defun` and add the parameters `id`, `initial-balance`, and `keyset`.
   
   ```pact
   (defun create-account:string (id:string initial-balance:decimal keyset:guard)
   
   )
   ```

2. Within the function, use `enforce-guard` to ensure that all accounts are created by the `dev.admin-keyset` administrator.
   
   ```pact
     (enforce-guard "dev.admin-keyset")
   ```

3. Within the function, use `enforce` to ensure the `initial-balance` is greater than or equal to zero and include an optional documentation string.
   
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
   (define-namespace "dev" (read-keyset "admin-keyset") (read-keyset "admin-keyset"))
     (namespace "dev")
   
     (define-keyset "dev.admin-keyset" (read-keyset "admin-keyset"))
 
   (module payments "dev.admin-keyset"

     (defschema payments
       balance:decimal
       keyset:guard)
   
     (deftable payments-table:{payments})

     (defun create-account:string (id:string initial-balance:decimal keyset:guard)
        (enforce-guard "dev.admin-keyset")
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

To define the `get-balance` function:

1. Start the `get-balance` function definition with the keyword `defun` and the required argument to be the `id` key-row value.
   
   ```pact
     (defun get-balance (id:string)
     
     )
   ```

2. Within the function, use `with-read` to view the `id` from the `payments-table`.
   
   ```pact
       (with-read payments-table id   
   ```

3. Within the function, use `enforce-one` to check that the keyset calling the function is either the `dev.admin-keyset` or the `id` keyset.
   
   ```pact
        (enforce-one "Access denied"
          [(enforce-guard keyset)
           (enforce-guard "dev.admin-keyset")])
   ```

4. Within the function, return the `balance` for the specified `id` keyset.
   
   ```pact
        balance)
   ```

5. Check that the closing parenthesis for the `get-balance` function is after the last expression and move the closing parenthesis for the `payments` module declaration after the function.
   
   Without comments, your code should look similar to the following:

   ```pact
   (define-namespace "dev" (read-keyset "admin-keyset") (read-keyset "admin-keyset"))
     (namespace "dev")
     (define-keyset "dev.admin-keyset" (read-keyset "admin-keyset"))

   (module payments "dev.admin-keyset"
     (defschema payments
       balance:decimal
       keyset:guard)
     (deftable payments-table:{payments})

     (defun create-account:string (id:string initial-balance:decimal keyset:guard)
       (enforce-guard "dev.admin-keyset")
       (enforce (>= initial-balance 0.0) "Initial balances must be >= 0.")
       (insert payments-table id
         { "balance": initial-balance,
           "keyset": keyset })
     )

     (defun get-balance:decimal (id:string)
        (with-read payments-table id
         { "balance":= balance, "keyset":= keyset }

        (enforce-one "Access denied"
          [(enforce-guard keyset)
           (enforce-guard "dev.admin-keyset")])
        balance)
     )
   )
   ```

### Define the pay function

The `pay` function allows one account to transfer assets to another account defined in the `payments-table`.

To define the `pay` function:

1. Start the `pay` function definition with the keyword `defun` and specify the parameters as `from`, `to`, and `amount`.
   
   ```pact
     (defun pay:string (from:string to:string amount:decimal)
     
     )
   ```

2. Within the function, use `with-read` to view the `payments-table` for the `from` account and bind the `balance` and `keyset` of this account to the `from-bal` and `keyset` variables.
   
   ```pact
       (with-read payments-table from { "balance":= from-bal, "keyset":= keyset }
   ```

1. Within the function, enforce that the `keyset` is the keyset of the account.
   
   ```pact
         (enforce-guard keyset)
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
   (define-namespace "dev" (read-keyset "admin-keyset") (read-keyset "admin-keyset"))
     (namespace "dev")
     (define-keyset "dev.admin-keyset" (read-keyset "admin-keyset"))

   (module payments "dev.admin-keyset"
     (defschema payments
       balance:decimal
       keyset:guard)
     (deftable payments-table:{payments})

     (defun create-account:string (id:string initial-balance:decimal keyset:guard)
       (enforce-guard "dev.admin-keyset")
       (enforce (>= initial-balance 0.0) "Initial balances must be >= 0.")
       (insert payments-table id
         { "balance": initial-balance,
           "keyset": keyset })
     )

     (defun get-balance:decimal (id:string)
        (with-read payments-table id
         { "balance":= balance, "keyset":= keyset }

        (enforce-one "Access denied"
          [(enforce-guard keyset)
           (enforce-guard "dev.admin-keyset")])
        balance)
     )

     (defun pay:string (from:string to:string amount:decimal)
        (with-read payments-table from { "balance":= from-bal, "keyset":= keyset }
           (enforce-guard keyset)
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

Although you defined a schema and a table inside of the `payments` module, tables are created **outside** of the module code.
This distinction between what you define inside of the module and outside of the module is important because the module acts as a guard to protect access to database functions and database records. 
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
In this part of the project, you'll see how to create a test file—the `simple-payment.repl` file—to call REPL-only functions to test the functions you've defined in the `payments` module.

To create the test file:

1. Copy the `simple-payment.pact` file and rename the file as `test-simple-payment.repl`.
2. Open the `test-simple-payment.repl` file in your code editor.
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

4. Add the `env-sigs` built-in function to set the key for signing transactions in your environment.
   
   ```pact
   ;; Add a signature for signing transactions
   (env-sigs
     [{ 'key  : 'admin-public-key
      , 'caps : []
     }]
   )
   ```

5. Add a transaction using the `begin-tx` and `commit-tx` built-in functions to define a namespace and keyset for your module.
   
   ```pact
   (begin-tx "Define a namespace and keyset")

     (define-namespace "dev" (read-keyset "admin-keyset") (read-keyset "admin-keyset"))
     (namespace "dev")
     (expect
        "A keyset can be defined"
        "Keyset write success"
       (define-keyset "dev.admin-keyset" (read-keyset "admin-keyset")))
   (commit-tx)
   ```

   Namespaces are required to define a context for modules when they are deployed on a network.

   This example also uses the `expect` built-in function to test the assertion that the keyset can be defined.

6. Add the `begin-tx` function before the module declaration, ans scroll to the bottom of the file and add the closing `commit-tx` function.
   
   ```pact
   (begin-tx "Crete module")
     (module payments "dev.admin-keyset"
   
       (defschema payments
         balance:decimal
         keyset:guard)
   
       (deftable payments-table:{payments})
   
       (defun create-account:string (id:string initial-balance:decimal keyset:guard)
         (enforce-guard "dev.admin-keyset")
         (enforce (>= initial-balance 0.0) "Initial balances must be >= 0.")
         (insert payments-table id
           { "balance": initial-balance,
             "keyset": keyset })
       )
   
       (defun get-balance:decimal (id:string)
         (with-read payments-table id
           { "balance":= balance, "keyset":= keyset }
           (enforce-one "Access denied"
           [(enforce-guard keyset)
            (enforce-guard "dev.admin-keyset")])
         balance)
       )
   
       (defun pay:string (from:string to:string amount:decimal)
         (with-read payments-table from { "balance":= from-bal, "keyset":= keyset }  
           (enforce-guard keyset)
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
   (create-table payments-table)
   (commit-tx)
   ```

7. Add a transaction for testing that only the administrator can create accounts.
   
   ```pact
   (begin-tx "Test creating account")   
   ;; Call the payments module into scope for this transaction.
     (use payments)
     ;; Clear keys from the environment.
     (env-keys [""])
     ;; Define the keysets for Sarah and James.
     (env-data { 
       "sarah-keyset": {"keys": ["sarah-key"]},
       "james-keyset": {"keys": ["james-key"]}})
   
     ;; Try creating the Sarah account without the admin keyset defined.
     (expect-failure "Admin Keyset is missing" "Keyset failure (keys-all): [admin-pu...]" (create-account "Sarah" 100.25 (read-keyset "sarah-keyset")))
   
     (env-keys ["admin-public-key"])
     
     ;; Create the Sarah account the proper admin keyset defined.
      (expect "Admin Keyset is present" "Write succeeded" (create-account "Sarah" 100.25 (read-keyset "sarah-keyset")))
   
      ;; Create the James account with initial value of 250.0.
      (create-account "James" 250.0 (read-keyset "james-keyset"))
   
   (commit-tx)
   ```

7. Add a transaction for testing that one account can pay another account.
   
   ```pact
   (begin-tx "Test making a payment")
     (use payments)
     (env-keys ["sarah-key"])
     (pay "Sarah" "James" 25.0)
   (commit-tx)
   ```

7. Add a transaction for testing that an account owner can view the account balance.

   ```pact
   (begin-tx "Test reading balances")
     (use payments)
     (env-keys ["sarah-key"])
     ;; Read Sarah's balance as Sarah.
     (format "Sarah's balance is {}" [(get-balance "Sarah")])
   
     (env-keys ["james-key"])
     ;; Read James' balance as James.
     (format "James's balance is {}" [(get-balance "James")])
   (commit-tx)
   ```

8. Open a terminal shell on your computer and test execution by running the following command:
   
   ```bash
   pact test-simple-payment.repl --trace
   ```

   You should see output similar to the following:

   ```bash
   test-simple-payment.repl:1:0-7:1:Trace: "Setting transaction data"
   test-simple-payment.repl:9:0-13:1:Trace: "Setting transaction signatures/caps"
   test-simple-payment.repl:15:0-15:42:Trace: "Begin Tx 0 Define a namespace and keyset"
   test-simple-payment.repl:17:2-17:84:Trace: "Namespace defined: dev"
   test-simple-payment.repl:18:2-18:19:Trace: "Namespace set to dev"
   test-simple-payment.repl:19:2-22:68:Trace: "Expect: success A keyset can be defined"
   test-simple-payment.repl:23:0-23:11:Trace: "Commit Tx 0 Define a namespace and keyset"
   test-simple-payment.repl:25:0-25:25:Trace: "Begin Tx 1 Crete module"
   test-simple-payment.repl:26:2-65:3:Trace: Loaded module payments, hash Y5S8S1dbBPRER7kbAWxXnowfOjQ7pwPywwwmIidAPTE
   test-simple-payment.repl:66:0-66:29:Trace: "TableCreated"
   test-simple-payment.repl:67:0-67:11:Trace: "Commit Tx 1 Crete module"
   test-simple-payment.repl:69:0-69:34:Trace: "Begin Tx 2 Test creating account"
   test-simple-payment.repl:71:2-71:16:Trace: Loaded imports from payments
   test-simple-payment.repl:73:2-73:17:Trace: "Setting transaction keys"
   test-simple-payment.repl:75:2-77:45:Trace: "Setting transaction data"
   test-simple-payment.repl:80:0-80:146:Trace: "Expect failure: Success: Admin Keyset is missing"
   test-simple-payment.repl:82:0-82:31:Trace: "Setting transaction keys"
   test-simple-payment.repl:85:0-85:113:Trace: "Expect: success Admin Keyset is present"
   test-simple-payment.repl:88:0-88:59:Trace: "Write succeeded"
   test-simple-payment.repl:90:0-90:11:Trace: "Commit Tx 2 Test creating account"
   test-simple-payment.repl:92:0-92:34:Trace: "Begin Tx 3 Test making a payment"
   test-simple-payment.repl:93:2-93:16:Trace: Loaded imports from payments
   test-simple-payment.repl:94:2-94:26:Trace: "Setting transaction keys"
   test-simple-payment.repl:95:2-95:28:Trace: "Sarah paid James 25.0"
   test-simple-payment.repl:96:0-96:11:Trace: "Commit Tx 3 Test making a payment"
   test-simple-payment.repl:98:0-98:34:Trace: "Begin Tx 4 Test reading balances"
   test-simple-payment.repl:99:2-99:16:Trace: Loaded imports from payments
   test-simple-payment.repl:100:2-100:26:Trace: "Setting transaction keys"
   test-simple-payment.repl:102:2-102:58:Trace: "Sarah's balance is 75.25"
   test-simple-payment.repl:104:2-104:26:Trace: "Setting transaction keys"
   test-simple-payment.repl:106:2-106:58:Trace: "James's balance is 275.0"
   test-simple-payment.repl:107:0-107:11:Trace: "Commit Tx 4 Test reading balances"
   Load successful
   ```

   This sample test file demonstrates adding REPL built-in functions around the Pact code. 
   A more common approach to testing Pact modules involves separating environment data into an `init.repl` file and then loading the `init.repl` file and the Pact `.pact` module file for more streamlined testing.
   For examples of other ways to test the `simple-payment.pact` module, see: 
   
   - [`simple-payment.repl`](https://github.com/kadena-docs/pact-coding-projects/blob/main/01-simple-payment/simple-payment.repl) demonstrates _loading_ a Pact module to test its functions rather than including the module in the `.repl` file.
   - [init.repl](https://github.com/kadena-docs/pact-coding-projects/blob/main/init.repl) demonstrates creating a separate `.repl` file for setting up environment data outside of the module.
   - [use-init-simple-payment.repl](https://github.com/kadena-docs/pact-coding-projects/blob/main/01-simple-payment/use-init-simple-payment.repl) demonstrates a `.repl` file that uses the `init.repl` file.

## Deploy the contract

After testing the contract using the Pact interpreter and the REPL file, you can deploy the contract on your local development network or the Kadena test network.

However, you must deploy to an existing namespace—such as the `free` namespace—or a registered [principal namespace](/guides/transactions/howto-namespace-tx) to deploy on any Kadena network.
If you want to deploy in an existing namespace, you must also ensure that your module name and keyset name are unique across all of the modules that exist in that namespace.

### Prepare to deploy

To deploy to the `free` namespace:

- Remove the `define-namespace` function.
- Replace all occurrences of the custom `"dev"` namespace with `"free"`.
- Modify the module and keyset names to make them unique in the `free` namespace.
  
  ```pact
  (namespace "free")
  (define-keyset "free.pistolas-project" (read-keyset "pistolas-project"))
  (module pistolas-payments "free.pistolas-project" ...)
  ```

To deploy to a private namespace:

- Modify the `define-namespace` function to use the `ns.create-principal-namespace` function to define a unique principal namespace for your public key.
- Replace all occurrences of the custom `"dev"` namespace with a principal namespace similar to the following `"n_1cc1f83c56f53b8865cc23a61e36d4b17e73ce9e"`.

In general, the best practice is to create a principal namespace for all of your modules and keysets.

### Verify network, chain, and account information

Before you deploy on the local development network, verify the following:

- The development network is currently running on your local computer.

- You have at least one **account** with **funds** on at least one **chain** in the development network. 
   
  If you don't have keys and at least one account on any chain on the network, you need to generate keys, create an account, and fund the account on at least one chain before continuing.

- You have the public key for the account on the chain where you have funds.

### Create a principal namespace

For this coding project, you can define a principal namespace by executing a transaction using the following `simple-define-namespace.ktpl` transaction template.

```yaml
code: |-
  (define-namespace (ns.create-principal-namespace (read-keyset "k")) (read-keyset "k") (read-keyset "k"))
data:
  {
    "k": [
        "{{public-key}}"
    ]
  }
meta:
  chainId: "{{chain-id}}"
  sender: "{{{sender-account}}}"
  gasLimit: 80300
  gasPrice: 0.000001
  ttl: 600
signers:
  - public: "{{public-key}}"
    caps:
      - name: "coin.GAS"
        args: []
networkId: "{{network-id}}"
```

You can use `kadena tx add` to replace the variables in the template with the values for your public key, sender account, chain, and network.
For example:

```sh
? Which template do you want to use: simple-define-namespace.ktpl
? File path of data to use for template .json or .yaml (optional):
? Template value public-key:
a6731ce787ece3941fcf28ce6ccf58150b55a23310e242f4bcb0498c93119689
? Template value chain-id: 3
? Template value sender-account:
k:a6731ce787ece3941fcf28ce6ccf58150b55a23310e242f4bcb0498c93119689
? Template value network-id: development
? Where do you want to save the output: myNamespace
```

After you save the transaction to a file, you can use `kadena tx sign` to sign the transaction with your wallet password or public and secret keys.

After signing the transaction, you can use `kadena tx send` to send the transaction to the blockchain network.

After the transaction is complete, copy the principal namespace from the transaction results and use it to replace all occurrences of the original `"dev"` namespace.

```pact
(namespace "n_1cc1f83c56f53b8865cc23a61e36d4b17e73ce9e")
(define-keyset "n_1cc1f83c56f53b8865cc23a61e36d4b17e73ce9e.admin-keyset" (read-keyset "admin-keyset"))
(module payments "n_1cc1f83c56f53b8865cc23a61e36d4b17e73ce9e.admin-keyset" ...)
```

### Create a deployment transaction

You can deploy the `simple-payment.pact` module on the local development network using the same workflow of `kadena tx add`, `sign`, and `send` commands that you used to execute the `define-namespace` transaction.

To deploy the module:

1. Create a new transaction template named `simple-payment.ktpl` in the `~/.kadena/transaction-templates` folder.
   
   ```sh
   cd ~/.kadena/transaction-templates
   touch simple-payment.ktpl
   ```

2. Open the `simple-payment.ktpl` file in a code editor and create a reusable transaction request in YAML format similar to the following to specify the path to the `simple-payment.pact` file that contains your Pact module code.
   
   ```pact
   codeFile: "../../simple-payment.pact"
   data:
     admin-keyset:
       keys: ["{{public-key}}"]
       pred: "keys-all"
   meta:
     chainId: "{{chain-id}}"
     sender: "{{{sender-account}}}"
     gasLimit: 80300
     gasPrice: 0.000001
     ttl: 600
   signers:
     - public: "{{public-key}}"
       caps: []
   networkId: "{{network-id}}"
   ```

3. Create a transaction that uses the template by running the `kadena tx add` command and following the prompts displayed.

   For example:

   ```sh
   ? Which template do you want to use: simple-payment.ktpl
   ? File path of data to use for template .json or .yaml (optional):
   ? Template value public-key: a6731ce7...93119689
   ? Template value chain-id: 3
   ? Template value sender-account: k:a6731ce7...93119689
   ? Template value network-id: development
   ? Where do you want to save the output: deploy-simple-payment
   ```

   In this example, the unsigned transaction is saved in a `deploy-simple-payment.json` file.

4. Sign the transaction by running the `kadena tx sign` command and following the prompts displayed to sign with a wallet account or a public and secret key pair.
   
   For example:

   ```sh
   ? Select an action: Sign with wallet
   ? Select a transaction file: Transaction: deploy-simple-payment.json
   ? 1 wallets found containing the keys for signing this transaction, please select a wallet to sign this transaction with first: Wallet: pistolas
   ? Enter the wallet password: ********
   ```

5. Send the transaction by running the `kadena tx send` command and following the prompts displayed.
   
   After the transaction is complete, you should see the message `TableCreated` in the transaction results.

### Create additional transactions

After you deploy the module, you can create additional transactions to verify contract functions running on the development network.
For example, you can create a transaction template for the `payments.create-account` function similar to the following:

```yaml
code: |-
   (n_1cc1f83c56f53b8865cc23a61e36d4b17e73ce9e.payments.create-account "{{{new-account-name}}}" {{balance}} (read-keyset "account-guard"))
data:
   account-guard:
      keys:
      - {{{publicKey}}}
      pred: "keys-all"
meta:
   chainId: "{{chain-id}}"
   sender: "k:a6731ce787ece3941fcf28ce6ccf58150b55a23310e242f4bcb0498c93119689"
   gasLimit: 2000
   gasPrice: 0.00000001
   ttl: 7200
signers:
   - public: "a6731ce787ece3941fcf28ce6ccf58150b55a23310e242f4bcb0498c93119689"
      caps: []
networkId: "{{network:networkId}}"
type: exec
```
   
With this template, you can create an account for Sarah with an initial balance of 100.25 and an account for James with an initial balance of 250.0, equivalent to executing calls like the following in the Pact REPL:

```pact
(dev.payments.create-account "Sarah" 100.25 (read-keyset "sarah-keyset"))
"Write succeeded"
     
(dev.payments.create-account "James" 250.0 (read-keyset "james-keyset"))
"Write succeeded"
```

You can also create transaction templates for the `pay` and `get-balance` functions.
For example, you can create a transaction for the `pay` function with a template similar to the following:

```yaml
code: |-
  (n_1cc1f83c56f53b8865cc23a61e36d4b17e73ce9e.payments.pay "{{sender-id}}" "{{receiver-id}}" {{amount}})
data:
meta:
  chainId: "{{chain-id}}"
  sender: "{{sender-k-account}}"
  gasLimit: 2000
  gasPrice: 0.00000001
  ttl: 7200
signers:
  - public: "{{sender-publicKey}}"
    caps: []
networkId: "{{network:networkId}}"
type: exec
```

With this template, you can create an transaction for Sarah to pay James 25.0, equivalent to executing the following call in the Pact REPL:
     
```pact
(dev.payments.pay "Sarah" "James" 25.0)
"Sarah paid James 25.0"
```

However, this transaction requires the account associated with Sarah to have an account and funds to pay for the transaction on the chain you specify.
The account must also be associated with a wallet that you've created or imported into the Kadena CLI local development environment.

Similarly, you can create a transaction for the `get-balance` function with a template similar to the following:

```yaml
code: |-
  (format "Sarah's balance is {}" [(n_1cc1f83c56f53b8865cc23a61e36d4b17e73ce9e.payments.get-balance "{{simple-payments-id}}")])
data:
meta:
  chainId: "{{chain-id}}"
  sender: "{{sender-k-account}}"
  gasLimit: 2000
  gasPrice: 0.00000001
  ttl: 7200
signers:
  - public: "{{sender-publicKey}}"
    caps: []
networkId: "{{network:networkId}}"
type: exec
```

With this template, you can create separate transactions for getting the balance for Sarah and getting the balance for James, equivalent to executing the following calls in the Pact REPL:

```pact
(format "Sarah's balance is {}" [(dev.payments.get-balance "Sarah")])
"Sarah's balance is 75.25"
     
(format "James's balance is {}" [(dev.payments.get-balance "James")])
"James's balance is 275.0"
```

## Next steps

Congratulations, you've just completed the _Simple payments_ coding project.
You'll see similar patterns in other coding projects, with each project introducing new features, Pact syntax, or alternative coding models.
The coding projects are also intended to complement and reinforce concepts and examples presented in other parts of the documentation.
Follow the links embedded in each project to learn more.