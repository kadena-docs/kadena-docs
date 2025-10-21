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

- An `auth` module for authorizing operations based on the `id` stored for the user in a table.
- A `payments` module for managing account balances and transferring value between accounts.

The following diagram provides an overview of the interaction between the modules.

![Contract interaction overview](/img/coding-projects/contract-interaction-overview.png)

To demonstrate contract interoperation, you'll also create test accounts for an administrator and two users, `Sarah` and `James`.

In this tutorial, you'll learn about the following topics:

- Calling contract functions defined in one module for use in another module.
- Setting up separate modules for authorization and payments.
- Testing contract interactions in the REPL environment.

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

3. Change to the `03-contract-interactions` directory by running the following command:

   ```bash
   cd pact-coding-projects/03-contract-interactions
   ```

   If you list the contents of this directory, you'll see that there are folders for `starter-contracts` and `finished-contracts`. 
   The `starter-contracts` folder includes the following files:

   - `auth.pact` provides the basic framework for coding the `auth` module.
   - `payments.pact` provides the basic framework for coding the `payments` module.
   - `starter-contract-interaction.pact` provides a framework overview of the complete coding project.
   - `contract-interaction.repl` provides the basic framework for building a `.repl` file with test cases for verifying module interactions.

4. Open and review the `starter-contract-interaction.pact` file for an overview of the tasks you need to complete for the _Contract Interactions_ project.
   Yo can follow the embedded instructions to work through the coding challenges on your own or use the detailed instructions provided in the next sections.

## Key concepts for contract interaction

In Pact, modules can call functions from other modules, enabling more complex contract setups. 
You’ll be using the following key Pact features:

- **load** to load and evaluate a module.
- **use** to import an existing module into a namespace.
- **function calls** to invoke functions in the one module that are defined in another module.

## Getting started

You’ll work with three main files:

- **auth.pact** - Responsible for authorizing users.
- **payments.pact** - Manages payments between users.
- **payments.repl** - Coordinates interactions between the modules.

## Define the auth module

As you might have seen in other coding projects, modules are defined in a **namespace** and are governed by either an administrative keyset or a governance capability.

To simplify the initial code required, this coding project assumes you are defining a custom `dev` namespace for local development.
As an alternative, you could use the `free` namespace.
The `free` namespace is a publicly-available namespace that you can use to deploy smart contracts on the Kadena test network.

The best practice is to create a unique **principal namespace** where you can deploy all of your modules.
If you have a principal namespace, use that namespace string instead of using the `dev` namespace.

To define the `auth` module:

1. Create an `auth.pact` file, then define and enter a custom, principal, or existing namespace.
   
   For example, add the following code to define a new `dev` namespace and make it your active namespace:

   ```pact
   (define-namespace "dev" (read-keyset "module-admin-keyset") (read-keyset "module-admin-keyset"))
   (namespace "dev")
   ```

2. Define two keysets in the `auth.pact` file to identify the keysets that have access to module operations.

   ```pact
   (define-keyset "dev.module-admin" (read-keyset "module-admin-keyset"))
   (define-keyset "dev.operate-admin" (read-keyset "module-operate-keyset"))
   ```

   These keysets will help manage access control throughout the contract.

3. Create the `auth` module with a governance capability that enforces the `module-admin` keyset guard.

   ```pact
   (module auth AUTH
     (defcap AUTH ()
       (enforce-guard "dev.module-admin"))
   ```

4. Define the schema and table for managing user data.

   ```pact
     (defschema user
       nickname:string
       keyset:guard)

     (deftable users:{user})
   ```

5. Define the `create-user` function that `operate-admin` keyset owners can execute to add new users to the `auth` module.

   ```pact
     (defun create-user:string (id:string nickname:string keyset:guard)
       (enforce-guard "dev.operate-admin")

       (insert users id {
         "keyset": keyset,
         "nickname": nickname
       })
     )
   ```

