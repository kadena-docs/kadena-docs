---
title: Rotate wallet keys
description: "Develop a smart contract that supports rotating ownership keys."
id: rotate-wallet
sidebar_position: 5
---

# Rotate wallet keys

The Rotate wallet keys coding project demonstrates how to create a smart contract with rotatable authorization keys and how to enforce row level permissions.
For this project, you'll build an `auth` module for a wallet application that supports key rotation.
This project continues to build on concepts and challenges presented in other coding projects and covered in [Smart contracts](/smart-contracts/smart-contract-dev) topics.
Specifically, this project demonstrates the following:

- How you can use keysets as row level **guards** for assets.
- How to allow users to update information in tables based on their keyset.
- How to change ownership by rotating keyset values to authorize a new owner.

Within the `auth` module, you need to define the functions, table, and keysets for the smart contract to complete this coding projects.

![Rotate wallet keys overview](/img/rotate-auth-overview.png)

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

3. Change to the `02-rotate-wallet` directory by running the following command:

   ```bash
   cd pact-coding-projects/02-rotate-wallet
   ```

   If you list the contents of this directory, you'll see the following files:

   - `starter-rotate-wallet.pact` provides a starting point with the framework for the project code and comments for every challenge.
   - `rotate-wallet.pact` contains the final solution code that can be deployed.
   - `rotate-wallet.repl` provides a complete test file for testing the final `simple-payment.pact` contract.

4. Open and review the `starter-rotate-wallet.pact` file.

   This file describes all of the tasks that you need to complete for the _Rotate wallet keys_ coding project.
   You can follow the instructions embedded in the file to try to tackle this coding project on your own
   without looking at the solutions to each step, or follow the instructions in the next sections if you need additional guidance.

## Define the module keysets

As you might have seen in other coding projects, modules are defined in a namespace and are governed by either an administrative keyset or a governance capability.
Like namespaces, keysets are also defined outside of module code and passed into the module through the namespace from message data that is outside of the module code.

This coding project requires two keysets:

- The **module-admin** keyset allows authorized users to define and update modules. 
- The **operate-admin** keyset allows authorized users to create wallet accounts.

To define the module keysets:

1. Open the `starter-auth.pact` file in your code editor and save it as `auth.pact`.

2. Enter the free namespace as the workspace for the keysets and module.
   
    ```pact
   (namespace "free")
   ```
3. Define and read the module administrative keyset with the name `module-admin` to own the `auth` module.
   
   ```pact
   (define-keyset "free.module-admin" 
     (read-keyset "module-admin-keyset"))
   ```
   
4. Define and read the operator keyset with the name `operate-admin` to allow users to create wallet accounts.

   ```pact
   (define-keyset "free.operate-admin"
     (read-keyset "module-operate-keyset"))
   ```

5. Save your changes.
   
For more information about defining and reading keysets, see [define-keyset](/pact-5/keysets/define-keyset)

## Define the module

The next step is to create the module that will contain the logic of your smart contract.

1. Create a module named `auth` that is governed by the `free.module-admin` keyset.
   
   ```pact
   (module auth "free.module-admin"
      ;; Module declaration
   )
   ```

## Define the schema and table

The `auth` modules stores information about user accounts in the `users-table` database table.
The schema for this table is named **user** with two columns:

| Field name | Field type |
| --------- | --------- |
| nickname  | string |
| keyset | keyset |

To define the schema and table:

1. Open the modified `auth.pact` file in your code editor.

2. Define a `users` schema for a table with the columns `nickname` with the type of string and `keyset` with the type of keyset.
   
   ```pact
   (defschema user
       nickname:string
       keyset:keyset
   )
   ```  

1. Define the `users-table` to use the schema `{users}` you created in the previous step.

   ```pact
   (deftable users:{user})
   ```

1. Move the closing parenthesis that marks the end of the `auth` module declaration after the table definition to include the schema and table inside of the module.
   
   Without comments, your code should look similar to the following:
   
   ```pact
   (namespace "free")

   (define-keyset "free.module-admin" 
      (read-keyset "module-admin-keyset"))
   
   (define-keyset "free.operate-admin"
      (read-keyset "module-operate-keyset"))
   
   (module auth "free.module-admin"
      (defschema user
          nickname:string
          keyset:keyset
      )
   
      (deftable users:{user})
   )
   ```

