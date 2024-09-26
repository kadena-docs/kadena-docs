---
title: GET block header by hash
description:
  Provides reference information for the chainweb-node block header endpoints.
id: get-block-header-by-hash
sidebar_position: 3
tags: ['chainweb', 'node api', 'chainweb api', 'api reference', 'block header']
---

# Get block header by hash

You can request a specific block header by using the block header hash.

## Request format

Use `GET http://{baseURL}/chain/{chain}/header/{blockHash}` to get a block header by using its hash.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to get block headers for the first chain (0), the request is `GET http://{baseURL}/chain/0/header/{blockHash}`.
| blockHash&nbsp;(required) | string | Specifies the block hash of a block. The block hash consists of 43 characters from the `a-zA-Z0-9_-` character set. For example: `k0an0qEORusqQg9ZjKrxa-0Bo0-hQVYLXqWi5LHxg3k`.

## Responses

Requests to `http://{baseURL}/chain/{chain}/header/{blockHash}` return the following response codes:

- **200 OK** indicates that the request succeeded and returns the block header matching the specified hash.
- **404 Not Found** indicates that no block header with the specified block hash was found.
- **406 Not Acceptable** indicates the endpoint can't generate content in the format specified by the Accept header.

### Response headers

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

### Successful response schemas

The format of the information returned in the response depends on the content type specified in the Accept header of the request.

### Not found response schema

If you specified `application/json` in the Accept header of the request and there are no results matching the request criteria, the response returns the following:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| key | string | Specifies the base64Url-encoded block hash (without padding). The block hash consists of 43 characters from the `a-zA-Z0-9_-` character set. |
| reason | string | Provides a placeholder for specifying the reason that no block headers were found. |

## Examples

You can send a request to the Kadena main network—mainnet01—and chain 4 by calling the service endpoint like this:

```Postman
GET http://api.chainweb.com/chainweb/0.0/mainnet01/chain/4/header/tsFkxqNHy_WbdnDDTumV_2MFjMQTyJrzb8--dO3kjjM
```

With the Accept header set to `application/json`, this request returns the block header as a base64Url-encoded string without padding:

```text
"AAAAAAAAAACHrEs-Th0GAIPjfG2bsp6NK5D8iWUoRUM1OQ3p9q3stapX5Zybos80AwAJAAAAGXv0fxVXgDQTtRTxMjWfr6JXXrSscoaCaxEDPC93QIgOAAAAVosxlCQP8q0cPi3zd_yD_099Untb69bnIgIFlAioj9ITAAAAYlpdztdOQ-ChRklldcC2oHbZlAMIiYAGRgzTZBXvRgaKSm6dcl7l1vKo1o0wOE5aEG0l4ulUQ1YVAAAAAAAAAG1aryT2lPfDS6jwjJmgctr-u158xYunNRIujS2Y2VbyBAAAABWoQdQYrsb9AUkBAAAAAAAAAAAAAAAAAAAAAAAAAAAA2JZLAAAAAAAFAAAAcRDzfU0dBgDGFmKDSkZ45LbBZMajR8v1m3Zww07plf9jBYzEE8ia82_PvnTt5I4z"
```

With the Accept header set to `application/json;blockheader-encoding=object`, the request returns the block header as a JSON-encoded object like this:

```json
{
    "nonce": "16462985723698616006",
    "creationTime": 1721071750065287,
    "parent": "g-N8bZuyno0rkPyJZShFQzU5Den2rey1qlflnJuizzQ",
    "adjacents": {
        "19": "YlpdztdOQ-ChRklldcC2oHbZlAMIiYAGRgzTZBXvRgY",
        "14": "VosxlCQP8q0cPi3zd_yD_099Untb69bnIgIFlAioj9I",
        "9": "GXv0fxVXgDQTtRTxMjWfr6JXXrSscoaCaxEDPC93QIg"
    },
    "target": "ikpunXJe5dbyqNaNMDhOWhBtJeLpVENWFQAAAAAAAAA",
    "payloadHash": "bVqvJPaU98NLqPCMmaBy2v67XnzFi6c1Ei6NLZjZVvI",
    "chainId": 4,
    "weight": "FahB1Biuxv0BSQEAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "height": 4953816,
    "chainwebVersion": "mainnet01",
    "epochStart": 1721068523032689,
    "featureFlags": 0,
    "hash": "tsFkxqNHy_WbdnDDTumV_2MFjMQTyJrzb8--dO3kjjM"
}
```

