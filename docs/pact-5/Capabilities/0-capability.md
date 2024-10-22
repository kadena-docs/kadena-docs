---
title: Capability functions
description: "Reference information for the Pact built-in capability functions."
id: 0-capability
---

Capability functions are used to define and manage the permissions that authorize or deny access to smart contract operations.
For an introduction to using capabilities, see [Capabilities and events](/smart-contracts/capabilities).

| Function | Description |
| :-------- | :----------- |
| [compose&#8209;capability](/pact-5/capabilities/compose-capability) | Compose and grant capabilities in a nested structure to control the scope of how the capabilities are applied. By convention, capabilities are defined using all uppercase letters. |
| [emit&#8209;event](/pact-5/capabilities/emit-event) | Emit a specified `CAPABILITY` as an event without evaluating the body of the capability. |
| [install&#8209;capability](/pact-5/capabilities/install-capability) | Define and provision a managed capability. |
| [require&#8209;capability](/pact-5/capabilities/require-capability) | Require a specific `CAPABILITY` to be granted before allowing the current body of code to be executed. |
| [with&#8209;capability](/pact-5/capabilities/with-capability) | Apply the access to a specific `CAPABILITY` to execute a body of code. |

