---
title: Get payload with output
description:
  Provides reference information for the chainweb-node block payload endpoints.
id: get-payload-output
sidebar_position: 7
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Get payload with output

You can use the `/payload/{payloadHash}/outputs` endpoint to return the specified payload data with its output.

## Request format

Use `GET https://{baseURL}/chain/{chain}/payload/{payloadHash}/outputs` to get payload data with output.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier for the chain you want to send the payload request to. Valid values are 0 to 19. For example, to get the payload for the first chain (0), the request is `GET https://{baseURL}/chain/0/payload/{payloadHash}/outputs`.
| payloadHash&nbsp;(required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set. For example: `GpaWbHkHrCjRhY8hKE0qZ1WsBBaG3Y_zkFLV2sYumQA`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| height | integer&nbsp;>=&nbsp;0 | Height of a block. For example: `height=3000000`.

## Responses

Requests to `GET https://{baseURL}/chain/{chain}/payload/{payloadhash}/outputs` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body returns the payload data and output for the specified payload hash. 
- **404 Not Found** indicates that the payload hash wasn't found.

### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

### Successful response schema

If the request is successful, the response returns `application/json` content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| transactions&nbsp;(required) | Array&nbsp;of&nbsp;strings | An array of Base64Url-encoded strings—without padding—that describe signed Pact transactions in JSON format.
| minerData (required) | string | Miner information is a Base64Url-encoded string—without padding—that consists of characters from the `a-zA-Z0-9_-` character set.This information is included as part of the payload JSON object.
| transactionsHash&nbsp;(required) | string | The transaction hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| outputsHash (required) | string | The output hash is a SHA256 hash. The hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| payloadHash (required) | string | The block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set.
| coinbase (required) | string | Coinbase output is a Base64Url-encoded string—without padding—that consists of characters from the `a-zA-Z0-9_-` character set. This information is included as part of the payload output JSON object.

### Not found response schema

If there are no results matching the request criteria, the response returns the following:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| key | string | Specifies the base64Url-encoded block hash without padding. The block hash consists of 43 characters from the `a-zA-Z0-9_-` character set. |
| reason | string | Provides a placeholder for specifying the reason that no block hashes were found. |

## Examples

You can send a request to a bootstrap node for the Kadena main network and chain id 4 with a call like this:

```Postman
GET https://us-e1.chainweb.com/chainweb/0.0/mainnet01/chain/4/payload/jafDpAgMCYnAqh-hweSjA6sWCAp-ADSDzIcUKyRwkq8/outputs
```

This request returns a response body that looks like this:

```json
{
    "transactions": [
        [
            "eyJoYXNoIjoiQXFtNTRlRWNmMkQtVGJQR3FYLURIYWFkdUF0VXp5dEVqVzhLaDJ6bWlRSSIsInNpZ3MiOlt7InNpZyI6IjY5MzYwYTlhZjZmOTVkMmQ4NjhiNDA4NmQ0ZTU1NjQ3NzRhOGU5NWY0ZDZmMGM0ZGI2MmE4YTgwMmI5YWNkODczOTRmNjNkN2FiMTFkNjA2NWU1MjEzYmYwMGRkNmVhYjliMWI0MzUwODU1MTFmYmRkNmE1ZDcxMzI1YjhmZTBiIn1dLCJjbWQiOiJ7XCJwYXlsb2FkXCI6e1wiZXhlY1wiOntcImNvZGVcIjpcIihuX2JmYjc2ZWFiMzdiZjhjODQzNTlkNjU1MmExZDk2YTMwOWUwMzBiNzEuZGlhLW9yYWNsZS5zZXQtbXVsdGlwbGUtdmFsdWVzIFtcXFwiR05PL1VTRFxcXCJdIFsodGltZSBcXFwiMjAyNC0wNy0xOFQxNTozMDo0N1pcXFwiKV0gWzI1Ny41NV0pXCIsXCJkYXRhXCI6e319fSxcIm5vbmNlXCI6XCJranM6bm9uY2U6MTcyMTMxNjY0NzM0N1wiLFwic2lnbmVyc1wiOlt7XCJwdWJLZXlcIjpcIjhmOTE5NzRkMDU0M2Q4YzEzMmJjNDc5NmE2NGQ4M2VhZjgwOGE2YzNmY2QyZWYyZDY2YWNhYTU5M2U4YjQ0ZTZcIixcInNjaGVtZVwiOlwiRUQyNTUxOVwifV0sXCJtZXRhXCI6e1wiZ2FzTGltaXRcIjoyNTAwLFwiZ2FzUHJpY2VcIjoxZS04LFwic2VuZGVyXCI6XCJrOjhmOTE5NzRkMDU0M2Q4YzEzMmJjNDc5NmE2NGQ4M2VhZjgwOGE2YzNmY2QyZWYyZDY2YWNhYTU5M2U4YjQ0ZTZcIixcInR0bFwiOjI4ODAwLFwiY3JlYXRpb25UaW1lXCI6MTcyMTMxNjY0NyxcImNoYWluSWRcIjpcIjRcIn0sXCJuZXR3b3JrSWRcIjpcIm1haW5uZXQwMVwifSJ9",
            "eyJnYXMiOjQzNSwicmVzdWx0Ijp7InN0YXR1cyI6InN1Y2Nlc3MiLCJkYXRhIjpbdHJ1ZV19LCJyZXFLZXkiOiJBcW01NGVFY2YyRC1UYlBHcVgtREhhYWR1QXRVenl0RWpXOEtoMnptaVFJIiwibG9ncyI6Ik1zenliLXRBZ3dOOEtWeGg5a3FZWTMyVkZlbGx2ZzBsT2lBV3NGWUR3dFkiLCJldmVudHMiOlt7InBhcmFtcyI6WyJrOjhmOTE5NzRkMDU0M2Q4YzEzMmJjNDc5NmE2NGQ4M2VhZjgwOGE2YzNmY2QyZWYyZDY2YWNhYTU5M2U4YjQ0ZTYiLCJrOjI1MWVmYjA2ZjNiNzk4ZGJlN2JiM2Y1OGY1MzViNjdiMGE5ZWQyZGE5YWE0ZTIzNjdiZTRhYmMwN2NjOTI3ZmEiLDQuMzVlLTZdLCJuYW1lIjoiVFJBTlNGRVIiLCJtb2R1bGUiOnsibmFtZXNwYWNlIjpudWxsLCJuYW1lIjoiY29pbiJ9LCJtb2R1bGVIYXNoIjoia2xGa3JMZnB5TFctTTN4alZQU2RxWEVNZ3hQUEppYlJ0X0Q2cWlCd3M2cyJ9LHsicGFyYW1zIjpbIkdOTy9VU0QiLHsidGltZSI6IjIwMjQtMDctMThUMTU6MzA6NDdaIn0sMjU3LjU1XSwibmFtZSI6IlVQREFURSIsIm1vZHVsZSI6eyJuYW1lc3BhY2UiOiJuX2JmYjc2ZWFiMzdiZjhjODQzNTlkNjU1MmExZDk2YTMwOWUwMzBiNzEiLCJuYW1lIjoiZGlhLW9yYWNsZSJ9LCJtb2R1bGVIYXNoIjoiN1FWOTlvcGVDMHRZSTE4NHdzOWJNdDRvcnk0bF9qX0F1WXMtTEpUMmJWNCJ9XSwibWV0YURhdGEiOm51bGwsImNvbnRpbnVhdGlvbiI6bnVsbCwidHhJZCI6NTUyMzQ4Mn0"
        ]
    ],
    "minerData": "eyJhY2NvdW50IjoiazoyNTFlZmIwNmYzYjc5OGRiZTdiYjNmNThmNTM1YjY3YjBhOWVkMmRhOWFhNGUyMzY3YmU0YWJjMDdjYzkyN2ZhIiwicHJlZGljYXRlIjoia2V5cy1hbGwiLCJwdWJsaWMta2V5cyI6WyIyNTFlZmIwNmYzYjc5OGRiZTdiYjNmNThmNTM1YjY3YjBhOWVkMmRhOWFhNGUyMzY3YmU0YWJjMDdjYzkyN2ZhIl19",
    "transactionsHash": "lyjQiTyx8SqozBYkbOxQ5BFBMiK8x7-TA7Ce--fkjNw",
    "outputsHash": "4hSo0VAUzsuROnt0WfX8vytqQ8lQq3xrvt9EHJA_NhI",
    "payloadHash": "jafDpAgMCYnAqh-hweSjA6sWCAp-ADSDzIcUKyRwkq8",
    "coinbase": "eyJnYXMiOjAsInJlc3VsdCI6eyJzdGF0dXMiOiJzdWNjZXNzIiwiZGF0YSI6IldyaXRlIHN1Y2NlZWRlZCJ9LCJyZXFLZXkiOiJJalZ5Wmt4cVEwOUlVbE4wU1RNNE0wbEZVVE5OVlhkemFIcHFSVmxpTjFKaE4zUlhiMnhvVVROU05HOGkiLCJsb2dzIjoieGhlOEREb0VqUEtpQU1GOUs3NXVZalBiTDkzeWlFY3Y0OHZBQnZvaGpZWSIsImV2ZW50cyI6W3sicGFyYW1zIjpbIiIsIms6MjUxZWZiMDZmM2I3OThkYmU3YmIzZjU4ZjUzNWI2N2IwYTllZDJkYTlhYTRlMjM2N2JlNGFiYzA3Y2M5MjdmYSIsMC45ODAxOTFdLCJuYW1lIjoiVFJBTlNGRVIiLCJtb2R1bGUiOnsibmFtZXNwYWNlIjpudWxsLCJuYW1lIjoiY29pbiJ9LCJtb2R1bGVIYXNoIjoia2xGa3JMZnB5TFctTTN4alZQU2RxWEVNZ3hQUEppYlJ0X0Q2cWlCd3M2cyJ9XSwibWV0YURhdGEiOm51bGwsImNvbnRpbnVhdGlvbiI6bnVsbCwidHhJZCI6NTUyMzQ4MH0"
}
```

If there are no results matching the request criteria, the response body indicates the reason no results were found. 
For example:

```json
{
    "key": "i3lwc38zLkSrHDn5wj_LMFfA4VdofhTZ3crqZZ-5WJs",
    "reason": "key not found"
}
```