If you set the Accept header to `application/octet-stream` and the content type is supported, the request returns a binary representation of the block header.
If the content type isn't support, the reguest fails with a **406 Not Acceptable** response code.

If there are no results matching the request criter, the response body indicates the reason no results matching the request criteria were found. 
For example:

```json
{
    "key": "WjPVpdhdS9NFU1rPHV_DiLI74a-wKs1g4CZSN6z5gHY",
    "reason": "key not found"
}
```

## Get block header branches

Use `POST http://{baseURL}/chain/{chain}/header/branch` to return a page of block headers from branches of the block chain in **descending** order.
Only blocks that are ancestors of the same block in the set of upper bounds and are not ancestors of any block in the set of lower bounds are returned.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to get block headers for the first chain (0), the request is `POST http://{baseURL}/chain/0/header/branch`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| limit | integer&nbsp;>=&nbsp;0 | Specifies the maximum number of records that should be returned. The actual number of records might be lower. For example: `limit=3`.
| next | string | Specifies the cursor to retrieve the next page of results. This value can be found as the value of the next property of the previous page. For example: `"inclusive:qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM"`.
| minheight	| integer&nbsp;>=&nbsp;0 | Specifies the minimum block height for the returned headers. For example: `minheight=4471908`.
| maxheight | integer&nbsp;>=&nbsp;0 | Specifies the maximum block height for the returned headers. For example: `maxheight=4953816`.

### Request schema

These parameters specify the upper and lower bounds for the queried branches.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| lower	| Array&nbsp;of&nbsp;strings | Specifies the lower bound block header hash for the query. No block headers are returned that are predecessors of any block with a hash from this array. The block hash consists of 43 characters from the `a-zA-Z0-9_-` character set. |
| upper | Array of strings | Specifies the upper bound block header for the query. All block hashes returned are predecessors of a block with a hash from this array. The block hash consists of 43 characters from the `a-zA-Z0-9_-` character set. |

The following examples illustrate the results to expect based on setting the lower and upper bound parameters. 

To return all ancestors of one block:

```json
{
  "lower": [],
  "upper": [
    "QxGCAz5AY1Y41nh1yWtgqhKhZ9pPiPRagFdIKNqBH74"
  ]
}
```

For example, to return all of the ancestors of a block that are not ancestors of another block, you might specify bounds similar to the following:

```json
{
  "lower": [
    "RClyuyZAacwvPpmLXKbTwrIRXWeUSjiNhJVP2esH8KM"
  ],
  "upper": [
    "QxGCAz5AY1Y41nh1yWtgqhKhZ9pPiPRagFdIKNqBH74"
  ]
}
```

### Responses

Requests to `http://{baseURL}/chain/{chain}/header/branch` return the following response codes:

- **200 OK** indicates that the request succeeded and returns the block headers matching the specified criteria as base64Url-encoded or JSON-encoded.
- **400 Bad Request** indicates that the branch bounds were exceeded.
- **404 Not Found** indicates that the block header indicated by a required parameter was not found.
- **406 Not Acceptable** indicates that the value of the Accept header is not supported.

#### Response headers

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Successful response schemas

The format of the information returned in the response depends on the content type specified in the Accept header of the request.

| Parameter | Type | Description
| --------- | ---- | -----------
| items&nbsp;(required) | Array&nbsp;of&nbsp;block&nbsp;headers | Returns an array of block headers as base64Url-encoded strings (`application/json`), JSON-encoded objects (`application/json;blockheader-encoding=object`), or a binary data stream (`application/octet-stream`, if supported)
| limit&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the number of items in the page. This number can be smaller but never be larger than the number of requested items.
| next (required) | string&nbsp;or&nbsp;null | Returns a cursor that can be used in a follow up request to query the next page. It should be used literally as the value for the `next` parameter in the follow-up request. It can be specified as inclusive or exclusive.

