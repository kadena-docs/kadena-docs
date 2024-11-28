---
title: Transaction format and flow
id: transactions
sidebar_position: 10
description: "There are two types of transaction in Pact smart contracts: transactions that execute in a single step and transactions that consist of more than one step."
---

# Transaction format and lifecycle

There are two types of transaction in Pact smart contracts: 

- Transactions that execute in a single step, identified in Pact code as `exec` transactions.
- Transactions that consist of more than one step, identified in Pact code as `cont` transactions.

Most transactions execute as a single step with a single message that is sent to a blockchain node to be evaluated by Pact.
The execution of the code in the message is _atomic_ and the transaction succeeds as a complete unit, or doesn't succeed at all.
For these types of transactions, Pact doesn't allow partial execution or provide any concept for rollback handling.

For transactions that consist of more than one step, each step is effectively a single transaction.
However, each step must be executed in sequence and if any step in the sequence fails, the entire transaction can be rolled back to its initial state or allowed to continue without rollback handling. 
For example, a cross-chain transfer is essentially a two-step transaction, with a debit transaction initiated on a source chain and a separate credit transaction occurring on a destination chain.
Without rollback handling, if the second step isn't called to complete the transaction, the first step becomes an orphan and the intended transfer operation remains in an incomplete, interrupted state.
However, multi-step transactions can include a rollback step so that if a specific condition exists, a previously completed steps can be reversed.
For example, if an asset is moved from a seller's account to an escrow account awaiting a buyer to complete the transaction, the transfer can be reversed if the buyer doesn't complete necessary steps within a previously agreed upon time.

