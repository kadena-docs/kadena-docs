import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {

   default: [
      'start',
      'design'
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