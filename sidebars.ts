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
               //'smart-contracts/transactions',
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
            {
               type: 'category',
               label: 'Accounts',
               items: [
                'guides/accounts/howto-create-accounts',
                'guides/accounts/howto-fund-accounts',
                'guides/accounts/howto-get-balances',
                'guides/accounts/howto-rotate-owners',
                'guides/accounts/howto-safe-transfers',
               ],
            },
            {
               type: 'category',
               label: 'Contracts',
               items: [
                'guides/contracts/howto-read-state',
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
                'guides/transactions/howto-verify-signatures',
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
                     'guides/nodes/compact-databases',
                     'guides/nodes/configure',
                     'guides/nodes/monitoring',
              ],
           },
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
                //'reference/pact-lang-intro',
                'reference/syntax',
                {
                  type: 'category',
                  label: 'Functions',
                  link: {
                    type: 'doc',
                    id: 'pact-5/pact-5',
                  },
                  items: [
                       'pact-5/General/acquire-module-admin',
                       'pact-5/Capabilities/compose-capability',
                       'pact-5/Capabilities/0-capability',
                       'pact-5/Database/0-database',
                       'pact-5/General/0-general',
                       //'pact-5/Guards/0-guards',
                       //'pact-5/Keysets/0-keysets',
                       //'pact-5/Guards/0-guards',
                       //'pact-5/Operators/0-operators',
                       //'pact-5/Repl/0-repl',
                       //'pact-5/Time/0-time',
                       //'pact-5/Commitments/0-commitments',
                       //'pact-5/SPV/0-spv',
                       //'pact-5/ZK/0-zk',
                       //'reference/operators/addition',
                       //'reference/operators/and'
                  ],
                },
                'reference/pact-cli',
                {
                  type: 'category',
                  label: 'kadena-cli commands',
                  link: {
                    type: 'doc',
                    id: 'reference/kadena-cli',
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
              //'coding-projects/pact-testing',
              //'coding-projects/interaction',
              //'coding-projects/wallets',
              //'coding-projects/loans',
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
           // 'resources/changelogs',
           //'resources/contributors',
           'resources/glossary',
           'resources/contribute-doc',
           'resources/contribute-dev',
           'resources/writing-guide',
           //'resources/tools',
           /*{
                type: 'link',
                label: 'Product Docs',
                href: 'https://docs.kadena.io',
           },*/
      ],
 }
],

   solutions: [
      'solutions/solutions',
      {
         type: 'category',
         label: 'Block Explorer',
         items: [
            'solutions/block-explorer/block-explorer',
         ],
      },
      {
         type: 'category',
         label: 'Chainweaver Wallet',
         items: [
            'solutions/chainweaver/chainweaver',
         ],
      },
      {
         type: 'category',
         label: 'GraphQL',
         items: [
            'solutions/graphql/graphql',
         ],
      },
      {
         type: 'category',
         label: 'HD Wallet',
         items: [
            'solutions/hd-wallet/hd-wallet',
         ],
      },
      {
         type: 'category',
         label: 'KadenaJS',
         items: [
            'solutions/kadena-js/kadena-js',
         ],
      },
      {
         type: 'category',
         label: 'Kadena CLI',
         items: [
            'solutions/kadena-cli/kadena-cli',
         ],
      },
      {
         type: 'category',
         label: 'Marmalade',
         items: [
            'solutions/marmalade/marmalade',
         ],
      },
      {
         type: 'category',
         label: 'Spirekey Wallet',
         items: [
            'solutions/spirekey/spirekey',
         ],
      },
   ],
};

export default sidebars;