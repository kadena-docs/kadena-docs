---
title: Contract Interactions
description: "Learn how to build smart contracts that allow users to authorize and make payments using multiple Pact modules."
id: contract-interactions
sidebar_position: 4
---

# Contract Interactions

The Contract Interactions project is designed to help you build a smart contract that handles both user authorization and payments. 
This guide focuses on creating a Pact module that enables secure interactions between multiple modules. 
Contract interactions are fundamental for setting up more complex smart contracts.

For this project, you'll create two Pact modules: 
- An `auth` module for handling user authentication
- A `payments` module for managing account balances and transactions

The `auth` module manages user authorization, while the `payments` module handles transferring value between two accounts—`Sarah` and `James`.

<img src="/img/contract-interactions-overview.webp" alt="Contract interactions project overview" height="550" width="900"/>

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

   - `starter-auth.pact` provides a starting point with the framework for building the `auth` module.
   - `starter-payments.pact` provides the framework for building the `payments` module.
   - `contract-interactions.repl` includes test cases for verifying module interactions.

4. Open and review the `starter-auth.pact` and `starter-payments.pact` files.

   These files outline the tasks you need to complete for the _Contract Interactions_ project.
   Follow the embedded instructions to work through the coding challenges or use the detailed instructions provided in the next sections.

## Overview of Contract Interactions

In this tutorial, you'll learn the following:

- Understanding contract interactions in Pact
- Setting up multiple modules for authorization and payments
- Testing interactions in the REPL environment

## Key Concepts

In Pact, modules can call functions from other modules, enabling more complex contract setups. You’ll be using the following key Pact features:

- **load:** Load and evaluate a module.
- **use:** Import an existing module into a namespace.
- **function calls:** Invoke functions defined within other modules.


## Getting Started

### Project Files Overview

You’ll work with three main files:

1. **auth.pact** - Responsible for authorizing users.
2. **payments.pact** - Manages payments between users.
3. **payments.repl** - Coordinates interactions between the modules.

## Step 1: Define the Auth Module

### 1.1 Define Keysets

The first step in the `auth.pact` file is to define the keysets that control the module's access and operation.

```lisp
;; define-keysets
(define-keyset "free.module-admin" (read-keyset "module-admin-keyset"))
(define-keyset "free.operate-admin" (read-keyset "module-operate-keyset"))
```

These keysets will help manage access control throughout the contract.

### 1.2 Define the Auth Module

Now, create the `auth` module, which will handle user authentication and management.

```lisp
(module auth "free.module-admin"
```

### 1.3 Define User Schema and Table

Define the schema and table for managing user data.

```lisp
  (defschema user
    nickname:string
    keyset:keyset)
  
  (deftable users:{user})
```

### 1.4 Create User Function

The `create-user` function adds a new user to the system, restricted to the operate-admin.

```lisp
  (defun create-user (id nickname keyset)
    (enforce-keyset "free.operate-admin")
    (insert users id {
      "keyset": (read-keyset keyset),
      "nickname": nickname
    })
  )
```

### 1.5 Enforce User Authentication

Define a function to ensure that a user is authorized for a specific operation.

```lisp
  (defun enforce-user-auth (id)
    (with-read users id { "keyset":= k }
      (enforce-keyset k)
    )
  )
```

### 1.6 Complete the Auth Module

Close the module and create the table.

```lisp
(create-table users)
```

## Step 2: Define the Payments Module

### 2.1 Define Keyset

In the `payments.pact` file, define the keyset that will manage this module.

```lisp
(define-keyset "free.admin-keyset" (read-keyset "admin-keyset"))
```

### 2.2 Start the Payments Module

Now, create the `payments` module and use the `auth` module.

```lisp
(module payments "free.admin-keyset"

  (use auth)
```

### 2.3 Define Account Schema and Table

Define the schema and table for account management.

```lisp
  (defschema accounts balance:decimal)
  (deftable accounts-table:{accounts})
```

### 2.4 Create Account Function

The `create-account` function sets up a new account, ensuring the user is authorized.

```lisp
  (defun create-account (userId initial-balance)
    (enforce-user-auth userId)
    (enforce (>= initial-balance 0.0) "Initial balances must be >= 0.")
    (insert accounts-table userId
      { "balance": initial-balance })
  )
```

### 2.5 Get Balance Function

The `get-balance` function retrieves the balance for an account, ensuring authorization.

```lisp
  (defun get-balance (userId)
    (enforce-user-auth 'admin)
    (with-read accounts-table userId
      { "balance":= balance }
      balance)
  )
```

### 2.6 Pay Function

The `pay` function allows for transferring funds between accounts.

```lisp
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

### 2.7 Complete the Payments Module

Close the module and create the table.

```lisp
(create-table accounts-table)
```

## Step 3: Testing with the REPL File

### 3.1 Load Auth Module

In the `payments.repl` file, start by loading the `auth.pact` module.

```lisp
(begin-tx)
(load "auth.pact")
(commit-tx)
```

### 3.2 Load Payments Module

Next, load the `payments.pact` module.

```lisp
(begin-tx)
(load "payments.pact")
(commit-tx)
```

### 3.3 Use Auth Module

Now, use the `auth` module and create user accounts.

```lisp
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

### 3.4 Use Payments Module

Finally, use the `payments` module and test transactions.

```lisp
(begin-tx)
(use payments)
(env-keys ["sarah"])
(create-account "Sarah" 100.25)
(env-keys ["james"])
(create-account "James" 250.0)
(pay "Sarah" "James" 25.0)
(commit-tx)
```

## Run REPL File

To test the setup, run the following command:

```bash
pact payments.repl --trace
```

Ensure that the REPL output aligns with expected results.

## Review

You have now built and tested a contract interaction setup using two modules, following a step-by-step approach. This tutorial covered user authentication and payment transactions across modules.

---
