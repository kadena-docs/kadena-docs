---
title: 'Define keysets'
description: 'Learn how to define keysets in your principal namespace.'
id: workshop-keysets
sidebar_position: 6
---

# Define keysets

As you learned in [Add an administrator account](/resources/election-workshop/workshop-admin) and [Define a namespace](/resources/election-workshop/workshop-namespace), keysets determine rules for signing transactions and controlling the accounts that can access and update the namespaces where you deploy smart contracts. 
This tutorial demonstrates how to define the `admin-keyset` in the principal namespace that you created in [Define a namespace](/resources/election-workshop/workshop-namespace) using the public key of the administrative account you created in [Add an administrator account](/resources/election-workshop/workshop-admin). 

After you define the `admin-keyset` in your principal namespace, you'll be able to use it to authorize your administrative account to submit specific types of transactions for the election application you're building. 
For example, you'll be able to authorize transactions that deploy and upgrade the election smart contract and that nominate the candidates that other accounts can vote on.

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local computer.
- You have a code editor, such as [Visual Studio Code](https://code.visualstudio.com/download), access to an interactive terminal shell, and are generally familiar with using command-line programs.
- You have cloned the [voting-dapp](https://github.com/kadena-community/voting-dapp.git) repository to create your project directory as described in [Prepare your workspace](/resources/election-workshop/workshop-prepare).
- You have the development network running in a Docker container as described in [Start a local blockchain](/resources/election-workshop/workshop-start).
- You are [connected to the development network](/resources/election-workshop/workshop-start#connect-to-the-development-network) using your local host IP address and port number 8080.
- You have created and funded an administrative account as described in [Add an administrator account](/resources/election-workshop/workshop-admin).
- You have created a principal namespace on the development network as described in [Create your own principal namespace](/resources/election-workshop/workshop-namespace#create-your-own-principal-namespace).

## Write a transaction to define a keyset

Like the previous tutorial, in this tutorial, you'll write transactions to test operations in a `.repl` file and execute the test code using the Pact command-line interpreter. 
After you test the transaction to define a keyset in the Pact REPL, you'll define a keyset in the principal namespace that you created for your local development network.

Pact provides the `define-keyset` built-in function to define keysets.
This function takes two arguments:

- The name of the keyset being defined.
- The keyset object—that is, one or more keys and a predicate—that you want to associate with the keyset name being defined.

As you saw in [Define a namespace](/resources/election-workshop/workshop-namespace), you can wrap the `define-keyset` function by calling the `expect` function to test that calling `define-keyset` will succeed. 
The `expect` function takes three arguments:

- The title of the test.
- The expected output of the `define-keyset` function.
- The `define-keyset` function call.

To define a keyset:

1. Open the `election-workshop/pact` folder in the code editor.

2. Create a new file named `keyset.repl` in the `pact` folder.

3. Write an empty transaction by adding the [`begin-tx`](/pact-5/repl/begin-tx) and [`commit-tx`](/pact-5/repl/commit-tx) built-in functions in the `keyset.repl` file:

   ```pact
   (begin-tx "Define a new keyset")
       
   (commit-tx)
   ```

4. Add the `expect` wrapper and `define-keyset` function call between the `begin-tx` and `commit-tx` lines:

   ```pact
   (begin-tx "Define a new keyset")
      (expect
        "A keyset can be defined"
        "Keyset write success"
        (define-keyset "election-admin-keyset" (read-keyset "admin-keyset"))
      )
   (commit-tx)
   ```
   
   If you execute the transaction using the `pact keyset.repl --trace` command at this point, the transaction will fail because there's no `"admin-keyset"` available to read:

   ```bash
   ...
   keyset.repl:2:3-6:4:FAILURE: A keyset can be defined evaluation of actual failed with error message: read-keyset failure
   Load failed
   ```

   As you saw when defining a namespace, you must add the information for the `admin-keyset` to the environment—using the `env-data` built-in function—so that it can be read in the `define-keyset` function call.
   
5. Add the `admin-keyset` to the environment by calling the `env-data` function at the top of the `keyset.repl` file:

   ```pact
   (env-data
     { "admin-keyset" :
       { "keys" : [ "admin-public-key" ]
       , "pred" : "keys-all"
       }
     }
   )
   ```

   With this environment data, the `define-keyset` function can read the `admin-keyset` object to define the new `election-admin-keyset` keyset.
   However, for this keyset to to useful for governing a module in a namespace, it must be defined within the context of a specific namespace.

6. Add the following transaction to define the `election` namespace before the transaction to define a keyset.

   ```pact
   (begin-tx "Define a namespace to define the keyset in")
      (define-namespace "election" (read-keyset "admin-keyset") (read-keyset "admin-keyset"))
   (commit-tx)
   ```

7. Modify the `Define a new keyset` transaction to define the `election-admin-keyset` in the context of the `election` namespace by first entering the election namespace by calling the `namespace` built-in function, then adding `election` as a prefix for the new keyset.
   
   For example:
   
   ```pact
   (begin-tx "Define a new keyset")
   (namespace "election")
   (expect
     "A keyset can be defined"
     "Keyset write success"
     (define-keyset "election.election-admin-keyset" (read-keyset "admin-keyset")))
   (commit-tx)
   ```

4. Execute the code in the `keyset.repl` file using the Pact command-line interpreter and the `--trace` command-line option.

   ```bash
   pact keyset.repl --trace
   ```

   You'll see that the transaction succeeds with output similar to the following:

   ```pact
   keyset.repl:0:0-6:1:Trace: "Setting transaction data"
   keyset.repl:8:0-8:55:Trace: "Begin Tx 0 Define a namespace to define the keyset in"
   keyset.repl:9:6-9:93:Trace: "Namespace defined: election"
   keyset.repl:10:0-10:11:Trace: "Commit Tx 0 Define a namespace to define the keyset in"
   keyset.repl:12:0-12:32:Trace: "Begin Tx 1 Define a new keyset"
   keyset.repl:13:3-13:25:Trace: "Namespace set to election"
   keyset.repl:14:3-17:83:Trace: "Expect: success A keyset can be defined"
   keyset.repl:18:0-18:11:Trace: "Commit Tx 1 Define a new keyset"
   Load successful
   ```

   You now have a valid keyset named `election-admin-keyset` in the `election` namespace.

## Test keyset authorization

The `election.election-admin-keyset` you just defined is protected by the `admin-keyset` that has only one key, the `admin-public-key`. 
Only this account is authorized to call the `define-keyset` function to modify or update the `election.election-admin-keyset` definition.
Transactions that use any other key will fail. 

To test keyset authorization and verify that no other accounts can take control of your namespace, you can add another test case to the `keyset.repl` file.

To test keyset authorization works as expected:

1. Open the `election-workshop/pact/keyset.repl` file in the code editor.

2. Add new environment data for the `admin-keyset` that uses a different key to the bottom of the `keyset.repl` file:

   ```pact
   (env-data
     { "admin-keyset" :
       { "keys" : [ "other-public-key" ]
       , "pred" : "keys-all"
       }
     }
   )
   ```

   These lines establish a different `admin-keyset` context for testing whether a different key can be used to change the keyset definition.

3. Sign the transaction with the `other-public-key` key from the second `admin-keyset` by adding the following lines of code after the lines changing the context:
   
   ```pact
   (env-sigs
     [{ "key"  : "other-public-key"
      , "caps" : []
     }]
   )
   ```

4. Add a transaction to define a new keyset using the `other-public-key` in the second `admin-keyset`
and change the `expect` function to `expect-failure` with the following lines of code:
   
   ```pact
   (begin-tx "Define a keyset using a different keyset fails")
     (namespace "election")
     (expect-failure
       "Keyset is already defined using a different keyset"
       "Keyset failure (keys-all): [admin-pu...]"
       (define-keyset "election.election-admin-keyset" (read-keyset "admin-keyset"))
     )
   (commit-tx)
   ```

1. Execute the code in the `keyset.repl` file using the Pact command-line interpreter and the `--trace` command-line option.
   
   ```bash
   pact keyset.repl --trace
   ```

   You'll see that the transaction to change the `election.admin-keyset` fails—as expected—with output similar to the following:

   ```bash
   ...
   keyset.repl:20:0-26:1:Trace: "Setting transaction data"
   keyset.repl:28:0-32:1:Trace: "Setting transaction signatures/caps"
   keyset.repl:34:0-34:59:Trace: "Begin Tx 2 Define a keyset using a different keyset fails"
   keyset.repl:35:2-35:24:Trace: "Namespace set to election"
   keyset.repl:36:2-40:3:Trace: "Expect failure: Success: keyset definition is already defined using a different keyset"
   keyset.repl:41:0-41:11:Trace: "Commit Tx 2 Define a keyset using a different keyset fails"
   Load successful
   ```

   This output proves that the `election.election-admin-keyset` can only be governed by the account with the `admin-public-key` and can't be modified by an account that uses a different key.

## Rotate the keyset

The previous example illustrated that an unauthorized account can't take control of your namespace. 
However, it is possible for you to transfer governance permissions to someone else by **rotating** the `election.election-admin-keyset` to use a different key. 
Keyset rotation can be useful in many situations. 
For example, if the administrator of an election resigns or retires, you can use keyset rotation to add the signature of a new authorized successor to the original `admin-public-key` in a new transaction.

To rotate the keyset to accept a new signature:

1. Open the `election-workshop/pact/keyset.repl` file in the code editor.

2. Add a new signature to the environment by adding the following lines of code after the last transaction that tested unauthorized access:

   ```pact
   (env-sigs
     [{ "key"  : "other-public-key"
      , "caps" : []
     }
     ,{ "key"  : "admin-public-key"
      , "caps" : []
     }]
   )
   ```
3. Add a new transaction that allows the `election.election-admin-keyset` to be modified and is expected to succeed:

   ```pact
   (begin-tx
     "Rotating the existing keyset to a new keyset works if the transaction is signed with the original admin-public-key"
   )
   (namespace "election")
   (expect
     "Keyset can be rotated"
     "Keyset write success"
     (define-keyset "election.election-admin-keyset" (read-keyset "admin-keyset"))
   )
   (commit-tx)
   ```

4. Execute the code in the `keyset.repl` file using the Pact command-line interpreter and the `--trace` command-line option.

   ```bash
   pact keyset.repl --trace
   ```

   You'll see that the transaction to rotate the `election.election-admin-keyset` succeeds with output similar to the following:

   ```bash
   ...
   keyset.repl:43:0-50:1:Trace: "Setting transaction signatures/caps"
   keyset.repl:52:0-54:3:Trace: "Begin Tx 3 Rotating the existing keyset to a new keyset works if the transaction is signed with the original admin-public-key"
   keyset.repl:55:2-55:24:Trace: "Namespace set to election"
   keyset.repl:56:2-60:3:Trace: "Expect: success Keyset can be rotated"
   keyset.repl:61:2-61:13:Trace: "Commit Tx 3 Rotating the existing keyset to a new keyset works if the transaction is signed with the original admin-public-key"
   Load successful
   ```

   This output indicates that your test passed and you have successfully rotated the `election.election-admin-keyset` to be governed by an `admin-keyset` that contains the `other-public-key` signature.

## Test keyset definition in a principal namespace

In [Define a namespace](/resources/election-workshop/workshop-namespace), you defined a principal namespace for your local development network. 
In this tutorial, you'll add a keyset definition for your account to govern that principal namespace. 
As a best practice, you should test transactions locally using the Pact REPL before you send them as API requests to the development network. 

To test your keyset definition:

1. Open the `election-workshop/pact/principal-namespace.repl` file in the code editor on your computer.
   
   You might remember that this file:
   
   - Loads the public key of the `sender00` account and the `ns` module from the local filesystem into the environment data of the Pact REPL.
   - Creates the principal namespace using the `ns-name` variable. 

2. Add the following signature and transaction to define the keyset:

   ```pact
   (env-sigs
     [{ "key"  : "368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca"
      , "caps" : []
     }]
   )
   (begin-tx "Define a keyset in the principal namespace")
   (expect
     "A keyset can be defined in a principal namespace"
     "Keyset write success"
     (let ((ns-name (ns.create-principal-namespace (read-keyset "admin-keyset"))))
       (namespace ns-name)
       (define-keyset (format "{}.{}" [ns-name "admin-keyset"]) (read-keyset "admin-keyset" ))
     )
   )
   (commit-tx)
   ```

   This code: 
   - Adds a signature for the transaction.
   - Stores the name of the principal namespace in the `ns-name` variable. 
   - Uses the `ns-name` variable with the `namespace` function to enter the principal namespace before calling the `define-keyset` function. 
   - Uses the `define-keyset` function to compose the keyset name from the principal namespace name stored in the `ns-name` variable and the string `admin-keyset` instead of a hardcoded `election.election-admin-keyset` string.

3. Execute the code in the `principal-namespace.repl` file using the Pact command-line interpreter and the `--trace` command-line option.

   ```bash
   pact principal-namespace.repl --trace
   ```

   You'll see that the transaction succeeds with output similar to the following:

   ```bash
   ...
   principal-namespace.repl:21:0-25:3:Trace: "Setting transaction signatures/caps"
   principal-namespace.repl:27:0-27:55:Trace: "Begin Tx 2 Define a keyset in the principal namespace"
   principal-namespace.repl:28:2-35:1:Trace: "Expect: success A keyset can be defined in a principal namespace"
   principal-namespace.repl:36:0-36:11:Trace: "Commit Tx 2 Define a keyset in the principal namespace"
   Load successful
   ```

   In this example, you defined a keyset using the public key for `sender00` account. 
   Next, you can define a keyset in the principal namespace you created on the development network using the administrative account you created in [Add an administrator account](/resources/election-workshop/workshop-admin).

## Define a keyset in your principal namespace

Now that you've seen how to use the `define-keyset` function and how to enter a specific namespace with the `namespace` function, you're ready to define a keyset for your principal namespace on the local development network with the administrative account you created previously.

To define a keyset for the principal namespace on the development network:

1. Verify the development network is currently running on your local computer.

2. Open your code editor and navigate to the `election-namespace.ktpl` file that you created previously.
   
   For example, open the `~/.kadena/transaction-templates` folder in your code editor.

3. Modify the code in the transaction request to define a keyset in your principal namespace using the public key for the `election-admin` administrator account that you created in [Add an administrator account](/resources/election-workshop/workshop-admin).
   
   For example:
   
   ```yaml
   code: |-
     (let ((ns-name (ns.create-principal-namespace (read-keyset "election-admin" ))))
        (define-namespace ns-name (read-keyset "election-admin" ) (read-keyset "election-admin" ))
     )

     (let ((ns-name (ns.create-principal-namespace (read-keyset "election-admin"))))
        (namespace ns-name)
     (define-keyset (format "{}.{}" [ns-name "election-admin"]) (read-keyset "election-admin" ))
     )
   ```

5. Create a transaction that uses the template by running the `kadena tx add` command and following the prompts displayed.

6. Sign the transaction by running the `kadena tx sign` command and following the prompts displayed.

7. Send the signed transaction to the blockchain by running the `kadena tx send` command and following the prompts displayed.

8. Verify the transaction results using the request key for the transaction.

   Note that combining the code to define or redefine the namespace and define a keyset for the namespace doesn't record the namespace name in the transaction results.
   If you didn't take note of the principal namespace defined for the keyset you used in the previous tutorial, you can rerun the transaction to define the principal namespace or create a separate transaction similar to the following:
   
   ```pact
   (define-namespace (ns.create-principal-namespace (read-keyset "election-admin")) (read-keyset "election-admin") (read-keyset "election-admin"))
   ```

   You'll always get the same unique principal namespace for the same keyset. 
   The principal namespace for the `d0aa32802596b8e31f7e35d1f4995524f11ed9c7683450b561e01fb3a36c18ae` public key used in the previous tutorial is `n_d5ff15d933b83c1ef691dce3dabacfdfeaeade80` and the keyset defined in that namespace for this tutorial is `n_d5ff15d933b83c1ef691dce3dabacfdfeaeade80.election-admin`.
   You need this information in the next tutorial.
   
You now have a **keyset definition** that governs your principal namespace on the local development network.
This keyset is controlled by the administrative account you created using `kadena-cli` commands.

## Next steps

In this tutorial, you learned how to:

- Define and update a keyset in the Pact REPL.
- Test the behavior of keysets before defining a keyset on the blockchain.
- Create a transaction to define a keyset in your principal namespace on the local development network.

In the next tutorial, you'll create your first **Pact module** for the election application.
You'll define the Pact module inside of your principal namespace and control how it's used with the keyset you defined in this tutorial. 
After you complete the tutorial, you'll have the basic functionality for the election application website.

To see the code for the activity you completed in this tutorial and get the starter code for the next tutorial, check out the `06-smart-contracts` branch from the `election-workshop` repository by running the following command in your
terminal shell:

```bash
git checkout 06-smart-contracts
```
