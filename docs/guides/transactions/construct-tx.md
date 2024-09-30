---
title: Construct a transaction
id: howto-construct-tx
---

<head>
  <title>Making Blockchain Calls with Kadena</title>
  <meta name="description" content="A guide to crafting blockchain calls using Traditional API, Kadena CLI, and Kadena.js" />
</head>
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

# Construct a transaction

You can use the kadena tx add command-line program to construct transactions using transfer templates. By providing values for template variables, you can generate transactions for multiple chains and access patterns that are ready to sign and submit with minimal configuration requirements. You can provide values interactively or specify them directly on the command-line.

Available templates
The default templates—transfer and safe-transfer—are stored in the .kadena/transaction-templates directory after you configure your local development environment using the kadena config init command. These templates cover the most common transaction types, allowing for straightforward transfers of tokens between accounts.

Command options
The basic syntax for creating a transaction from a template is:

```bash
kadena tx add [options]
```
If you run the command without any options, you are prompted to enter the information required to create the transaction. This command accepts the following options:

Option	Description	Required
--template	Specifies the path to the transaction template file.	Yes
--template-data	Specifies the path to a file that contains the information you want to use for template values.	No
--network-id	Specifies the network identifier for the transaction. For example, to submit a transaction on the Kadena test network, use testnet04.	Yes
--out-file	Specifies the path for saving the generated transaction file.	No
--holes	Displays a list of required template variables.	No
Custom options	Generated based on the chosen template's required fields.	Varies
Example
bash
kadena tx add --template="transfer.kptl" --template-data="data.yaml" --network-id="testnet04" --out-file="transaction.json"
In this example:

transfer.kptl is the template used to construct the transaction.
data.yaml contains the user-supplied values for the template variables
--network-id specifies the network the transaction is intended for. --out-file saves the generated transaction file as transaction.json in the current working directory.
Template prefixes and input values
The following transfer.kptl file is a YAML template that specifies the structure for a coin.transfer operation on Kadena.

```yaml
code: |-
  (coin.transfer "{{{account:from}}}" "{{{account:to}}}" {{decimal:amount}})
data:
meta:
  chainId: '{{chain-id}}'
  sender: '{{{account:from}}}'
  gasLimit: 2300
  gasPrice: 0.000001
  ttl: 600
signers:
  - public: '{{key:from}}'
    caps:
      - name: 'coin.TRANSFER'
        args: ['{{{account:from}}}', '{{{account:to}}}', {{decimal:amount}}]
      - name: 'coin.GAS'
        args: []
networkId: '{{network:networkId}}'
type: exec
```

The template uses the following prefixes to define expected data type and format for each field:

account: The account prefix indicates variables that should specify a valid Kadena account name.
key: The key prefix indicates variables that should specify a public key. - network: The network prefix is used for variables that should specify the appropriate network for the transaction.
decimal: The decimal prefix indicates variables that should specify a numerical values with a decimal point.
If you create transactions interactively, the prefixes ensure you are prompted for the appropriate information for the transaction you are constructing. If you provide this information on the command-line, the prefixes are ignored and you must provide the appropriate data types and formats to create valid transactions.

Define template variables in a file
Variables are a critical part of transaction templates, defining the data required to construct a transaction. Users can be prompted for variables missing from the --template-data file or not provided as command-line options. The --holes option is particularly useful for identifying all the variables a template requires.

Variables support specific prefixes (account:, key:, network:, decimal:) to facilitate the correct selection or validation of input values in interactive mode. The following data.yaml example is a YAML file that specifies the structure for a template data file.

```yaml
account-from: ''
account-to: ''
decimal-amount: ''
chain-id: ''
pk-from: ''
network-id: ''
```