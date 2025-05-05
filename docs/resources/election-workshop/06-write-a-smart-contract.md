---
title: 'Write a smart contract'
description:
  'Use the Pact smart contract language to build the scaffolding for the
  election application smart contract backend.'
id: workshop-write
sidebar_position: 7
---

# Write a smart contract

Now that you have a unique principal  namespace controlled by your administrative keyset, you're ready to start building the backend for the election application. 
In this tutorial, you'll learn the basics of how to write a **smart contract** that can be deployed on the blockchain as the backend code for the election application.

A smart contract is a special type of application runs automatically when the conditions specified in the contract logic are met. 
By deploying a smart contract on a blockchain, the terms of an agreement can be executed programmatically in a decentralized way, without any intermediary involvement or process delays.

On the Kadena blockchain, a smart contract consists of one or more **modules** written in the Pact programming language. 
For this workshop, the election smart contract consists of two modules: the main **election** module and an auxiliary
**gas station** module.

The exercises in this tutorial illustrate the basics of building and deploying a Pact module as you develop the main **election** module. 
At the completion of this tutorial, you'll deploy the core logic of the election module on your local development network.

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local computer.
- You have a code editor, such as [Visual Studio Code](https://code.visualstudio.com/download), access to an interactive terminal shell, and are generally familiar with using command-line programs.
- You have cloned the [voting-dapp](https://github.com/kadena-community/voting-dapp.gitp) repository to create your project directory as described in [Prepare your workspace](/resources/election-workshop/workshop-prepare).
- You have the development network running in a Docker container as described in [Start a local blockchain](/resources/election-workshop/workshop-start).
- You are [connected to the development network](/resources/election-workshop/workshop-start#connect-to-the-development-network) using your local host IP address and port number 8080.
- You have created and funded an administrative account as described in [Add an administrator account](/resources/election-workshop/workshop-admin).
- You have created a principal namespace on the development network as described in [Define a namespace](/resources/election-workshop/workshop-namespace).
- You have defined the keyset in your principal namespace using the administrative account as described in [Define keysets](/resources/election-workshop/workshop-keysets). 

## Define a minimal Pact module

To get started writing Pact modules, you must have a file that contains the bare minimum of code required to deploy. 
You can create and test this starter code for a Pact module using the Pact REPL. 
After you have a minimal working deployment, you can add and refactor the code to add functionality to the Pact
module.

To create the starter code for a Pact module:

1. Open the `election-workshop/pact` folder in the code editor on your computer.

2. Create a new file named `module.repl` in the `pact` folder.

3. Add a transaction that uses the `module` keyword to define a new module named `election` and a module owner to protect access to the module's functions. 
   
  All modules require either a keyset, like the `admin-keyset`, or a [capability](/resources/glossary#capability) to control who can deploy or update the module, and, potentially, who can execute protected operations. 
  
  You must specify the governance keyset or capability immediately after the module name.
  Although keysets—like the `admin-keyset` you've used in previous tutorials—are valid module owners, most modules define a governance capability as a more flexible solution.
  For example, you can define a GOVERNANCE capability that is always true by adding the following lines in the `module.repl` file:

   ```pact
   (begin-tx "Deploy the election module")
     (module election GOVERNANCE)
        (defcap GOVERNANCE () true)
   (commit-tx)
   ``` 
   
   You'll learn more about capabilities a little later in this tutorial and in other tutorials.
   For now, there are only two points to keep in mind about this capability:

   - The name you use for the capability isn't significant—you can use any name—however, the placement of the capability at the start of the module declaration is significant.
   - The definition of a capability as always true represents the simplest form a definition can take for demonstration purposes. 
   
   You could also write this definition using an `enforce` statement similar to the following with exactly the same results:

   ```pact
   (begin-tx "Deploy the election module")
     (module election GOVERNANCE
        (defcap GOVERNANCE () 
          (enforce (= 1 1)))
     )
   (commit-tx)
   ``` 
   
   At this point, you have a module name and a module owner in the form of a capability.
   For this module to be useful, you must define at least one function.
   The first function you'll define in this module is the `list-candidates` function.

1. Add a `list-candidates` function as the first function in the  `election` module declaration transaction.
   
   ```pact
   (begin-tx "Deploy the election module")
     (module election GOVERNANCE       ; Start the module declaration
        (defcap GOVERNANCE () true)    ; Define the module owner capability
   
        (defun list-candidates () [])  ; Add a new function to the transaction   
     )                                 ; End the module declaration
   (commit-tx)
   ```

   Later, you'll update this function to list the candidates stored in a database table. 
   For now, this function just returns an empty list (`[]`).

3. Execute the code in the `module.repl` file using the Pact command-line interpreter and the `--trace` command-line option.

   ```bash
   pact module.repl --trace
   ```

   You'll see that the transaction succeeds with output similar to the following:

   ```bash
   module.repl:0:0-0:39:Trace: "Begin Tx 0 Deploy the election module"
   module.repl:1:2-6:3:Trace: Loaded module election, hash iKhGsvHzyhKh947693r9mF5leHM4Iw0rDjeoj6WQyL8
   module.repl:7:0-7:11:Trace: "Commit Tx 0 Deploy the election module"
   Load successful
   ```

   If you open the Pact command-line interpreter REPL, you can load this file and test that the `list-candidates` function returns an empty list.
   For example, type `pact` in the terminal shell to open the Pact command-line interpreter, then load the `module.repl` file and call the `list-candidates` function to see output similar to the following:

   ```pact
   pact> (load "module.repl")
   "Loading module.repl..."
   "Begin Tx 0 Deploy the election module"
   Loaded module election, hash iKhGsvHzyhKh947693r9mF5leHM4Iw0rDjeoj6WQyL8
   "Commit Tx 0 Deploy the election module"
   pact> (election.list-candidates)
   []
   ```

   Type Control-d to exit the Pact command-line interpreter REPL.

4. Add the environment data keyset and signature and the transactions to define a namespace for the `election` module to the `module.repl` file before the start of the module declaration.
   
   For example:

   ```pact
   (env-data
      { "admin-keyset" :
         { "keys" : [ "admin-public-key" ]
         , "pred" : "keys-all"
         }
      }
   )
   (env-sigs
      [{ "key"  : "admin-public-key"
       , "caps" : []
      }]
   )
   
   (begin-tx "Define a namespace for the module")
      (define-namespace 'election (read-keyset 'admin-keyset) (read-keyset 'admin-keyset))
   (commit-tx)
   (begin-tx "Define a keyset to govern the module")
      (namespace 'election)
      (define-keyset "election.admin-keyset" (read-keyset 'admin-keyset))
   (commit-tx)
   
   (begin-tx "Deploy the election module")
      (module election GOVERNANCE       ; Start the module declaration
         (defcap GOVERNANCE () true)    ; Define the module owner capability
    
         (defun list-candidates () [])  ; Add a new function to the transaction   
      )                                 ; End the module declaration
   (commit-tx)
   ```
   
   As you might remember from previous tutorials, this code:

   - Loads the `admin-keyset` context and signatures into the REPL environment.
   - Defines the `election` namespace.
   - Enters the `election` namespace to define the `election.admin-keyset` as the namespace owner.

3. Execute the code in the `module.repl` file using the Pact command-line interpreter and the `--trace` command-line option.

   ```pact
   pact module.repl --trace
   ```

   You'll now see that the transaction succeeds with output similar to the following:

   ```bash
   module.repl:0:0-6:1:Trace: "Setting transaction data"
   module.repl:7:0-11:1:Trace: "Setting transaction signatures/caps"
   module.repl:13:0-13:46:Trace: "Begin Tx 0 Define a namespace for the module"
   module.repl:14:4-14:88:Trace: "Namespace defined: election"
   module.repl:15:0-15:11:Trace: "Commit Tx 0 Define a namespace for the module"
   module.repl:16:0-16:49:Trace: "Begin Tx 1 Define a keyset to govern the module"
   module.repl:17:4-17:25:Trace: "Namespace set to election"
   module.repl:18:4-18:71:Trace: "Keyset write success"
   module.repl:19:0-19:11:Trace: "Commit Tx 1 Define a keyset to govern the module"
   module.repl:21:0-21:39:Trace: "Begin Tx 2 Deploy the election module"
   module.repl:22:2-26:3:Trace: Loaded module election, hash iKhGsvHzyhKh947693r9mF5leHM4Iw0rDjeoj6WQyL8
   module.repl:27:0-27:11:Trace: "Commit Tx 2 Deploy the election module"
   Load successful
   ```

## Test the election module

At this point, the `module.repl` file includes the minimal code required to define a Pact module named `election` in the `election` namespace. 
The module is owned by a minimal GOVERNANCE capability and only includes one function—the `list-candidates` function—that is publicly available because access to the function isn't guarded by any keyset or capability.
You can use the `list-modules` built-in function in the Pact REPL to test access to the `election` module and then add a transaction to call the `list-candidates` function.

To test access to the `election` module:

1. Open the `election-workshop/pact/module.repl` file in the code editor.

2. Add the following transaction to assert that the `election` module is available:

   ```pact
   (begin-tx "Look up the election module")
     (expect "The election module should exist"
      ["election"]
      (list-modules)
     )
   (commit-tx)
   ```

3. Execute the code in the `module.repl` file using the Pact command-line interpreter and the `--trace` command-line option.

   ```pact
   pact module.repl --trace
   ```

   You should see output similar to the following that indicates the `election` module is defined in the Pact REPL:

   ```bash
   ...
   module.repl:29:0-29:40:Trace: "Begin Tx 3 Look up the election module"
   module.repl:30:3-33:4:Trace: "Expect: success The election module should exist"
   module.repl:34:0-34:11:Trace: "Commit Tx 3 Look up the election module"
   Load successful
   ```

4. Clear the environment data and signature information and add a transaction to call the `list-candidates` function on the `election` module, and assert that the function returns an empty array:

   ```pact
   (env-data {})
   (env-sigs [])
   (begin-tx "Call list-candidates")
     (expect "list-candidates returns an empty list"
       []
       (election.list-candidates)
     )
   (commit-tx)
   ```

5. Execute the code in the `module.repl` file using the Pact command-line interpreter and the `--trace` command-line option.

   ```pact
   pact module.repl --trace
   ```

   You should see output similar to the following that indicates you were able to call the `list-candidates` function without signing the transaction and that the function returned an empty list:

   ```bash
   ...
   module.repl:36:0-36:13:Trace: "Setting transaction data"
   module.repl:37:0-37:13:Trace: "Setting transaction signatures/caps"
   module.repl:38:0-38:33:Trace: "Begin Tx 4 Call list-candidates"
   module.repl:39:3-42:4:Trace: "Expect: success list-candidates returns an empty list"
   module.repl:43:0-43:11:Trace: "Commit Tx 4 Call list-candidates"
   Load successful
   ```

   For the `election` module, some functions—like the `list-candidates` function—should be publicly accessible.
   Other operations—as demonstrated in the next section—should be more carefully guarded.

## Update the election module

When you defined the `election` namespace for the `election` module, you also specified the keysets with access rights and with administrative rights. 
Changes that update the module must be signed with a keyset that has the necessary rights. 
The examples in this section demonstrate how to test that updates work as expected, with transactions that update the Pact module with the correct keyset and fail to update the module with an incorrect keyset.

### Update the module with the correct keyset

To test updating a module by calling the correct administrative keyset:

1. Open the `election-workshop/pact/module.repl` file in the code editor.

2. Reload the election `admin-keyset` and signature into the Pact REPL with the following lines of code after the last transaction:

   ```pact
   (env-data
     { 'admin-keyset :
       { "keys" : [ "admin-public-key" ]
       , "pred" : "keys-all"
       }
     }
   )
   (env-sigs
     [{ "key"  : "admin-public-key"
      , "caps" : []
     }]
   )

3. Update the `election` module to change the `list-candidates` function to return a list containing 1, 2, 3 and test that `list-candidates` returns the new list.

   ```pact
   (begin-tx "Update the module")
     (module election "election.admin-keyset"
       (defun list-candidates () [1, 2, 3])
     )
   (commit-tx)
   (begin-tx "Call updated list-candidates function")
     (expect "list-candidates returns a list with numbers"
       [1, 2, 3]
       (election.list-candidates)
     )
   (commit-tx)
   ```

4. Execute the code in the `module.repl` file using the Pact command-line interpreter and the `--trace` command-line option.
   
   ```bash
   pact module.repl --trace
   ```
   
   You should see output similar to the following that indicates you were able to call the updated `list-candidates` function and that the function returned a list with numbers:

   ```bash
   ...
   module.repl:45:0-51:2:Trace: "Setting transaction data"
   module.repl:52:1-56:2:Trace: "Setting transaction signatures/caps"
   module.repl:58:0-58:30:Trace: "Begin Tx 5 Update the module"
   module.repl:59:3-61:4:Trace: Loaded module election, hash aqTzmLOHdx5cNTPnhHMu6XXE69KBqDbzWvK70dGTkyo
   module.repl:62:0-62:11:Trace: "Commit Tx 5 Update the module"
   module.repl:63:0-63:50:Trace: "Begin Tx 6 Call updated list-candidates function"
   module.repl:64:3-67:4:Trace: "Expect: success list-candidates returns a list with numbers"
   module.repl:68:0-68:11:Trace: "Commit Tx 6 Call updated list-candidates function"
   Load successful   
   ```
   
### Test updating the module with an incorrect keyset

To test that updating a module with an incorrect keyset fails:

1. Open the `election-workshop/pact/module.repl` file in the code editor.

2. Set the environment data and signature to use a different key by adding the following lines of code after the last transaction:

   ```pact
   (env-data
     { "admin-keyset" :
       { "keys" : [ "other-key" ]
       , "pred" : "keys-all"
       }
     }
   )
   (env-sigs
     [{ "key"  : "other-key"
      , "caps" : []
     }]
   )
   ```
   
3. Add a transaction to attempt to update the module with an incorrect key by adding the following lines of code:
   
   ```pact
   (begin-tx "Upgrade the module without permission")
       (module election "election.admin-keyset"
         (defun list-candidates () [])
       )
   (commit-tx)
   ```

4. Execute the code in the `module.repl` file using the Pact command-line interpreter and the `--trace` command-line option.
   
   ```pact
   pact module.repl --trace
   ```
   
   You should see the `Load failed` message and that the failure was caused by a `Keyset failure` error. 
   With these two tests, you know that you can update the Pact module by signing a transaction with the `election.admin-keyset` and that no other keyset can update the `election` module.

   ```bash
   ...
   module.repl:70:0-76:1:Trace: "Setting transaction data"
   module.repl:77:0-81:1:Trace: "Setting transaction signatures/caps"
   module.repl:83:0-83:50:Trace: "Begin Tx 7 Upgrade the module without permission"
   module.repl:85:6: Keyset failure (keys-all): [admin-ke...]
   85 |       (module election "election.admin-keyset"
   ...
   ``` 
   
5. Remove the code you added for testing an incorrect keyset.
      
6. Execute the code in the `module.repl` file to verify that the file loads successfully before you continue:
   
   ```pact
   pact module.repl --trace
   ```

## Enforce the keyset guard

With the GOVERNANCE capability set to always pass, there are no restrictions for executing functions in the module code.
This behavior is acceptable for preliminary local testing, but not desirable in any other context.
As an alternative to calling a keyset directly, you can update the module to define a restriction for the GOVERNANCE capability that enforces the use of the administrative keyset.

To test updating the module with a guarded capability:

1. Open the `election-workshop/pact/module.repl` file in the code editor.
2. Update the `election` module to define a GOVERNANCE capability that enforces the use of the `election.admin-keyset` keyset.

   ```pact
   (begin-tx "Update the module with enforce-guard")
      (module election GOVERNANCE 
        (defcap GOVERNANCE () 
        (enforce-guard (keyset-ref-guard "election.admin-keyset")))
        
        (defun list-candidates () ["Chris", "Harry", "Tai"])
      )
   (commit-tx)
   ```

1. Add a transaction that imports the `election` module and tests that the `list-candidates` function returns the expected list.
   
   ```pact
   (begin-tx "Return the list of candidates")
      (use election)  
      (election.list-candidates)
   (commit-tx)
   ```
   
2. Execute the code in the `module.repl` file using the Pact command-line interpreter and the `--trace` command-line option.
   
   ```bash
   pact module.repl --trace
   ```
   
   You should see output similar to the following that indicates you were able to call the updated `list-candidates` function and that the function returned a list with strings:

   ```bash
   ...
   module.repl:70:0-70:49:Trace: "Begin Tx 7 Update the module with enforce-guard"
   module.repl:71:3-76:4:Trace: Loaded module election, hash Z-nnwjtYoQ1RT993qOSGZkoE5b-_iKH_KL1_yMUH8xU
   module.repl:77:0-77:11:Trace: "Commit Tx 7 Update the module with enforce-guard"
   module.repl:79:0-79:42:Trace: "Begin Tx 8 Return the list of candidates"
   module.repl:80:3-80:17:Trace: Loaded imports from election
   module.repl:81:3-81:29:Trace: ["Chris" "Harry" "Tai"]
   module.repl:82:0-82:11:Trace: "Commit Tx 8 Return the list of candidates"
   Load successful
   ```

## Deploy the Pact module locally

Now that you've seen how to define and update a Pact module, you're ready to deploy the module on the local development network with the administrative account you created previously.

To deploy the Pact module on the development network:

1. Verify the development network is currently running on your local computer.

2. Open the `election-workshop/pact` folder in the code editor.

3. Create a new file named `election.pact` in the `pact` folder.

4. Add the minimal Pact code required to define a module to the `election.pact` file.
   
   ```pact
   (let ((ns-name (ns.create-principal-namespace (read-keyset "election-admin" ))))
     (define-namespace ns-name (read-keyset "election-admin" ) (read-keyset "election-admin" ))
   )
   
   (let ((ns-name (ns.create-principal-namespace (read-keyset "election-admin"))))
     (namespace ns-name)
     (define-keyset (format "{}.{}" [ns-name "election-admin"]) (read-keyset "election-admin" ))
   )
   
   (module election GOVERNANCE 
      (defcap GOVERNANCE () 
        (enforce-guard (keyset-ref-guard "n_d5ff15d933b83c1ef691dce3dabacfdfeaeade80.election-admin")))
       
      (defun list-candidates () [1, 2, 3])
   )
   ```

5. Create a new transaction template named `election-module-devnet.ktpl` in the `~/.kadena/transaction-templates` folder.

6. Open the `election-module-devnet.ktpl` file and create a reusable transaction request similar to the following using the path to the `election.pact` file that contains your Pact module code.
   
   ```pact
   codeFile: "../../election.pact"
   data:
     election-admin:
       keys: ["{{public-key}}"]
       pred: "keys-all"
   meta:
     chainId: "{{chain-id}}"
     sender: "{{{sender-account}}}"
     gasLimit: 80300
     gasPrice: 0.000001
     ttl: 600
   signers:
     - public: "{{public-key}}"
       caps: []
   networkId: "{{network-id}}"
   ```
   
7. Create a transaction that uses the template by running the `kadena tx add` command and following the prompts displayed.

8. Sign the transaction by running the `kadena tx sign` command and following the prompts displayed.

9. Send the signed transaction to the blockchain by running the `kadena tx send` command and following the prompts displayed.

   You can verify the transaction results using the request key for the transaction.

## Next steps

Congratulations! 
You now have a smart contract with one `election` module governed by the `election-admin` deployed in your principal namespace on your local development network.
In this tutorial, you learned how to:

- Define a minimal Pact module.
- Test a Pact module using the Pact REPL.
- Deploy a Pact module on the local development network.
- Implement governance for a module by using a capability.
- Update a deployed module governed by your keyset.

So far, your `election` module only contains one simple function. 
The next tutorial demonstrates how to add a schema and a database table to the `election` module and how to use that table to store the names of election candidates and the number of votes each candidate receives.

You'll also update the `list-candidates` function to return data from the database table and add a new function to nominate candidates.

To see the code for the activity you completed in this tutorial and get the
starter code for the next tutorial, check out the `07-nominate-candidates` branch from the `election-workshop` repository by running the following command in your terminal shell:

```bash
git checkout 07-nominate-candidates
```
