Usage
Run from the root of the repository via:

bash ./run-setup-tests.sh | column -s, -t

## Notes
A separate deployer is a broadcast account that is different from the `msg.sender` account that runs the script or test.
The builtin deployer is the Foundry default sender account.

- network (Anvil or external) has no effect on LOCAL_NONCE
- SEPARATE_DEPLOYER=1 implies LOCAL_NONCE=1
- BUILTIN_SENDER=1 implies LOCAL_NONCE=0

## Conclusions
The builtin sender always uses global nonces, which is consistent with the
design of foundry.
A separate deployer always uses local nonces, which is consistent with the
design of foundry.
The use of an external account as sender for the test or script leads to
inconsistent and unpredictable behavior.
Therefore, the use of command lines flags like `--sender` or `--private-key`
should be avoided in the context of multiple chains.

Summary of inconsistent behavior

```
TYPE     INIT_IN_CONSTRUCTOR   SET_SENDER_IN_CONSTRUCTOR   LOCAL_NONCE
test     1                     1                           true
script   1                     1                           false
test     1                     0                           false
script   1                     0                           false
test     0                     1                           false
script   0                     1                           false
test     0                     0                           false
script   0                     0                           true
```

Details

No separate deployer:

```
TYPE     CHAINWEB   INIT_IN_CONSTRUCTOR   SET_SENDER_IN_CONSTRUCTOR   SEPARATE_DEPLOYER   BUILDIN_SENDER   LOCAL_NONCE
test     anvil      1                     1                           0                   0                true
script   anvil      1                     1                           0                   0                false
test     anvil      1                     1                           0                   1                false
script   anvil      1                     1                           0                   1                false
test     anvil      1                     0                           0                   0                false
script   anvil      1                     0                           0                   0                false
test     anvil      1                     0                           0                   1                false
script   anvil      1                     0                           0                   1                false
test     anvil      0                     1                           0                   0                false
script   anvil      0                     1                           0                   0                false
test     anvil      0                     1                           0                   1                false
script   anvil      0                     1                           0                   1                false
test     anvil      0                     0                           0                   0                false
script   anvil      0                     0                           0                   0                true
test     anvil      0                     0                           0                   1                false
script   anvil      0                     0                           0                   1                false
```

Separate deployer:

```
TYPE     CHAINWEB   INIT_IN_CONSTRUCTOR   SET_SENDER_IN_CONSTRUCTOR   SEPARATE_DEPLOYER   BUILDIN_SENDER   LOCAL_NONCE
test     anvil      1                     1                           1                   0                true
script   anvil      1                     1                           1                   0                true
test     anvil      1                     1                           1                   1                true
script   anvil      1                     1                           1                   1                true
test     anvil      1                     0                           1                   0                true
script   anvil      1                     0                           1                   0                true
test     anvil      1                     0                           1                   1                true
script   anvil      1                     0                           1                   1                true
test     anvil      0                     1                           1                   0                true
script   anvil      0                     1                           1                   0                true
test     anvil      0                     1                           1                   1                true
script   anvil      0                     1                           1                   1                true
test     anvil      0                     0                           1                   0                true
script   anvil      0                     0                           1                   0                true
test     anvil      0                     0                           1                   1                true
script   anvil      0                     0                           1                   1                true
```

I created a draft PR (do not merge) for the nonce issue, that includes the test scripts and documents the observed behavior: https://github.com/kadena-io/foundry-chainweb/pull/17
In a nutshell:
The built-in/default Foundry sender always uses global nonces, which is consistent with the design of foundry.
A separate deployer for broadcasts (one that is different from msg.sender of the script or test) always uses local nonces, which is consistent with the design of foundry.
The use of an external account as sender for the test or script leads to inconsistent and unpredictable behavior in broadcasts.
Therefore the use of command lines flags like --sender or --private-key should be avoided in the context of multiple chains. (edited) 
1 reply


Lars Kuhtz
  37 minutes ago
My guess is, that for "external" accounts foundry internally maintains different versions of the account for each fork. One persistent (global) version that is used for running the script/test one non-persistent (local) version for broadcasting to the forks.
But it seems that the setup of those different account versions is sensitive to when, where, and how forks and accounts are initialized.