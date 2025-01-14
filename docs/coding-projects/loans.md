---
title: Loans in multiple tables
description: "Learn how to build smart contracts that allow users to create, distribute, and manage loan information."
id: loans
sidebar_position: 5
---

# Loans in multiple tables

The _Loans and database management_ project is designed to demonstrate working with multiple tables and writing more complex functions to build more complete applications.
For this project, you'll build a smart contract with tables for adding and manipulating loan information with secure interactions for module administrators.

For this project, you'll create three tables in the `loans` module:

- A `loan` table for storing loan holder information.
- A `loan-history` table for tracking loan history.
- A `loan-inventory` table for holding the loan inventory balance.

![Loans project overview](/img/docs-loans.png)

## Before you begin

Before starting this project, verify your environment meets the following basic requirements:

- You have a GitHub account and can run `git` commands.
- You have installed the Pact programming language and command-line interpreter.
- You have installed the `kadena-cli` package and have a working directory with initial configuration settings.
- You have a local development node that you can connect to that runs the `chainweb-node` program, either in a Docker container or on a physical or virtual computer.
- You should be familiar with defining modules and using keysets.

## Get the starter code

To get started:

1. Open a terminal shell on your computer.

2. Clone the `pact-coding-projects` repository by running the following command:

   ```bash
   git clone https://github.com/kadena-docs/pact-coding-projects.git
   ```

3. Change to the `05-loans` directory by running the following command:

   ```bash
   cd pact-coding-projects/05-loans
   ```

   If you list the contents of this directory, you'll see the following files:

   - `starter-loans.pact` provides a starting point with the framework for building the `loans` module.
   - `project-steps` provides solutions and test cases for completing each part of the coding project.
   - `finished-contracts` provides the final code for the `loans.pact` module and the final `loans.repl` test cases for verifying module functions.

4. Open and review the `starter-loans.pact` file.

   This file outlines the tasks you need to complete for the _Loans_ project.
   Follow the embedded instructions to work through the coding challenges on your own or use the detailed instructions and code provided in the next sections.

## Define the module and keyset

As you might have seen in other coding projects, the first step in creating a new module requires defining or identifying a namespace and an administrative owner for the module.

To start the module declaration:

1. Open the `starter-loans.pact` file in your code editor and save it as `loans.pact`.

1. Specify the namespace and a define a keyset for the module to use.

   ```pact
   (namespace "free")
     (define-keyset "free.loans-admin" (read-keyset "loan-admin-keyset"))
   ```

1. Define the `loans` module governed by the `LOAN_ADMIN` capability and enforced to use the free.loans-admin keyset:

   ```pact
   (module loans LOAN_ADMIN
      (defcap LOAN_ADMIN ()
        (enforce-guard "free.loans.loans-admin"))

   )
   ```

2. Create a `loans.repl` file in you code editor to prepare the environment for testing the `loans` module.

   For example, add test keys and data to define the namespace in your working environment and to load the module:

   ```pact
   (env-keys ["loan-admin-keyset"])
   (env-data { "loans-admin":
     { "keys": ["loan-admin-keyset"], "pred": "keys-all" } })

   (begin-tx "Define namespace")
     (define-namespace "free" (read-keyset "loans-admin" ) (read-keyset "loans-admin" ))
   (commit-tx)

   (begin-tx)
     (load "loans.pact")
   (commit-tx)
   ```

## Define the schemas and tables

To define the schemas and tables:

1. Open the `loans.pact` file in your code editor.

2. Define the `loan` schema and the table that uses the `loan` schema.

   ```pact
     (defschema loan
        loanName:string
        entityName:string
        loanAmount:integer
        status:string
     )

     (deftable loans:{loan})
   ```

2. Define the `loan-history` schema and the table that uses the `loan-history` schema.

   ```pact
     (defschema loan-history
        loanId:string
        buyer:string
        seller:string
        amount:integer
     )

     (deftable loan-history-table:{loan-history})
   ```

2. Define the `loan-inventory` schema and the table that uses the `loan-inventory` schema.

   ```pact
     (defschema loan-inventory
       balance:integer
     )

     (deftable loan-inventory-table:{loan-inventory})
   ```

## Define constants

To define the constants for loan status:

1. Define an `INITIATED` constant that contains the status description for loans that have been initiated using the "initiated" comment.

   ```pact
   (defconst INITIATED "initiated")
   ```

2. Define an `ASSIGNED` constant that contains the status description for loans that have been assigned using the "assigned" comment.

   ```pact
   (defconst ASSIGNED "assigned")
   ```

## Define functions

For this coding project, the `loans` module provides ten functions to provide comprehensive features for loan management.
You can define them in any order.

