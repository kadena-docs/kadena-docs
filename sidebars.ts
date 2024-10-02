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
           
                'get-started/get-started-intro',
                //'get-started/install-pact',
                //'get-started/basic-concepts',
                //'get-started/lang-features',
                //'get-started/modules',
                //'get-started/database-model'
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
              //'guides/howto-read-state',
              //'guides/howto-create-accounts',
              //'guides/howto-fund-accounts',
              //'guides/howto-get-balances',
              //'guides/howto-construct-tx',
              //'guides/howto-sign-submit-tx',
              //'guides/howto-deploy-contracts',
              //'guides/howto-sign-submit-tx',
              //'guides/howto-check-tx-status',
              //'guides/howto-sign-submit-tx',
              //'guides/howto-call-functions',
              //'guides/howto-rotate-owners',
              //'guides/howto-verify-signatures',
              //{
                //type: 'category',
                //label: 'Nodes',
                //link: {
                   //type: 'doc',
                   //id: 'guides/nodes/nodes',
              //},
              //items: [
                     //'guides/nodes/compaction',
                     //'guides/nodes/configure',
                     //'guides/nodes/monitoring',
              //],
           //}
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
              'api/pact-api',
              //'reference/operators/addition',
              //'reference/operators/and'
         ]
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
                //'reference/functions',
                //'reference/builtin-functions',
                //'reference/smart-contract-language',
                {
                  type: 'category',
                  label: 'Functions',
                  link: {
                    type: 'doc',
                    id: 'reference/functions',
                  },
                  items: [
                       'reference/functions/general',
                       //'reference/operators/addition',
                       //'reference/operators/and'
                  ]
                }

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
              //'coding-projects/hello-world',
              //'coding-projects/transfers',
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
      'solutions',
      {
         type: 'category',
         label: 'Block Explorer',
         items: [
            'block-explorer/block-explorer',
         ],
      },
      {
         type: 'category',
         label: 'Chainweaver Wallet',
         items: [
            'chainweaver/chainweaver',
         ],
      },
      {
         type: 'category',
         label: 'GraphQL',
         items: [
            'graphql/graphql',
         ],
      },
      {
         type: 'category',
         label: 'HD Wallet',
         items: [
            'hd-wallet/hd-wallet',
         ],
      },
      {
         type: 'category',
         label: 'KadenaJS',
         items: [
            'kadena-js/kadena-js',
         ],
      },
      {
         type: 'category',
         label: 'Kadena CLI',
         items: [
            'kadena-cli/kadena-cli',
         ],
      },
      {
         type: 'category',
         label: 'Marmalade',
         items: [
            'marmalade/marmalade',
         ],
      },
      {
         type: 'category',
         label: 'Spirekey Wallet',
         items: [
            'spirekey/spirekey',
         ],
      },
   ],
};

export default sidebars;