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
 
These functions store information in a `payments` database table.
The `payments` table manages payments between two accounts `Sarah` and `James`.

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

## Module and Keyset

The first step is to set up the module and keysets for the smart contract.

:::caution Code Challenge

Define and read the admin-keyset, create the payments module, and give the
admin-keyset access to the module.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/1-module-and-keysets/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/1-module-and-keysets/solution.pact)

:::

:::info

If you’re unfamiliar with modules and keyset, our
[Pact Modules Tutorial](/build/pact/modules)

is a great place to get started.

:::

## 2. Define Schema and Table

The next step is to define the schema and table for the smart contract.

The **payments-table**, will keep track of the balance of the accounts and
associate that to the account’s keyset.

**Payments Table**

| fieldname | fieldtype |
| --------- | --------- |
| balance   | decimal   |
| keyset    | keyset    |

:::caution Code Challenge

Define a schema and table with columns **balance** and **keyset**.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/2-schema-and-table/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/2-schema-and-table/solution.pact)

:::

:::info

Schema definitions are introduced in the
[Pact Schemas and Tables Tutorial](/build/pact/schemas-and-tables#define-schemas).

:::

## 3. Functions

This smart contract will contain 3 functions create-account, get-balance, and
pay. Each of these are essential functions to allow users to manage their
accounts.

:::info

You can review each of the function types in the
[Schemas and Tables Tutorial](/build/pact/schemas-and-tables) as well as the
[Pact Language Basics Tutorial](/build/pact/language-basics).

:::

### 3.1 Create Account

First, add a function that allows the administrator to create accounts. This
will allow you to add as many accounts as you’d like.

:::caution Code Challenge

Create a function **create-account** that allows administrator to create
accounts.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/3-functions/3.1-create-account/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/3-functions/3.1-create-account/solution.pact)

:::

:::info

Try using [enforce](/reference/functions/general#enforceh-1604583454) to regulate
who has access to create an account.

:::

### 3.2 Get Balance

Now that you can create accounts, it is helpful to be able to view the balance
of these accounts. In this case, we’ll allow both users and administrators to
view the balance.

:::caution Code Challenge

Create a function **get-balance** that allows administrators and users to view
the balance of their account.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/3-functions/3.2-function-get-balance/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/3-functions/3.2-function-get-balance/solution.pact)

:::

### 3.3 Pay

Next, you’ll create the function that allows one account to pay another account.
This allows accounts to transfer value from their account to another to begin
making payments and managing their finances.

:::caution Code Challenge

Create a function **pay** that allows an account to pay another account.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/3-functions/3.3-function-pay/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/3-functions/3.3-function-pay/solution.pact)

:::

## 4. Create Table

You have now completed the module. Outside of the module you can create the
table that you defined earlier.

:::caution Code Challenge

Create the **payments-table**.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/4-create-table/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/4-create-table/solution.pact)

:::

:::info

At this point you have completed the module. You will notice the previous
challenge containing a final parenthesis to close out the module. The remaining
steps are meant to help you call functions from within the module you created to
put your smart contract to use.

:::

## 5. Create Accounts

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

## 6. Make Payment

The final step is to make a payment from one account to another. You can do this
using the pay function created earlier.

:::caution Code Challenge Use the pay function to transfer **25.0** to **James**
from **Sarah’s** account. After making the payment, read the balance of both
Sarah and James.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/6-make-payment/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/payments/2-challenges/6-make-payment/solution.pact)

:::

### Deploy the smart contract

Congratulations, at this point you have completed the Simple Payment smart
contract!

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