- `inventory-key` takes `loanId:string` and `owner:string`to create a composite key of `loanId:owner`.
- `create-a-loan` takes `loanId`, `loanName`, `entityName`, and `loanAmount` to create a loan entry.
- `assign-a-loan` takes `txid`, `loanId`, `buyer`, and `amount` to assign a loan.
- `sell-a-loan` takes `txid`, `loanId`, `buyer`, `seller`, and `amount` to sell a loan.
- `read-a-loan` takes `loanId` to read values from the `loans-table` for a given `loanId`.
- `read-loan-tx` maps the values from the `loans` table to  the txids in the "loans" table at value 0.
- `read-all-loans` select all values from the `loans-table` with `constantly` set to true.
- `read-inventory-pair` takes `key` to set `inventory-key` and `balance` the provided `key`.
- `read-loan-inventory` maps the value of `read-inventory-pair` to the keys of the `loan-inventory-table`.
- `read-loans-with-status` takes `status` to select all values from the `loans-table` where `status` equals the provided `status`.

### Define the inventory-key function

To define the `inventory-key` function:

1. Open the `loans.pact` file in your code editor.

2. Start the `inventory-key` function definition with the keyword `defun` and add the parameters `loanId:string` `owner:string`.

   ```pact
   (defun inventory-key (loanId:string owner:string)

   )
   ```

3. Create a composite key from the `owner` and `loanId` in the format `loanId:owner`.

   ```pact
   (defun inventory-key (loanId:string owner:string)
      (format "{}:{}" [loanId owner])
   )
   ```

### Define the create-a-loan function

To define the `create-a-loan` function:

1. Open the `loans.pact` file in your code editor.

2. Start the `create-a-loan` function with the parameters `loanId`, `loanName`, `entityName`, and `loanAmount`.

3. Insert the values for the new loan `loanId` into the `loans` table.

   ```pact
   (defun create-a-loan (loanId:string loanName:string entityName:string loanAmount:integer)
     (insert loans loanId {
       "loanName":loanName,
       "entityName":entityName,
       "loanAmount":loanAmount,
       "status":INITIATED
      })
   )
   ```

4. Insert the values for a new loan into the `loan-inventory` table.

   ```pact
   (defun create-a-loan (loanId:string loanName:string entityName:string loanAmount:integer)
     (insert loans loanId {
        "loanName":loanName,
        "entityName":entityName,
        "loanAmount":loanAmount,
        "status":INITIATED
     })

     (insert loan-inventory-table (inventory-key:string loanId:string entityName:string){
        "balance": loanAmount
     })
   )
   ```

### Define the assign-a-loan function

To define the `assign-a-loan` function:

1. Open the `loans.pact` file in your code editor.

2. Start the `assign-a-loan` function with the parameters `txid`, `loanId`, `buyer`, and `amount`.

3. Read from the `loans` table using `loanId` and bind variables to the column values.

   ```pact
   (defun assign-a-loan (txid loanId buyer amount)
     (with-read loans loanId {
       "entityName":= entityName,
       "loanAmount":= issuerBalance
      }

     )
   ```

1. Insert values into `loan-history-table` using the value of the `txid` parameter.

   ```pact
     (insert loan-history-table txid {
       "loanId":loanId,
       "buyer":buyer,
       "seller":entityName,
       "amount": amount}
     )
   ```

