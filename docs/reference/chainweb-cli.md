---
title: chainweb-node command-line reference
description: "Command-line options and usage information for running the chainweb-node binary."
id: chainweb-cli
sidebar_position: 6
---

# chainweb-node command-line reference

You can configure many aspects of Chainweb node operations using configuration settings in one or more configuration files or by specifying command-line options and arguments.

Configuration settings are loaded in order first from one or more configuration file locations that you specify using `--config-file` options then from the command-line options in the order you specify them.
Configuration settings that are loaded later overwrite settings that were previously loaded.

You can specify configuration file locations by providing local file system paths or remote HTTP or HTTPS URLs. 
Remote URLs must start with either "http://" or "https://".

## Basic usage

The basic syntax for setting chainweb-node command-line options is:

```bash
chainweb-node [option] [arguments]
```

## Basic information options

| Use this option | To do this |
| --------------- | ---------- |
| --config-file _filename_ | Specify the local path or the URL of a file that contains configuration settings in YAML or JSON format. If you specify more than one `--config-file` option, the files are loaded in the order that they are specified on the command line. You can specify configuration file locations by providing local file system paths or remote HTTP or HTTPS URLs. 
Remote URLs must start with either "http://" or "https://". |
| -?, -h, --help | Display usage information as standard output, then exit. |
| --info | Display a brief summary that describes the Chainweb version number and revision (commit) hash as standard output, then exit. |
| --license | Display the license agreement for the software as standard output, then exit. |
| --long-info | Display a complete list of packages and dependencies as standard output, then exit. |
| --print-config | Display the current configuration of the node as standard output. This option is an alias for the `--print-config-as=full` option. |
| --print-config-as full|minimal|diff | Choose whether to display the full configuration settings, only the settings you have explicitly set, or only the settings that are different from the default settings. |
| -v, --version | Display the Chainweb version number and revision (commit) hash as standard output, then exit. |

## General blockchain options

| Use this option | To do this 
| --------------- | ---------- 
| -v, --chainweb-version _networkId_ | Specify the Chainweb network identifier for the node. Valid values are `development`, `testnet04`, `testnet05`, and `mainnet01`. The default is `mainnet01`. |
|--database-directory _path_ | Specify the path to the `chainweb-node` database root folder. |
| --header-stream | Enable the endpoint for streaming block updates. For information about streaming block updates, see [Stream block header event updates](/api/service-api/api-update-event-stream). |
| --no-header-stream | Unset the `--header-stream` option and disable streaming block updates. |
| --enable-tx-reintro | Enable transactions from losing forks of the chain to be resubmitted. |
| --disable-tx-reintro | Unset the `--enable-tx-reintro` option and prevent transactions from losing forks to be resubmitted. |
| --enable-reset-chain-databases | 
| --disable-reset-chain-databases |

## Development mode options

|--fork-upper-bound _upperBound_ | Specify the latest fork for the node to enable (development mode only). |
| --block-delay _delay_ | Specify the block delay in seconds per block (development mode only). |
| --disable-pow | Disable the proof-of-work check (development mode only). |


## Peer-to-peer options

| Use this option | To do this 
| --------------- | ---------- 
| --p2p-hostname _hostname_ | Set the hostname or IP address for the local peer to enable peer-to-peer communication. |
| --p2p-port _portNumber_ | Set the port number for the local peer to enable peer-to-peer communication. |
| --p2p-interface _interface_ | Set the interface for the peer-to-peer REST API endpoints to bind to. For more information, see the HostPreference documentation. |
| --p2p-certificate-chain _certificate_ | Specifies the PEM-encoded X509 certificate or certificate chain used by the local peer for peer-to-peer communication. |
| --p2p-certificate-chain-file _file_ | Specifies a file with the PEM-encoded certificate chain. Providing the `certificate-chain` as a text string takes precedence over using a file for peer-to-peer communication. |
| --p2p-key _key_ | Specifies the PEM-encoded X509 certificate key used by the local peer for peer-to-peer communication. The default is `null`. |
| --p2p-certificate-key-file _file_ | fSpecifies a file with the PEM-encoded certificate key. A textually provided certificate `key` has precedence over using a filefor peer-to-peer communication. |
| --p2p-max-session-count _count_ | Specifies the maximum number of sessions that can be active at any time. |
| --p2p-max-peer-count _count_ | Specifies the maximum number of entries allowed in the peer database. |
| --p2p-session-timeout _seconds_ | Specifies the maximum number of seconds to allow for a session to try to connect before timing out the connection. |
| --known-peer-info [ _peerId@_ ]_hostaddress_ | Specifies the peer information that is added to the list of known peers. You can specify this option multiple times on the command-line. |
| --enable-ignore-bootstrap-nodes | Specifies that you want to ignore the hard-coded bootstrap nodes for the network. |
| --disable-ignore-bootstrap-nodes | Unsets the option to ignore bootstrap nodes to restore communication with the hard-coded bootstrap nodes for the network. |
| --enable-private | Specifies that you want this node to be private and only communicate only with its initially configured known peer nodes. |
| --disable-private | Unsets the make the node private to enable the node to communicate with other nodes in the network. |
| --bootstrap-reachability [0,1] | Specifies the number of bootstrap nodes that must be reachable when the node starts up as a fraction of the bootstrap nodes available. The default value of 0.5 indicates that half of the bootstrap nodes must be reachable for the node to connect to the network. |

