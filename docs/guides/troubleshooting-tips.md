---
title: Troubleshooting tips
description: "Tips for troubleshooting common issues when connecting to Chainweb nodes or calling Kadena API endpoints."
id: troubleshooting
---

# Troubleshooting tips

If you encounter errors, warnings, or Bad Request failures when you attempt to connect to a Chainweb nodes or call Kadena API endpoints, you should check for the following common issues and potential solutions.

## Common issues for API calls

The following are the most common causes of potential issues when you have problems calling Kadena API endpoints:

- Network and chain identifiers
  
  You should verify that you are using the correct network identifier and chain in the call.
  Most API endpoints require you to specify the network identifier, such as `testnet04` or `mainnet01`, and a specific chain identifier in the request.
  If you specify testnet or mainnet or the wrong chain identifier, you'll receive a Bad Request or empty response instead of the information you expect.
  If you're submitting or checking the status of a transaction, be sure you've specifed the correct chain identifier, and, if applicable, there are funds to pay transaction fees on the network and chain you specify.

- Gas management
  
  Although default values for the gas limit and gas price might be appropriate for most situations, you should always check the settings and adjust them when necessary.
  For example, if you're deploying a complex contract, you might need to set a higher gas limit or gas price to ensure your transaction is processed.

- Nonce handling
  
  The nonce setting is optional in YAML request files and defaults to the transaction creation time, if not set.
  However, it's a best practice to include a unique nonce to prevent duplicate transactions.

- Error handling
  
  If you don't get the results you expect from an API request, you should always check the response for any additional information about the errors encountered.

- Security
  
  If an API request fails, you should check the keys you used to sign the transaction request and verify you are using the correct keys and accounts for the network and chain you connect to.
  Most Chainweb service API requests don't require a secure (HTTPS) connection.
  However, private keys are used to sign requests, so in most cases you should use a secure connection when calling API endpoints.

For more information about calling specific endpoints and their parameters, see the [API documentation](/api).

## Common issues for Chainweb nodes

The most common issues you might encounter if you're a node operator or attempting to connect to a remote node are problems with peer synchronization, network interruptions, or node unavailability.

The following are the most common causes of potential issues when you have problems connecting to Chainweb nodes:

- Out of date binaries
  
  Peer synchronization failures are often caused by nodes with out of date binaries or dependencies.
  For example, if a node attempts to synchronize with an outdate version of the `librocksdb` library, peer synchronization will fail. 
  To address this issue, you should make that any node you control is up to date with the most recent official release of the `chainweb-node` binary.

- Timeout exceptions
  
  If a synchronizing node fails to provide timely feedback to the network, other nodes will receive a timeout exception warning. 
  Generally, the warning can be ignored and nodes can synch to alternative nodes. 
  These exceptions can be fixed by issuing a `ConnectionTimeout` statement.

- Something went wrong exceptions
  
  A "Something went wrong" error signals an internal server error due to misconfiguration. 
  If you see this error, you should regenerate your current configuration file and post a message on the Kadena Discord server [#infrastructure](https://discord.com/channels/502858632178958377/1051827506279370802) channel to make sure your node is configured correctly.
  
  To regenerate the configuration:
  
  ```bash
  ./chainweb-node --print-config > config.yaml
  ```

- Network communication issues
  
  Every Chainweb node maintains a list of peers. 
  You can connect to the `/cut/peer` endpoint on any node to discover its list of peers. 
  For example, to see a list of peers for a bootstrap node, you can run a command similar to the following:
  
  ```bash
  curl -sk "https://us-e2.chainweb.com/chainweb/0.0/mainnet01/cut/peer" | python -m json.tool | grep hostname
  ```
  
  ```bash
  
  ```

- Network configuration issues
  
  If you do not have incoming and outgoing ports configured correctly on your router, network traffic might be blocked, preventing access to the node, or the node might be offline.
  To see is a node is accessible, you can try pinging the node with a command similar to the following:
  
  ```bash
  ping -c 3 <node ip>
  ```
  
  You can also try sending a request to the /health-check endpoint for a node:
  
  ```bash
  curl -k https://<node-ip>:443/health-check
  ```
  
  A healthy node should return the following:
  
  ```bash
  Health check OK.
  ```
  
  If a node is down, try connecting to a different node.