1. Insert values into the `loan-inventory-table` with the parameters `inventory-key`, `loanId`, and `buyer`.

   ```pact
     (insert loan-inventory-table (inventory-key loanId buyer) {
       "balance":amount
      })

1. Update the `loan-inventory-table` for the row matching the parameters `inventory-key`, `loanId`, and `entityName` with the new balance of the issuer.

   ```pact
     (update loan-inventory-table (inventory-key loanId entityName){
       "balance": (- issuerBalance amount)
      }))
   ```

2. Update the `status` in the `loans` table for the specified `loanId`.

   ```pact
     (update loans-table loanId {
      "status": ASSIGNED
      })
   ```

If you want to test the functions that you've defined so far, you can update the `loans.pact` file to create the tables and the `loans.repl` file with transactions that call the functions.
If you aren't sure how to make these changes, continue defining the functions, then follow the steps in [Test functions in the REPL](#test-functions-in-the-repl).

### Define the sell-a-loan function

To define the `sell-a-loan` function:

1. Open the `loans.pact` file in your code editor.

2. Start the `sell-a-loan` function with the parameters `txid`, `loanId`, `buyer`, `seller`, and `amount`.

3. Read from the `loan-inventory-table` table using the parameters `inventory-key`, `loanId`, and `seller` and bind `balance` to value of `prev-seller-balance`.

   ```pact
     (defun sell-a-loan (txid loanId buyer seller amount)
       (with-read loan-inventory-table (inventory-key loanId seller)
         {"balance":= prev-seller-balance}
1. Read from the `loan-inventory-table` using the  parameters `inventory-key`, `loanId`, and `buyer`, assign balance to 0, and bind `balance` to value of `prev-buyer-balance`.

   ```pact
     (with-default-read loan-inventory-table (inventory-key loanId buyer)
         {"balance" : 0}
         {"balance":= prev-buyer-balance}
   ```

1. Insert values into the `loan-history-table` at the given `txid`.

   ```pact
     (insert loan-history-table txid {
        "loanId":loanId,
        "buyer":buyer,
        "seller":seller,
        "amount": amount
      })
   ```

1. Update the `loan-inventory-table` with the parameters `inventory-key`, `loanId`, and `seller`, and set the `balance` to the `previous-seller-balance` minus the `amount`.

   ```pact
     (update loan-inventory-table (inventory-key loanId seller)
       {"balance": (- prev-seller-balance amount)})
   ```

1. Write to the `loan-inventory-table` with the parameters `inventory-key`, `loanId`, and `buyer`, set the `balance` to the `previous-buyer-balance` plus the `amount`.


   ```pact
     (write loan-inventory-table (inventory-key loanId buyer)
       {"balance": (+ prev-buyer-balance amount)})))
      )
   ```

### Define the read-a-loan function

To define the `read-a-loan` function:

1. Open the `loans.pact` file in your code editor.

2. Start the `read-a-loan` function with the parameter `loanId`.

3. Read all of the values from the `loans` table at the given `loanId`.

   ```pact
     (defun read-a-loan (loanId:string)
       (read loans loanId))
   ```

### Define the read-loan-tx function

To define the `read-loan-tx` function:

1. Open the `loans.pact` file in your code editor.

2. Start the `read-loan-tx` function with no parameters.

3. Map the values of the transaction log in the `loans` table to the `txids` in the `loans` table at value 0.

   ```pact
     (defun read-loan-tx ()
       (map (txlog loans) (txids loans 0)))
   ```

### Define the read-all-loans function

To define the `read-all-loans` function:

1. Open the `loans.pact` file in your code editor.

2. Start the `read-all-loans` function with no parameters.

1. Select all values from the `loans` table that have `constantly` set to true.

   ```pact
     (defun read-all-loans ()
       (select loans (constantly true)))
   ```

### Define the read-inventory-pair function

To define the `read-inventory-pair` function:

1. Open the `loans.pact` file in your code editor.

2. Start the `read-inventory-pair` function with the parameter `key`.

3. Set the `inventory-key` to the provided `key`.

4. Set the `balance` value of the balance in the `loan-inventory-table` to the value of the `key`.

   ```pact
     (defun read-inventory-pair (key)
       {"inventory-key":key,
        "balance": (at 'balance (read loan-inventory-table key))}
     )
   ```

### Define the read-loan-inventory function

To define the `read-loan-inventory` function:

1. Open the `loans.pact` file in your code editor.

2. Start the `read-loan-inventory` function with no parameters.

3. Map the value of the `read-inventory-pair` to the `keys` in the `loan-inventory-table`.

   ```pact
   (defun read-loan-inventory ()
     (map (read-inventory-pair) (keys loan-inventory-table)))
   ```

### Define the read-loans-with-status function

To define the `read-loans-with-status` function:

1. Open the `loans.pact` file in your code editor.

2. Start the `read-loans-with-status` function that takes the parameter `status`.

3. Select all values from the `loans` table where the status equals the `status` parameter.

   ```pact
   (defun read-loans-with-status (status)
     (select loans-table (where "status" (= status)))
   ```

## Complete the module declaration

Complete the `loans` module by closing the module declaration and create the tables.

To complete the `loans` module:

1. Finish the module declaration with a closing parenthesis, if you haven't already done so.

   ```pact
   )
   (create-table accounts-table)
   ```

2. Create the tables defined for the module declaration, if you haven't already done so.

   ```pact
   (create-table loans)
   (create-table loan-inventory-table)
   (create-table loan-history-table)
   ```

## Test functions in the REPL

To test the loans module, you need to add transactions to the `loans.repl` file.

To test the functions in the `loans.pact` file:

1. Open the `loans.repl` file.

2. Add a transaction that loads the `loans.pact` file and calls the functions that update loan tables similar to the following:

   ```pact
   (begin-tx "Call functions that update loan tables")
     (load "loans.pact")
     (inventory-key "loanId-1" "Las Pistolas") ;; loanId, owner
     (create-a-loan "loanId-1" "Ponderosa" "Valley Credit" 16000) ;; loanId, loanName, entity, amount
     (assign-a-loan "txid-1" "loanId-1" "Studio Funding" 10000) ;; loanId, buyer, amount
     (sell-a-loan "txid-2" "loanId-1" "buyer2" "Studio Funding" 2000) ;; loanId, seller, buyer, amount
   (commit-tx)
   ```

   Because you're loading the module and calling the functions in the same transaction, you don't need to include the namespace and module name to call the functions.

3. Add a transaction that calls the functions that read loan information from table similar to the following:

   ```pact
   (begin-tx "Call functions that read loan information")
      (use free.loans)
      (create-a-loan "loanId-2" "Renovation" "RiverBank" 140000)
      (read-a-loan "loanId-1")
      (read-all-loans)
      (read-loan-inventory)
      (read-loans-with-status INITIATED)
      (read-loans-with-status ASSIGNED)
   (commit-tx)
   ```

   In this example, you specify the module where the functions are defined using the namespace and module name.

4. Add transactions that call the individual functions similar to the following:

   ```pact
   (begin-tx "Test inventory-key function")
     (free.loans.inventory-key "loanId-3" "Pistolas")
   (commit-tx)

   (begin-tx "Test create-a-loan function")
     (free.loans.create-a-loan "loanId-3" "Pistolas" "Capital Bank" 11000)
   (commit-tx)

   (begin-tx "Test assign-a-loan function")
     (free.loans.assign-a-loan "txid-3" "loanId-3" "Buyer 1" 10000) ;; loanId, buyer, amount
   (commit-tx)
   ```

   In this example, you must specify the module where the functions are defined using the namespace and module name.

5. Open a terminal shell on your computer and test execution by running the following command:

   ```bash
   pact --trace loans.repl
   ```

   You should see that the transactions are successful with output similar to the following:

   ```pact
   ...
   loans.pact:4:3:Trace: Loaded module free.loans, hash 6SCj9hDm0ANSVOqbmY3gwF4SXg9BaRi-7cV8-FbqJDY
   loans.pact:162:0:Trace: TableCreated
   loans.pact:163:0:Trace: TableCreated
   loans.pact:164:0:Trace: TableCreated
   loans.repl:11:2:Trace: loanId-1:Las Pistolas
   loans.repl:12:2:Trace: Write succeeded
   loans.repl:13:2:Trace: Write succeeded
   loans.repl:14:2:Trace: Write succeeded
   loans.repl:15:0:Trace: Commit Tx 1: Call functions that update loan tables
   loans.repl:17:0:Trace: Begin Tx 2: Call functions that read loan information
   loans.repl:18:3:Trace: Using free.loans
   loans.repl:19:3:Trace: Write succeeded
   loans.repl:20:3:Trace: {"entityName": "Valley Credit","loanAmount": 16000,"loanName": "Ponderosa","status": "assigned"}
   loans.repl:21:3:Trace: [{"entityName": "Valley Credit","loanAmount": 16000,"loanName": "Ponderosa","status": "assigned"} {"entityName": "RiverBank","loanAmount": 140000,"loanName": "Renovation","status": "initiated"}]
   loans.repl:22:3:Trace: [{"inventory-key": "loanId-1:Studio Funding","balance": 8000} {"inventory-key": "loanId-1:Valley Credit","balance": 6000} {"inventory-key": "loanId-1:buyer2","balance": 2000} {"inventory-key": "loanId-2:RiverBank","balance": 140000}]
   loans.repl:23:3:Trace: [{"entityName": "RiverBank","loanAmount": 140000,"loanName": "Renovation","status": "initiated"}]
   loans.repl:24:3:Trace: [{"entityName": "Valley Credit","loanAmount": 16000,"loanName": "Ponderosa","status": "assigned"}]
   loans.repl:25:0:Trace: Commit Tx 2: Call functions that read loan information
   loans.repl:27:0:Trace: Begin Tx 3: Test inventory-key function
   loans.repl:28:2:Trace: loanId-3:Pistolas
   loans.repl:29:0:Trace: Commit Tx 3: Test inventory-key function
   loans.repl:31:0:Trace: Begin Tx 4: Test create-a-loan function
   loans.repl:32:2:Trace: Write succeeded
   loans.repl:33:0:Trace: Commit Tx 4: Test create-a-loan function
   loans.repl:35:0:Trace: Begin Tx 5: Test assign-a-loan function
   loans.repl:36:2:Trace: Write succeeded
   loans.repl:37:0:Trace: Commit Tx 5: Test assign-a-loan function
   Load successful
   ```

1. Ensure that the REPL output aligns with expected results.

## Review

You have now built and tested a smart contract that manipulates loan information in three tables with a robust set of functions.