Single-step transactions are defined in smart contracts as function calls using the `defun` reserved keyword, as previously introduced in [Define a function](/smart-contracts/functions-variables#define-a-function).
Transactions with multiple steps are defined in smart contracts using the [`defpact`](/reference/syntax#defpact), [`step`](/reference/syntax#step), and [`step-with-rollback`](/reference/syntax#step-with-rollback) reserved keywords.

## Transaction formats

Given that there are two types of transactions, there are also two transaction formats.
The format for transaction execution requests—`exec` requests—is the same for single-step transactions and the first step (0) in multi-step defpact transactions.
These transactions always contain the Pact code to execute, either as raw embedded code or as a reference to a `.pact` file.
By contrast, continuation requests—`cont` requests—don't contain Pact code.
Instead, they reference the `defpact` identifier that links the steps together and the continuation step they are attempting to execute.
The difference between execution transaction requests and continuation transaction requests is reflected in the different fields required to construct the transactions.
For example, if you're constructing a transaction request using the YAML API format, you use the [exec](//model-payload) payload format for transactions that are completed in a single step and the [cont](https://api.chainweb.com/openapi/pact.html#tag/model-payload) payload format for transactions that are executed in more than one step.

### Execution request format

The following template describes the YAML format for execution transaction requests:

```yaml
code: Transaction code
codeFile: Transaction code file
data: JSON transaction data
dataFile: JSON transaction data file
keyPairs: list of key pairs for signing (use pact -g to generate): [
  public: base 16 public key
  secret: base 16 secret key
  caps: [
      optional capabilities
  ]
]
nonce: optional request nonce, will use current time if not provided
networkId: string identifier for a blockchain network
publicMeta:
  chainId: string chain id of the chain of execution
  sender: string denoting the sender of the transaction
  gasLimit: integer gas limit
  gasPrice: decimal gas price
  ttl: integer time-to-live value
  creationTime: optional integer tx execution time after offset
type: exec
```

### Continuation request format

The following template describes the YAML format for continuation transaction requests:

```yaml
pactTxHash: integer transaction identifier for a defpact
step: integer next step of a defpact
rollback: boolean for rolling back a defpact step
proof: string spv proof of continuation (optional, cross-chain only)
data: JSON transaction data
dataFile: JSON transaction data file
keyPairs: list of key pairs for signing (use pact -g to generate): [
  public: string base 16 public key
  secret: string base 16 secret key
  caps: [
      optional capabilities
  ]
]
networkId: string identifier for a blockchain network
publicMeta:
  chainId: string chain id of the chain of execution
  sender: string denoting the sender of the transaction
  gasLimit: integer gas limit
  gasPrice: decimal gas price
  ttl: integer time-to-live value
  creationTime: optional integer tx execution time after offset
nonce: optional request nonce, will use current time if not provided
type: cont
```

## Basic transaction flow

After you have a transaction message properly formatted as a JSON object, it can be executed locally for testing purposes or sent to the blockchain for execution on-chain.
You submit transactions to the blockchain for on-chain execution by connecting to a node using the Pact `/send` endpoint.
In most cases, the node you connect to is a node that you control—in the local development environment, the public test network, or the production main network. 

Before moving the transaction into a pending state, Pact performs some initial checks on the message to validate that the transaction doesn't have errors that would prevent it from being executed. 
These initial checks include verifying the signatures format, metadata, and the availability of funds to pay transaction fees. 
If there are issues—like an invalid signature or a time-to-live (TTL) that has expired—the transaction fails immediately without further processing.
If the initial checks pass, the node receiving the transaction message assigns the message a unique transaction identifier (txid) and inserts the transaction into its holding area for pending transactions, called the **mempool**.
The transactions waiting to be included in a block are synchronized across all of the nodes.

Mining nodes, typically Chainweb nodes with specialized application-specific integrated circuit hardware attached, periodically check the transaction pool—the mempool—for new work and select transactions to validate based on their transaction fees.
After the mining node computes the solution that validates the transaction, it includes the transaction in its next block.
The block that includes the transaction is then sent to all of the nodes in the network, including the node where the transaction originated.

The following diagram provides a simplified view of the transaction flow for a single-step exec transaction.

![Transaction lifecycle](/img/tx-workflow.png)

Throughout its lifecycle, there are several ways you can check the status of the transaction using the transaction identifier or request key.
For example, you can use the Pact `/listen` endpoint to wait for the results from a single transaction or the Pact `/poll` endpoint to poll the node for one or more transaction results without blocking new requests. 
You can also check whether transactions are pending in the mempool by calling the [peer-to-peer API](/api/peer-to-peer) endpoints, such as the `/mempool/member` and `/mempool/lookup` endpoints.

If you don't want to use the [Pact API](/api/pact-api) or the [peer-to-peer API](/api/peer-to-peer) to see results, you can enter the transaction request key in a block explorer, such as [explorer.kadena.io/mainnet](https://explorer.kadena.io/mainnet) or [explorer.kadena.io/testnet](https://explorer.kadena.io/testnet).

## Multi-step transaction flow

At a high level, the workflow for transactions with more than one step is the same as single-step transactions.
However, transactions with more than one step require a both an initial transaction request and a continuation message to be sent to a node.
Depending on the logic in the smart contract, each part of the transaction might be initiated by the same entity or required to be initiated by different entities.
The logic in the smart contract also determines whether each step can be rolled back to a previous state under specific conditions or discontinued as an incomplete operation.

Much like single-step transactions, the node receiving the first step in a `defpact` transaction message assigns the message a unique identifier (pact-id).
This identifier is what ties the steps together as parts of the same transaction.
The remainder of the workflow for the first step in a `defpact` transaction is the same as any other execution request. 

### Two-step transactions without rollback

In cross-chain transfers, a receiving account is typically responsible for sending the continuation transaction request and paying the transaction fee associated with that request.
However, any account—including a dedicated autonomous [gas station](/resources/glossary#gas-station) account—can sign and send the continuation request. 
If there's a delay in sending the continuation request, the transfer operation remains incomplete.

### Two-step transactions with rollback

Multi-step `defpact` transactions can also include logic to rollback a step under specified conditions.
For example, you can use a  `defpact` transaction to orchestrate operations similar to an escrow service, moving assets into a holding account until contractual obligations are met and the releasing assets only after all parties have completed require actions. 
A step with rollback logic could specify a time limit for completing required actions and return assets to the original account if all required steps aren't completed within the time allowed.