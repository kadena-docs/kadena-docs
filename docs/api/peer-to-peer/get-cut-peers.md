---
title: Get cut peers
description:
  Provides reference information for the chainweb-node peer endpoints.
id: api-get-cut-peers
sidebar_position: 8
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Get cut peers

The peer-to-peer communication that's required for Chainweb nodes to synchronize state is partitioned into separate independent network channels. 
The `/cut/peer` portion of the peer-to-peer network is responsible for communicating the consensus state across a set of distributed network nodes and all chains in the network.
There is also one `/mempool/peer` peer-to-peer network channel for each chain. 
The `/mempool/peer` portion of the peer-to-peer network is responsible for queuing and managing pending transactions for each chain independently. 

## Request format

Use `GET https://{baseURL}/cut/peer` to retrieve peer node information about the `cut` portion of the peer-to-peer network for a specific Chainweb node.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| limit | integer&nbsp;>=&nbsp;0 | Specifies the maximum number of records that should be returned. The actual number of records returned might be lower than the value you specify. For example: `limit=3`.
| next | string | Specifies the cursor value to retrieve the next page of results. You can find the value to specify in the `next` property returned by the previous page in a successful response. For example: `"inclusive:qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM"`.

## Responses

Requests to `GET https://{baseURL}/cut/peer` return the following response code:

- **200 OK** indicates that the request succeeded. The response body describes the peers from the peer database on the remote node.

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
| items&nbsp;(required) | Array&nbsp;of&nbsp;objects | Returns an array of peer information objects.
| limit&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the maximum number of items in the page. This number can be smaller but never larger than the number of requested items.
| next&nbsp;(required) | string or null | Returns a value that can be used to query the next page. You can use this value for the `next` parameter in a follow-up request. The format for this parameter consists of two parts. The first part of the string can be `inclusive`, `exclusive`, or null. The second part is the value that calls the next page of results or null if there are no more results to query.

## Examples

You can send a request to a Kadena main network bootstrap node by calling the peer-to-peer endpoint like this:

```Postman
GET https://us-e1.chainweb.com/chainweb/0.0/mainnet01/cut/peer?limit=2
```

This request returns two items with peer information in the response body:

```json
{
    "limit": 2,
    "items": [
        {
            "id": "70HnUJJN41Ee-miB5ZlsqDJW3TRcTV5fZ9vM_Gw332k",
            "address": {
                "hostname": "65.109.98.245",
                "port": 1789
            }
        },
        {
            "id": null,
            "address": {
                "hostname": "fr1.chainweb.com",
                "port": 443
            }
        }
    ],
    "next": "inclusive:2"
}
```

To send a follow-up request to get peer information for the next two peers, you can add the `next` parameter to the request:

```Postman
GET https://us-e1.chainweb.com/chainweb/0.0/mainnet01/cut/peer?limit=2&next=inclusive:2
```

This request returns the next two items from the peer database in the response body:

```json
{
    "limit": 2,
    "items": [
        {
            "id": "YhmXbYrjrVwUEtIRkwroJ5RPB2tnPqH6qMPsXgi6BOg",
            "address": {
                "hostname": "47.253.46.121",
                "port": 8443
            }
        },
        {
            "id": "tfgiwMyznf8M7p8mP99aEamD2mbvp9DLQCkRXyvsuFc",
            "address": {
                "hostname": "149.154.176.34",
                "port": 31350
            }
        }
    ],
    "next": "inclusive:4"
}
```
