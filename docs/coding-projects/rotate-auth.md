---
title: Rotate authorized keys
description: "Develop a smart contract that allows users to change their account name and rotate authorized keys."
id: rotate-auth
sidebar_position: 5
---

# Rotate authorized keys

The _Rotate authorized keys_ coding project demonstrates how to create a smart contract with rotatable authorization keys and how to enforce row level permissions.
This project continues to build on concepts and challenges presented in other coding projects and covered in [Smart contracts](/smart-contract-dev) topics.
Specifically, this project demonstrates the following:

- How you can use keysets as row level **guards** for assets.
- How to allow users to update information in tables based on their keyset.
- How to change ownership by rotating keyset values to authorize a new owner.

To implement these features, you'll create an `auth` module with four functions, one table, and two keysets:

![Rotate authorized keys overview](/img/docs-rotate-authorized-keys.png)

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

3. Change to the `02-rotate-auth` directory by running the following command:

   ```bash
   cd pact-coding-projects/02-rotate-auth
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
- The **operate-admin** keyset allows authorized users to create user accounts.

To define the module keysets:

1. Open the `starter-auth.pact` file in your code editor and save it as `auth.pact`.

2. Enter the `free` namespace as the workspace for the keysets and module.

    ```pact
   (namespace "free")
   ```

   You can define custom namespaces in the local development environment.
   The `free` namespace is a public namespace that you can use to deploy smart contracts on the Kadena test network.

3. Define and read the module administrative keyset with the name `module-admin` to own the `auth` module.

   ```pact
   (define-keyset "free.module-admin"
     (read-keyset "module-admin-keyset"))
   ```

4. Define and read the operator keyset with the name `operate-admin` to control who can create new user accounts.

   ```pact
   (define-keyset "free.operate-admin"
     (read-keyset "module-operate-keyset"))
   ```

5. Save your changes.

For more information about defining and reading keysets, see [define-keyset](/pact-5/keysets/define-keyset)

## Define the module

The next step is to create the module that will contain the logic for your smart contract.

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
| keyset | guard |

To define the schema and table:

1. Open the modified `auth.pact` file in your code editor.

2. Define a `user` schema for a table with the columns `nickname` with the type of `string` and `keyset` with the type of `guard`.

   ```pact
   (defschema user
       nickname:string
       keyset:guard
   )
   ```

1. Define the `users-table` to use the `{user}` schema you created in the previous step.

   ```pact
   (deftable users-table:{user})
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
          keyset:guard
      )

      (deftable users-table:{user})
   )
   ```

For more information about creating schemas and tables, see the descriptions for the [defschema](/reference/syntax#defschema) and [deftable](/reference/syntax#deftable) keywords.

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
   (defun create-user (id:string nickname:string keyset:guard)

   )
   ```

2. Within the function, use `enforce-keyset` to restrict access to this function, so that new users can only be created by the `operate-admin` keyset.

   ```pact
     (enforce-keyset "free.operate-admin")
   ```

3. Within the function, insert a row into the `users-table` with the specified `nickname` and `keyset`.

   ```pact
     (insert users-table id {
        "keyset": keyset,
        "nickname": nickname
       }
     )
   ```

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

      (deftable users-table:{user})

      (defun create-user (id:string nickname:string keyset:keyset)
         (enforce-keyset "free.operate-admin")
         (insert users-table id {
             "keyset": keyset,
             "nickname": nickname
           }
         )
      )
   )
   ```

For more information, see the descriptions for the [enforce-keyset](/pact-5/keysets/enforce-keyset) and [insert](/pact-5/database/insert) functions.

### Define the enforce-user-auth function

It’s sometimes useful to restrict access to specific data for specific users.
For example, you might want to prevent users from seeing account balances or other sensitive information that should be private.
In Pact, you can restrict access to specific rows in a table by using **row-level keysets**.

To define a row-level keyset, you must first be able to view the keyset associated with a specific key-row.
The following example demonstrates reading a keyset for a specified `id` key-row:

```pact
(defun enforce-keyset-of-id (id)
  (with-read table id { "keyset" := keyset }
  (enforce-keyset keyset)
  keyset)
)
```

The purpose of this function is only to identify the keyset associated with the specified `id` key-row.
This function doesn’t provide access to any of the data in the row.
However, other functions can call this function if they want to act on the information, for example, to place row-level restrictions on the data.

To define the `enforce-user-auth` function:

1. Open the modified `auth.pact` file in your code editor.

2. Start the `enforce-user-auth` function definition that takes the parameter `id`.

   ```pact
   (defun enforce-user-auth (id:string)

   )
   ```

3. Within the function, use `with-read` to read the `users-table` to find the specified `id`, and bind the `keyset` column for the `id` to the `k` variable, then return the `keyset` value with the `k` variable.

   ```pact
   (with-read users-table id { "keyset":= k }
      (enforce-keyset k)
      k)
   ```

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

      (deftable users-table:{user})

      (defun create-user (id:string nickname:string keyset:keyset)
         (enforce-keyset "free.operate-admin")
         (insert users-table id {
             "keyset": keyset,
             "nickname": nickname
           }
         )
      )


      (defun enforce-user-auth (id:string)
          (with-read users-table id { "keyset":= k }
          (enforce-keyset k)
          k)
       )
   )
   ```

