---
title: Sign and submit transactions
id: howto-sign-submit-tx
---

<head>
  <title>Sign and submit transactions</title>
  <meta name="description" content="A guide to crafting blockchain calls using Traditional API, Kadena CLI, and Kadena.js" />
</head>
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

# Sign and submit transactions

There are several ways you can sign and submit transactions.
This guide provides instructions and examples for signing and submitting transactions using different tools and in different scenarios.
For example, this guide describes how to use the Pact command-line interpreter built-in HTTP server and SQLite backend to sign and submit transactions locally using Pact commands and how to format transactions requests so that they can be executed using `curl` commands or Postman API calls.

## Use the Pact built-in server

To use the built-in Pact server:

1. Open a terminal shell on your local computer.

2. Create a configuration file using YAML format with the following properties:
   
   ```bash
   port       - HTTP server port number.
   persistDir - Directory for persisting database files. If you omit this setting, the server runs in-memory only.
   logDir     - Directory for HTTP logs.
   pragmas    - SQLite pragma statement to use with persistent database files.
   entity     - Entity name for simulating privacy. The default is "entity".
   gasLimit   - Gas limit for each transaction. The default is zero (0).
   gasRate    - Gas price per action. The default is zero (0).
   flags      - Pact runtime execution flags.
   ```

   For example, create a `pact-config.yaml` file with properties similar to the following:

   ```yaml
   # Config file for pact http server. Launch with `pact -s config.yaml`

   # HTTP server port
   port: 8081
   
   # directory for HTTP logs
   logDir: log
   
   # persistence directory
   persistDir: log
   
   # SQLite pragmas for pact back-end
   pragmas: []
   
   # verbose: provide log output
   verbose: True
   ```

2. Start the built-in server by running a command similar to the following:
   
   ```bash
   pact --serve pact-config.yaml
   ```

1. Create an API request for the server in a YAML file.

   For example, use a text editor to create a YAML file called `my-api-request.yaml` with the following content:
   
   ```yaml
   code: "(+ 1 2)"
   data:
     name: Stuart
     language: Pact
   keyPairs:
     - public: ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d
       secret: 8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332
   ```

2. Format the YAML version of the API request using the Pact `--apireq` command-line option to generate a valid JSON API request.
   
   For example, run the following command to display the output before submitting the request to the built-in server:

   ```bash
   pact --apireq  my-api-request.yaml
   ```

   This command displays the formatted API request as standard output:
   
   ```bash
   {"cmds":[{"hash":"T3vt3Cuh2sdDcTS8Exck96Yht55OD0B9qp_2O8hn1Z0","sigs":[{"sig":"6f8a7fd50d2807127feefe7c9df382c6538b20aa8d62c9c10051f80201af7352f172a18be5f6a43ec2ece7fc74f951e1dd36ef18975fcb76d72bcb453396dc02"}],"cmd":"{\"networkId\":null,\"payload\":{\"exec\":{\"data\":{\"name\":\"Stuart\",\"language\":\"Pact\"},\"code\":\"(+ 1 2)\"}},\"signers\":[{\"pubKey\":\"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d\"}],\"meta\":{\"creationTime\":0,\"ttl\":0,\"gasLimit\":0,\"chainId\":\"\",\"gasPrice\":0,\"sender\":\"\"},\"nonce\":\"2024-09-06 20:04:12.679143 UTC\"}"}]}
   ```

1. Submit the transaction using the built-in server and `/local` endpoint by running the following command:
   
   ```bash
   pact --apireq  my-api-request.yaml --local
   ```
   
   The command displays the transaction submitted:

   ```bash
   {"hash":"RRkPaHkAlAYMOgCxVtIiR20B8aEl4U4FGLNuFMbmSXg","sigs":[{"sig":"47e66eeec37991ad49b162401ab777a8dc9e872090f0a1552ee080931450891d321ab6fd3907d0aa1395d3816a74a8c08dd1be5d2871dc2398dd5d2851cbc60d"}],"cmd":"{\"networkId\":null,\"payload\":{\"exec\":{\"data\":{\"name\":\"Stuart\",\"language\":\"Pact\"},\"code\":\"(+ 1 2)\"}},\"signers\":[{\"pubKey\":\"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d\"}],\"meta\":{\"creationTime\":0,\"ttl\":0,\"gasLimit\":0,\"chainId\":\"\",\"gasPrice\":0,\"sender\":\"\"},\"nonce\":\"2024-09-06 20:24:45.82271 UTC\"}"}
   ```

