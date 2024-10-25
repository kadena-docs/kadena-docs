---
title: Database model
description: "Kadena blockchain nodes store information in two different data stores, with a RocksDB key-value store that stores information about nodes, chains, and blocks and a SQLite database that stores information about Pact smart contracts and transactions."
id: databases
order: 7
tags:
  [
    'pact',
    'beginner',
    'schemas and tables',
    'schemas',
    'tables',
    'pact tutorials',
  ]
---

# Database model

Kadena blockchain nodes store information in two different data stores.
On each Chainweb node, there's a RocksDB key-value stores that stores information about the peer network, chains, and blocks.
Each node also hosts a set of SQLite database files that store information about Pact smart contracts and transaction results for each chain in the network.

The following diagram presents a simplified view of this separation of concerns.

![Data store overview](/img/database-overview.png)

If you explore the folders and files on a Chainweb node, you'll see this structure reflected in the file system with a hierarchy like this:

```bash
chainweb
 |_ db
   |_ 0
     |_ rocksDb
     |_ sqlite
        |_ pact-v1-chain-0.sqlite
        |_ pact-v1-chain-0.sqlite.shm
        |_ pact-v1-chain-0.sqlite.wal
        ...
```

As a smart contract developer, you're primarily interested in writing to and reading from the Pact state, but it's helpful to know how data is organized and optimized for different execution modes and to perform different tasks.
The rockDb—sometimes referred to as the chain database—is optimized for efficient network communication and resiliency.
Pact database operations are optimized for transaction performance.

## Working with Pact tables

Interacting with Pact databases is much like interacting with any other type of database, but with constraints that reflect the unique requirements of blockchain execution.
For example, working with Pact databases is similar to working with other SQL-based databases, with similar database operations.
There are built-in functions to insert, read, and update values stored in tables.

