---
title: Check a database backup
description:
  Send an API request to check the status of a database backup job.
id: check-db-backup
sidebar_position: 11
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Check the status of a database backup

Use `GET http://{baseURL}/check-backup/{backupId}` to check the status of a backup job.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| backupId&nbsp;(required) | string | Specifies the backup job identifier with a UNIX timestamp from the `a-zA-Z0-9_-` character set. For example: 1648665437000

### Responses

Requests to the `GET http://{baseURL}/check-backup` endpoint can return the following response codes:

- **200 OK** indicates that a backup job with the specified identifier exists and returns its current status.
- **404 Not Found** indicates that there were no backup jobs matching the specified identifier.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Response schema

The response returns `text/plain` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| status | string | Specifies the status of the backup job with the specified identifier. There are three possible status messages: `backup-done`, `backup-in-progress`, and `backup-failed`.
