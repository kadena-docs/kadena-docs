---
title: Send a private Pact command
description:
  Provides reference information for the Pact /private endpoint.
id: private
sidebar_position: 5
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Send a private Pact command

You can use the `POST http://{baseURL}/chain/{chain}/pact/api/v1/private` endpoint for asynchronous submission of a single command transmitted with end-to-end encryption between addressed entity nodes. 
Private payload metadata is required.

## Request format

Use the `POST http://{baseURL}/chain/{chain}/pact/api/v1/private` endpoint for asynchronous submission of a single command transmitted with end-to-end encryption between addressed entity nodes. 

### Request body schema

| Parameter | Type | Description
| --------- | ---- | -----------
| `cmd` (required) | string | Stringified JSON payload object with signed transaction data that can't be modified.
| `hash` (required) | string | An unpadded base64Url-encoded string created using the Blake2s-256 hash function for the `cmd` field value. Serves as a command request key because each transaction must be unique.
| `sigs` (required) | Array of objects | List of signatures corresponding one-to-one with the signers array in the payload.

## Responses

Requests to `POST http://{baseURL}/chain/{chain}/pact/api/v1/private` return the following response codes:

- **200 OK** indicates that the request succeeded and the response body includes the command results.
- **400 Bad Request** indicates that the request failed. The response returns `text/plain` content with information about why the request failed. For example, the response might indicate that the command wasn't executed because the request body specified an invalid gas payer, was missing required metadata, or there were other environment issues.

If the request is successful and the command is accepted, the response returns `application/json` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| `requestKeys` (required) | Array of strings | Unique identifier for the Pact transaction. The transaction hash is a base64Url-encoded string that consists of 43 characters from the [`a-zA-Z0-9_-`] character set. You can use the request key to call the `poll` or `listen` endpoint to retrieve results.