| Function type | Description |
| :------------ | :---------- |
| [Insert](/pact-5/database/database#insert) | Insert new rows into a table. |
| [Read](/pact-5/database/database#read) | Read values from a table. |
| [Update](/pact-5/database/update) | Update values within a table. |
| Delete | Not available in Pact. |

If you've worked with other databases or programming languages, you should be familiar with similar functions that enable you to create, read, update, and delete (CRUD) information.
However, in Pact, you use the `insert` function in place of the create functionality to add rows to a table and there isn't a function to delete rows from a table.
Pact doesn't provide a delete function because of the potential issues with performance, data integrity, and data migration that row-level delete operations can introduce.
In addition, being able to delete rows or tables violates one of the most important properties of a blockchain environment: that it provides an immutable record of state. 

Most smart contracts use one or more tables to store all of the information required for the application or service that the smart contract provides. 
You access the information stored in Pact tables by using the table's key-row structure.
This access model is similar to using a primary key to access table data in other relational databases. 

## Table creation

Tables are defined by **schemas** in module declarations.
The schema defines the table columns, field values, and field types.
The module declaration also specifies the table name to associate with each schema you define.
There's no restriction on the number of tables you can create.

The tables specified in the module declaration are [created](/pact-5/database/create-table) after the module declaration, and the table name is prepended with the module name, so that the module becomes the table owner. 

It’s important to note this distinction between when tables are defined and when tables are created.
You define table schemas, the table associated with each schema, and the functions that insert, read, and modify database records inside of module code. You create the tables outside of module code. 
The module acts as a guard to protect access to database functions and database records. 
This separation also allows module code to be updated without necessarily recreating the table in Pact state. 

## Table schemas

Before you create a table in Pact, you must define its schema.
The schema describes the structure of the table by specifying the columns and data types for the values to be stored in the table. 
Schemas are defined within the Pact module declarations by using the [defschema](/reference/syntax#defschema) keyword and consist of a
series of **field names** and **field types**.

Each field name specifies a column in the table, and each field type specifies the type of data held in that field.

In the following example, the **accounts** table has three columns with the field names  **balance**, **amount**, and **currency**:

| Field name | Field type |
| :--------- | :---------- |
| balance | decimal |
| amount | decimal |
| currency | string |

In this example, the **balance** and **amount** columns require the decimal as the data type and the currency column requires data to be a string value.
You can create the schema for this table in Pact like this:

```pact
(defschema accounts
  "Schema for accounts table."
  balance:decimal
  amount:decimal
  currency:string
)
```

All table schemas you create look similar to this example, but with different field names and data types. 
There are no specific requirements for field names. 
In general, you should field names that are short but recognizable.
For each field, the field type must be one the data types that Pact supports.

For information about the data types that Pact supports, see [Data types](/smart-contracts/lang-featuresd#data-types).

## Table definition

In Pact, tables are defined inside of the module declaration by using the `deftable` keyword.
The table definition accomplishes two goals:

- It associates a table name with a specific table schema of columns and data types.
- It defines the table inside of the module namespace.

There's no limit to the number of tables you can define in a module. 
Because the table is defined inside of a module, direct access to the table using database functions is only authorized for the module owner, that is, its administrative keyset or governance capability. 
However, module functions have unrestricted access to the table by default. 
With this default behavior, the module acts as the main entry point for all user interaction.
You can restrict access to tables inside of the module by using [row-level keysets](#row-level-keysets) and enforcing the keyset guard for specific functions.

The following example illustrates using the deftable keyword to define an **accounts-table** table that uses the **accounts** schema:

```pact
(deftable accounts-table:{accounts})
```

Notice that the table and schema are represented as a pair, separated by a colon (`:`). 
The curly braces (`{ }`) around the schema name are there because the schema is an object.

The schema name and table name must be different from one another. 
In general, you should use table and schema names that are similar to each other or follow a consistent convention to avoid confusion:
For example:

```pact
(deftable cat-table:{cats})
(deftable asset-tracker:{assets})
```

## Create module tables

After you have defined all of the tables for your module inside of the module declaration, you can create those tables outside of the module. 
Creating the table outside of the module ensures that other parts of the module logic can be redefined or updated without recreating the table.

You can created tables after the module declaration by using the [create-table](/pact-5/database/create-table) function followed by the table name as it's defined in the module declaration.
For example:

```pact
(create-table accounts-table)
(create-table cat-table)
(create-table asset-tracker)
```

## Insert

You can use the [insert](/pact-5/database/insert) function to add new data to a table. 
You can use `insert` function to add any type of new artifact with a key value.
For example, you can use a key value to add a row of data about accounts, customers, loans, or assets.

The following example illustrates adding a row to the `accounts-table` using the `insert` function with the key value
"account-1".

```pact
(insert accounts-table “account-1” { "balance": 12.3, "amount": 0.0, "currency":"USD"})
```

Note that the key must be a string value.
This example adds the following row to the `accounts-table`:

| key | balance | amount | currency
|:--- | :------ | :----- | :-------
| account-1 | 12.3 | 0.0 | USD


You can also use the `insert` function inside of another function to add new data to rows in a table from the input values for the function.
For example:

```pact
(defun create-account (id balance amount currency)
  (insert accounts-table id 
       { "balance": balance,
         "amount" : amount,
         "currency": currency })
)
```

In this example, the row inserted into the `accounts-table` takes the values entered for the `create-account` function.

## Read

You can use the [read](/pact-5//database/read) function to read a row of data from a specified table for a specified key value.

In the following example, the `accounts-table` has two rows of data storing the account balance and currency for **account-1** and **account-2**:

| key       | balance | currency |
| --------- | ------- | --- |
| account-1 | 4.00    | USD |
| account-2 | 3.00    | USD |

You can use the `read` function to retrieve the information for the  key value.
For example, you can get the `balance` and `currency` information for `account-1` like this:

```pact
(read accounts-table account-1 ['balance 'ccy])
```

You can also use the `read` function inside of another function like this.

```pact
(defun read-accounts (1)
  (read accounts id [‘balance ‘ccy])
)
```

In each example, the `read` functions returns the following values:

| balance | currency |
| :------ | :------- |
| 4.00 | USD |

## Update

You can use the [update](/pact-5/database/update) function to update one or more values in an existing row of a table. 
Updates enable you to change the status of a column or amend the initial dataset to record a new value.

With the `update` function, you specify the key for the row you want to update, the field you want to update, and the new value for the field in that that row.
In most cases, you use `update` functions in other functions to allow users to input new values.

```pact
(update table-name id {"field": new-value})
```

The following example illustrates updating the `status` field for an asset in the `assets-table`.
Before updating the  `assetPrice`, the  `assets-table` has the following fields and values.

| assetID | assetName | assetPrice | status |
|:------- |:--------- |:---------- |:------ |
| asset-1 | My Asset | 5.0         | todo   |

For this example, the `asset-update` function updates the `status` column, then reads the value of the updated column.

```pact
(defun asset-update (assetId:string new-status:string)
  (update assets-table assetId {
    "status": new-status
  })
  (read asset-table assetId)
)
```

## Select

You can use the [select](/pact-5/database/select) function to select values from a table based on some criteria.

The `select` function is similar to the `read` function but provides you with more flexibility in what information you choose to select. 
The syntax for the Pact `select` function is similar to the syntax for standard SQL `SELECT` statements.

The simplest `select` statement retrieves all values from a specified table.
In the following example, the `select` statement is used in a `select-assets` function to return all values from the `assets-table`.

```pact
  (defun select-assets ()
    (select assets-table (constantly true))
  )
```

This query returns all of the values currently stored in the `assets-table` fields.
For example:

| assetId  | assetName | assetPrice | status      |
|:-------- |:--------- |:---------- |:----------- |
| asset-1 | My Asset  | 5.0        | todo        |
| asset-2 | Asset 2   | 6.0        | in progress |
| asset-3 | Asset 3   | 7.0        | done        |

Like standard SQL SELECT statements, you can use a `where` clause to refine your results.
For example:

```pact
  (select assets-table ['assetName,'assetPrice] (where 'assetName (= "Asset 2")))
```

This query returns the following values from the sample `assets-table`:

| assetName | assetPrice |
| --------- | ---------- |
| Asset 2   | 6.0        |

You can also specify operators—such as greater than (>) or less than (<)—from within the `where` clause.
For example:

```pact
  (select assets-table (where 'assetPrice (> 6.0)))
```

This query returns the following values from the sample `assets-table`:

| key      | assetName | assetPrice | status |
| -------- | --------- | ---------- | ------ |
| entity-3 | Asset 3   | 7.0        | done   |

## Keys

You can use the [keys](/pact-5/database/keys) function to return all of the **key** values in a table.
For example, you can return the `key` values for the sample `assets-table` with the following code:

```pact
  (keys assets-table)
```

You can also use this function within another function.
For example:

```pact title=" "
  (defun get-keys (table-name)
    (keys table-name)
  )
```


---



### Atomic execution

A single message sent into the blockchain to be evaluated by Pact is _atomic_: the transaction succeeds as a unit, or does not succeed at all, known as "transactions" in database literature. There is no explicit support for rollback handling, except in [multi-step transactions](/reference/pacts).

### Key-row model

Blockchain execution can be likened to online transaction processing database workloads, which favor denormalized data written to a single table. Pact's data-access API reflects this by presenting a _key-row_ model, where a row of column values is accessed by a single key.

As a result, Pact does not support _joining_ tables, which is more suited for an OLAP (online analytical processing) database, populated from exports from the Pact database. This does not mean Pact cannot _record_ transactions using relational techniques -- for example, a Customer table whose keys are used in a Sales table would involve the code looking up the Customer record before writing to the Sales table.

### Queries and performance

Pact offers a powerful query mechanism for selecting multiple rows from a table. While visually similar to SQL, the [select](/build/pact/schemas-and-tables#selecth-1822154468) and [where](/reference/functions/general#whereh113097959) operations offer a _streaming interface_ to a table, where the user provides filter functions, and then operates on the rowset as a list data structure using [sort](/reference/functions/general#sorth3536286) and other functions.

```pact

;; the following selects Programmers with salaries >= 90000 and sorts by age descending

(reverse (sort ['age]
  (select 'employees ['first-name,'last-name,'age]
    (and? (where 'title (= "Programmer"))
          (where 'salary (< 90000))))))

;; the same query could be performed on a list with the filter function:

(reverse (sort ['age]
  (filter (and? (where 'title (= "Programmer"))
                (where 'salary (< 90000)))
          employees)))

```

In a transactional setting, Pact database interactions are optimized for single-row reads and writes, meaning such queries can be slow and prohibitively expensive computationally. However, using the [local](/build/pact/advanced#queries-and-local-executionh-453550016) execution capability, Pact can utilize the user filter functions on the streaming results, offering excellent performance.

The best practice is therefore to use select operations via local, non-transactional operations, and avoid using select on large tables in the transactional setting.

### No nulls

Pact has no concept of a NULL value in its database metaphor. The main function for computing on database results, [with-read](/reference/functions/database#with-readh866473533), will error if any column value is not found. Authors must ensure that values are present for any transactional read. This is a safety feature to ensure _totality_ and avoid needless, unsafe control-flow surrounding null values.

### Versioned history

The key-row model is augmented by every change to column values being versioned by transaction ID. For example, a table with three columns "name", "age", and "role" might update "name" in transaction #1, and "age" and "role" in transaction #2. Retrieving historical data will return just the change to "name" under transaction 1, and the change to "age" and "role" in transaction #2.

### Back-ends

Pact guarantees identical, correct execution at the smart-contract layer within the blockchain. As a result, the backing store need not be identical on different consensus nodes. Pact's implementation allows for integration of industrial RDBMSs, to assist large migrations onto a blockchain-based system, by facilitating bulk replication of data to downstream systems.

## Types and schemas

Pact gains explicit type specification, albeit optional. Pact 1.0 code without types still functions as before, and writing code without types is attractive for rapid prototyping.

Schemas provide the main impetus for types. A schema [is defined](/reference/syntax#defschemah-1003560474) with a list of columns that can have types. Tables are then [defined](/reference/syntax#deftableh661222121) with a particular schema.

Note that schemas also can be used on/specified for object types.

### Runtime type enforcement

Any types declared in code are enforced at runtime. For table schemas, this means any write to a table will be typechecked against the schema. Otherwise, if a type specification is encountered, the runtime enforces the type when the expression is evaluated.


## Row-level keysets

Keysets can be stored as a column value in a row, allowing for row-level authorization. The following code indicates how this might be achieved:

```pact
(defun create-account (id)
  (insert accounts id { "balance": 0.0, "keyset": (read-keyset "owner-keyset") }))
 
(defun read-balance (id)
  (with-read accounts id { "balance":= bal, "keyset":= ks }
    (enforce-keyset ks)
    (format "Your balance is {}" [bal])))
```

In the example, create-account reads a keyset definition from the message payload using read-keyset to store as "keyset" in the table. read-balance only allows that owner's keyset to read the balance, by first enforcing the keyset using enforce-keyset.




Tables are one of the three core elements of Pact smart contracts. Tables are
defined using **deftable**, which references a schema defined by **defschema**,
and are later created using **create-table**. 

There are many ways to build
functions that store, manipulate, and read data from smart contract tables.

## Changing a table schema 

As noted in [Create module tables](#create-module-tables), you can update contract functions without updating or recreating database tables.
However, you can't modify the table schema when you update a contract. 
In general, Pact doesn't support database migration or schema and table upgrades.
To update a database, you must declare new tables and define any data migration functions as part of a module load step for the new module that contains the modified table schema.

To update a table schema:

1. Create a new module and declare the new table schema.
2. Add functions to read rows from the old table and write them to the new table.
3. Deploy the updated module with the new table schema on the network.

The original table and database state remain unchanged on the blockchain, but won't receive any new information after you deploy the new module.
