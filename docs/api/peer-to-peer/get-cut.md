---
title: Query the current state
description:
  Use the GET /cut endpoint to return the cut height for a Chainweb node.
id: get-cut
sidebar_position: 2
tags: ['chainweb', 'node api', 'chainweb api', 'api reference', 'block height cut']
---

# Query the current state

In the Kadena network, a **cut height** represents the distributed state from a Chainweb node. 
Each cut height—much like a database snapshot or a block height—references one block header for each chain, compared with concurrent blocks on other chains.

Two blocks from two different chains are considered concurrent if either block is an adjacent parent and a direct dependency of the other or if the blocks do not depend at all on each other.

## Request format

Use `GET https://{baseURL}/cut` to query a Chainweb node for the current cut height on all chains.

You can specify the following optional query parameter for the request:

| Parameter | Type | Description
| --------- | ---- | -----------
| maxheight | integer >= 0 | Maximum cut height of the returned cut.

## Responses

Requests to `GET https://{baseURL}/cut` return the following response code:

- **200 OK** indicates that the request succeeded and the response body returns the blockchain state for each chain at the specified block height. 

### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

### Response schema

The response returns `application/json` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| origin | object | Describes a peer information object that consists of an `id` string and an `address` object for a Chainweb node. The `origin` parameter is required to use the `PUT /cut` endpoint. For more information, see the [Peer information](/api/data-models#peer-information-model) data model.
| height&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the cut height. The cut height is the sum of the height for all of the blocks included in the cut. You should avoid using this value because its semantics may change in the future.
| weight&nbsp;(required) | string | Specifies the cut weight. The cut weight is the sum of the weights from all of the blocks included in the cut. The weight string consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| hashes&nbsp;(required) | object | Specifies an object that maps chain identifiers 0-19 to their respective block hash and block height for the cut.
| instance | string | Specifies the network identifier for the cut.
| id | string | Specifies a cut identifier. The id string consists of 43 characters from the [`a-zA-Z0-9_-`] character set.

## Examples

You can send a request to a bootstrap node for the Kadena main network with a call like this:

```Postman
GET https://us-e1.chainweb.com/chainweb/0.0/mainnet01/cut?maxheight=4833114
```

The response header for this request looks like this:

```text
X-Server-Timestamp: 1717448611
X-Peer-Addr: 54.86.50.139:49795
X-Chainweb-Node-Version: 2.24
Content-Type: application/json;charset=utf-8
```

The response body for this request returns the state for each chain with the maximum block height of 483314:

```json
{
  "hashes":
  {
    "5":{
      "height":483311,
      "hash":"3uC7pcfNDQLBnkSEXak5-SJDTQDzOcCu-hzLdZB5SZY"
    },
    "4":{
      "height":483311,
      "hash":"-J7wrfvBhTV_4FMEwzcUczchURV3vR8X1Iw6_70Vdcw"
    },
    "7":{
      "height":483311,
      "hash":"Th5sqaG-czuzwwqJplj_tqJrp9C09mFFESqpxZ_n5TM"
    },
    "6":{
      "height":483311,
      "hash":"jGXtsEywkJiDd0QdTou3vP-7-s_5tf49DFq0BP0roBs"
    },
    "1":{
      "height":483311,
      "hash":"-v_J5dWJIsBa760sVDXg69OizfWvhK10VRtDDlGq4-M"
    },
    "0":{
      "height":483311,
      "hash":"pG1qqlfEaCkCcIw1cPMcFt4ELRbHVsFqtmx287DZzfw"
    },
    "3":{
      "height":483311,
      "hash":"_dZeAaGioNKP3eEMfI7yLw49RGaiSc57L7bKged_Uf0"
    },
    "2":{
      "height":483311,
      "hash":"belGw7zEJah0nNrP-jw7LarZSTt_NMlqAzvIDS40Fgo"
    },
    "9":{
      "height":483311,
      "hash":"--PHSuDXqCIXnGDXc0w49VT9yA-BJ_vwLil2IIAkrk4"
    },
    "8":{
      "height":483311,
      "hash":"1kDMHN7wEE51E1yDew16WE8GFWfSXBCpmV5Koy00Mjg"
    }
  },
  "origin":null,
  "weight":"yQadPJMTi0wrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "height":4833110,
  "instance":"mainnet01",
  "id":"unhwBpXkw-Pa9hulGzExDev40Ju7VelHTg1zArwsoOU"
}
```

Note that this sample request was sent to a bootstrap node for the Kadena public blockchain, so the `origin` is `null`.
If you want to publish a cut, you must send the request to a Chainweb node that returns a value for the `origin` property.
