---
title: Simple payments
description: "Build a simple contract that transfers value between two accounts, one of the most common and most important operations that smart contracts are use to perform."
id: payments
sidebar_position: 3
---

# Simple payments

The simple payments project is designed to help you build a simple contract that transfers value between two accounts.
Because a blockchain acts as a digital ledger, transferring value between accounts is one of the most common blockchain operations.
Knowing how to create a smart contract that can be securely transfer assets is one of the most important building blocks that will enable you up to create more complex applications.

For this project, you'll create one Pact `simple-payments` module smart contract that consists of three functions:

- `create-account`
- `get-balance`
- `pay` 
 
These functions store information in a `payments-table` database table.
The `payments-table` manages payments between two accounts `Sarah` and `James`.

![Simple payments project overview](/img/simple-payments-overview.png)

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

3. Change to the `01-simple-payment` directory by running the following command:

   ```bash
   cd pact-coding-projects/01-simple-payments
   ```

   If you list the contents of this directory, you'll see the following folders:
   
   | Folder name | What it contains |
   | ----------- | ---------------- |
   | `start` | Provides a starting point with the framework for the project code and all comments for every challenge. |
   | `challenges` | Coding challenges that enable you to test what you've learned or experiment with your own ideas. There are separate files for each part of the project for you to work through on your own.  |
   | `finish` | Final code including all coding challenge comments for the final application. |
   | `simple-payment` | The final smart contract application without any of challenge comments. |

1. Open and review the `simple-payments.pact` file.
   
   This file describes all of the tasks that you need to complete for the _Simple payments_ coding project.
   You can follow the instructions embedded in the file to try to tackle this coding project on your own
   without looking at the solutions to each step, or follow the instructions in the next section if you need additional guidance.

## Define a module and keyset

The module declaration is a core part of any Pact smart contract.
To define a module, you must also specify the administrative keyset or governance capability that owns the module. 
For this coding project, you need to define one module—the `payments` module—and the administrative keyset for the `payments` module.

1. Open the `simple-payments.pact` file in your code editor.

2. Define and read an administrative keyset with the name `admin-keyset` to own the `payments` module.
   
   ```pact
   (define-keyset 'admin-keyset (read-keyset "admin-keyset"))
   ```
   
   In essence, this line creates an administrative keyset using the keyset name of `admin-keyset` that will have one or more public keys and a predicate function read from a message or as environment data.
   The `admin-keyset` data that needs to be passed into the environment looks similar to the following:

   ```pact
   {"admin-keyset":{ "keys": ["fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7"], "pred": "keys-all" } }
   ```

3. Create a module named `payments` that is governed by the `admin-keyset`.
   
   ```pact
   (module payments 'admin-keyset
   )
   ```

1. Save your changes.
   
   Now that you have a module, you need to add the code for this module inside of the `payments` declaration—that is, before the closing parenthesis that marks the end of the module declaration. 
   
   For more information about defining modules, see [Modules](/smart-contracts/modules).

## Define a schema and table

The `payments` modules stores information about accounts and balances in the `payments-table` database table.
This table keeps track of the balance of the accounts that are associated with th  `Sarah` and `James` account keysets. accounts for.
The schema for the payments-table looks like this:

| Field name | Field type |
| --------- | --------- |
| balance | decimal |
| keyset | keyset |

1. Open the modified `simple-payments.pact` file in your code editor.

2. Define a `payments` schema for a table with the columns `balance` as type decimal and `keyset` as type keyset.
   
   ```pact
     (defschema payments
        balance:decimal
        keyset:keyset)
   ```
1. Define the `payments-table` to use the schema `{payments}` you created in the previous step.
   
   ```pact
     (deftable payments-table:{payments})
   ```

1. Move the closing parenthesis that marks the end of the `payments` module declaration after the table definition to include the schema and table inside of the module.
   
   Without comments, your code should look similar to the following:
   
   ```pact
   (define-keyset 'admin-keyset (read-keyset "admin-keyset"))

   (module payments 'admin-keyset
   
     (defschema payments
       balance:decimal
       keyset:keyset)
   
     (deftable payments-table:{payments})
   )
   ```

1. Save your changes.
   
   Now you have a schema and table definition inside of the `payments` declaration.

   For more information about defining schema and tables, see [Databases, schemas, and tables](/smart-contracts/databases).

## Define functions

For this coding project, the payments module provides three functions:

- `create-account` to allow the module administrator to create accounts. 
- `get-balance` to allow the module administrator and account owner to view account balance.
- `pay` to allow one account to pay another account.

### Define the create-account function

The `create-account` function allows the `payments` module administrator—identified by the `admin-keyset` keyset—to create any number of accounts. 

1. Open the modified `simple-payments.pact` file in your code editor.

1. Start the `create-account` function definition with the keyword `defun` and add the parameters `id`, `initial-balance`, and `keyset`.
   
   ```pact
   (defun create-account (id initial-balance keyset)
   
   )
   ```

2. Within the function, use `enforce-keyset` to ensure that all accounts are created by the `admin-keyset` administrator.
   
   ```pact
     (enforce-keyset 'admin-keyset)
   ```

3. Within the function, use `enforce` to ensure the initial-balance is zero and with an optional documentation.
   
   ```pact
     (enforce (>= initial-balance 0.0) "Initial balances must be >= 0.")
   ```

1. Within the function, insert the `initial-balance` and `keyset` into the `payments-table`.
   
   ```pact
     (insert payments-table id
            { "balance": initial-balance,
              "keyset": keyset })
   ```