For more information, see the descriptions for the [enforce-keyset](/pact-5/keysets/enforce-keyset) and [with-read](/pact-5/database/with-read) functions.

### Define the change-nickname function

After you define a function to restrict access to data, you can allow users to take specific actions based on the data they have access to.
For example, users might want to update their profile name, or make changes to sensitive information that other users should not be able to access.

To do that, you can write a function that calls the `enforce-user-auth` function to only allow users to update their own data.
For example, the following `update-data` function allows users to update existing information in the `example-table` by leveraging the `enforce-keyset-of-id` function:

```pact
(defun update-data (id new-data)
  (enforce-keyset-of-id id)
  (update example-table id { "data": new-data })
  (format "Data updated in row {} to {}" [id new-data]))
```

By calling the `enforce-keyset-of-id` function, this function allows users with a specific keyset to make updates to restricted information.

To define the `change-nickname` function:

1. Open the modified `auth.pact` file in your code editor.

2. Start the `change-nickname` function definition that takes the parameters `id` and `new-name`.

   ```pact
  (defun change-nickname (id:string new-name:string)
  )
  ```

2. Within the function, use the `enforce-user-auth` function to enforce authorization for the specified `id`.

   ```pact
   (enforce-user-auth id)
   ```

2. Within the function, call the `update` function to update the `nickname` column for the specified `id`.

   ```pact
   (update users-table id { "nickname": new-name })
   ```

1. Within the function, return a message to the user formatted as "Updated name for user [id] to [name]".

   ```pact
   (format "Updated name for user {} to {}" [id new-name])
   ```

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

      (deftable users-table:{user})

      (defun create-user (id:string nickname:string keyset:keyset)
         (enforce-keyset "free.operate-admin")
         (insert users-table id {
             "keyset": keyset,
             "nickname": nickname
           }
         )
      )

      (defun enforce-user-auth (id:string)
          (with-read users-table id { "keyset":= k }
          (enforce-keyset k)
          k)
       )

       (defun change-nickname (id:string new-name:string)
          (enforce-user-auth id)
          (update users-table id { "nickname": new-name })
          (format "Updated name for user {} to {}" [id new-name])
       )
   )
   ```

For more information, see the descriptions for the [update](/pact-5/database/update) and [format](/pact-5/general/format) functions.

### Define the rotate-keyset function

Now that users can update their name, you can apply this same functionality to other information.
For this coding project, you can allow users to update their authorized keyset.
Being able to rotate the keyset is similar to being able to update your password.
For single key keysets, this feature enables a user to replace a potentially compromised key.
For keysets with multiple keys, this feature enables the set of owners or authorized signers to change when needed.

To define the `rotate-keyset` function:

1. Open the modified `auth.pact` file in your code editor.

2. Start the `rotate-keyset` function definition that takes the parameters `id` and `new-keyset`.

   ```pact
  (defun rotate-keyset (id:string new-keyset:string)
  )
  ```

2. Within the function, use the `enforce-user-auth` function to enforce authorization for the specified `id`.

   ```pact
   (enforce-user-auth id)
   ```

2. Within the function, call the `update` function to update the `keyset` column to the `new-keyset` for the specified `id`.

   ```pact
   (update users-table id { "keyset": new-keyset })
   ```

2. Within the function, return a message describing the update in the format "Updated keyset for user [id]".

   ```pact
   (format "Updated keyset for user {}" [id])
   ```

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

      (deftable users-table:{user})

      (defun create-user (id:string nickname:string keyset:keyset)
         (enforce-keyset "free.operate-admin")
         (insert users-table id {
             "keyset": keyset,
             "nickname": nickname
           }
         )
      )

      (defun enforce-user-auth (id:string)
          (with-read users-table id { "keyset":= k }
          (enforce-keyset k)
          k)
       )

       (defun change-nickname (id:string new-name:string)
          (enforce-user-auth id)
          (update users-table id { "nickname": new-name })
          (format "Updated name for user {} to {}" [id new-name])
       )

       (defun rotate-keyset (id:string new-keyset:guard)
          (enforce-user-auth id)
          (update users-table id { "keyset": new-keyset})
          (format "Updated keyset for user {}" [id])
       )
   )
   ```

