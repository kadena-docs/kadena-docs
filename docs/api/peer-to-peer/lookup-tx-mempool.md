---
title: Look up transactions
description:
  Provides reference information for the chainweb-node mempool endpoints.
id: lookup-tx-mempool
sidebar_position: 6

tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Look up transactions

When transactions are submitted to the blockchain for processing, they are queued in the node memory pool to await delivery to a mining node as new work to be validated.
Endpoints related to memory pool activity are peer-to-peer endpoints that enable communication between memory pools on different nodes. 

With the` /mempool/lookup` endpoint, you can specify a list of transaction request keys to look for in the mempool.
For each transaction request key, the endpoint returns the Pending tag and details about the transaction or the Missing tag.

## Request format

Use `POST https://{baseURL}/chain/{chain}/mempool/lookup` to look up pending transactions in the memory pool.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the payload request to. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `POST https://{baseURL}/chain/0/mempool/lookup`.

### Request body schema

The request body consists of an array of transaction request keys to check for in the memory pool. Each request key for a Pact transaction is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
The request body is an array of these strings.

## Responses

Requests to `POST https://{baseURL}/chain/{chain}/mempool/lookup` return the following response code:

- **200 OK** indicates that the request succeeded and the response body returns an array of lookup results for each specified transaction. The array has the same size as the request body.

### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

## Successful response schema

If the request is successful, the response returns `application/json` content with an array of lookup results for each request key in the request body.

| Parameter | Type | Description
| --------- | ---- | -----------
| tag | string | Specifies the lookup result. The valid return values are "Missing" or "Pending".
| contents | string | Specifies the JSON-encoded text for a signed Pact transaction.

## Examples

You can send a request to a bootstrap node for the Kadena test network and chain id 1 with a call like this:

```postman
POST https://us1.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/mempool/lookup
```

For this example, the request body consists of two request keys:

```request
["ptI7wQeOmOt-BER2KQGVd0o6axBpqbhMPQVkkq5YAyE","Gc17hqzSZinUt-JCPvH6k_GJFXEJtRwU1Bx4OtSnxWU"]
```

In this example, the first transaction is "Pending" and the second transaction is "Missing" in the memory pool:

```response
[
    {
        "tag": "Pending",
        "contents": "{\"hash\":\"ptI7wQeOmOt-BER2KQGVd0o6axBpqbhMPQVkkq5YAyE\",\"sigs\":[{\"sig\":\"1569af1b56cddd4b853b7d49249c4c52d55e59e04910bfeb8aacbd02bfa0637bbe81b0f4b48ba8eb101fa0e8a276023fbfa57fa5a835741b346d574897052201\"}],\"cmd\":\"{\\\"signers\\\":[{\\\"pubKey\\\":\\\"1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\\\",\\\"clist\\\":[{\\\"name\\\":\\\"coin.TRANSFER\\\",\\\"args\\\":[\\\"k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\\\",\\\"k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\\\",10]},{\\\"name\\\":\\\"coin.GAS\\\",\\\"args\\\":[]}]}],\\\"meta\\\":{\\\"creationTime\\\":1721947429,\\\"ttl\\\":32441,\\\"chainId\\\":\\\"1\\\",\\\"gasPrice\\\":1.9981e-7,\\\"gasLimit\\\":2320,\\\"sender\\\":\\\"k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\\\"},\\\"nonce\\\":\\\"chainweaver\\\",\\\"networkId\\\":\\\"testnet04\\\",\\\"payload\\\":{\\\"exec\\\":{\\\"code\\\":\\\"(coin.transfer \\\\\\\"k:1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4\\\\\\\" \\\\\\\"k:58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c\\\\\\\" 10.0)\\\",\\\"data\\\":null}}}\"}"
    },
    {
        "tag": "Missing"
    }
]
```

## Insert transactions into the mempool

Nodes can use the `PUT https://{baseURL}/chain/{chain}/mempool/insert` endpoint to move transactions into the memory pool.
Information about this endpoint is included for reference. 
You shouldn't use this endpoint directly. 
Instead, you should use the appropriate Pact endpoints to submit transactions to the network.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the payload request to. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `POST https://{baseURL}/chain/0/mempool/insert`.

### Request body schema

The request body consists of an array of JSON-encoded strings representing signed Pact transactions.

### Responses

Requests to `PUT https://{baseURL}/chain/{chain}/mempool/insert` return the following response code:

- **200 OK** indicates that the request succeeded and that transactions were inserted into the memory pool.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

### Examples

The following example illustrates the content of the request body with an array that only contains one transaction:

```request
[
"{\"hash\":\"y3aWL72-3wAy7vL9wcegGXnstH0lHi-q-cfxkhD5JCw\",\"sigs\":[{\"sig\":\"8ddc06b37c496f2cadc4f7412405a80faf3ab07482ff5553b9b5fcc73d1b4121275ad5948d9b4078e553b71f8b42eaf6b24135bf2fb4d5840c16bcdde0e35e0f\"}],\"cmd\":\"{\\\"networkId\\\":\\\"mainnet01\\\",\\\"payload\\\":{\\\"exec\\\":{\\\"data\\\":{\\\"account-keyset\\\":{\\\"pred\\\":\\\"keys-all\\\",\\\"keys\\\":[\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\"]}},\\\"code\\\":\\\"(coin.transfer-create \\\\\\\"60241f51ea34e05c61fbea9d\\\\\\\" \\\\\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\\\\\" (read-keyset \\\\\\\"account-keyset\\\\\\\") 5007.0000)\\\"}},\\\"signers\\\":[{\\\"pubKey\\\":\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\",\\\"clist\\\":[{\\\"args\\\":[\\\"60241f51ea34e05c61fbea9d\\\",\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\",5007],\\\"name\\\":\\\"coin.TRANSFER\\\"},{\\\"args\\\":[],\\\"name\\\":\\\"coin.GAS\\\"}]}],\\\"meta\\\":{\\\"creationTime\\\":1618949714,\\\"ttl\\\":300,\\\"gasLimit\\\":600,\\\"chainId\\\":\\\"0\\\",\\\"gasPrice\\\":1.0e-7,\\\"sender\\\":\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\"},\\\"nonce\\\":\\\"\\\\\\\"2021-04-20T20:16:13.645Z\\\\\\\"\\\"}\"}"
]
```