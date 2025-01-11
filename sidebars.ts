import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {

   default: [
      'quickstart',
      {
           type: 'category',
           label: 'Smart contracts',
           link: {
                type: 'doc',
                id: 'smart-contract-dev',
           },
           items: [

                'smart-contracts/get-started-intro',
                {
                  type: 'category',
                  label: 'Installation and setup',
                  link: {
                     type: 'doc',
                     id: 'smart-contracts/install',
                   },
                 items: [
                  'smart-contracts/install/linux',
                  'smart-contracts/install/macos',
                  'smart-contracts/install/windows',
                  'smart-contracts/install/tooling',
                  'smart-contracts/install/local-dev-node',
                 ],
                },
                'smart-contracts/basic-concepts',
                'smart-contracts/accounts',
                'smart-contracts/lang-features',
                'smart-contracts/functions-variables',
                'smart-contracts/modules',
                'smart-contracts/capabilities',
                'smart-contracts/guards',
                'smart-contracts/databases',
                'smart-contracts/transactions',
                ],
      },
      {
         type: 'category',
         label: 'How-to guides',
         link: {
              type: 'doc',
              id: 'guides/guides',
         },
         items: [
            'guides/howto-quick-ref',
            {
               type: 'category',
               label: 'Accounts',
               items: [
                'guides/accounts/howto-create-accounts',
                'guides/accounts/howto-fund-accounts',
                'guides/accounts/howto-get-balances',
                //'guides/accounts/howto-rotate-owners',
               ],
            },
            {
               type: 'category',
               label: 'Contracts',
               items: [
                //'guides/contracts/howto-read-state',
                'guides/contracts/howto-deploy-contracts',
                'guides/contracts/howto-call-functions',
               ],
            },
            {
               type: 'category',
               label: 'Transactions',
               items: [
                'guides/transactions/howto-construct-tx',
                'guides/transactions/howto-sign-submit-tx',
                'guides/transactions/howto-check-tx-status',
                'guides/transactions/howto-namespace-tx',
                'guides/transactions/howto-safe-transfers',
                //'guides/transactions/howto-verify-signatures',
               ],
            },
            {
                type: 'category',
                label: 'Nodes',
                link: {
                   type: 'doc',
                   id: 'guides/nodes/nodes',
              },
                 items: [
                     'guides/nodes/howto-node-operator',
                     'guides/nodes/compact-databases',
                     'guides/nodes/configure',
                     'guides/nodes/monitoring',
              ],
           },
           'guides/dev-kadena-cli',
           'guides/chainweaver',
           'guides/troubleshooting',
         ],
      },
      {
         type: 'category',
         label: 'API',
         link: {
           type: 'doc',
           id: 'api/api',
         },
         items: [
            {
                 type: 'category',
                 label: 'Pact API',
                 link: {
                      type: 'doc',
                      id: 'api/pact-api/pact-api',
                 },
                 items: [
                      "api/pact-api/listen",
                      "api/pact-api/local",
                      "api/pact-api/poll",
                      "api/pact-api/private",
                      "api/pact-api/send",
                      "api/pact-api/spv",
                 ],
            },
            {
                 type: 'category',
                 label: 'Peer-to-peer API',
                 link: {
                      type: 'doc',
                      id: 'api/peer-to-peer/p2p-api',
                 },
                 items: [
                      "api/peer-to-peer/get-cut",
                      "api/peer-to-peer/publish-cut",
                      "api/peer-to-peer/get-payload",
                      "api/peer-to-peer/get-payload-batch",
                      "api/peer-to-peer/all-pending-mempool",
                      "api/peer-to-peer/boolean-tx-mempool",
                      "api/peer-to-peer/lookup-tx-mempool",
                      "api/peer-to-peer/insert-tx-mempool",
                      "api/peer-to-peer/api-get-cut-peers",
                      "api/peer-to-peer/api-add-cut-peers",
                      "api/peer-to-peer/api-get-mempool-peers",
                      "api/peer-to-peer/api-add-mempool-peers",
                      "api/peer-to-peer/api-config",
                 ],
            },
            {
                 type: "category",
                 label: "Service API",
                 link: {
                      type: "doc",
                      id: "api/service-api/service-api",
                      },
                      items: [
                           "api/service-api/get-block",
                           "api/service-api/get-block-branch",
                           "api/service-api/get-block-hash",
                           "api/service-api/get-block-hash-branch",
                           "api/service-api/get-block-header",
                           "api/service-api/get-block-header-by-hash",
                           "api/service-api/get-block-header-branch",
                           'api/service-api/api-update-event-stream',
                           'api/service-api/make-db-backup',
                           'api/service-api/check-db-backup',
                           'api/service-api/check-node-health',
                           'api/service-api/get-node-info',
                           'api/service-api/mining',
                           'api/service-api/rosetta',
                      ],
            },
            'api/data-models',
            'api/binary-encoding',
       ],
  },
  {
      type: 'category',
      label: 'Reference',
      link: {
         type: 'doc',
         id: 'reference/reference',
      },
      items: [
         'reference/syntax',
         'pact-5/func-quick-ref',
         {
            type: 'category',
            label: 'Capability functions',
            link: {
               type: 'doc',
               id: 'pact-5/capabilities/capabilities',
            },
            items: [
               'pact-5/capabilities/compose-capability',
               'pact-5/capabilities/emit-event',
               'pact-5/capabilities/install-capability',
               'pact-5/capabilities/require-capability',
               'pact-5/capabilities/with-capability',
               ],
         },
         {
            type: 'category',
            label: 'Database functions',
            link: {
               type: 'doc',
               id: 'pact-5/database/database',
            },
            items: [
               'pact-5/database/create-table',
               'pact-5/database/describe-keyset',
               'pact-5/database/describe-module',
               'pact-5/database/describe-table',
               'pact-5/database/fold-db',
               'pact-5/database/insert',
               'pact-5/database/keylog',
               'pact-5/database/keys',
               'pact-5/database/list-modules',
               'pact-5/database/read',
               'pact-5/database/select',
               'pact-5/database/txids',
               'pact-5/database/txlog',
               'pact-5/database/update',
               'pact-5/database/with-default-read',
               'pact-5/database/with-read',
               'pact-5/database/write',
            ],
         },
         {
            type: 'category',
            label: 'General functions',
            link: {
               type: 'doc',
               id: 'pact-5/general/general',
            },
            items: [
               'pact-5/general/acquire-module-admin',
               'pact-5/general/at',
               'pact-5/general/base64-decode',
               'pact-5/general/base64-encode',
               'pact-5/general/bind',
               'pact-5/general/chain-data',
               'pact-5/general/charset-ascii',
               'pact-5/general/charset-latin1',
               'pact-5/general/compose',
               'pact-5/general/continue',
               'pact-5/general/concat',
               'pact-5/general/constantly',
               'pact-5/general/contains',
               'pact-5/general/define-namespace',
               'pact-5/general/describe-namespace',
               'pact-5/general/distinct',
               'pact-5/general/drop',
               'pact-5/general/enforce-guard',
               'pact-5/general/enforce-one',
               'pact-5/general/enforce-pact-version',
               'pact-5/general/enforce-verifier',
               'pact-5/general/enforce',
               'pact-5/general/enumerate',
               'pact-5/general/filter',
               'pact-5/general/fold',
               'pact-5/general/format',
               'pact-5/general/hash-keccak256',
               'pact-5/general/hash',
               'pact-5/general/identity',
               'pact-5/general/if',
               'pact-5/general/int-to-str',
               'pact-5/general/is-charset',
               'pact-5/general/length',
               'pact-5/general/list-module',
               'pact-5/general/list',
               'pact-5/general/make-list',
               'pact-5/general/map',
               'pact-5/general/namespace',
               'pact-5/general/pact-id',
               'pact-5/general/pact-version',
               'pact-5/general/poseidon-hash-hack-a-chain',
               'pact-5/general/read-decimal',
               'pact-5/general/read-integer',
               'pact-5/general/read-keyset',
               'pact-5/general/read-msg',
               'pact-5/general/read-string',
               'pact-5/general/remove',
               'pact-5/general/resume',
               'pact-5/general/reverse',
               'pact-5/general/round',
               'pact-5/general/sort',
               'pact-5/general/static-redeploy',
               'pact-5/general/str-to-int',
               'pact-5/general/str-to-list',
               'pact-5/general/take',
               'pact-5/general/try',
               'pact-5/general/tx-hash',
               'pact-5/general/typeof',
               'pact-5/general/where',
               'pact-5/general/yield',
               'pact-5/general/zip',
            ],
         },
         {
            type: 'category',
            label: 'Guard functions',
            link: {
               type: 'doc',
               id: 'pact-5/guards/guards',
            },
            items: [
               'pact-5/guards/create-capability-guard',
               'pact-5/guards/create-capability-pact-guard',
               'pact-5/guards/create-module-guard',
               'pact-5/guards/create-pact-guard',
               'pact-5/guards/create-principal',
               'pact-5/guards/create-user-guard',
               'pact-5/guards/is-principal',
               'pact-5/guards/keyset-ref-guard',
               'pact-5/guards/typeof-principal',
               'pact-5/guards/validate-principal',
            ]
         },
         {
            type: 'category',
            label: 'Keyset functions',
            link: {
               type: 'doc',
               id: 'pact-5/keysets/keysets',
            },
            items: [
               'pact-5/keysets/define-keyset',
               'pact-5/keysets/enforce-keyset',
               'pact-5/keysets/keys-2',
               'pact-5/keysets/keys-all',
               'pact-5/keysets/keys',
            ]
         },
         {
            type: 'category',
            label: 'Operator functions',
            link: {
               type: 'doc',
               id: 'pact-5/operators/operators',
            },
            items: [
               'pact-5/operators/abs',
               'pact-5/operators/add',
               'pact-5/operators/and-q',
               'pact-5/operators/and',
               'pact-5/operators/bitwise-and',
               'pact-5/operators/bitwise-or',
               'pact-5/operators/bitwise-reverse',
               'pact-5/operators/ceiling',
               'pact-5/operators/dec',
               'pact-5/operators/div',
               'pact-5/operators/eq',
               'pact-5/operators/exp',
               'pact-5/operators/floor',
               'pact-5/operators/geq',
               'pact-5/operators/gt',
               'pact-5/operators/leq',
               'pact-5/operators/ln',
               'pact-5/operators/log',
               'pact-5/operators/lt',
               'pact-5/operators/mod',
               'pact-5/operators/mult',
               'pact-5/operators/neq',
               'pact-5/operators/not-q',
               'pact-5/operators/not',
               'pact-5/operators/or-q',
               'pact-5/operators/or',
               'pact-5/operators/pow',
               'pact-5/operators/shift',
               'pact-5/operators/sqrt',
               'pact-5/operators/sub',
               'pact-5/operators/xor',
            ],
         },
         {
            type: 'category',
            label: 'REPL-only functions',
            link: {
               type: 'doc',
               id: 'pact-5/repl/repl',
            },
            items: [
               'pact-5/repl/begin-tx',
               'pact-5/repl/commit-tx',
               'pact-5/repl/continue-pact',
               'pact-5/repl/env-chain-data',
               'pact-5/repl/env-data',
               'pact-5/repl/env-enable-repl-natives',
               'pact-5/repl/env-events',
               'pact-5/repl/env-exec-config',
               'pact-5/repl/env-gas',
               'pact-5/repl/env-gaslimit',
               'pact-5/repl/env-gaslog',
               'pact-5/repl/env-gasmodel',
               'pact-5/repl/env-hash',
               'pact-5/repl/env-keys',
               'pact-5/repl/env-namespace-policy',
               'pact-5/repl/env-sigs',
               'pact-5/repl/expect-failure',
               'pact-5/repl/expect-that',
               'pact-5/repl/expect',
            ]
         },
         {
            type: 'category',
            label: 'Time functions',
            link: {
               type: 'doc',
               id: 'pact-5/time/time-functions',
            },
            items: [
               'pact-5/time/add-time',
               'pact-5/time/days',
               'pact-5/time/diff-time',
               'pact-5/time/format-time',
               'pact-5/time/hours',
               'pact-5/time/minutes',
               'pact-5/time/parse-time',
               'pact-5/time/time',
            ]
         },
         {
            type: 'category',
            label: 'Specialized functions',
            link: {
               type: 'doc',
               id: 'pact-5/special-use',
            },
            items: [
               'pact-5/commitments/decrypt-cc20p1305',
               'pact-5/commitments/hyperlane-decode-token-message',
               'pact-5/commitments/hyperlane-encode-token-message',
               'pact-5/commitments/hyperlane-message-id',
               'pact-5/commitments/validate-keypair',
               'pact-5/spv/verify-spv',
               'pact-5/zk/pairing-check',
               'pact-5/zk/point-add',
               'pact-5/zk/scalar-mult'
            ],
         },
      'reference/pact-cli',
      {
         type: 'category',
         label: 'kadena-cli commands',
         link: {
            type: 'doc',
            id: 'reference/kadena-cli-ref',
         },
         items: [
            'reference/cli/cli-account',
            'reference/cli/cli-config',
            'reference/cli/cli-dapp',
            'reference/cli/cli-key',
            'reference/cli/cli-network',
            'reference/cli/cli-tx',
            'reference/cli/cli-wallet',
         ],
      },
         'reference/chainweb-cli',
         'reference/kadena-client',
         //'reference/client-libs',
         'reference/guard-json',
      ],
   },
      {
         type: 'category',
         label: 'Coding projects',
         link: {
         type: 'doc',
         id: 'coding-projects/coding-projects',
         },
         items: [
              'coding-projects/hello-world',
              'coding-projects/transfers',
              'coding-projects/rotate-auth',
              'coding-projects/contract-interactions',
              'coding-projects/gas-station',
              'coding-projects/loans',
              'coding-projects/local-testing',
              'coding-projects/pact-server-api',
              ],
    },
    {
      type: 'category',
      label: 'Resources',
      link: {
           type: 'doc',
           id: 'resources/resources',
      },
      items: [
           'resources/glossary',
           'resources/solutions',
           'resources/contribute-doc',
           'resources/contribute-dev',
           'resources/writing-guide',
           'resources/legacy',
      ],
 }
],

};

export default sidebars;