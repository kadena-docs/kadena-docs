---
title: Insert transactions
description:
  Provides reference information for the chainweb-node mempool endpoints.
id: insert-tx-mempool
sidebar_position: 6

tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Insert transactions

When transactions are submitted to the blockchain for processing, they are queued in the node memory pool to await delivery to a mining node as new work to be validated.
Endpoints related to memory pool activity are peer-to-peer endpoints that enable communication between memory pools on different nodes.

The `/mempool/insert` endpoint is included for reference.
However, you shouldn't use this endpoint to insert transactions into the memory pool directly.
You should always use the appropriate Pact REST API endpoints to submit and check the status of transactions.

## Request format

Nodes can use the `PUT https://{baseURL}/chain/{chain}/mempool/insert` endpoint to move transactions into the memory pool.
You shouldn't use this endpoint directly. 

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the payload request to. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `POST https://{baseURL}/chain/0/mempool/insert`.

### Request body schema

The request body consists of an array of JSON-encoded strings representing signed Pact transactions.

## Responses

Requests to `PUT https://{baseURL}/chain/{chain}/mempool/insert` return the following response code:

- **200 OK** indicates that the request succeeded and that transactions were inserted into the memory pool.

### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

## Examples

The following example illustrates the content of the request body with an array that only contains one transaction:

```request
[
"{\"hash\":\"y3aWL72-3wAy7vL9wcegGXnstH0lHi-q-cfxkhD5JCw\",\"sigs\":[{\"sig\":\"8ddc06b37c496f2cadc4f7412405a80faf3ab07482ff5553b9b5fcc73d1b4121275ad5948d9b4078e553b71f8b42eaf6b24135bf2fb4d5840c16bcdde0e35e0f\"}],\"cmd\":\"{\\\"networkId\\\":\\\"mainnet01\\\",\\\"payload\\\":{\\\"exec\\\":{\\\"data\\\":{\\\"account-keyset\\\":{\\\"pred\\\":\\\"keys-all\\\",\\\"keys\\\":[\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\"]}},\\\"code\\\":\\\"(coin.transfer-create \\\\\\\"60241f51ea34e05c61fbea9d\\\\\\\" \\\\\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\\\\\" (read-keyset \\\\\\\"account-keyset\\\\\\\") 5007.0000)\\\"}},\\\"signers\\\":[{\\\"pubKey\\\":\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\",\\\"clist\\\":[{\\\"args\\\":[\\\"60241f51ea34e05c61fbea9d\\\",\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\",5007],\\\"name\\\":\\\"coin.TRANSFER\\\"},{\\\"args\\\":[],\\\"name\\\":\\\"coin.GAS\\\"}]}],\\\"meta\\\":{\\\"creationTime\\\":1618949714,\\\"ttl\\\":300,\\\"gasLimit\\\":600,\\\"chainId\\\":\\\"0\\\",\\\"gasPrice\\\":1.0e-7,\\\"sender\\\":\\\"acc28032a1bb725b7ba0a3593ab86f393894fa6659281f3dfdfee0afe48559a2\\\"},\\\"nonce\\\":\\\"\\\\\\\"2021-04-20T20:16:13.645Z\\\\\\\"\\\"}\"}"
]
```