## Memory pool options

| Use this option | To do this 
| --------------- | ---------- 
| --enable-mempool-p2p | Enables the memory pool peer-to-peer network for the local node. |
| --disable-mempool-p2p | Unsets the --enable-mempool-p2p option to disable the memory pool peer-to-peer network for the local node. |
| --mempool-p2p-max-session-count _count_ | Specifies the maximum number of memory pool peer-to-peer sessions that are active at any time. |
| --mempool-p2p-session-timeout _seconds_ | Specifies the maximum number of seconds to allow for a memory pool peer-to-peer session to try to connect before timing out the connection. |
| --mempool-p2p-poll-interval _seconds_ | Specifies the poll interval for synchronizing memory pool sessions.

## Gas options

| Use this option | To do this 
| --------------- | ---------- 
| --block-gas-limit ARG |
| --log-gas | 
| --no-log-gas | 
| --min-gas-price ARG |
| --pact-queue-size ARG | 

--reorg-limit ARG |
| --pre-insert-check-timeout ARG
| --allowReadsInLocal | 
| --no-allowReadsInLocal |
| --rosetta |
| --no-rosetta

## Pact state (Sqlite) options

| Use this option | To do this 
| --------------- | ---------- 
| --full-historic-pact-state | 
| --no-full-historic-pact-state | 

## Chain database (Rocksdb) options

| Use this option | To do this 
| --------------- | ---------- 
| --prune-chain-database none|headers|headers-checked|full |
| --cut-fetch-timeout ARG | 
| --initial-block-height-limit INT | 
| --fast-forward-block-height-limit INT |

## Service API options

| Use this option | To do this 
| --------------- | ---------- 
| --service-port ARG |
| --service-interface ARG |
| --service-payload-batch-limit ARG| 

## Mining options

| Use this option | To do this 
| --------------- | ---------- 
| --enable-mining-coordination | 
| --disable-mining-coordination |
| --mining-public-key ARG |
| --mining-request-limit ARG | 
| --mining-update-stream-limit ARG | 
| --mining-update-stream-timeout ARG | 
| --mining-payload-refresh-delay ARG | 
| --enable-node-mining | 
| --disable-node-mining |
| --node-mining-public-key ARG
 
## Synchronization and replay options

| Use this option | To do this 
| --------------- | ---------- 
| --only-sync-pact | 
| --no-only-sync-pact |
| --read-only-replay | 
| --no-read-only-replay | 
| --sync-pact-chains JSON list of chain ids | 

## Backup options

| Use this option | To do this 
| --------------- | ---------- 
| --enable-backup-api | 
| --disable-backup-api |
| --backup-directory ARG | 

| --module-cache-limit INT | 
| --enable-local-timeout ARG | 
                     
| --queue-size INT |

## Logging options

| Use this option | To do this 
| --------------- | ---------- 
| --log-level quiet|error|warn|info|debug | 
| --log-policy block|raise|discard |
| --exception-limit INT |
| --exception-wait INT | 
| --exit-timeout INT | 
| -c|--color ARG |
| --log-format text|json |
| --log-handle stdout|stderr|file:_FILENAME_|es:[APIKEY]:_URL_ |
| --enable-telemetry-logger | 
| --disable-telemetry-logger |
| -c|--telemetry-color ARG |
| --telemetry-log-format text|json |
| --telemetry-log-handle stdout|stderr|file:_FILENAME_|es:[APIKEY]:_URL_ |
| --cluster-id ARG |
| --log-filter-rule KEY:VALUE:LOGLEVEL[:RATE]|
| --log-filter-default LOGLEVEL:RATE

Chainweb Node