6. Define the `enforce-user-auth` function that ensures a user is authorized for a specific operation.

   ```pact
     (defun enforce-user-auth:guard (id:string)
       (with-read users id { "keyset":= k }
         (enforce-guard k)
       k)
     )
   ```

7. Complete the `auth` module by closing the module declaration and create the `users` table.

   ```pact
   )
   (create-table users)
   ```

## Define the payments module

1. Create a `payments.pact` file, then define and enter the same custom, principal, or existing namespace you're using for the `auth` module.

2. Define a keyset in the `payments.pact` file that will manage this module.

   ```pact
   (define-keyset "dev.module-admin" (read-keyset "module-admin-keyset"))
   ```

3. Start the `payments` module declaration and import the `auth` module with the Pact `use` keyword.

   ```pact
   (module payments ADMIN
     (defcap ADMIN ()
       (enforce-guard "dev.module-admin"))
     (use auth)
   )
   ```

4. Define the schema and table for account management.

   ```pact
     (defschema account
        balance:decimal)
     (deftable accounts:{account})
   ```

1. Define the `create-account` function to set up a new account, ensuring the user is authorized.

   ```pact
   (defun create-account:string (userId:string initial-balance:decimal)
      "Create a new account for ID with INITIAL-BALANCE funds, must be administrator."
      (enforce-user-auth userId)
      (enforce (>= initial-balance 0.0) "Initial balances must be >= 0.")
      (insert accounts userId
        { "balance": initial-balance})
   )
   ```

2. Define the `get-balance` function to retrieve the balance for an account from the database for an authorized user.

   ```pact
   (defun get-balance:decimal (userId:string)
    "Only admin can read balance."
    (enforce-user-auth "admin")
    (with-read accounts userId
      { "balance":= balance }
      balance)
   )
   ```

3. Define the `pay` function to allow for transferring funds between accounts.

   ```pact
   (defun pay:string (from:string to:string amount:decimal)
    (with-read accounts from { "balance":= from-bal }
      (enforce-user-auth from)
      (with-read accounts to { "balance":= to-bal }
        (enforce (> amount 0.0) "Transaction amount cannot be negative.")
        (enforce (>= from-bal amount) "Insufficient funds")
        (update accounts from
                { "balance": (- from-bal amount) })
        (update accounts to
                { "balance": (+ to-bal amount) })
        (format "{} paid {} {}" [from to amount])))
   )
   ```

4. Complete the `payments` module by closing the module declaration and create the `accounts` table.

   ```pact
   )
   (create-table accounts)
   ```

## Test interactions with the REPL File

To test contract interaction:

1. Create a `payments.repl` file and add a transaction that loads the `auth.pact` module.

   ```pact
   (begin-tx)
     (load "auth.pact")
   (commit-tx)
   ```

2. Add a transaction that loads the `payments.pact` module.

   ```pact
   (begin-tx)
     (load "payments.pact")
   (commit-tx)
   ```

3. Add a transaction that uses the `auth` module to create user accounts.

   ```pact
   (begin-tx)
     (use auth)
     (env-data {
        "admin-keyset" : ["admin"],
        "sarah-keyset": ["sarah"],
        "james-keyset": ["james"]})

     (create-user "admin" "Administrator" (read-keyset "admin-keyset"))
     (create-user "sarah" "Sarah" (read-keyset "sarah-keyset"))
     (create-user "james" "James" (read-keyset "james-keyset"))

   (commit-tx)
   ```

1. Add a transaction that uses the `payments` module to test transactions.

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

2. Execute the `payments.repl` file with the following command:

   ```bash
   pact payments.repl --trace
   ```

Ensure that the REPL output aligns with expected results.

## Review

You have now built and tested contract interoperability using separate user authorization and payment modules. 
In this tutorial, you learned how to import functions defined in one module so they can be used in another module and tested transactions that required both modules to successfully complete tasks.
The tutorial introduced the Pact `load` and `use` keywords and demonstrated the basics of using them in your own modules.

