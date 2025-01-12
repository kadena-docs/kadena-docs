declare module '@docusaurus/core' {
     export function useDocusaurusContext(): {
       siteConfig: {
         url: string;
         baseUrl: string;
         title: string;
         tagline: string;
       };
     };
   }