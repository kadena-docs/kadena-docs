---
title: 'Add an administrator account'
description: 'Create an administrative account for the election application to control access to specific functions.'
id: workshop-admin
sidebar_position: 4
---

# Add an administrator account

At this point, you have a wallet and an account that can connect to the development network and sign transactions using at least one chain where funds are available. 
In this tutorial, you'll create an administrative account to take ownership of the election application, with permission to deploy and update Pact modules and to execute protected operations.

As discussed in [Accounts, keys, and principals](/smart-contracts/accoounts), Kadena accounts aren't simply public keys.
Instead, Kadena accounts consist of four parts:

- An account name.
- An account balance.
- One or more public keys that can be used to sign transactions.
- A predicate function that specifies how many keys are required to sign transactions.

For this tutorial, you'll create an administrative account with only one key and you'll use the default `keys-all` predicate. 
The `keys-all` predicate requires transactions to be signed by all keys in the account. 
Because you're creating this account with only one key, only one signature will be required to sign transactions. 
You can use any text string of three to 256 characters for the account name. 
However, the general convention for account names that only have one key is to use the prefix `k:` followed by public key of the account.

For a more general introduction to how public and private keys are used to sign transactions and in Kadena accounts, see [Beginner’s Guide to Kadena: Accounts + Keysets](https://medium.com/kadena-io/beginners-guide-to-kadena-accounts-keysets-fb7f32104291).

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local computer.
- You have a code editor, such as [Visual Studio Code](https://code.visualstudio.com/download), access to an interactive terminal shell, and are generally familiar with using command-line programs.
- You have cloned the [voting-dapp](https://github.com/kadena-community/voting-dapp.git) repository to create your project directory as described in [Prepare your workspace](/resources/election-workshop/workshop-prepare).
- You have the development network running in a Docker container as described in [Start a local blockchain](/resources/election-workshop/workshop-start).
- You have created and funded a local account to use on the development network.

## Generate the administrative key pair

There are many tools you can use to create keys, including `kadena-cli` commands like you used in the previous tutorial, Chainweaver, or other wallet applications. 
If you followed the [Start a local blockchain](/resources/election-workshop/workshop-start) tutorial, you already have at least one public and private key pair that you could use as the basis for your administrative account. 
However, for demonstration purposes, let's create a completely new key pair to use as the administrative account for the election application.

To create a new key pair and account:

1. Verify the development network is currently running on your local computer.
2. Open a terminal shell on your computer.
3. Generate a new random key pair independent of the first account you created for the wallet by running the following command:
   
   ```bash
   kadena key generate
   ```

   Alternatively, you could add a new key to your wallet by running the `kadena account add` command.

4. Follow the prompts displayed to select an account alias and the number of keys to generate.
   
   For example:
   
   ```bash
   ? Enter an alias for your key: election-admin
   ? Enter the amount of keys you want to generate (alias-{amount} will increment) 
   (default: 1): 1
   Generated Plain Key Pair(s):
   Public key
   d0aa32802596b8e31f7e35d1f4995524f11ed9c7683450b561e01fb3a36c18ae
   
   The Key Pair is stored in your working directory with the filename(s):
   election-admin.yaml
   
   Executed:
   kadena key generate --key-alias="election-admin" --key-amount="1"
   ```

5. Add an account for the new key pair by running the `kadena account add` command and following the prompts displayed.

   For example:

   ```bash
   kadena account add                      
   ? How would you like to add the account locally? Key - Add an account by providing public keys from a key file or entering key details manually
   ? Enter an alias for an account: election-admin
   ? Enter an account name (optional): election-admin
   ? Enter the name of a fungible: coin
   ? Do you want to verify the account on chain? No, add the account without verifying on chain
   ? Select public keys to add to account(alias - publickey): election-admin.yaml 
   d0aa328025....b3a36c18ae
   ? Select a keyset predicate: keys-all
   
   The account configuration "election-admin" has been saved in .kadena/accounts/election-admin.yaml
   
   
   Executed:
   kadena account add --from="key" --account-alias="election-admin" --account-name="election-admin" --fungible="coin" --public-keys="d0aa32802596b8e31f7e35d1f4995524f11ed9c7683450b561e01fb3a36c18ae" --predicate="keys-all" 
   ```

   You now have a local account for the election administrator.
   However, an account must have funds before it can be used on any Kadena blockchain.
   To enable the local account for the election administrator to be used on-chain, you must fund the account on a specific network and chain.
   You can fund on-chain accounts for testing purposes by submitting a request using [Kadena Developer Tools](https://tools.kadena.io/) or the `kadena account fund` command.

   Note that you can't fund an account for the Kadena main production network using the Developer Tools or Kadena CLI commands.

6. Fund the new account on the development network and one or more chains by running the `kadena account fund` command and following the prompts displayed.

   For example:

   ```bash
   kadena account fund
   ? Select an account (alias - account name): election-admin - election-admin
   ? Select a network: devnet
   ? Enter a ChainId (0-19) (comma or hyphen separated e.g 0,1,2 or 1-5 or all): 3
   ? Enter an amount: 15
   Success with Warnings:
   Account "election-admin" does not exist on Chain ID(s) 3. So the account will be created on these Chain ID(s).
   
   Transaction explorer URL for 
   Chain ID "3" : http://localhost:8080/explorer/development/tx/ZTXIQqmYhaUjEnl-BP4ajOzRdQeHz5C2FX76l4bC7hk
   ✔ Funding account successful.
   
   Account "election-admin" funded with 15 coin(s) on Chain ID(s) "3" in development network.
   Use "kadena account details" command to check the balance.
   
   Executed:
   kadena account fund --account="election-admin" --network="devnet" --chain-ids="3" --amount="15"
   ```

## Next steps

In this tutorial, you learned how to use `kadena-cli` commands to complete the following basic tasks:

- Generate a new random public and secret key.
- Add a new local account using the public key.
- Fund the new account on a specific network and chain.
- Verify account information.

You'll use the coins you transferred to the administrative account to pay transaction fees for all of the activities in later tutorials. 
Before you get to those tutorials, the next tutorial demonstrates how to create a **namespace** that will be governed by the election administrator account you created in this tutorial.