Available options:

  
  --mempool-p2p-poll-interval ARG
                           poll interval for synchronizing mempools in seconds
  --block-gas-limit ARG    the sum of all transaction gas fees in a block must
                           not exceed this number
  --log-gas                log gas consumed by Pact commands
  --no-log-gas             unset flag log-gas
  --min-gas-price ARG      the gas price of an individual transaction in a block
                           must not be beneath this number
  --pact-queue-size ARG    max size of pact internal queue
  --reorg-limit ARG        Max allowed reorg depth. Consult
                           https://github.com/kadena-io/chainweb-node/blob/master/docs/RecoveringFromDeepForks.md
                           for more information.
  --pre-insert-check-timeout ARG
                           Max allowed time in microseconds for the transactions
                           validation in the PreInsertCheck command.
  --allowReadsInLocal      Enable direct database reads of smart contract tables
                           in local queries.
  --no-allowReadsInLocal   unset flag allowReadsInLocal
  --rosetta                Enable the Rosetta endpoints.
  --no-rosetta             unset flag rosetta
  --full-historic-pact-state
                           Write full historic Pact state; only enable for
                           custodial or archival nodes.
  --no-full-historic-pact-state
                           unset flag full-historic-pact-state
  --prune-chain-database none|headers|headers-checked|full
                           How to prune the chain database on startup. This can
                           take several hours.
  --cut-fetch-timeout ARG  The timeout for processing new cuts in microseconds
  --initial-block-height-limit INT
                           Reset initial cut to this block height.
  --fast-forward-block-height-limit INT
                           When --only-sync-pact is given fast forward to this
                           height. Ignored otherwise.
  --service-port ARG       port number for service
  --service-interface ARG  interface that the service Rest API binds to (see
                           HostPreference documentation for details) for service
  --service-payload-batch-limit ARG
                           upper limit for the size of payload batches on the
                           service API for service
  --enable-mining-coordination
                           whether to enable the mining coordination API
  --disable-mining-coordination
                           unset flag mining-coordination
  --mining-public-key ARG  public key of a miner in hex decimal encoding. The
                           account name is the public key prefix by 'k:'. (This
                           option can be provided multiple times.)
  --mining-request-limit ARG
                           Number of /mining/work requests that can be made
                           within a 5min period
  --mining-update-stream-limit ARG
                           maximum number of concurrent update streams that is
                           supported
  --mining-update-stream-timeout ARG
                           duration that an update stream is kept open in
                           seconds
  --mining-payload-refresh-delay ARG
                           frequency that the mining payload is refreshed
  --enable-node-mining     ONLY FOR TESTING NETWORKS: whether to enable in node
                           mining
  --disable-node-mining    unset flag node-mining
  --node-mining-public-key ARG
                           public key of a miner in hex decimal encoding. The
                           account name is the public key prefix by 'k:'. (This
                           option can be provided multiple times.)
  --only-sync-pact         Terminate after synchronizing the pact databases to
                           the latest cut
  --no-only-sync-pact      unset flag only-sync-pact
  --read-only-replay       Replay the block history non-destructively
  --no-read-only-replay    unset flag read-only-replay
  --sync-pact-chains JSON list of chain ids
                           The only Pact databases to synchronize. If empty or
                           unset, all chains will be synchronized.
  --enable-backup-api      whether backup-api is enabled or disabled
  --disable-backup-api     unset flag backup-api
  --backup-directory ARG   Directory in which backups will be placed when using
                           the backup API endpoint for backup
  --module-cache-limit INT Maximum size of the per-chain checkpointer module
                           cache in bytes
  --enable-local-timeout ARG
                           Enable timeout support on /local endpoints
  --queue-size INT         size of the internal logger queue
  --log-level quiet|error|warn|info|debug
                           threshold for log messages
  --log-policy block|raise|discard
                           how to deal with a congested logging pipeline
  --exception-limit INT    maximal number of backend failures before and
                           exception is raised
  --exception-wait INT     time to wait after an backend failure occured
  --exit-timeout INT       timeout for flushing the log message queue on exit
  -c,--color ARG           whether to use ANSI terminal colors in the output
  --log-format text|json   format that is use for writing logs to file handles
  --log-handle stdout|stderr|file:_FILENAME_|es:[APIKEY]:_URL_
                           handle where the logs are written
  --enable-telemetry-logger
                           whether telemetry-logger is enabled or disabled
  --disable-telemetry-logger
                           unset flag telemetry-logger
  -c,--telemetry-color ARG whether to use ANSI terminal colors in the output
  --telemetry-log-format text|json
                           format that is use for writing logs to file handles
  --telemetry-log-handle stdout|stderr|file:_FILENAME_|es:[APIKEY]:_URL_
                           handle where the logs are written
  --cluster-id ARG         a label that is added to all log messages from this
                           node
  --log-filter-rule KEY:VALUE:LOGLEVEL[:RATE]
                           A log filter rule. Log messages with matching scope
                           are discarded if they don't meet the log level
                           threshold.
  --log-filter-default LOGLEVEL:RATE
                           default log filter, which is applied to all messages
                           that don't match any other filter rule
  --database-directory ARG directory where the databases are persisted
  --enable-reset-chain-databases
                           Reset the chain databases for all chains on startup
  --disable-reset-chain-databases
                           unset flag reset-chain-databases