For more information about updating a table, see [Update](/smart-contracts/databases#update).

## Create table

Although you defined a schema and a tables inside of the `auth` module, tables are created outside of the module code.
This distinction between what you define inside of the module and outside of the module is important because the module acts as a guard to protect access to database functions and records.
This separation also allows module code to be potentially updated without replacing the table in Pact state.

To create the table:

1. Open the modified `auth.pact` file in your code editor.

2. Locate the closing parenthesis for the `auth` module.

3. Create the table using the `create-table` reserved keyword.

   ```pact
   (create-table users-table)
   ```

The code for the _Rotate authorized keys_ smart contract is now complete.
From here, the next steps involve testing module functions, adding features, and deploying the contract in your local development environment or the Kadena public test network.

## Test the module using Chainweaver

Because you must define the keyset keys and predicate for your contract in the environment outside of the contract code, the Chainweaver integrated development environment provides the most convenient way to add the required keysets and test contract functions in the `free` public namespace on the Kadena test network.

To load the contract using Chainweaver:

1. Open and unlock the Chainweaver desktop and web-based application, then select the **testnet** network.

2. Click **Accounts** in the Chainweaver navigation pane and verify that you have at least one account with funds on at least one chain in the test network.

   If you don't have keys and at least one account on any chain on the test network, you need to generate keys, create an account, and fund the account on at least one chain before continuing.
   You'll use the public key for this account and the chain where you have funds in the account to deploy the contract and identify the contract owner.

3. Click **Contracts** in the Chainweaver navigation pane, then click **Open File** to select the `auth.pact` contract that you want to deploy.

   After you select the contract and click **Open**, the contract is displayed in the editor panel on the left with contract navigation on the right.
   You'll also notice that the line where you define the keyset indicates an error, and the **Env** tab indicates that the error message is `No such key in message` because your `module-admin-keyset` doesn't exist in the environment yet.

   In the Chainweaver integrated development environment, you can add keysets on the **Env** tab, under the **Data** section.

4. Under **Keysets**, type the name of your administrative keyset—in this example, type `module-admin-keyset` as the keyset name—click **Create**, then select the public key and predicate function for the administrative keyset.

   You'll see that adding the keyset replaces the first error message with a second error message for the missing `module-operate-keyset` keyset.

   Add the `module-operate-keyset` name, key, and predicate function to the environment to dismiss the second error message.

5. Click **Load into REPL** to load the contract into the interactive Pact interpreter for testing its functions.

   You should see the following message:

   ```pact
   "TableCreated"
   ```

6. Click the **ENV** tab to add a keyset for the test user account.

   - Type `sarah-keyset`, click **Create**, then select a public key and predicate function for the Sarah account keyset.
   - Remove the `module-admin-keyset` keyset from the environment to test that the `module-operate-keyset` keyset can add users.

7. Click the **REPL** tab to return to the loaded `auth` module to test its functions:

   - Call the `create-user` function to create the test user in the `free` namespace.
     For example, to create the `sarah` user:

     ```pact
     (free.auth.create-user "sarah" "Sarah Rae Fitzpatrick" (read-keyset "sarah-keyset"))
     "Write succeeded"
     ```

   - Remove the `module-operate-keyset` keyset from the environment to test that the `sarah-keyset` keyset can change the user `nickname` field.

   - Call the `change-nickname` function to change the `nickname` field for the `sarah` key-row, for example, to "S. R. Fitzpatrick-Perez":

     ```pact
     (free.auth.change-nickname "sarah" "S. R. Fitzpatrick-Perez")
     "Updated name for user sarah to S. R. Fitzpatrick-Perez"
     ```
   - Read information from the `users-table` for the `sarah` key-row:

     ```pact
     (with-read free.auth.users-table "sarah" {"nickname" := n, "keyset" := k} (format "User Nickname: {} Keyset: {}" [n,k]))
     "User Nickname: S. R. Fitzpatrick-Perez Keyset: KeySet {keys: [58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c],pred: keys-all}"
     ```

   - Call the `rotate-keyset` function for the `sarah` key-row, then read the information from the `users-table`:

     ```pact
     (free.auth.rotate-keyset "sarah" (read-keyset "new-sarah-keyset")) "Updated keyset for user sarah"

     (with-read free.auth.users-table "sarah" {"nickname" := n, "keyset" := k} (format "User Nickname: {} Keyset: {}" [n,k]))
     "User Nickname: S. R. Fitzpatrick-Perez Keyset: KeySet {keys: [9a23bf6a61f753d3ffa45c02b33c65b9dc80b8fb63857debcfe21fdb170fcd99],pred: keys-any}"
     ```

## Deploy using Chainweaver

After testing that the contract functions work as expected in the interactive REPL, you can use Chainweaver to deploy the contract on the test network in the `free` namespace.
To deploy in an existing namespace, you must also ensure that your module name and keyset name are unique across all of the modules that exist in that namespace.

To deploy the contract using Chainweaver:

1. Update the module name and keysets to make them unique in the namespace.

   For example:

   ```pact
   (namespace "free")

   (define-keyset "free.pistolas-module-admin"
      (read-keyset "module-admin-keyset"))

   (define-keyset "free.pistolas-operate-admin"
      (read-keyset "module-operate-keyset"))

   (module pistolas-auth-project "free.pistolas-module-admin"
   ...
   )
   ```

2. Click **Deploy** to display the Configuration tab.
3. On the Configuration tab, update General and Advanced settings like this:

   - Select the **Chain identifier** for the chain where you want to deploy the contract.
   - Select the **Transaction Sender**.
   - Click **Advanced** and add the updated ` module-admin` keyset to the environment.
   - Click **Next**.

4. On the Sign tab, select the public key for the administrative keyset as an **Unrestricted Signing Key**, then click **Next**.

3. On the Preview tab, scroll to see the Raw Response is "TableCreated", then click **Submit** to deploy the contract.