For more information about creating schemas and tables, see the descriptions for the [defschema](/reference/syntax#defschema) and
[deftable](/reference/syntax#deftable) keywords.

## Define functions

For this coding project, the `auth` module provides the following functions:

- `create-user` to allow users with the `operate-admin` keyset to add rows to the user table.
- `enforce-user-auth` to restrict access permissions to users with a given id.
- `change-nickname` to allow users with a specific keyset to update their nickname.
- `rotate-keyset` to allow the owner of a keyset to change the keyset being used.

These functions give users the ability to create and manage their own accounts.

### Define the create-user function

The `create-user` function specifies that only users with the `operate-admin` keyset can add rows to the user table.

To define the `create-user` function:

1. Open the modified `auth.pact` file in your code editor.

1. Start the `create-user` function definition with the keyword `defun` and add the parameters `id`, `nickname`, and `keyset`.
   
   ```pact
   (defun create-user (id nickname keyset)
   
   )
   ```

2. Within the function, use `enforce-keyset` to ensure that all accounts are created by the `admin-keyset` administrator.
   
   ```pact
     (enforce-keyset 'admin-keyset)
   ```


Define a function named **create-user** that takes 3 arguments; id, nickname,
and keyset. Next, restrict access for function calls to the **operate-admin**.
Finally, insert a row into the **users** table using the inputs specified by the
user.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/4-functions/4.1-create-user/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/4-functions/4.1-create-user/solution.pact)
  :::

:::info

View
[enforce-keyset](/reference/functions/keysets#enforce-keyseth1553446382)

and [insert](/reference/functions/database#inserth-1183792455) for more
information related to completing this challenge.

:::

### 4.2 Enforce User

It’s sometimes useful to restrict access to data to specific users. For example,
users may not want others to see the balance of their account or other sensitive
information. This can be done in Pact by enforcing access to rows of data using
row-level keysets.

The first step toward making this happen is to be able to view the keyset
associated with a specific id. The following function shows an example of
reading a keyset in a specific row from a given id.

```pact title=" "
(defun enforce-keyset-of-id (id)
  (with-read table id { "keyset":= keyset }
  (enforce-keyset keyset)
  keyset)
)
```

This function doesn’t yet give any access to the data in a row. It’s purpose is
for other functions to call on it in the case that they want to do something
like place row level restrictions on data. This will be valuable shortly when
you write code that needs to call this function.

:::caution Code Challenge

Define a function named **enforce-user-auth** that returns the keyset associated
with a given id.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/4-functions/4.2-enforce-user/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/4-functions/4.2-enforce-user/solution.pact)

:::

:::info

View
[enforce-keyset](/reference/functions/keysets#enforce-keyseth1553446382),
[with-read](/reference/functions/database#with-readh866473533), and
[bind](/reference/functions/general#bindh3023933) for more information related to
completing this challenge.

:::

### 4.3 Change Nickname

Once you can restrict access to data, you’re ready to allow users to take
specific actions based on the data they have access to. For example, a user may
want to update their profile name, or make changes to sensitive information that
other users should not be able to access.

To do that, you can write a function that utilizes the previous function you
created. From there, you can add in functionality that allows users to update
their data.

Here is an example function **update-data** that allows users to update existing
information. It leverages the previous example function **enforce-keyset-of-id**
to make an update to a row in the table **example-table**.

```pact title=" "
(defun update-data (id new-data)
  (enforce-keyset-of-id id)
  (update example-table id { "data": new-data })
  (format "Data updated in row {} to {}" [id new-data]))
```

This function combined with the previous function allows users with a specific
keyset to make updates to restricted information.

:::caution Code Challenge

Define a function named **change-nickname** that allows users with a specific
keyset to update their nickname in the **users** table.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/4-functions/4.3-change-nickname/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/4-functions/4.3-change-nickname/solution.pact)

:::

:::info

View [update](/build/pact/schemas-and-tables#updateh-1754979095) and
[format](/reference/functions/general#formath-1268779017) for more information
related to completing this challenge.

:::

### 4.4 Rotate Keyset

Now that users can update their name, you can apply this same functionality to
other information.

For example, you can allow users to update their keyset. The ability to update
keysets is known as ‘rotating keysets’ and this is where the name ‘Rotatable
wallets’ came from for this demonstration. This feature is comparable to being
able to update a password, and it’s an extremely useful feature to have in an
application.

For this final function, use the information learned from previous steps to add
rotating keysets as a feature of your smart contract.

:::caution Code Challenge

Define a function named rotate-keyset that allows the owner of a keyset to
change their keyset.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/4-functions/4.4-rotate-keyset/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/4-functions/4.4-rotate-keyset/solution.pact)

:::

:::info

View [update](/build/pact/schemas-and-tables#updateh-1754979095) and
[format](/reference/functions/general#format) for more information related to
completing this challenge.

:::

## 5. Create Table

The last step is to create the **user** table defined within the module.

:::caution Code Challenge

Create the user table.

- [Challenge](https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/5-create-table/challenge.pact)
- [Solution](https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/5-create-table/solution.pact)

:::

## Deploy the Smart Contract

Your Rotatable Wallet smart contract is complete! If you’d like, you can deploy
this contract similar to how you would deploy other smart contracts.

For more information on deploying this smart contract, view the following
tutorials.

- [Hello World with Pact](/build/pact/hello-world)
- [Set up a local development network](/build/pact/dev-network)
- [Develop with Atom SDK](/build/pact/atom-sdk)

## Review

That wraps up this tutorial on the **Rotatable Wallet** application.

Throughout this tutorial, you built a smart contract named **Rotatable Wallets**
that demonstrated many important Pact features that you learned throughout
previous tutorials.

Most importantly, you showed how modules can be permissioned to ensure the
security of running your code on a decentralized network and allow for row level
permissions when necessary.

Having the ability to permission modules is an extremely valuable feature of
Pact, and you can use this in many other applications in the future. Take some
time now to experiment with this feature to try applying it in new situations.

When you’re ready, move to the next tutorial to continue building Pact
applications!