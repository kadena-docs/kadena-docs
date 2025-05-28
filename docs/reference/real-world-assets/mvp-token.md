---
title: mvp-token
description: "Technical documentation for the Kadena RWA token standard initial minimally-viable product (MVP) contract."
id: mvp-token
sidebar_position: 2
---

# mvp-token

The [`mvp-token`](https://github.com/kadena-io/RWA-token/blob/main/mvp/mvp-token.pact) contract is an example of a real-world asset (RWA) token.
This sample contract implements Kadena RWA token standard interfaces that are defined in the following modules:

- [real-world-asset-v1](https://github.com/kadena-io/RWA-token/blob/main/contracts/real-world-asset/real-world-asset-v1.pact)
- [agent-role-v1](https://github.com/kadena-io/RWA-token/blob/main/contracts/roles/agent-role-v1.pact)
- [identity-registry-v1](https://github.com/kadena-io/RWA-token/blob/main/contracts/roles/agent-role-v1.pact)
- [compliance-compatible-v1](https://github.com/kadena-io/RWA-token/blob/main/mvp/compliances/compliance-compatible-v1.pact)

The `mvp-token` contract extends the functionality defined in the Kadena `fungible-v2` interface and provides `mint`, `burn`, and `forced-transfer` operations for tokens, and `freeze` operations for an entire contract or investors. 
The example also implements agent role and identity registry features, but does not implement identity verification.
The MVP sample implementation also provides the following sample compliance contracts to demonstrate practical use cases:

- [max-balance-compliance-v1](https://github.com/kadena-io/RWA-token/blob/main/mvp/compliances/max-balance-compliance-v1.pact)
- [max-investors-compliance-v1](https://github.com/kadena-io/RWA-token/blob/main/mvp/compliances/max-investors-compliance-v1.pact)
- [supply-limit-compliance-v1](https://github.com/kadena-io/RWA-token/blob/main/mvp/compliances/supply-limit-compliance-v1.pact)

## Governance

The `mvp-token` contract defines two types of owners:

| Type | Defined as | Description |
| :--- | :--------- | :---------- |
| Governance | `GOV-KEYSET` | Identifies the primary module owner responsible for contract upgrades and initialization. The `GOV` capability enforces ownership using `GOV-KEYSET keyset-reference-guard` statement. |
| Operational owner | owner-guard | Specifies the account registered during initialization and granted access to specific operational functions. You can update the `owner-guard` after registration by calling the `transfer-ownership` function. The operational owner is enforced by `(only-agent "owner")` function. For more information about this functions, see Agent role.|

## Initialization

Use `init` to initialize the `mvp-token` contract with the following information:

- Token owner-guard
- Token name
- Token symbol
- Token decimal precision
- Kadena account name for the owner identity
- Compliance module references
- Paused state

### Requirements

The **signer** for an `init` transaction must be the `GOV-KEYSET` governance capability owner with the `GOV` capability.

### Inputs

Use the following input parameters:

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| name | string | Name of the token being initialized.|
| symbol | string | Symbol to use for the token being initialized.|
| decimals | integer | Decimal precision for the token being initialized.|
| kadenaID | string | Kadena account name for the owner of the token being initialized.|
| compliance | `[module{RWA.compliance-v1}]` | Compliance rules to apply for the token being initialized. |
| paused | bool | Initial state for the token being initialized. |
| owner-guard | guard | Guard for the Kadena account that owns the token being initialized. |

### State changes

The `init` function makes the following state changes:

- Registers token metadata using the name, symbol, decimals, and kadenaID input parameters.
- Sets pause state to true or false based on paused input parameters.
- Assigns owner guard to authorize operational control for the specified owner-guard input parameter.
- Initializes compliance modules and default parameters.

### Events

The `init` function emits the following events:

- UPDATED-TOKEN-INFORMATION name symbol MINIMUM-PRECISION VERSION kadenaID
- COMPLIANCE-PARAMETERS default-compliance-parameters
- COMPLIANCE-UPDATED compliance

### Error codes

The `init` function reports the following errors:

- CMPL-DUP-001 if there are duplicate compliance modules in the input parameters.