2. Check that the closing parenthesis for the `create-account` function is after the last expression and move and move the closing parenthesis the `payments` module declaration after the function.
   
   Without comments, your code should look similar to the following:
   
   ```pact
   (define-keyset 'admin-keyset (read-keyset "admin-keyset"))
   
   (module payments 'admin-keyset
   
     (defschema payments
       balance:decimal
       keyset:keyset)
   
     (deftable payments-table:{payments})

     (defun create-account (id initial-balance keyset)
        (enforce-keyset 'admin-keyset)
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

1. Start the `get-balance` function definition with the keyword `defun` and takes the argument `id`.
   
   ```pact
     (defun get-balance (id)
     
     )
   ```

1. Within the function, use `with-read` to view the `id` from the `payments-table`.
   
   ```pact
       (with-read payments-table id   
   ```

2. Within the function, use `enforce-one` to check that the keyset calling the function is the `admin-keyset` or the `id` keyset.
   
   ```pact
        (enforce-one "Access denied"
          [(enforce-keyset keyset)
           (enforce-keyset 'admin-keyset)])
   ```

3. Within the function, return the `balance` for the specified `id` keyset.
   
   ```pact
        balance)
   ```

2. Check that the closing parenthesis for the `get-balance` function is after the last expression and move and move the closing parenthesis for the `payments` module declaration after the function.
   
   Without comments, your code should look similar to the following:

   ```pact
   (define-keyset 'admin-keyset (read-keyset "admin-keyset"))
   
   (module payments 'admin-keyset
   
     (defschema payments
       balance:decimal
       keyset:keyset)
   
     (deftable payments-table:{payments})

     (defun create-account (id initial-balance keyset)
        (enforce-keyset 'admin-keyset)
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
           (enforce-keyset 'admin-keyset)])
        balance)
     )
   )
   ```

### Define the pay function

The `pay` function allows one account to transfer assets to another account defined in the `payments-table`.

1. Start the `pay` function definition with the keyword `defun` and takes the parameters `from`, `to`, and `amount`.
   
   ```pact
     (defun pay (from to amount)
     
     )
   ```

2. Within the function, use `with-read` to view the` payments-table` for the `from` account and bind the `balance` and `keyset` of this account to the `from-bal` and `keyset` variables.
   
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

2. Within the function, enforce that the amount being transferred is greater than zero.

   ```pact
        (enforce (> amount 0.0) "Negative Transaction Amount")
   ``` 

3. Within the function, enforce that `balance` for the `from` account is greater than what is being transferred.

   ```pact
        (enforce (>= from-bal amount) "Insufficient Funds")
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

1. Within the function, return a formatted string to say that the from account has paid the to account the amount paid
   
   ```pact
        (format "{} paid {} {}" [from to amount])))
   ```

2. Check that the closing parenthesis for the `pay` function is after the last expression and move and move the closing parenthesis for the `payments` module declaration after the function.
   
   Without comments, your code should look similar to the following:

   ```pact
   (define-keyset 'admin-keyset (read-keyset "admin-keyset"))

   (module payments 'admin-keyset
   
     (defschema payments
        balance:decimal
        keyset:keyset)
   
     (deftable payments-table:{payments})

     (defun create-account (id initial-balance keyset)
        (enforce-keyset 'admin-keyset)
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
            (enforce-keyset 'admin-keyset)])
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

1. Save your changes.
   
   The `pay` function is the last code that you need to include within the `payments` module. 

## Create table

Although you defined a schema and a tables inside of the `payments` module, tables are created outside of the module code.

1. Open the modified `simple-payments.pact` file in your code editor.

2. Locate the closing parenthesis for the `payments` module.

3. Create the table using the create-table reserved keyword.
   
   ```pact
   (create-table payments-table)
   ```

## Call contract functions

At this point, you have completed all of the code for the `simple-payments.pact` contract. 
The remaining steps illustrate how to create a test file—the simple-payments.repl file—and call the functions you've defined in the module.


The next step is to create the accounts that will transfer value.

For this tutorial, create 2 accounts.

- Sarah
- James

To do this, you use the **create-account** function built earlier. This function
takes 3 arguments; **id**, **initial-balance**, and **keyset**.

:::caution Code Challenge

Call the **create-account** function to create accounts for **Sarah** and
**James**.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/5-create-accounts/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/5-create-accounts/solution.pact)

:::

## Make a payment

The final step is to make a payment from one account to another. You can do this
using the pay function created earlier.

:::caution Code Challenge Use the pay function to transfer **25.0** to **James**
from **Sarah’s** account. After making the payment, read the balance of both
Sarah and James.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/6-make-payment/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/6-make-payment/solution.pact)

:::

### Deploy the smart contract

Congratulations, at this point you have completed the _Simple payment_ coding project.

If you’d like, you can try deploying this smart contract. 
You can deploy this contract locally on the development network using **Chainweaver** or from the **Pact Atom SDK**. 
If you choose to deploy this locally, you’ll need the REPL file which you can find inside of the repository you cloned.

For help getting started and deploying in each of these environments, try the following tutorials.

- [Set up a local development network](/build/pact/dev-network)
- [Develop with Atom SDK](/build/pact/atom-sdk)

## Review

Congratulations on completing the **Accounts and Transfers Tutorial**!

In this tutorial, you built a **Simple Payment** application that creates
accounts, views account balances, and makes payments between accounts. This is
an important function of smart contracts and will set you up to create more
complex applications using accounts and transfers.

This is a key feature of many smart contracts and can be extended into all types
of use cases. Take some time now to experiment with these features to try them
out in creative new ways.