1. Send the API request to the Pact built-in HTTP server running on port 8081—as configured in the `pact-config.yaml` file for this example—by running the following command:
   
   ```bash
   pact --apireq my-api-request.yaml --local | curl --json @- http://localhost:8081/api/v1/local
   ```
   
   This command returns the transaction result with output similar to the following:

   ```bash
   {"gas":0,"result":{"status":"success","data":3},"reqKey":"q4HW4wP1FCj3RQRvhILQHaqU8tmMqHPp-nDJdw6CwK8","logs":"wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8","metaData":null,"continuation":null,"txId":null}
   ```

## Use a curl command directly

<CodeBlock>
test
</CodeBlock>

## Use kadena tx commands


## Transaction types and request templates

As discussed in Transaction models, there are two type of transactions:

- Transactions that are completed in a single execution step are executed (exec) transactions.
- Transaction that are completed using more than one step are continued (cont) transactions.

To handle these two transaction types, there are two API request formats that you can define in YAML files: 

- For transactions that are executed in a single step, the YAML API request describes the [exec](https://api.chainweb.com/openapi/pact.html#tag/model-payload) payload for the transaction.
- For transactions that are executed in more than one step, the YAML API request describes the [cont](https://api.chainweb.com/openapi/pact.html#tag/model-payload) payload for the transaction.


### Template for exec transaction requests

The execution request yaml for a public blockchain takes the following keys:

```yaml
  code: Transaction code
  codeFile: Transaction code file
  data: JSON transaction data
  dataFile: JSON transaction data file
  keyPairs: list of key pairs for signing (use pact -g to generate): [
    public: base 16 public key
    secret: base 16 secret key
    caps: [
      optional managed capabilities
      ]
    ]
  nonce: optional request nonce, will use current time if not provided
  networkId: string identifier for a blockchain network
  publicMeta:
    chainId: string chain id of the chain of execution
    sender: string denoting the sender of the transaction
    gasLimit: integer gas limit
    gasPrice: decimal gas price
    ttl: integer time-to-live value
    creationTime: optional integer tx execution time after offset
  type: exec
```

### Template for cont transaction requests

The continuation request yaml for a public blockchain takes the following keys:

```yaml
  pactTxHash: integer transaction id of pact
  step: integer next step of a pact
  rollback: boolean for rollingback a pact
  proof: string spv proof of continuation (optional, cross-chain only)
  data: JSON transaction data
  dataFile: JSON transaction data file
  keyPairs: list of key pairs for signing (use pact -g to generate): [
    public: string base 16 public key
    secret: string base 16 secret key
    caps: [
      optional managed capabilities
      ]
    ]
  networkId: string identifier for a blockchain network
  publicMeta:
    chainId: string chain id of the chain of execution
    sender: string denoting the sender of the transaction
    gasLimit: integer gas limit
    gasPrice: decimal gas price
    ttl: integer time-to-live value
    creationTime: optional integer tx execution time after offset
  nonce: optional request nonce, will use current time if not provided
  type: cont
```

Note that the proof field is optional and only used for transactions that are completed as cross-chain continuations.

## Sign transactions

The `pact` command-line program includes several commands that enable you to sign transactions from the command line. 
The following example illustrates how to use pact command to prepare an unsigned version of a transaction and add signatures to it. 

1. Prepare transaction details as an API request manually using a YAML file or using `kadena tx` commands.
specified in a file called `tx.yaml`.

1. Generate and save the public and secret keys for the `alice` test accounts by running the following command:
   
   ```bash
   pact --genkey > alice-key.yaml
   ```
   
   This command writes the public and secret key to the alice-key.yaml file.
   For example:

   ```yaml
   public: 24f00ba35e894899710b699ce718f7f7439402e13e775167290026914ab32472
   secret: a2880862a6452ad3e84e8df7d51f7dec4c6fd4da2c8b5e42999548414b5641cf
   ```

1. Generate and save the public and secret keys for the `bob` test accounts by running the following command:
   
   ```bash
   pact --genkey > bob-key.yaml
   ```
   
   This command writes the public and secret key to the `bob-key.yaml` file.
   For example:

   ```bash
   public: e6519fb36c0ae6e65efee11344c50ea44b822cc84d9cd4ff85cae62635e8221a
   secret: 1e2801fe6a6e203b81459fcfee97f19c6e8a586c320bcfc9aeaa695d8bff9660
   ```

2. Convert the transaction request you created into an unsigned transaction that you can add signatures to by running the following command:
   
   ```bash
   pact --unsigned tx.yaml > tx-unsigned.yaml
   ```
   
# Sign the prepared transaction with one or more keys
cat tx-unsigned.yaml | pact add-sig alice-key.yaml > tx-signed-alice.yaml
cat tx-unsigned.yaml | pact add-sig bob-key.yaml > tx-signed-bob.yaml

# Combine the signatures into a fully signed transaction ready to send to the blockchain
pact combine-sigs tx-signed-alice.yaml tx-signed-bob.yaml > tx-final.json

The `add-sig` command takes the output of `pact -u` on standard input and one or
more key files as command line arguments. It adds the appropriate signatures to
to the transaction and prints the result to stdout.

The `combine-sigs` command takes multiple unsigned (from `pact -u`) and signed
(from `pact add-sig`) transaction files as command line arguments and outputs
the command and all the signatures on stdout.

Both `add-sig` and `combine-sigs` will output YAML if the output transaction
hasn't accumulated enough signatures to be valid. If all the necessary
signatures are present, then they will output JSON in final form that is ready
to be sent to the blockchain on the [`/send` endpoint](#send). If you would like
to do a test run of the transaction, you can use the `-l` flag to generate
output suitable for use with the [`/local` endpoint](#local).

The above example adds signatures in parallel, but the `add-sig` command can
also be used to add signatures sequentially in separate steps or all at once in
a single step as shown in the following two examples:

```
cat tx-unsigned.yaml | pact add-sig alice-key.yaml | pact add-sig bob-key.yaml
cat tx-unsigned.yaml | pact add-sig alice-key.yaml add-sig bob-key.yaml
```

### Offline Signing with a Cold Wallet

Some cold wallet signing procedures use QR codes to get transaction data on and
off the cold wallet machine. Since QR codes can transmit a fairly limited amount
of information these signing commands are also designed to work with a more
compact data format that doesn't require the full command to generate
signatures. Here's an example of what `tx-unsigned.yaml` might look like in the
above example:

```
hash: KY6RFunty4WazQiCsKsYD-ovu-_XQByfY6scTxi9gQQ
sigs:
  368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca: null
  6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7: null
cmd: '{"networkId":"mainnet01","payload":{"exec":{"data":{"ks":{"pred":"keys-all","keys":["368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca"]}},"code":"(coin.transfer-create \"alice\" \"bob\" (read-keyset \"ks\") 100.1)\n(coin.transfer \"bob\" \"alice\" 0.1)"}},"signers":[{"pubKey":"6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7","clist":[{"args":["alice","bob",100.1],"name":"coin.TRANSFER"},{"args":[],"name":"coin.GAS"}]},{"pubKey":"368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca","clist":[{"args":["bob","alice",0.1],"name":"coin.TRANSFER"}]}],"meta":{"creationTime":1580316382,"ttl":7200,"gasLimit":1200,"chainId":"0","gasPrice":1.0e-5,"sender":"alice"},"nonce":"2020-01-29 16:46:22.916695 UTC"}'
```

To get a condensed version for signing on a cold wallet all you have to do is
drop the `cmd` field. This can be done manually or scripted with `cat
tx-unsigned.yaml | grep -v "^cmd:"`. The result would look like this:

```
hash: KY6RFunty4WazQiCsKsYD-ovu-_XQByfY6scTxi9gQQ
sigs:
  368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca: null
  6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7: null
```

Keep in mind that when you sign these condensed versions, you won't be able to
submit the output directly to the blockchain. You'll have to use `combine-sigs`
to combine those signatures with the original `tx-unsigned.yaml` file which has
the full command.

### Detached Signature Transaction Format

The YAML input expected by `pact -u` is similar to the [Public Blockchain YAML
format](#request-yaml-public-chain) described above with one major difference.
Instead of the `keyPairs` field which requires both the public and secret keys,
`pact -u` expects a `signers` field that only needs a public key. This allows
signatures to be added on incrementally as described above without needing
private keys to all be present when the transaction is constructed.

Here is an example of how the above `tx.yaml` file might look:

```
code: |-
  (coin.transfer-create "alice" "bob" (read-keyset "ks") 100.1)
  (coin.transfer "bob" "alice" 0.1)
data:
  ks:
    keys: [368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca]
    pred: "keys-all"
publicMeta:
  chainId: "0"
  sender: alice
  gasLimit: 1200
  gasPrice: 0.0000000001
  ttl: 7200
networkId: "mainnet01"
signers:
  - public: 6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7
    caps:
      - name: "coin.TRANSFER"
        args: ["alice", "bob", 100.1]
      - name: "coin.GAS"
        args: []
  - public: 368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca
    caps:
      - name: "coin.TRANSFER"
        args: ["bob", "alice", 0.1]
type: exec
```
