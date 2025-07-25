# env-sigs

Use `env-sigs` to set signature keys for signing transactions and granting capabilities.

## Basic syntax

To set the signature keys to use for signing transactionL and granting capabilities, use the following syntax:

```pact
(env-sigs sigs)
```

## Arguments

Use the following argument when using the `env-sigs` Pact function.

| Argument | Type         | Description   |
|----------|--------------|---------------|
| `sigs`  | [object] | Specifies the list of signature objects. Each object represents a signer `key` and its associated `caps` capabilities. |

## Return value

The `env-sigs` function returns a string indicating that the transaction signature keys and capabilities have been set.

## Examples

The following example illustrates using the `env-sigs` function to sign a transaction with a specific public key and capability in the Pact REPL:

```pact
(env-sigs [{"key": "58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c", "caps": [(free.payments.PAYADMIN)]}])
"Setting transaction signatures/caps"
```

The following example demonstrates how to use the `env-sigs` function to set transaction signatures and capabilities for two keys—"my-test-key" and "admin-key"—without using any public keys in the Pact REPL:

```pact
(env-sigs [
    {"key": "my-test-key", "caps": [(accounts.USER_GUARD "my-account")]
    }, 
    {"key": "admin-key", "caps": []}]
)
```

The following example illustrates using the `env-sigs` function to grant the `MINT` capability for the `mint` function in a simplified transaction:

```pact
(begin-tx "mint")
  (use token-sample)

  (env-data {
     "token-id": "t:YV6-cQBhE_EoIXAuNV08aGXLfcucBEGy0Gb1Pj6w_Oo"
    ,"account": "k:e4c6807d79d8bf4695e10e5678ebf72862f59b71f971d39dd3349f4beeacd6e3"
    ,"account-guard": {"keys": ["e4c6807d79d8bf4695e10e5678ebf72862f59b71f971d39dd3349f4beeacd6e3"], "pred": "keys-all"}
    })
  (env-sigs [
      { "key": "e4c6807d79d8bf4695e10e5678ebf72862f59b71f971d39dd3349f4beeacd6e3"
       ,"caps": [(MINT (read-msg "token-id") (read-string 'account) 4.0)]}
     ])
  
  (mint (read-msg "token-id") (read-msg "account") 4.0)
 
(commit-tx)
```