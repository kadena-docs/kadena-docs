---
title: GET block hash
description:
  Provides reference information for the chainweb-node block hash endpoints.
id: get-block-hash
sidebar_position: 2
tags: ['chainweb', 'node api', 'chainweb api', 'api reference', 'block hash']
---

# Get block hash

Block hash endpoints return block hashes from the chain database.
Generally, block hashes are returned in **ascending** order and include hashes from orphaned blocks.

If you only want to query for blocks that are included in the canonical version of the chain, you can use the `/branch` endpoint.
The `/branch` endpoint returns blocks in descending order starting from the leafs of branches of the block chain.

## Request format

Use `GET http://{baseURL}/chain/{chain}/hash` to get block hashes for the specified chain.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to get block hashes for the first chain (0), the request is `GET http://{baseURL}/chain/0/hash`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| limit | integer&nbsp;>=&nbsp;0 | Specifies the maximum number of records that should be returned. The actual number of records returned might be lower than the value you specify. For example: `limit=3`.
| next | string | Specifies the cursor value to retrieve the next page of results. You can find the value to specify in the `next` property returned by the previous page in a successful response. For example: `"inclusive:qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM"`.
| minheight	| integer&nbsp;>=&nbsp;0 | Specifies the minimum block height for the returned hashes. For example: `minheight=4471908`.
| maxheight | integer&nbsp;>=&nbsp;0 | Specifies the maximum block height for the returned hashes. For example: `maxheight=4953816`.

## Responses

Requests to `GET http://{baseURL}/chain/{chain}/hash` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body includes the collection of block hashes matching the request criteria in **ascending** order. 
  All block hashes that match the specified criteria are returned from the chain database, including hashes for orphaned blocks.
- **404 Not Found** indicates that the request failed to find any block hashes matching the request criteria. For example, if you specify a Chainweb node version or chain identifier that doesn't exist, you'll see this response code.

### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

### Successful response schema

If the request is successful, the response returns `application/json` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| items&nbsp;(required) | Array&nbsp;of&nbsp;strings | Lists the block hashes matching the request criteria. Each block hash string consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| limit&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the maximum number of items to include in the page of results. This number can be smaller but never larger than the number of requested items.
| next&nbsp;(required) | string&nbsp;or&nbsp;null | Returns a value that can be used to query the next page. You can use this value for the `next` parameter in a follow-up request. The format for this parameter consists of two parts. The first part of the string can be `inclusive`, `exclusive` or `null`. The second part is the value that calls the next page of results or `null` if there are no more results to query.

## Examples

You can send a request to the Kadena main network and chain 19 by calling the service endpoint like this:

```Postman
GET http://api.chainweb.com/chainweb/0.0/mainnet01/chain/19/hash?limit=3
```

This request returns a maximum of three items in the response body like this:

```json
{
    "limit": 3,
    "items": [
        "y76dr78dPJlFDMPzCc-aEz97iRyimv5Ij3psdVlC64c",
        "1ETD2LKF_gmJ92-q1fqAJY2eZerhhZA2kLxM1BC5hKE",
        "1B3UJuYNx0LHqtgbJ_sSpJl5h-77pMfvjBBy85e2K8w"
    ],
    "next": "inclusive:qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM"
}
```

To send a follow-up request to get block hashes for the next three blocks, you can add the `next` parameter to the request.
In this example, the follow-up request looks like this:

```Postman
GET http://api.chainweb.com/chainweb/0.0/mainnet01/chain/19/hash?limit=3&next=inclusive:qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM
``` 

The follow-up request returns three more hashes and a new `next` value:

```json
{
    "limit": 3,
    "items": [
        "qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM",
        "nN3fl9FaF2sD3zJSa1fY2rtoJMw33bFfzxK-25qKtT4",
        "2lqldW8MEeOzvApgJnmSIUaUT4CihoL9OMpdYbBAm_g"
    ],
    "next": "inclusive:01Dhx9c9mfbP7t0k0CztGi8IrE81u4ljd2NQ0UvXSZM"
}
```

