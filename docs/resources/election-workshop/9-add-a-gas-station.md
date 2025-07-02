---
title: 'Add a gas station'
description: 'Prepare a gas station module to pay the transaction fees for account holders who cast votes in the election application.'
id: workshop-gas
sidebar_position: 10
---

# Add a gas station

Traditional elections have minimal safeguards against fraud, corruption, mishandling of ballots, and intentional or unintentional disruptions. 
Even where voting is available by mail or online, elections can be costly, inefficient, and subject to human error.

By using blockchain technology, elections could be made more convenient, transparent, and reliable. 
For example:

- Every vote can be recorded as a public transaction that can't be altered.
- Voters can remain anonymous with votes linked to an encrypted digital fingerprint instead of government-issued identification.
- Election results can be independently verified by anyone.

However, there is one main drawback to using a blockchain to cast votes in an election. 
Because every vote is a public transaction that changes the state of the blockchain, every vote requires computational resources and incurs a processing fee—commonly referred to as a **gas** payment.

Paying for transaction processing is normal in the context of many business operations, but paying to vote is essentially undemocratic. 
To address this issue, Kadena introduced a transaction processing clearing house for paying fees called a **gas station**.

A gas station is an account that exists only to make transaction fee payments on behalf of other accounts and under specific conditions. 
For example, a government agency could apply a fraction of its budget for a traditional election to fund a gas station. 
The gas station could then pay the transaction fee for every voting transaction, allowing all citizens to vote for free.

