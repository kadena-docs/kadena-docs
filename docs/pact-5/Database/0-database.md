---
title: Database functions
description: "Reference information for the Pact built-in capability functions."
id: 0-database
---

Database functions are used to perform database-related tasks, such as creating new tables, reading data from existing tables, or updating table records.
For an introduction to creating database schemas and tables and using database functions, see [Databases](/smart-contracts/databases).

| Function | Description |
| :-------- | :----------- |
| [create&#8209;table](/pact-5/database/create-table) | Create a table identified by the specified table `name`. |
| [describe&#8209;keyset](/pact-5/database/describe-keyset) | Retrieve metadata for a specified `keyset`. |
| [describe&#8209;module](/pact-5/database/describe-module) | Retrieve metadata for a specified `module`. |
| [describe&#8209;table](/pact-5/database/describe-table) | Retrieve metadata for a specified `table`. |
| [fold-db](/pact-5/database/fold-db) | Select rows from a specified `table` and iterate over them using a specified `consumer` function. |
| [insert](/pact-5/database/insert) | Write an entry in a specified `table` for a given `key` of `object` data. |

