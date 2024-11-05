---
title: General functions
description: "Reference information for the Pact built-in general functions."
id: 0-general
---

General functions are used to perform many different types of common tasks, such as specifying the character set for a smart contract, concatenating a list of strings, or defining a unique namespace for module code.
For an introduction to creating and working with modules, see [Modules and references](/smart-contracts/modules).


| Function | Description |
| :-------- | :----------- |
| [acquire&#8209;module-admin](/pact-5/General/acquire-module-admin) | Grant module administrative privileges for a specified module.  |
| [at](/pact-5/General/at) | Retrieve the value at the location specified by an `index` number or by a `key` string. |
| [base64&#8209;decode](/pact-5/General/base64-decode) | Convert a previously-encoded `string` from unpadded base64 encoding to a string. |
| [base64&#8209;encode](/pact-5/General/base64-encode) | Convert the specified `string` to an unpadded base64-encoded string. |
| [bind](/pact-5/General/bind) | Bind variables to values over subsequent body statements. |
| [chain-data](/pact-5/General/chain-data) | Retrieve the blockchain-specific public metadata for a transaction. |
| [charset-ascii](/pact-5/General/charset-ascii) | Use the standard ASCII character set. |
| [charset-latin1](/pact-5/General/charset-latin1) | Use the standard Latin-1 character set. |
| [compose](/pact-5/General/compose) | Compose functions using specified operands and a specified input value. |
| [concat](/pact-5/General/concat) | Concatenate a list of strings. |
| [constantly](/pact-5/General/constantly) | Ignore specified arguments. |
| [contains](/pact-5/General/contains) | Evaluate the contents of a list, object, or string. |
| [continue](/pact-5/General/continue) | Continue a previously started `defpact` step. |
| [define-namespace](/pact-5/General/define-namespace) | Create a new namespace or update the guards of an existing namespace. |
| [describe-namespace](/pact-5/General/describe-namespace) | Describe the specified namespace. |
| [distinct](/pact-5/General/distinct) | Return a list with duplicates removed. |
| [drop](/pact-5/General/drop) | Remove values from a list or string. |
| [enforce-guard](/pact-5/General/enforce-guard) | Execute a specified guard or keyset to enforce predicate logic. |
| [enforce-one](/pact-5/General/enforce-one) | Evaluate a series of tests in order. |
| [enforce-pact-version](/pact-5/General/enforce-pact-version) | Enforce the runtime Pact version to be within a specified range. |
| [enforce-verifier](/pact-5/General/enforce-verifier) | Enforce that a verifier with the specified name is in scope. |
| [enforce](/pact-5/General/enforce) | Fail a transaction if an expression evaluates to false. |
| [enumerate](/pact-5/General/enumerate) | Return a sequence of numbers as a list. |
| [filter](/pact-5/General/filter) | Filter a list by applying a function to each element. |
| [fold](/pact-5/General/fold)|  Reduce a list iteratively by applying a function to each element. |
| [format](/pact-5/General/format) | Format a message using placeholders and variables. |
| [hash-keccak256](/pact-5/General/hash-keccak256) | Compute the hash of a list of inputs. |
| [hash](/pact-5/General/hash) | Compute the BLAKE2b 256-bit hash of a value. |
| [identity](/pact-5/General/identity)|  Return the provided value. |
| [if](/pact-5/General/if) | Test whether a condition is true to determine the operation to perform. |
| [int-to-str](/pact-5/General/int-to-str) | Represent an integer value as a string in a specified base.|
| [is-charset](/pact-5/General/is-charset) | Check whether a string conforms to a supported character set.|
| [length](/pact-5/General/length) | Compute the length of a list, string, or object. |
| [list-module](/pact-5/General/list-module) | List modules available for loading.|
| [list](/pact-5/General/list) | Create a list from the specified elements (deprecated). |
| [make-list](/pact-5/General/make-list) | Create a list by repeating a specified value a certain number of times. |
| [map](/pact-5/General/map) | Apply a function (APP) to each element in a list. |
| [namespace](/pact-5/General/namespace) | Set the current namespace to a specified value. |
| [pact-id](/pact-5/General/pact-id) | Return the identifier associated with `defpact` execution.|
| [pact-version](/pact-5/General/pact-version) | Get the current Pact build version.|
| [poseidon-hash-hack-a-chain](/pact-5/General/poseidon-hash-hack-a-chain) | Compute a hash using the Poseidon hash function used by Hack-a-Chain.|
| [read-decimal](/pact-5/General/read-decimal) | Read a `key` string or number value from the message data as a decimal.|
| [read-integer](/pact-5/General/read-integer) | Read a `key` string or number value from the message data as an integer.|
| [read-keyset](/pact-5/General/read-keyset) | Read a `key` from the message data as a keyset with a list of keys and a predicate function.|
| [read-msg](/pact-5/General/read-msg) | Read a `key` from the message data body.|
| [read-string](/pact-5/General/read-string) | Read a `key` string or number value from the message data as a string.|
| [remove](/pact-5/General/remove) | Remove an entry associated with a specified `key` from an object.|
| [resume](/pact-5/General/resume) | Bind a yielded object value from a `defpact` step to the execution of the next `defpact` step.|
| [reverse](/pact-5/General/reverse) | Reverse the order of elements in a given list.|
| [round](/pact-5/General/round)| Perform Banker's rounding to return an integer or decimal value.|
| [sort](/pact-5/General/sort) | Sort a list of primitive values or objects.|
| [static-redeploy](/pact-5/General/static-redeploy) | Redeploy a module without any code changes. |
| [str-to-int](/pact-5/General/str-to-int) | Compute the integer value of the specified string.|
| [str-to-list](/pact-5/General/str-to-list) | Convert a string into a list where each element is a single-character string.|
| [take](/pact-5/General/take) | Retrieve a specified number of values from a list, string, or object.|
| [try](/pact-5/General/try) | Attempt a pure action without input, output, or state-changing operations.|
| [tx-hash](/pact-5/General/tx-hash) | Get the hash of the current transaction as a string.|
| [typeof](/pact-5/General/typeof) | Return a description of the data type for a specified value.|
| [where](/pact-5/General/where) | Define a clause to refine the results from `filter` or `select` operations.|
| [yield](/pact-5/General/yield) | Yield an object to use with the `resume` function in a `defpact` step. |
| [zip](/pact-5/General/zip) | Combine two lists using a specified function to create a new list.|
 