For more information about the introduction of gas stations, see [The First Crypto Gas Station is Now on Kadena’s Blockchain](https://medium.com/kadena-io/the-first-crypto-gas-station-is-now-on-kadenas-blockchain-6dc43b4b3836).

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local computer.
- You have a code editor, such as [Visual Studio Code](https://code.visualstudio.com/download), access to an interactive terminal shell, and are generally familiar with using command-line programs.
- You have cloned the [voting-dapp](https://github.com/kadena-community/voting-dapp.git) repository to create your project directory as described in [Prepare your workspace](/resources/election-workshop/workshop-prepare).
- You have the development network running in a Docker container as described in [Start a local blockchain](/resources/election-workshop/workshop-start).
- You are [connected to the development network](/resources/election-workshop/workshop-start#connect-to-the-development-network) using your local host IP address and port number 8080.
- You have created and funded an administrative account as described in [Add an administrator account](/resources/election-workshop/workshop-admin).
- You have created a principal namespace on the development network as described in [Define a namespace](/resources/election-workshop/workshop-namespace).
- You have defined the keyset that controls your namespace using the administrative account as described in [Define keysets](/resources/election-workshop/workshop-keysets).
- You have created an `election` Pact module and deployed it as described in [Write a smart contract](/resources/election-workshop/workshop-write).
- You have added functions and updated the `election` module deployed on the development network as described in [Nominate candidates](/resources/election-workshop/workshop-nominate) and [Add vote management](/resources/election-workshop/workshop-vote).

## Create a voter account

In the previous tutorial, you voted with your administrative account. 
The transaction was successful because the account had sufficient funds to pay the transaction fee. 
For this tutorial, you need to create a new voter account on the development network. 
Initially, you'll use the voter account to see that voting in the election application requires you to have funds in an account.
Later, you'll use the voter account to verify that voting transactions are paid using a separate gas station account.

As previously discussed, there are many ways you can create keys and accounts, including `kadena-cli` commands, Chainweaver, or another wallet application. 
For this tutorial, you'll create an account in the wallet you created when you ran the `kadena config init` command in [Create an account](/resources/election-workshop/workshop-start#create-an-account).

To create a voter account:

1. Verify the development network is currently running on your local computer.

1. Open a terminal shell on your computer.

2. Add a new account to the wallet by running `kadena account add` and following the prompts displayed.
   
   For example:

   ```bash
   ? How would you like to add the account locally? Wallet - Add an account by providing public keys from a list of available wallets
   ? Select a wallet: Wallet: pistolas
   ? Enter an alias for an account: voter
   ? Enter the name of a fungible: coin
   ? Select public keys to add to account(index - alias - publickey): Generate new public key
   ? Enter the wallet password: ********
   ? Select a keyset predicate: keys-all
   
   The account configuration "voter" has been saved in .kadena/accounts/voter.yaml
   ```
   
   You now have a new local `voter` account.
   However, the account doesn't exist on any specific network or chain.
   You could use `kadena account fund` to give the account a minimal balance on the development network.
   For the purposes of this tutorial, you want to add the account to the coin ledger with a zero (0.0) balance.
   To do that, you can create a transaction that calls the `coin.create-account` function.

3. Add a new `create-account.ktpl` transaction template for creating an account in the `.kadena/transaction-templates` folder.
   For example:
   
   ```yaml
   code: |-
     (coin.create-account "{{{new-account-name}}}" (read-keyset "account-guard"))
   data:
     account-guard:
       keys:
         - {{{publicKey}}}
       pred: {{{predicate}}}
   meta:
     chainId: "{{chain-id}}"
     sender: {{{wallet-account}}}
     gasLimit: 2000
     gasPrice: 0.00000001
     ttl: 7200
   signers:
     - public: {{wallet-publicKey}}
       caps:
         - name: "coin.GAS"
           args: []
   networkId: "{{network:networkId}}"
   type: exec
   ```

5. Create a transaction that uses the template by running the `kadena tx add` command and following the prompts displayed.
   
   For this transaction:
   - Use the `voter` account name from your wallet for the `new-account-name` variable.
   - Use the `voter` public key for the `publicKey` variable.
   - Use the `wallet` account name for the `wallet-account` variable.
   - Use the `wallet` public key for the `wallet-publicKey` variable.

6. Sign the transaction by running the `kadena tx sign` command and following the prompts displayed.
   
   For this transaction, select the `Sign with wallet` option and specify the wallet password.

7. Send the signed transaction to the blockchain by running the `kadena tx send` command and following the prompts displayed.

## Attempt to cast a vote

To attempt to cast a vote with the new `voter` account:

1. Verify the development network is currently running on your local computer.

2. Add a new `vote.ktpl` transaction template in the `.kadena/transaction-templates` folder.
   For example:
   
   ```yaml
   code: |-
      (n_90785a0e8c65525ef342c84991842f851868f7cb.election.vote "{{account-name}}")
   data:
   meta:
      chainId: "{{chain-id}}"
      sender: "{{{account-name}}}"
      gasLimit: 80300
      gasPrice: 0.000001
      ttl: 600
   signers:
      - public: "{{public-key}}"
        caps: []
   networkId: "{{network-id}}"
   ```

5. Create a transaction that uses the template by running the `kadena tx add` command and following the prompts displayed.
   
   For this transaction:
   - Use the voter account name from your wallet for the `account-name` variable.
   - Use the chain where you deployed the election module for the `chain-id` variable.
   - Use the voter public key for the `publicKey` variable.
   - Use development for the `network-id` variable.

6. Sign the transaction by running the `kadena tx sign` command, select the `Sign with wallet` option, and type the wallet password.

7. Send the signed transaction by running the `kadena tx send` command and selecting the signed transaction file.

   Because the current implementation doesn't allow accounts with a zero balance to vote, you'll see that the transaction fails with an error message similar to the following:

   ```bash
   Error in processing transaction: "D62Gs0Zx...3f8vuajw" Failed to buy gas: Insufficient funds
   ```

## Implement the gas payer interface

Before accounts without funds can vote, you need to add a second Pact module—the `election-gas-station` module—that implements the `gas-payer` interface to your `election` smart contract.

To create the gas station module:

1. Open the `election-workshop/pact` folder in the code editor on your computer.

2. Create a new `election-gas-station.pact` file in the `pact` folder.

3. Open the `election-gas-station.pact` file and add the Pact code to specify the namespace, module name, and module owner.

   For example:

   ```pact
   (namespace "n_d5ff15d933b83c1ef691dce3dabacfdfeaeade80")

   (module election-gas-station GOVERNANCE
     (defcap GOVERNANCE () 
       (enforce-guard (keyset-ref-guard "n_d5ff15d933b83c1ef691dce3dabacfdfeaeade80.election-admin")))

   )
   ```
   
   As you can see in this example, the new module—like the `election` module—is deployed in the principal namespace and governed by the `election-admin` keyset.
   Be sure you replace the namespace and keyset information with the principal namespace and keyset you have deployed on the development network.

1. Add `gas-payer-v1` as the interface you want to implement in this module inside of the module declaration.

   For example: 
   
   ```pact
   (namespace "n_d5ff15d933b83c1ef691dce3dabacfdfeaeade80")

   (module election-gas-station GOVERNANCE
     (defcap GOVERNANCE () 
       (enforce-guard (keyset-ref-guard "n_d5ff15d933b83c1ef691dce3dabacfdfeaeade80.election-admin")))
     (implements gas-payer-v1)
   )
   ```

   You can find the `gas-payer-v1` interface locally in the `election-workshop/pact/root/gas-payer-v1.pact` file for your project so that you can test your module in the Pact REPL. 
   The interface is also pre-installed on the Kadena development, test, and main networks, so you don't need to deploy it when you deploy the `election-gas-station` module. 
   However, you must implement the capabilities, types, and functions that are defined in the `gas-payer-v1.pact` file before you can start testing.

2. Implement the `GAS_PAYER` capability as defined in the `gas-payer-v1.pact` file and compose an inner capability called `ALLOW_GAS` to use as a guard for the account used to pay transaction fees:

   ```pact
     (defcap GAS_PAYER:bool
        ( user  : string
          limit : integer
          price : decimal
        )
        (compose-capability (ALLOW_GAS))
     )
 
     (defcap ALLOW_GAS () true)

     (defun create-gas-payer-guard:guard ()
       (create-capability-guard (ALLOW_GAS))
     )
   ```
   
   With this code, an account granted the `GAS_PAYER` capability can pay gas fees for any transaction.
   In addition, the `create-gas-payer-guard` function uses the built-in `create-capability-guard` function to return a guard for the `ALLOW_GAS` capability.
   The guarded inner capability `ALLOW_GAS` always returns `true` so that the gas station account can pay the transaction fees on behalf of any account.

3. Create a `election-gas-station.repl` file in the `pact` folder and add the following lines of code:

   ```pact
   (load "setup.repl")

   (begin-tx "Load election gas station module")
     (load "root/gas-payer-v1.pact")
     (load "election-gas-station.pact")
   (commit-tx)
   ```
      
4. Execute the code in the `election-gas-station.repl` file using the Pact command-line interpreter and the `--trace` command-line option.

   ```bash
   pact election-gas-station.repl --trace
   ```

   You should see that the transaction succeeds with output similar to the following:

   ```bash
   ...
   election-gas-station.repl:3:2-3:33:Trace: "Loading root/gas-payer-v1.pact..."
   root/gas-payer-v1.pact:0:0-31:1:Trace: Loaded interface gas-payer-v1, hash iIWAP1oen_kpXjFbnQM87AJRZIgtsfZcAwYrEy21RWQ
   election-gas-station.repl:4:2-4:36:Trace: "Loading election-gas-station.pact..."
   election-gas-station.pact:1:0-1:56:Trace: "Namespace set to n_d5ff15d933b83c1ef691dce3dabacfdfeaeade80"
   election-gas-station.pact:3:0-22:1:Trace: Loaded module n_d5ff15d933b83c1ef691dce3dabacfdfeaeade80.election-gas-station, hash vYfspyHz004xJXyR224XLZsktOtPI5qEN5VcW7pZsdM
   election-gas-station.repl:5:0-5:11:Trace: "Commit Tx 3 Load election gas station module"
   Load successful
    ```

    Now that you have a working implementation of the `gas-payer-v1` interface, you can deploy the new module on the development network to test whether it can pay the transaction fee for votes cast using the election application.

## Deploy the module on the development network

To deploy the new Pact module on the development network:

1. Verify the development network is currently running on your local computer.

2. Copy the `election-module-devnet.ktpl` transaction template that you created previously and rename the file as `election-gas-module-devnet.ktpl` to add create new transaction template.

3. Remove the `"init-candidates": true` and `"upgrade": true` properties, then save the file.

4. Create a transaction that uses the `election-gas-module-devnet.ktpl` template by running the `kadena tx add` command and following the prompts displayed.

5. Sign the transaction by running the `kadena tx sign` command and following the prompts displayed.

6. Send the signed transaction to the blockchain by running the `kadena tx send` command and following the prompts displayed.

   You can verify the transaction results using the request key for the transaction.
  
   ![Election module deployed on the development chain](/img/election-workshop/gas-module-loaded.jpg)

## Create the gas station account

Because the GAS_PAYER account is guarded by the ALLOW_GAS capability, you can use the `create-principal` built-in function to automatically create its account name with a `c:` prefix. 
You can then define the gas station account name as a constant in the `election-gas-station.pact` file.

To create a capability-guarded account:

1. Open the `election-workshop/pact` folder in the code editor on your computer.
2. Open the `election-gas-station.pact` file and add the following line of code to the end of the module declaration:

   ```pact
   (defconst GAS_STATION_ACCOUNT (create-principal (create-gas-payer-guard)))
   ```

3. Open the `./pact/election-gas-station.repl` file and update the transaction to display the capability-guarded gas station account name when you run the file.

   ```pact
   (load "setup.repl")

   (begin-tx "Load election gas station module")
     (load "root/gas-payer-v1.pact")
     (load "election-gas-station.pact")
     [GAS_STATION_ACCOUNT]
   (commit-tx)
   ```

4. Execute the code in the `election-gas-station.repl` file using the Pact command-line interpreter and the `--trace` command-line option.

   ```bash
   pact election-gas-station.repl --trace
   ```

   You should see that the transaction succeeds with output similar to the following:

   ```bash
   ...
   election-gas-station.repl:4:2-4:36:Trace: "Loading election-gas-station.pact..."
   election-gas-station.pact:1:0-1:56:Trace: "Namespace set to n_d5ff15d933b83c1ef691dce3dabacfdfeaeade80"
   election-gas-station.pact:3:0-24:1:Trace: Loaded module n_d5ff15d933b83c1ef691dce3dabacfdfeaeade80.election-gas-station, hash QZMPB9N5frFc_gcJ3o7YtqTqCvMKhLA4OUxVT9X8sPU
   election-gas-station.repl:5:2-5:23:Trace: ["c:1PaIauckhwRAVXP8YyoxSIczy60Nh9s9-_K59ugzW8A"]
   election-gas-station.repl:6:0-6:11:Trace: "Commit Tx 3 Load election gas station module"
   Load successful
   ```

5. Open the `election-gas-station.pact` file in the code editor on your computer.

6. Add an `init` function that uses the `create-account` function from the `coin` module to create the gas station account in the `election-gas-station` module:

   ```pact
   (defun init ()
     (coin.create-account GAS_STATION_ACCOUNT (create-gas-payer-guard))
   )
   ```

   In this code:

   - The first argument of the function is the account name you just defined.
   - The second argument is the guard for the account.

7. Add an if-statement after the module declaration that calls the `init` function if the module is deployed with `{ "init": true }` in the transaction data:

   ```pact
   (if (read-msg 'init)
     [(init)]
     ["not creating the gas station account"]
   )
   ```

8. Update the `election-gas-station.repl` file to set `init` to true for the next transaction by adding the following lines of code after loading the `setup.repl` module:

   ```pact
   (env-data
     { "init": true }
   )
   ```

4. Execute the code in the `election-gas-station.repl` file using the Pact command-line interpreter and the `--trace` command-line option.

   ```pact
   pact election-gas-station.repl --trace
   ```

   You should see that the transaction succeeds with output similar to the following:

   ```bash
   ...
   election-gas-station.pact:29:0-32:1:Trace: ["Write succeeded"]
   election-gas-station.repl:9:2-9:23:Trace: ["c:1PaIauckhwRAVXP8YyoxSIczy60Nh9s9-_K59ugzW8A"]
   election-gas-station.repl:10:0-10:11:Trace: "Commit Tx 3 Load election gas station module"
   Load successful
   ```

   If you're successful loading the `election-gas-station module` in the Pact REPL, you can update the module deployed on the development network.

## Update the gas station module

To deploy the new Pact module on the development network:

1. Verify the development network is currently running on your local computer.

2. Open the `election-gas-module-devnet.ktpl` file, add the `"init": true` property to the transaction data, and save the file.
   
   ```yaml
   data:
     election-admin:
       keys: ["{{public-key}}"]
       pred: "keys-all"
     "init": true
   ```

3. Create a transaction that uses the `election-gas-module-devnet.ktpl` template by running the `kadena tx add` command and following the prompts displayed.

4. Sign the transaction by running the `kadena tx sign` command and following the prompts displayed.

5. Send the signed transaction to the blockchain by running the `kadena tx send` command and following the prompts displayed.

   You can verify the transaction results using the request key for the transaction.

## Fund the gas station account

Now that you have created and deployed a secure gas station account, you're ready to fund the account to pay transaction fees.

To fund the gas station account:

1. Verify the development network is currently running on your local computer.

3. Create a transaction that uses the `transfer.ktpl` template by running the `kadena tx add` command and following the prompts displayed.
   
   For this transaction:

   - Use the election administrator account for the `account:from` variable.
   - Use the capability-guarded account (c:) for the `account:to` variable.
   - Use 1.0 for the `decimal:amount` variable.
   - Use the chain identifier where you deployed the election module for the `chain-id` variable.
   - Use the public key for election administrator for the `key:fromt` variable.
   - Use development for the `network-id` variable.

4. Sign the transaction by running the `kadena tx sign` command and following the prompts displayed.

5. Send the signed transaction to the blockchain by running the `kadena tx send` command and following the prompts displayed.



## Update the vote function

The next step is to ensure that the signature of the voter account is within the scope of the `GAS_PAYER` capability. 
To do this, you'll update the `vote` function to accept the following arguments:

- The voter account name.
- Zero as the gas limit to allow unlimited gas.
- Zero as the gas price.

You'll also change the `senderAccount` in the transaction metadata to use the `election-gas-station` module so that the election gas station account pays the transaction fee for voting transactions instead of the voter account.

To update the `vote` function:

1. Open the `frontend/src/repositories/vote/DevnetVoteRepository.ts` file in the code editor.

2. Update the `vote` function to change the `.addSigner(accountKey(account))` code as follows:

   ```typescript
   .addSigner(accountKey(account), (withCapability) => [
     withCapability(`${NAMESPACE}.election-gas-station.GAS_PAYER`, account, { int: 0 }, { decimal: '0.0' }),
   ])
   ```

3. Update the `senderAccount` in the transaction metadata to use the capability-guarded gas station account.
   
   For example as follows:

   ```typescript
   .setMeta({
      chainId: CHAIN_ID,
      ttl: 28000,
      gasLimit: 100000,
      gasPrice: 0.000001,
      senderAccount: 'c:6mPDcWM1oMKDI3mdEio-Yczjul4IYZYcjlhZ--Rkhe8',
   })
   ```


## Set the scope for signatures

At this point, most of the work required to use a gas station to pay transaction fees is done. 
However, when you added the `ACCOUNT-OWNER` capability to the `election-workshop/pact/election.pact` file in the previous tutorial, you didn't set the scope for the capability.

In a test from the previous tutorial, the `caps` field passed to `env-sigs` is an empty array:

```pact
(env-sigs
  [{ 'key  : "voter"
   , 'caps : []
  }]
)
```

Because the signature isn't scoped to any capability, the unrestricted signing key automatically approves all capabilities required for the function to execute.

However, in this tutorial, you modified the `vote` function in the `frontend/src/repositories/vote/DevnetVoteRepository.ts` file to scope the signature of the `vote` transaction to grant the `GAS_PAYER` capability, but not the `ACCOUNT-OWNER` capability. 

If you sign for some capabilities but not for all capabilities that are required for a transaction, the transaction will fail at the point where a capability is required that you didn't sign for. 
Therefore, you need to add a second capability to the array passed to `addSigners` in the `vote` function.

To set the scope for the `ACCOUNT-OWNER` capability:

1. Open the `frontend/src/repositories/vote/DevnetVoteRepository.ts` file in the code editor.

2. Add the `ACCOUNT-OWNER` capability to the `.addSigner` with the following line of code:

   ```typescript
   withCapability(`${NAMESPACE}.election.ACCOUNT-OWNER`, account),
   ```

   After making this change, the voter signature is scoped to two capabilities:

   ```typescript
   .addSigner(accountKey(account), (withCapability) => [
      withCapability(`${NAMESPACE}.election-gas-station.GAS_PAYER`, account, { int: 0 }, { decimal: '0.0' }),
      withCapability(`${NAMESPACE}.election.ACCOUNT-OWNER`, account),
    ])
   ```

## Cast a vote

To cast a vote with the voter account:

1. Verify the development network is currently running on your local computer.

2. Open `http://localhost:5173` in your browser and verify that there's at least one candidate listed.

3. Click **Set Account**, copy and paste the voter account name from Chainweaver to vote using that account, then click **Save**.

4. Click **Vote Now** for a candidate, sign the transaction, and wait for it to complete.

   You should see the vote count for the candidate you voted for incremented by one vote.

   ![View the result after voting](/img/election-workshop/election-two-votes.png)

## Enforce a limit on transaction fees

You now have a functioning gas station for the election application. However, you might want to make some additional changes to make the module more secure. For example, you should enforce an upper limit for transaction fees to help ensure that funds in the gas station account aren't drained too quickly.

To set an upper limit for transaction fees:

1. Open the `election-gas-station.pact` file in the code editor on your computer.

2. Add the following function to retrieve the gas price from the metadata of the transaction using the built-in `chain-data` function:

   ```pact
   (defun chain-gas-price ()
     (at 'gas-price (chain-data))
   )
   ```

3. Add the following function to force the gas price to be below a specified limit.

   ```pact
   (defun enforce-below-or-at-gas-price:bool (gasPrice:decimal)
     (enforce (<= (chain-gas-price) gasPrice)
       (format "Gas Price must be lower than or equal to {}" [gasPrice]))
   )
   ```

4. Update the `GAS_PAYER` capability by adding `(enforce-below-or-at-gas-price 0.000001)` right before `(compose-capability (ALLOW_GAS))`.

   For example:

   ```pact
   (enforce-below-or-at-gas-price 0.000001)
   (compose-capability (ALLOW_GAS))
   ```

## Set limits on the transactions allowed

In its current state, any module can use your gas station to pay for any type of transaction, including transactions that involve multiple steps and could be quite costly. For example, a cross-chain transfer is a transaction that requires a continuation with part of the transaction taking place on the source chain and completed on the destination chain. This type of "continued" transaction requires more computational resources—that is, more gas—than a simple transaction that completes in a single step.

To prevent the gas station account from being depleted by transactions that require multiple steps, you can configure the gas station module to only allow simple transactions, identified by the `exec` transaction type. Transactions identified with the `exec` transaction type can contain multiple functions but complete in a single step.

To set limits on the transactions allowed to access the gas station account:

1. Open the `election-gas-station.pact` file in the code editor on your computer.

2. Restrict the transaction type to only allow `exec` transactions by adding the following line to the start of the `GAS_PAYER` capability definition:

   ```pact
   (enforce (= "exec" (at "tx-type" (read-msg))) "Can only be used inside an exec")
   ```

   An `exec` transaction can contain multiple function calls. You can further restrict access to the funds in the gas station account by only allowing specific function calls.

   An `exec` transaction can contain multiple function calls. You can also restrict access to the gas station account by only allowing specific function calls.

3. Restrict access to only allow one function call by adding the following line to the `GAS_PAYER` capability definition:

   ```pact
   (enforce (= 1 (length (at "exec-code" (read-msg)))) "Can only be used to call one pact function")
   ```

4. Restrict access to only pay transaction fees for functions defined in the `election` module by adding the following line to the `GAS_PAYER` capability definition:

   ```pact
   (enforce
     (= "(n_14912521e87a6d387157d526b281bde8422371d1.election." (take 52 (at 0 (at "exec-code" (read-msg)))))
     "Only election module calls are allowed"
   )
   ```

   Remember to replace the namespace with your own principal namespace.

## Update the smart contract on the development network

After you've completed the changes to secure the gas station account, you are ready to update the smart contract you have deployed on the development network and complete the workshop.

To update the smart contract and complete the workshop:

1. Open the `election-workshop/pact` folder in a terminal shell on your computer and verify all of the tests you created in the workshop pass using the Pact REPL.

   - pact/candidates.repl
   - pact/election-gas-station.repl
   - pact/keyset.repl
   - pact/module.repl
   - pact/namespace.repl
   - pact/principal-namespace.repl
   - pact/setup.repl

1. Verify the development network is currently running on your local computer.

1. Open and unlock the Chainweaver desktop or web application and verify that:

   - You're connected to **development network (devnet)** from the network list.
   - Your administrative account name with the **k:** prefix exists on chain 1.
   - Your administrative account name is funded with KDA on chain 1.

1. Open the `election-workshop/snippets` folder in a terminal shell on your computer.

1. Update your `election-gas-station` module on the development network by running a command similar to the following with your administrative account name:

   ```bash
   npm run deploy-gas-station:devnet -- k:<your-public-key> upgrade
   ```

   Remember that `k:<your-public-key>` is the default **account name** for the administrative account that you funded in [Add an administrator account](/resources/election-workshop/workshop-admin). You can copy this account name from Chainweaver when viewing the account watch list. When you run the script, you should see Chainweaver display a QuickSign Request.

1. Click **Sign All** to sign the request.

   After you click Sign All, the transaction is executed and the results are displayed in your terminal shell.

1. Verify your contract changes in the Chainweaver Module Explorer by refreshing the list of **Deployed Contracts**, then clicking **View** for the `election-gas-station` module.

   After you click View, you should see the updated list of functions and capabilities. If you click **Open**, you can view the module code in the editor pane and verify that the `election-gas-station` module deployed on the local development network is what you expect.

## Next steps

In this tutorial, you learned how to:

- Add a second module to your smart contract.
- Define a gas station account that pays transaction fees on behalf of other accounts.
- Restrict access to the gas station account based on conditions you specify in the Pact module.
- Deploy the gas station module on the development network.

In this workshop, you configured an election application to use the Kadena client to interact with a smart contract deployed on the Kadena blockchain as its backend. The workshop demonstrates the basic functionality for conducting an election online that uses a blockchain to provide more efficient, transparent, and tamper-proof results. However, as you saw in [Add vote management](/resources/election-workshop/wworkshop-vote), it's possible for individuals to vote more than once by simply creating additional Kadena accounts. That might be a challenge you want to explore.

As an alternative, you might want to deploy the election application and smart contract on the Kadena test network, making it available to community members.

We can't wait to see what you build next.

To see the code for the activity you completed in this tutorial, check out the `00-complete` branch from the `voting-dapp` repository by running the following command in your terminal shell:

```bash
git checkout 00-complete
```
