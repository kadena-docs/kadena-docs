---
title: Get multiple payload outputs
description:
  Provides reference information for the chainweb-node block payload endpoints.
id: get-payload-output-batch
sidebar_position: 7
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Get multiple payload outputs

Use `POST https://{baseURL}/chain/{chain}/payload/outputs/batch` to multiple block payloads with output in a single batch request.

## Request format

Use `POST https://{baseURL}/chain/{chain}/payload/outputs/batch` with an array of payload hash strings in a JSON object to specify the payloads you want to include in your batch request.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the chain identifier for the chain you want to get the payload from. Valid values are 0 to 19. For example, to get block payload for the first chain (0), the request is `POST https://{baseURL}/chain/0/payload/outputs/batch`.

### Request body schema

Use an array of payload hash strings in a JSON object to specify the payloads you want to include in your batch request, with or without heights.

| Parameter | Type | Description
| --------- | ---- | -----------
| hashes&nbsp;(required) | Array&nbsp;of&nbsp;strings | Each block payload hash is a Base64Url-encoded string—without padding—that consists of 43 characters from the `a-zA-Z0-9_-` character set. For example: `GpaWbHkHrCjRhY8hKE0qZ1WsBBaG3Y_zkFLV2sYumQA`.
| heights&nbsp;(required) | Array&nbsp;of&nbsp;integers | Specifies the block heights to include in the request.

## Responses

Requests to `POST https://{baseURL}/chain/{chain}/payload/outputs/batch` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body includes some or all of the requested block payloads. The payloads are returned in any order.
- **404 Not Found** indicates that no payloads mateching the request criteris were found.

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

## Examples

You can send a request to a bootstrap node for the Kadena main public blockchain network and chain id 4 with a call like this:

```Postman
POST https://us-e1.chainweb.com/chainweb/0.0/mainnet01/chain/4/payload/outputs/batch
```

In this example, the batch request includes three payload hashes and two block heights like this:

```json
{
    "hashes":["R464YmQdiNCakRluZb2oJDG_uJBqUSAZpANNktJRQko","nrPYG6PSkE40eYuf4LLrPFRADp2Uq7EI9d4OOIqeOMs","JerYnYUPUWavDKO1plBuVTi62PHcAsgICIA0IRSGA8s"],
    "heights":[4953820,4953821]
}
```

The request returns the results matching the request criteria like this:

