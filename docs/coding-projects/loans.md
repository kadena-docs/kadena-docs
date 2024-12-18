---
title: Loans
description: "Learn how to build smart contracts that allow users to create, distribute, and manage loan information."
id: loans
sidebar_position: 5
---

# Loans

The _Loans_ project is designed to demonstrate working with multiple tables and writing more complex functions to build more complete applications.
For this project, you'll build a smart contract with tables for adding and manipulating loan information with secure interactions for module administrators. 

For this project, you'll create three tables in the `loans` module:

- A `loan` table for storing loan holder information.
- A `loan-history` table for tracking loan history.
- A `loan-inventory` table for holding the loan inventory balance.

![Loans project overview](/img/loans-overview.jpg)

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

   - `starter-loan.pact` provides a starting point with the framework for building the `loans` module.
   - `loans.pact` provides the final code for the `loans` module.
   - `loans.repl` includes test cases for verifying module functions.

4. Open and review the `starter-loan.pact` file.

   This file outlines the tasks you need to complete for the _Loans_ project.
   Follow the embedded instructions to work through the coding challenges on your own or use the detailed instructions provided in the next sections.

## Define the module administrator

1. Define keysets in the `auth.pact` file is to define the keysets that control the module's access and operation.

   ```pact
   ;; define-keysets
   (define-keyset "free.module-admin" (read-keyset "module-admin-keyset"))
   (define-keyset "free.operate-admin" (read-keyset "module-operate-keyset"))
   ```

   These keysets will help manage access control throughout the contract.

1. Create the `auth` module to handle user authentication and management.
   
   ```pact
   (module auth "free.module-admin"
   ```

1. Define the schema and table for managing user data.

   ```pact
     (defschema user
       nickname:string
       keyset:keyset)
     
     (deftable users:{user})
   ```

2. Define the `create-user` function that `operate-admin` keyset owners can execute to add new users to the `auth` module.

   ```pact
     (defun create-user (id nickname keyset)
       (enforce-keyset "free.operate-admin")
       (insert users id {
         "keyset": (read-keyset keyset),
         "nickname": nickname
       })
     )
   ```

3. Define the `enforce-user-auth` function that ensures a user is authorized for a specific operation.

   ```pact
     (defun enforce-user-auth (id)
       (with-read users id { "keyset":= k }
         (enforce-keyset k)
       )
     )
   ```

4. Complete the `auth` module by closing the module declaration and create the table.

   ```pact
   )
   (create-table users)
   ```

## Define the payments module

1. Define a keyset in the `payments.pact` file that will manage this module.

   ```pact
   (define-keyset "free.admin-keyset" (read-keyset "admin-keyset"))
   ```

1. Start the `payments` module declaration and use the `auth` module.

   ```pact
   (module payments "free.admin-keyset"
   
     (use auth)
   ```

1. Define the schema and table for account management.

   ```pact
     (defschema accounts balance:decimal)
     (deftable accounts-table:{accounts})
   ```

1. Define the `create-account` function to set up a new account, ensuring the user is authorized.

   ```pact
     (defun create-account (userId initial-balance)
       (enforce-user-auth userId)
       (enforce (>= initial-balance 0.0) "Initial balances must be >= 0.")
       (insert accounts-table userId
         { "balance": initial-balance })
     )
   ```

1.  Define the `get-balance` function to retrieve the balance for an account, ensuring authorization.

   ```pact
     (defun get-balance (userId)
       (enforce-user-auth 'admin)
       (with-read accounts-table userId
         { "balance":= balance }
         balance)
     )
   ```
2. Define the `pay` function to allow for transferring funds between accounts.

   ```pact
     (defun pay (from to amount)
       (with-read accounts-table from { "balance":= from-bal }
         (enforce-user-auth from)
         (with-read accounts-table to { "balance":= to-bal }
           (enforce (> amount 0.0) "Negative Transaction Amount")
           (enforce (>= from-bal amount) "Insufficient Funds")
           (update accounts-table from { "balance": (- from-bal amount) })
           (update accounts-table to { "balance": (+ to-bal amount) })
           (format "{} paid {} {}" [from to amount])
         )
       )
     )
   ```

1. Complete the `payments` module by closing the module declation and create the table.

   ```pact
   )
   (create-table accounts-table)
   ```

## Test interactions with the REPL File

1. Create a transaction in the `payments.repl` file that loads the `auth.pact` module.

   ```pact
   (begin-tx)
     (load "auth.pact")
   (commit-tx)
   ```

2. Create a transaction that loads the `payments.pact` module.

   ```pact
   (begin-tx)
     (load "payments.pact")
   (commit-tx)
   ```

3. Create a transaction that uses the `auth` module to create user accounts.

   ```pact
   (begin-tx)
     (use auth)
     (env-data {
       "admin-keyset": ["admin"],
       "sarah-keyset": ["sarah"],
       "james-keyset": ["james"]
     })
     (create-user "admin" "Administrator" 'admin-keyset)
     (create-user "Sarah" "Sarah" 'sarah-keyset)
     (create-user "James" "James" 'james-keyset)
   (commit-tx)
   ```

2. Create a transaction that uses the `payments` module to test transactions.

   ```pact
   (begin-tx)
     (use payments)
     (env-keys ["sarah"])
     (create-account "Sarah" 100.25)
     (env-keys ["james"])
     (create-account "James" 250.0)
     (pay "Sarah" "James" 25.0)
   (commit-tx)
   ```

1. Execute the `payments.repl` file with the following command:

   ```bash
   pact payments.repl --trace
   ```

Ensure that the REPL output aligns with expected results.

## Review

You have now built and tested a contract interaction setup using two modules, following a step-by-step approach. This tutorial covered user authentication and payment transactions across modules.