### Examples

You can send a request to the Kadena main network—mainnet01—and chain 4 with a limit of three items per request and a minimum block height of 4953300 by calling the service endpoint like this:

```Postman
POST http://api.chainweb.com/chainweb/0.0/mainnet01/chain/4/header/branch?limit=3&minheight=4953300
```

With the Accept header set to `application/json`, this request returns the block headers as a base64Url-encoded strings without padding:

```json
{
    "limit": 3,
    "items": [
        "AAAAAAAAAACHrEs-Th0GAIPjfG2bsp6NK5D8iWUoRUM1OQ3p9q3stapX5Zybos80AwAJAAAAGXv0fxVXgDQTtRTxMjWfr6JXXrSscoaCaxEDPC93QIgOAAAAVosxlCQP8q0cPi3zd_yD_099Untb69bnIgIFlAioj9ITAAAAYlpdztdOQ-ChRklldcC2oHbZlAMIiYAGRgzTZBXvRgaKSm6dcl7l1vKo1o0wOE5aEG0l4ulUQ1YVAAAAAAAAAG1aryT2lPfDS6jwjJmgctr-u158xYunNRIujS2Y2VbyBAAAABWoQdQYrsb9AUkBAAAAAAAAAAAAAAAAAAAAAAAAAAAA2JZLAAAAAAAFAAAAcRDzfU0dBgDGFmKDSkZ45LbBZMajR8v1m3Zww07plf9jBYzEE8ia82_PvnTt5I4z",
        "AAAAAAAAAAA_lIk6Th0GAKw2xvazH-9PUpO1fCT45HbD8uU5Nsu51AAI0uD75S98AwAJAAAAptV1M_F1lYvTgMuC8g17ltHfA3SPsypQtiPWT8CTOW8OAAAAd_4KONk9zhF-yXHzShOookNJq9wV67K7jKxcZjcTtVETAAAAqp2F3-wGndQygNovYEYmrCygvvagdZRqHCi8Rml3C_qKSm6dcl7l1vKo1o0wOE5aEG0l4ulUQ1YVAAAAAAAAAJ1YNbk1mDHy9fXRpWr5RtcQNyMdcV6Wrc7l1yeb14WvBAAAAN80jMLyM8fxAUkBAAAAAAAAAAAAAAAAAAAAAAAAAAAA15ZLAAAAAAAFAAAAcRDzfU0dBgD-CxOF2XaGNoPjfG2bsp6NK5D8iWUoRUM1OQ3p9q3stapX5Zybos80",
        "AAAAAAAAAAAu1Hc3Th0GANsQ9KLq4IMMIXs1kWe-AeOqxJtuuLxO3iruSl3AmktlAwAJAAAAMmRRH-P_WCcG8UNu-NS4iWCmT4Godwm0ScV7MJXxNuUOAAAAH6HdmZhFzniidoeZTFUa4CKnMa-5e0INX8vhvhezAPcTAAAA82lUdaVunS05mRdpWeSSb0vixsVpYISDRLX0BE2lySeKSm6dcl7l1vKo1o0wOE5aEG0l4ulUQ1YVAAAAAAAAAAHTXM_ZAusmXzCBgSx7u8opHkC8kkNCDX7KS8ywVI60BAAAAKnB1rDMucflAUkBAAAAAAAAAAAAAAAAAAAAAAAAAAAA1pZLAAAAAAAFAAAAcRDzfU0dBgBxACkcRTx3HKw2xvazH-9PUpO1fCT45HbD8uU5Nsu51AAI0uD75S98"
    ],
    "next": "inclusive:2xD0ourggwwhezWRZ74B46rEm264vE7eKu5KXcCaS2U"
}
```

