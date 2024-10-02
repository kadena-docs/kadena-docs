---
title: Get mempool peers
description:
  Provides reference information for the chainweb-node peer endpoints.
id: api-get-mempool-peers
sidebar_position: 8
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Get mempool peer information

For peer-to-peer connections, Chainweb nodes have two separate communication channels with specialized independent peer-to-peer networks that different nodes can be part of:

- The `/peer/cut` peer-to-peer network is responsible for communicating the consensus state across the distributed network nodes. 
- The `/peer/mempool` peer-to-peer network is responsible for queuing and managing the pending transactions for each chain independently. 

## Request format

Use `GET https://{baseURL}/chain/{chain}/mempool/peer` to retrieve peer information about the `mempool` peer-to-peer network for a specific Chainweb node and chain.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to get block hashes for the first chain (0), the request is `GET https://{baseURL}/chain/0/mempool/peer`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| limit | integer&nbsp;>=&nbsp;0 | Specifies the maximum number of records that should be returned. The actual number of records returned might be lower than the value you specify. For example: `limit=3`.
| next | string | Specifies the cursor value to retrieve the next page of results. You can find the value to specify in the `next` property returned by the previous page in a successful response. For example: `"inclusive:qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM"`.

## Responses

Requests to `GET https://{baseURL}/chain/{chain}/mempool/peer` return the following response code:

- **200 OK** indicates that the request succeeded and the response body returns the blockchain state for each chain at the specified block height. 

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

You can send a request to retrieve information about the memory pool peer-to-peer network with a call to the `/peer` endpoint similar to the following:

```Postman
GET https://us1.testnet.chainweb.com/chainweb/0.0/testnet04/chain/4/mempool/peer?limit=3
```

The response body for this request returns the peer information for the nodes in the `mempool` peer-to-peer network:

```json
{
    "limit": 3,
    "items": [
        {
            "id": "aEdeq9bOZws1X5IpBF5aGM6vV6gh_EicHSMoPs5wb40",
            "address": {
                "hostname": "13.251.43.216",
                "port": 1789
            }
        },
        {
            "id": "SMq0oMEVVBNNl3GfMBJfbHVBIRIVa0v6qwoKZflQtAA",
            "address": {
                "hostname": "34.148.233.99",
                "port": 1789
            }
        },
        {
            "id": "AFqlaMJ8IfuwQiuyo_qxa83U_2DTkrJjhGftplwvWZc",
            "address": {
                "hostname": "34.75.215.49",
                "port": 1789
            }
        }
    ],
    "next": "inclusive:3"
}
```

## Add peer information to the mempool peer-to-peer network

Use `PUT https://{baseURL}/chain/{chain}/mempool/peer` to add peer information to the mempool peer-to-peer network for a specific chain.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to get block hashes for the first chain (0), the request is `PUT https://{baseURL}/chain/0/mempool/peer`.

### Request body schema

Use the following parameters to specify the peer information you want to add to the peer database of the memory pool peer-to-peer network on the remote host.

| Parameter | Type | Description
| --------- | ---- | -----------
| id&nbsp;(required) | string&nbsp;or&nbsp;null | Specifies the Base64Url-encoded string—without padding—that represents the SHA256 fingerprint of the SSL certificate for the remote node. This field can only be `null` if the node uses an official certificate authority (CA) signed certificate. In all other cases, the `id` string consists of 43 characters from the `a-zA-Z0-9_-` character set.
| address&nbsp;(required) | object | Specifies the host and port number of the peer you want to add to the peer database of the memory pool peer-to-peer network for the specified chain.

### Responses

Requests to `PUT https://{baseURL}/chain/{chain}/mempool/peer` return the following response codes:

- **204 No Content** indicates that the request was successful and the peer was added to the peer database of the remote node.
- **400 Bad Request** indicates that the request itself is invalid or that the hostname and port provided for the peer is not reachable. Before a Chainweb node adds a peer to its peer database, the node checks whether the peer can be reached using the information provided. If this check fails, an error is returned.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

### Examples

You can send a request to add a peer to the peer node database with a call to the `/peer` endpoint similar to the following:

```Postman
PUT https://us1.testnet.chainweb.com/chainweb/0.0/testnet04/chain/4/mempool/peer`
```

The request body for adding a peer contains parameters similar to the following:

```json
{
    "id": "aEdeq9bOZws1X5IpBF5aGM6vV6gh_EicHSMoPs5wb40",
    "address": {
        "hostname": "13.251.43.216",
        "port": 1789
    }
}
```

If the request is successful, you'll see the **204 No Content** response returned.
If the host name or IP address wasn't reachable, you'll see an error message similar to the following:

```text
Invalid hostaddress: IsNotReachable "ConnectionFailure Network.Socket.getAddrInfo (called with preferred socket type/protocol: AddrInfo {addrFlags = [AI_ADDRCONFIG], addrFamily = AF_UNSPEC, addrSocketType = Stream, addrProtocol = 0, addrAddress = 0.0.0.0:0, addrCanonName = Nothing}, host name: Just \"us1.testnet.ajuba.io\", service name: Just \"1789\"): does not exist (Name or service not known)"
```
