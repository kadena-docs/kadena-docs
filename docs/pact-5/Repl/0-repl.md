---
title: REPL-only functions
description: "Reference information for the Pact built-in REPL functions."
id: 0-repl
---

REPL-only functions are used to control environment settings and expected behavior when testing module code in the Pact REPL.

| Function | Description |
| :-------- | :----------- |
| [begin&#8209;tx](/pact-5/Repl/begin-tx) | Begin a new transaction with an optional name. |
| [commit&#8209;tx](/pact-5/Repl/commit-tx) | Commit the current transaction.|
| [continue&#8209;pact](/pact-5/Repl/continue-pact) | Continue a previously-initiated multi-step transaction.|
| [env&#8209;chain&#8209;data](/pact-5/Repl/env-chain-data) | Define chain information for transactions in the testing environment.|
| [env&#8209;data](/pact-5/Repl/env-data) | Set transaction data for the testing environment |
| [env&#8209;enable#8209;repl#8209;natives](/pact-5/Repl/env-enable-repl-natives) | Control whether REPL native functions are allowed in module code. |
| [env&#8209;events](/pact-5/Repl/env-events) | Retrieve any accumulated events.|
| [env&#8209;exec&#8209;config](/pact-5/Repl/env-exec-config) | Query or set execution configuration information for the testing environment. |
| [env&#8209;gas](/pact-5/Repl/env-gas) | Query the current gas state or set it to a specific value. |
| [env&#8209;gaslimit](/pact-5/Repl/env-gaslimit) | Set the environment gas limit to a specific value.|
| [env&#8209;gaslog](/pact-5/Repl/env-gaslog) | Enable gas logging for a block of code. |
| [env&#8209;gasmodel](/pact-5/Repl/env-gasmodel) | Query or update the current gas model. |
| [env&#8209;hash](/pact-5/Repl/env-hash) | Set the current transaction hash. |
| [env&#8209;keys](/pact-5/Repl/env-keys) | Set the transaction signer keys (deprecated). |
| [env&#8209;namespace&#8209;policy](/pact-5/Repl/env-namespace-policy) | Install a managed namespace policy. |
| [env&#8209;sigs](/pact-5/Repl/env-sigs) | Set signature keys for signing transactions and granting capabilities.|
| [expect&#8209;failure](/pact-5/Repl/expect-failure) | Evaluate an expression and succeed only if the expressions results in an error.|
| [expect&#8209;that](/pact-5/Repl/expect-that) |Evaluate an expression and succeed if the resulting value passes a predicate function. |
| [expect](/pact-5/Repl/expect) | Evaluate an expression and verify that the result equals an expected value. |
