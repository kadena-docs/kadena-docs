---
title: Request pending transactions
description:
  Provides reference information for the chainweb-node mempool endpoints.
id: all-pending-mempool
sidebar_position: 6

tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Request all transactions

When transactions are submitted to the blockchain for processing, they are queued in the node memory pool to await delivery to a mining node as new work to be validated.
Endpoints related to memory pool activity are peer-to-peer endpoints that enable communication between memory pools on different nodes. 
These API endpoints are included for reference but are not intended to be used directly. 
In most cases, you should use the appropriate Pact REST API endpoints to submit and check the status of transactions.

With the` /mempool/getPending` endpoint, you can return all of the transaction hashes for the transactions found waiting in the memory pool.

## Request format

Use `POST https://{baseURL}/chain/{chain}/mempool/getPending` to retrieve pending transactions from the memory pool.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the payload request to. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `POST https://{baseURL}/chain/0/mempool/getPending`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| nonce | integer&nbsp;>=&nbsp;0 | Specifies the server nonce value.
| since | integer&nbsp;64&#8209;bit | Specifies the transaction identifier value to use as a starting point for retrieving pending transactions from the memory pool.

## Responses

Requests to `POST https://{baseURL}/chain/{chain}/mempool/getPending` return the following response code:

- **200 OK** indicates that the request succeeded and the response body returns the pending transactions matching the request criteria. 

### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

### Successful response schema

If the request is successful, the response returns `application/json` content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| hashes | Array&nbsp;of&nbsp;strings | Lists the transaction hashes for pending transactions in the memory pool. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| highwaterMark	| Array&nbsp;of&nbsp;integers | Specifies a two-element array with the server nonce value and the transaction identifier representing the last transaction mined out of the memory pool.

## Examples

You can send a request to a bootstrap node for the Kadena main network and chain id 0 with a call like this:

```Postman
POST https://us-e1.chainweb.com/chainweb/0.0/mainnet01/chain/0/mempool/getPending
```

The response body for this request returns information about the pending transactions similar to the following:

```json
{
    "hashes": [
        "a1VnNruJpIbwatGwHlZXtNYqPiani1UuM5l87NDQ-Hs",
        "akUQgcIGR2mi4StuiAMLtYgr9tTVg2_Z0Oni4Mbm_lQ",
        "Ck-ltmAS7M0e1OFfzIHRSVRtV-zRP81Vw_7gFcu3pCk",
        "LUU1i0dtHZHjY3BBcFcyZaxmwWL7E6eiAMH4TVisdT8"
    ],
    "highwaterMark": [
        8354532306934176444,
        1218762
    ]
}
```
