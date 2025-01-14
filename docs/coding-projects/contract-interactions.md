---
title: Contract interactions
description: "Learn how to build smart contracts that allow users to authorize and make payments using multiple Pact modules."
id: contract-interactions
sidebar_position: 4
---

# Contract interactions

The _Contract interactions_ project is designed to demonstrate how you can import and use functions defined in one module in another module.
For this project, you'll build a smart contract with separate modules to handle user authorization and payments with secure interactions between the modules.
Secure contract interaction is a fundamental requirement for setting up more complex smart contracts.

For this project, you'll create two Pact modules:

- An `auth` module for handling user authentication
- A `payments` module for managing account balances and transactions

The `auth` module manages user authorization, while the `payments` module handles transferring value between two accounts—`Sarah` and `James`.

<img src="/img/docs-contract-interactions.png" alt="Contract interactions project overview" height="550" width="900"/>

In this tutorial, you'll learn the following:

- Understanding contract interactions in Pact
- Setting up multiple modules for authorization and payments
- Testing interactions in the REPL environment

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

3. Change to the `02-contract-interactions` directory by running the following command:

   ```bash
   cd pact-coding-projects/02-contract-interactions
   ```

   If you list the contents of this directory, you'll see the following files:

   - `starter-auth.pact` provides the framework for building the `auth` module.
   - `starter-payments.pact` provides the framework for building the `payments` module.
   - `contract-interactions.repl` includes test cases for verifying module interactions.

4. Open and review the `starter-auth.pact` and `starter-payments.pact` files.

   These files outline the tasks you need to complete for the _Contract Interactions_ project.
   Follow the embedded instructions to work through the coding challenges or use the detailed instructions provided in the next sections.

## Key concepts for contract interaction

In Pact, modules can call functions from other modules, enabling more complex contract setups. You’ll be using the following key Pact features:

- **load:** Load and evaluate a module.
- **use:** Import an existing module into a namespace.
- **function calls:** Invoke functions defined within other modules.

## Getting started

You’ll work with three main files:

- **auth.pact** - Responsible for authorizing users.
- **payments.pact** - Manages payments between users.
- **payments.repl** - Coordinates interactions between the modules.

## Define the auth module

1. Define two keysets in the `auth.pact` file to identify the keysets that have access to module operations.

   ```pact
   ;; define-keysets
   (define-keyset "free.module-admin" (read-keyset "module-admin-keyset"))
   (define-keyset "free.operate-admin" (read-keyset "module-operate-keyset"))
   ```

   These keysets will help manage access control throughout the contract.

2. Create the `auth` module to handle user authentication and management.

   ```pact
   (module auth "free.module-admin"
   ```

3. Define the schema and table for managing user data.

   ```pact
     (defschema user
       nickname:string
       keyset:guard)

     (deftable users:{user})
   ```

4. Define the `create-user` function that `operate-admin` keyset owners can execute to add new users to the `auth` module.

   ```pact
     (defun create-user (id:string nickname:string keyset:guard)
       (enforce-keyset "free.operate-admin")
       (insert users id {
         "keyset": (read-keyset keyset),
         "nickname": nickname
       })
     )
   ```

5. Define the `enforce-user-auth` function that ensures a user is authorized for a specific operation.

   ```pact
     (defun enforce-user-auth (id)
       (with-read users id { "keyset":= k }
         (enforce-keyset k)
       )
     )
   ```

6. Complete the `auth` module by closing the module declaration and create the table.

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
     (defun create-account (userId:string initial-balance:decimal)
       (enforce-user-auth userId)
       (enforce (>= initial-balance 0.0) "Initial balances must be >= 0.")
       (insert accounts-table userId
         { "balance": initial-balance })
     )
   ```

1. Define the `get-balance` function to retrieve the balance for an account from the database for an authorized user.

   ```pact
     (defun get-balance (userId:string)
       (enforce-user-auth 'admin)
       (with-read accounts-table userId
         { "balance":= balance }
         balance)
     )
   ```

2. Define the `pay` function to allow for transferring funds between accounts.

   ```pact
     (defun pay (from:string to:string amount:decimal)
       (with-read accounts-table from { "balance":= from-bal }
         (enforce-user-auth from)
         (with-read accounts-table to { "balance":= to-bal }
           (enforce (> amount 0.0) "Can't transfer a negative transaction amount.")
           (enforce (>= from-bal amount) "Insufficient funds")
           (update accounts-table from { "balance": (- from-bal amount) })
           (update accounts-table to { "balance": (+ to-bal amount) })
           (format "{} paid {} {}" [from to amount])
         )
       )
     )
   ```

1. Complete the `payments` module by closing the module declaration and create the table.

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

You have now built and tested a contract interaction setup using two modules, following a step-by-step approach.
This tutorial covered user authentication and payment transactions across modules.

