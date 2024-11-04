---
title: Time functions
description: "Reference information for the Pact built-in time functions."
id: 0-time
---

Time functions are used to create and manage account principals for different types of guards and to enforce guard predicate functions.

| Function | Description |
| :-------- | :----------- |
| [create&#8209;capability&#8209;guard](/pact-5/guards/create-capability-guard) | Create a predicate function that ensures that specific conditions are true and can be enforced to grant the specified `CAPABILITY`. |
| [create&#8209;capability&#8209;pact&#8209guard](/pact-5/guards/create-capability-pact-guard) | Create a predicate function that ensures that specific conditions are true and can be enforced to grant the specified `CAPABILITY` for steps defined in a `defpact` multi-step transaction. |
| [create&#8209;module&#8209;guard](/pact-5/guards/create-module-guard) | Create a predicate function with the specified `name` that ensures that specific conditions are true for the current module.|
| [create&#8209;pact&#8209;guard](/pact-5/guards/create-pact-guard) | Define a predicate function with the specified `name` that captures the results of the `pact-id` function for a `defpact` transaction.  |
| [create&#8209;principal](/pact-5/guards/create-principal) | Create a principal account that unambiguously identifies a specified `guard` predicate function. |
| [create&#8209;user&#8209;guard](/pact-5/guards/create-user-guard) | Define a custom guard to evaluate and enforce. |
| [is&#8209;principal](/pact-5/guards/is-principal) | Determine whether a string conforms to the principal format *without* proving its validity.|
| [keyset&#8209;ref&#8209;guard](/pact-5/guards/keyset-ref-guard) | Create a guard for the keyset registered as `keyset-ref` in the database. |
| [typeof&#8209;principal](/pact-5/guards/typeof-principal) | Return the protocol type of the specified `principal` value.  |
| [validate&#8209;principal](/pact-5/guards/validate-principal) | Validate that a principal identifies a specified guard. |