```json
[
    {
        "transactions": [
            [
                "eyJoYXNoIjoiQmJHc0J6RTNhcW9ObmstOUt6U3FwSnFDc3duSEFuWHFJa21JUFV4RjVidyIsInNpZ3MiOlt7InNpZyI6Ijc2NjU1NjM0N2MzYzY1YzMwMmM0OTYwMWVlY2E2Yzk3ZTg1ODdmMDk3M2E5ZjlkOWY0N2YyM2NhZjJhMGZiMTMwN2Y1OGNhM2FiYzNlNjEyZTM3NTE3NWMyNWQ3ZjViY2FjZmEwOTQzN2NkZDI1MjU1YTM2ZmQwOGEzYjI0ZTA2In1dLCJjbWQiOiJ7XCJwYXlsb2FkXCI6e1wiZXhlY1wiOntcImNvZGVcIjpcIihuX2JmYjc2ZWFiMzdiZjhjODQzNTlkNjU1MmExZDk2YTMwOWUwMzBiNzEuZGlhLW9yYWNsZS5zZXQtbXVsdGlwbGUtdmFsdWVzIFtcXFwiQlRDL1VTRFxcXCIsXFxcIkVUSC9VU0RcXFwiLFxcXCJXRVRIL1VTRFxcXCIsXFxcIkdMTVIvVVNEXFxcIixcXFwiT1AvVVNEXFxcIixcXFwiQVJCL1VTRFxcXCIsXFxcIkFWQVgvVVNEXFxcIixcXFwiS0RBL1VTRFxcXCJdIFsodGltZSBcXFwiMjAyNC0wNy0xNVQxOTozMDozNlpcXFwiKSwgKHRpbWUgXFxcIjIwMjQtMDctMTVUMTk6MzA6MzZaXFxcIiksICh0aW1lIFxcXCIyMDI0LTA3LTE1VDE5OjMwOjM2WlxcXCIpLCAodGltZSBcXFwiMjAyNC0wNy0xNVQxOTozMDozNlpcXFwiKSwgKHRpbWUgXFxcIjIwMjQtMDctMTVUMTk6MzA6MzZaXFxcIiksICh0aW1lIFxcXCIyMDI0LTA3LTE1VDE5OjMwOjM2WlxcXCIpLCAodGltZSBcXFwiMjAyNC0wNy0xNVQxOTozMDozNlpcXFwiKSwgKHRpbWUgXFxcIjIwMjQtMDctMTVUMTk6MzA6MzZaXFxcIildIFs2MzM4Ny4zOTczNzQwNjUyNywzMzkwLjI0NTAxNDM2NjE1MSwzMzkyLjQ1MzQzNDMzMDA3MywwLjIxNTc3OTQyOTUwMDgzOTEsMS43OTY5MTQwODA1ODkyMzg3LDAuNzM3ODY2MDk2NzE1NzI5MSwyNy4xMjM2MjM2NjcyNjQ5NDgsMC42MDk1NDkzMDk0NDYwNjM2XSlcIixcImRhdGFcIjp7fX19LFwibm9uY2VcIjpcImtqczpub25jZToxNzIxMDcxODM2OTE5XCIsXCJzaWduZXJzXCI6W3tcInB1YktleVwiOlwiOGY5MTk3NGQwNTQzZDhjMTMyYmM0Nzk2YTY0ZDgzZWFmODA4YTZjM2ZjZDJlZjJkNjZhY2FhNTkzZThiNDRlNlwiLFwic2NoZW1lXCI6XCJFRDI1NTE5XCJ9XSxcIm1ldGFcIjp7XCJnYXNMaW1pdFwiOjI1MDAsXCJnYXNQcmljZVwiOjFlLTgsXCJzZW5kZXJcIjpcIms6OGY5MTk3NGQwNTQzZDhjMTMyYmM0Nzk2YTY0ZDgzZWFmODA4YTZjM2ZjZDJlZjJkNjZhY2FhNTkzZThiNDRlNlwiLFwidHRsXCI6Mjg4MDAsXCJjcmVhdGlvblRpbWVcIjoxNzIxMDcxODM2LFwiY2hhaW5JZFwiOlwiNFwifSxcIm5ldHdvcmtJZFwiOlwibWFpbm5ldDAxXCJ9In0",
                "eyJnYXMiOjE2MTQsInJlc3VsdCI6eyJzdGF0dXMiOiJzdWNjZXNzIiwiZGF0YSI6W3RydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZV19LCJyZXFLZXkiOiJCYkdzQnpFM2Fxb05uay05S3pTcXBKcUNzd25IQW5YcUlrbUlQVXhGNWJ3IiwibG9ncyI6IjlwUUNvZWZNSEpKNllYS0pLUVVGMkVOTmItMW9XMXRsQ2ZnSUx6a3hMdW8iLCJldmVudHMiOlt7InBhcmFtcyI6WyJrOjhmOTE5NzRkMDU0M2Q4YzEzMmJjNDc5NmE2NGQ4M2VhZjgwOGE2YzNmY2QyZWYyZDY2YWNhYTU5M2U4YjQ0ZTYiLCJrOjI1MWVmYjA2ZjNiNzk4ZGJlN2JiM2Y1OGY1MzViNjdiMGE5ZWQyZGE5YWE0ZTIzNjdiZTRhYmMwN2NjOTI3ZmEiLDEuNjE0ZS01XSwibmFtZSI6IlRSQU5TRkVSIiwibW9kdWxlIjp7Im5hbWVzcGFjZSI6bnVsbCwibmFtZSI6ImNvaW4ifSwibW9kdWxlSGFzaCI6ImtsRmtyTGZweUxXLU0zeGpWUFNkcVhFTWd4UFBKaWJSdF9ENnFpQndzNnMifSx7InBhcmFtcyI6WyJCVEMvVVNEIix7InRpbWUiOiIyMDI0LTA3LTE1VDE5OjMwOjM2WiJ9LDYzMzg3LjM5NzM3NDA2NTI3XSwibmFtZSI6IlVQREFURSIsIm1vZHVsZSI6eyJuYW1lc3BhY2UiOiJuX2JmYjc2ZWFiMzdiZjhjODQzNTlkNjU1MmExZDk2YTMwOWUwMzBiNzEiLCJuYW1lIjoiZGlhLW9yYWNsZSJ9LCJtb2R1bGVIYXNoIjoiN1FWOTlvcGVDMHRZSTE4NHdzOWJNdDRvcnk0bF9qX0F1WXMtTEpUMmJWNCJ9LHsicGFyYW1zIjpbIkVUSC9VU0QiLHsidGltZSI6IjIwMjQtMDctMTVUMTk6MzA6MzZaIn0sMzM5MC4yNDUwMTQzNjYxNTFdLCJuYW1lIjoiVVBEQVRFIiwibW9kdWxlIjp7Im5hbWVzcGFjZSI6Im5fYmZiNzZlYWIzN2JmOGM4NDM1OWQ2NTUyYTFkOTZhMzA5ZTAzMGI3MSIsIm5hbWUiOiJkaWEtb3JhY2xlIn0sIm1vZHVsZUhhc2giOiI3UVY5OW9wZUMwdFlJMTg0d3M5Yk10NG9yeTRsX2pfQXVZcy1MSlQyYlY0In0seyJwYXJhbXMiOlsiV0VUSC9VU0QiLHsidGltZSI6IjIwMjQtMDctMTVUMTk6MzA6MzZaIn0sMzM5Mi40NTM0MzQzMzAwNzNdLCJuYW1lIjoiVVBEQVRFIiwibW9kdWxlIjp7Im5hbWVzcGFjZSI6Im5fYmZiNzZlYWIzN2JmOGM4NDM1OWQ2NTUyYTFkOTZhMzA5ZTAzMGI3MSIsIm5hbWUiOiJkaWEtb3JhY2xlIn0sIm1vZHVsZUhhc2giOiI3UVY5OW9wZUMwdFlJMTg0d3M5Yk10NG9yeTRsX2pfQXVZcy1MSlQyYlY0In0seyJwYXJhbXMiOlsiR0xNUi9VU0QiLHsidGltZSI6IjIwMjQtMDctMTVUMTk6MzA6MzZaIn0sMC4yMTU3Nzk0Mjk1MDA4MzkxXSwibmFtZSI6IlVQREFURSIsIm1vZHVsZSI6eyJuYW1lc3BhY2UiOiJuX2JmYjc2ZWFiMzdiZjhjODQzNTlkNjU1MmExZDk2YTMwOWUwMzBiNzEiLCJuYW1lIjoiZGlhLW9yYWNsZSJ9LCJtb2R1bGVIYXNoIjoiN1FWOTlvcGVDMHRZSTE4NHdzOWJNdDRvcnk0bF9qX0F1WXMtTEpUMmJWNCJ9LHsicGFyYW1zIjpbIk9QL1VTRCIseyJ0aW1lIjoiMjAyNC0wNy0xNVQxOTozMDozNloifSx7ImRlY2ltYWwiOiIxLjc5NjkxNDA4MDU4OTIzODcifV0sIm5hbWUiOiJVUERBVEUiLCJtb2R1bGUiOnsibmFtZXNwYWNlIjoibl9iZmI3NmVhYjM3YmY4Yzg0MzU5ZDY1NTJhMWQ5NmEzMDllMDMwYjcxIiwibmFtZSI6ImRpYS1vcmFjbGUifSwibW9kdWxlSGFzaCI6IjdRVjk5b3BlQzB0WUkxODR3czliTXQ0b3J5NGxfal9BdVlzLUxKVDJiVjQifSx7InBhcmFtcyI6WyJBUkIvVVNEIix7InRpbWUiOiIyMDI0LTA3LTE1VDE5OjMwOjM2WiJ9LDAuNzM3ODY2MDk2NzE1NzI5MV0sIm5hbWUiOiJVUERBVEUiLCJtb2R1bGUiOnsibmFtZXNwYWNlIjoibl9iZmI3NmVhYjM3YmY4Yzg0MzU5ZDY1NTJhMWQ5NmEzMDllMDMwYjcxIiwibmFtZSI6ImRpYS1vcmFjbGUifSwibW9kdWxlSGFzaCI6IjdRVjk5b3BlQzB0WUkxODR3czliTXQ0b3J5NGxfal9BdVlzLUxKVDJiVjQifSx7InBhcmFtcyI6WyJBVkFYL1VTRCIseyJ0aW1lIjoiMjAyNC0wNy0xNVQxOTozMDozNloifSx7ImRlY2ltYWwiOiIyNy4xMjM2MjM2NjcyNjQ5NDgifV0sIm5hbWUiOiJVUERBVEUiLCJtb2R1bGUiOnsibmFtZXNwYWNlIjoibl9iZmI3NmVhYjM3YmY4Yzg0MzU5ZDY1NTJhMWQ5NmEzMDllMDMwYjcxIiwibmFtZSI6ImRpYS1vcmFjbGUifSwibW9kdWxlSGFzaCI6IjdRVjk5b3BlQzB0WUkxODR3czliTXQ0b3J5NGxfal9BdVlzLUxKVDJiVjQifSx7InBhcmFtcyI6WyJLREEvVVNEIix7InRpbWUiOiIyMDI0LTA3LTE1VDE5OjMwOjM2WiJ9LDAuNjA5NTQ5MzA5NDQ2MDYzNl0sIm5hbWUiOiJVUERBVEUiLCJtb2R1bGUiOnsibmFtZXNwYWNlIjoibl9iZmI3NmVhYjM3YmY4Yzg0MzU5ZDY1NTJhMWQ5NmEzMDllMDMwYjcxIiwibmFtZSI6ImRpYS1vcmFjbGUifSwibW9kdWxlSGFzaCI6IjdRVjk5b3BlQzB0WUkxODR3czliTXQ0b3J5NGxfal9BdVlzLUxKVDJiVjQifV0sIm1ldGFEYXRhIjpudWxsLCJjb250aW51YXRpb24iOm51bGwsInR4SWQiOjU1MTIwNjV9"
            ]
        ],
        "minerData": "eyJhY2NvdW50IjoiazoyNTFlZmIwNmYzYjc5OGRiZTdiYjNmNThmNTM1YjY3YjBhOWVkMmRhOWFhNGUyMzY3YmU0YWJjMDdjYzkyN2ZhIiwicHJlZGljYXRlIjoia2V5cy1hbGwiLCJwdWJsaWMta2V5cyI6WyIyNTFlZmIwNmYzYjc5OGRiZTdiYjNmNThmNTM1YjY3YjBhOWVkMmRhOWFhNGUyMzY3YmU0YWJjMDdjYzkyN2ZhIl19",
        "transactionsHash": "18splwzqG5qFgIm9EY9em0PS6OGT7pME9pyOYsmFsgA",
        "outputsHash": "et4kTB87lv7VFx1dmyzzqnVRg7QUNFBcE02zU5wD44c",
        "payloadHash": "R464YmQdiNCakRluZb2oJDG_uJBqUSAZpANNktJRQko",
        "coinbase": "eyJnYXMiOjAsInJlc3VsdCI6eyJzdGF0dXMiOiJzdWNjZXNzIiwiZGF0YSI6IldyaXRlIHN1Y2NlZWRlZCJ9LCJyZXFLZXkiOiJJakJEYnpCcFozaDFjRkJTUjBSSGVESTNibmRUYUd4RmVIcFNPVUZ6TFhCdE9EbG1OSFZJUjFsQmFXc2kiLCJsb2dzIjoiSEFHZjhtUkZNQ09MWVVsR1V3Q28xSVJ3akY1MzRDd1FDZ2xHaHIydURrbyIsImV2ZW50cyI6W3sicGFyYW1zIjpbIiIsIms6MjUxZWZiMDZmM2I3OThkYmU3YmIzZjU4ZjUzNWI2N2IwYTllZDJkYTlhYTRlMjM2N2JlNGFiYzA3Y2M5MjdmYSIsMC45ODAxOTFdLCJuYW1lIjoiVFJBTlNGRVIiLCJtb2R1bGUiOnsibmFtZXNwYWNlIjpudWxsLCJuYW1lIjoiY29pbiJ9LCJtb2R1bGVIYXNoIjoia2xGa3JMZnB5TFctTTN4alZQU2RxWEVNZ3hQUEppYlJ0X0Q2cWlCd3M2cyJ9XSwibWV0YURhdGEiOm51bGwsImNvbnRpbnVhdGlvbiI6bnVsbCwidHhJZCI6NTUxMjA2M30"
    }
]
```