import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
   title: 'Kadena Docs',
   url: 'https://enterprise-docs.kadena.io',
   baseUrl: '/',

   favicon: 'img/kadena-favicon.png',
   trailingSlash: false,
   i18n: {
      defaultLocale: 'en',
      locales: ['en'],
   },
   onBrokenLinks: 'log',
   onBrokenAnchors: 'warn',
   onBrokenMarkdownLinks: 'warn',
   tagline: 'The Blockchain for Business',
   organizationName: 'kadena-docs',
   projectName: 'kadena-docs',

   themeConfig: {
      colorMode: {
         defaultMode: 'light',
         disableSwitch: false,
         respectPrefersColorScheme: true
      },
      image: 'img/kadena-opengraph.png',
      metadata: [
         {name: 'keywords', content: 'kadena, kda, developer, docs, documentation, enterprise, institutional'},
         {name: 'twitter:card', content: 'summary_large_image'},
      ],
      announcementBar: {
         id: "announcement-bar_1",
         content: `<strong>This docs site is a work in progress, please visit our <a target="_blank" href="https://docs.kadena.io">live docs site</a>.</strong>`,
         backgroundColor: "#469279",
         textColor: "#FFFFFF",
         isCloseable: false,
      },
      docs: {
         sidebar: {
            hideable: true,
            autoCollapseCategories: true,
         },
      },
      navbar: {
         title: '',
         logo: {
            alt: 'Kadena Documentation',
            src: 'img/kadena-docs-light.png',
            srcDark: 'img/kadena-docs-dark.png',
            width: 196,
            height: 32,
         },
         items: [
            {
               type: 'docSidebar',
               label: 'Get Started',
               sidebarId: 'default',
               position: 'left',
            },
            {
               type: 'docSidebar',
               label: 'Solutions',
               sidebarId: 'solutions',
               position: 'left',
            },
            {
               label: 'Academy',
               href: 'https://academy.kadena.io',
               position: 'left',
            },
            {
               label: 'Support',
               href: 'https://discord.com/invite/kadena',
               position: 'left'
            },
            {
               href: 'https://github.com/kadena-io',
               position: 'right',
               className: 'github-link-icon'
            }
         ],
         hideOnScroll: false,
         style: 'primary',
      },
      prism: {
         additionalLanguages: ['lisp'],
         theme: prismThemes.github,
         darkTheme: prismThemes.dracula,
      },
      footer: {
         style: 'dark',
         copyright: `Copyright © ${new Date().getFullYear()} - <a href="https://kadena.io" target="_blank">Kadena LLC</a>`,
      },
      tableOfContents: {
         minHeadingLevel: 2,
         maxHeadingLevel: 2
      },
      algolia: {
         appId: '6UVWQF4IS8',
         apiKey: 'b89b66367ee8fd13c34fb502b67609be',
         indexName: 'enterprise-kadena',

         contextualSearch: true,
         externalUrlRegex: 'external\\.com|domain\\.com',
         searchParameters: {},
         searchPagePath: 'search',
         insights: false,
       },
   } satisfies Preset.ThemeConfig,

   presets: [
      [
         'classic',
         {
            docs: {
               routeBasePath: '/',
               sidebarPath: './sidebars.ts',
               editUrl: 'https://github.com/kadena-docs/kadena-docs/blob/master/',
            },
            blog: {
               showReadingTime: false,
               feedOptions: {
                  type: ['rss', 'atom'],
                  xslt: true,
               },
               editUrl: 'https://github.com/kadena-docs/kadena-docs/blob/master/',
               onInlineTags: 'warn',
               onInlineAuthors: 'warn',
               onUntruncatedBlogPosts: 'warn',
            },
            theme: {
               customCss: './src/css/custom.css',
            },
            /*gtag: {
               trackingID: 'GTM-WMSSTV5V',
            },*/
         } satisfies Preset.Options,
      ],
   ],
};

export default config;