With the Accept header set to `application/json;blockheader-encoding=object`, the request returns the block headers as JSON-encoded objects like this:

```json
{
    "limit": 3,
    "items": [
        {
            "nonce": "16462985723698616006",
            "creationTime": 1721071750065287,
            "parent": "g-N8bZuyno0rkPyJZShFQzU5Den2rey1qlflnJuizzQ",
            "adjacents": {
                "19": "YlpdztdOQ-ChRklldcC2oHbZlAMIiYAGRgzTZBXvRgY",
                "14": "VosxlCQP8q0cPi3zd_yD_099Untb69bnIgIFlAioj9I",
                "9": "GXv0fxVXgDQTtRTxMjWfr6JXXrSscoaCaxEDPC93QIg"
            },
            "target": "ikpunXJe5dbyqNaNMDhOWhBtJeLpVENWFQAAAAAAAAA",
            "payloadHash": "bVqvJPaU98NLqPCMmaBy2v67XnzFi6c1Ei6NLZjZVvI",
            "chainId": 4,
            "weight": "FahB1Biuxv0BSQEAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "height": 4953816,
            "chainwebVersion": "mainnet01",
            "epochStart": 1721068523032689,
            "featureFlags": 0,
            "hash": "tsFkxqNHy_WbdnDDTumV_2MFjMQTyJrzb8--dO3kjjM"
        },
        {
            "nonce": "3928958401539935230",
            "creationTime": 1721071687013439,
            "parent": "rDbG9rMf709Sk7V8JPjkdsPy5Tk2y7nUAAjS4PvlL3w",
            "adjacents": {
                "19": "qp2F3-wGndQygNovYEYmrCygvvagdZRqHCi8Rml3C_o",
                "14": "d_4KONk9zhF-yXHzShOookNJq9wV67K7jKxcZjcTtVE",
                "9": "ptV1M_F1lYvTgMuC8g17ltHfA3SPsypQtiPWT8CTOW8"
            },
            "target": "ikpunXJe5dbyqNaNMDhOWhBtJeLpVENWFQAAAAAAAAA",
            "payloadHash": "nVg1uTWYMfL19dGlavlG1xA3Ix1xXpatzuXXJ5vXha8",
            "chainId": 4,
            "weight": "3zSMwvIzx_EBSQEAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "height": 4953815,
            "chainwebVersion": "mainnet01",
            "epochStart": 1721068523032689,
            "featureFlags": 0,
            "hash": "g-N8bZuyno0rkPyJZShFQzU5Den2rey1qlflnJuizzQ"
        },
        {
            "nonce": "2051174422813409393",
            "creationTime": 1721071635518510,
            "parent": "2xD0ourggwwhezWRZ74B46rEm264vE7eKu5KXcCaS2U",
            "adjacents": {
                "19": "82lUdaVunS05mRdpWeSSb0vixsVpYISDRLX0BE2lySc",
                "14": "H6HdmZhFzniidoeZTFUa4CKnMa-5e0INX8vhvhezAPc",
                "9": "MmRRH-P_WCcG8UNu-NS4iWCmT4Godwm0ScV7MJXxNuU"
            },
            "target": "ikpunXJe5dbyqNaNMDhOWhBtJeLpVENWFQAAAAAAAAA",
            "payloadHash": "AdNcz9kC6yZfMIGBLHu7yikeQLySQ0INfspLzLBUjrQ",
            "chainId": 4,
            "weight": "qcHWsMy5x-UBSQEAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "height": 4953814,
            "chainwebVersion": "mainnet01",
            "epochStart": 1721068523032689,
            "featureFlags": 0,
            "hash": "rDbG9rMf709Sk7V8JPjkdsPy5Tk2y7nUAAjS4PvlL3w"
        }
    ],
    "next": "inclusive:2xD0ourggwwhezWRZ74B46rEm264vE7eKu5KXcCaS2U"
}
```

If you set the Accept header to `application/octet-stream` and the content type is supported, the request returns a binary representation of the block header.
If the content type isn't support, the reguest fails with a **406 Not Acceptable** response code.
