import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import KadenaBlockTemp from '/static/img/kadena-docs-block-temp.jpg';

export default function Home(): JSX.Element {

   const {siteConfig} = useDocusaurusContext();

   return (

      <Layout description="">

         <header className='home-header'>

            <div className='home-header-gap left'></div>

            <div className='home-header-main'>

               <h1 className='home-header-title'>Kadena Developer Documentation</h1>

               <p className='home-header-excerpt'>Kadena developer-focused documentation provides everything you need to start building for the Kadena blockchain, accelerate your development process, and deploy your applications on the Kadena network.</p>

               <div className='home-header-search'>Search the documentation</div>

            </div>

            <div className='home-header-gap right'></div>

         </header>

         <main className='home-main'>

            <h2 className='home-section-heading'>Let's get started</h2>

            <span className='home-section-excerpt'>From introductory tutorials to comprehensive API documentation, we've got you covered.</span>

            <div className='home-main-sections'>

               <a className='home-main-sections-item' href="./quickstart">

                  <div className='home-main-sections-item-cover' style={{backgroundImage: "url(" + KadenaBlockTemp + ")"}}></div>

                  <div className='home-main-sections-item-content'>

                     <span className="home-main-sections-item-label">Quick Start</span>

                     <p className="home-main-sections-item-summary">Start here to set up your development environment and build your first project.</p>

                  </div>

               </a>

               <a className='home-main-sections-item' href="./api">

                  <div className='home-main-sections-item-cover' style={{backgroundImage: "url(" + KadenaBlockTemp + ")"}}></div>

                  <div className='home-main-sections-item-content'>

                     <span className="home-main-sections-item-label">API Reference</span>

                     <p className="home-main-sections-item-summary">Connect to API endpoints to interact with smart contracts and the Kadena blockchain network.</p>

                  </div>

               </a>

               <a className='home-main-sections-item' href="./pact-5">

                  <div className='home-main-sections-item-cover' style={{backgroundImage: "url(" + KadenaBlockTemp + ")"}}></div>

                  <div className='home-main-sections-item-content'>

                     <span className="home-main-sections-item-label">Function Reference</span>

                     <p className="home-main-sections-item-summary">Get fast access to Pact built-in functions to perform many types of common programming tasks.</p>

                  </div>

               </a>

               <a className='home-main-sections-item' href="./smart-contract-dev">

                  <div className='home-main-sections-item-cover' style={{backgroundImage: "url(" + KadenaBlockTemp + ")"}}></div>

                  <div className='home-main-sections-item-content'>

                     <span className="home-main-sections-item-label">Smart Contracts</span>

                     <p className="home-main-sections-item-summary">Learn how to write smart contracts using the Pact smart contract programming language.</p>

                  </div>

               </a>

               <a className='home-main-sections-item' href="./guides">

                  <div className='home-main-sections-item-cover' style={{backgroundImage: "url(" + KadenaBlockTemp + ")"}}></div>

                  <div className='home-main-sections-item-content'>

                     <span className="home-main-sections-item-label">How-To Guides</span>

                     <p className="home-main-sections-item-summary">Follow the examples in the how-to guides to learn patterns for how to perform common tasks.</p>

                  </div>

               </a>

               <a className='home-main-sections-item' href="./resources">

                  <div className='home-main-sections-item-cover' style={{backgroundImage: "url(" + KadenaBlockTemp + ")"}}></div>

                  <div className='home-main-sections-item-content'>

                     <span className="home-main-sections-item-label">Resources</span>

                     <p className="home-main-sections-item-summary">Find resources to learn more about blockchain technology and being part of the Kadena community.</p>

                  </div>

               </a>


            </div>

            <div className="home-main-academy">

               <span className="home-main-academy-heading">Kadena Academy</span>

               <p className="home-main-academy-summary">Browse modules and take courses to build your skill set using video demos, hands-on exercises, and sample projects.</p>

               <a className="home-main-academy-link" href="https://academy.kadena.io" target="_blank">Learn Today</a>

            </div>

            <h2 className='home-section-heading'>Solution Showcase</h2>

            <span className='home-section-excerpt'>Explore a curated collection of tools and resources that highlight building with Kadena blockchain technology.</span>

            <div className='home-main-solutions'>

               <a className='home-main-solutions-item' href="./solutions/block-explorer">

                  <span className="home-main-solutions-item-icon">

                     <span className="kadena-dot"></span>

                  </span>

                  <span className="home-main-solutions-item-label">Block Explorer</span>

                  <span className="home-main-solutions-item-summary">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</span>

                  <span className="home-main-solutions-item-link">Learn more &#8594;</span>

               </a>

               <a className='home-main-solutions-item' href="./solutions/chainweaver">

                  <span className="home-main-solutions-item-icon">

                     <span className="kadena-dot"></span>

                  </span>

                  <span className="home-main-solutions-item-label">Chainweaver Wallet</span>

                  <span className="home-main-solutions-item-summary">Our feature-rich desktop wallet for advanced users and developers.</span>

                  <span className="home-main-solutions-item-link">Learn more &#8594;</span>

               </a>

               <a className='home-main-solutions-item' href="./solutions/graphql">

                  <span className="home-main-solutions-item-icon">

                     <span className="kadena-dot"></span>

                  </span>

                  <span className="home-main-solutions-item-label">GraphQL</span>

                  <span className="home-main-solutions-item-summary">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</span>

                  <span className="home-main-solutions-item-link">Learn more &#8594;</span>

               </a>

               <a className='home-main-solutions-item' href="./solutions/hd-wallet">

                  <span className="home-main-solutions-item-icon">

                     <span className="kadena-dot"></span>

                  </span>

                  <span className="home-main-solutions-item-label">HD Wallet</span>

                  <span className="home-main-solutions-item-summary">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</span>

                  <span className="home-main-solutions-item-link">Learn more &#8594;</span>

               </a>

               <a className='home-main-solutions-item' href="./solutions/kadena-cli">

                  <span className="home-main-solutions-item-icon">

                     <span className="kadena-dot"></span>

                  </span>

                  <span className="home-main-solutions-item-label">Kadena CLI</span>

                  <span className="home-main-solutions-item-summary">Command-line interface for Kadena blockchain operations.</span>

                  <span className="home-main-solutions-item-link">Learn more &#8594;</span>

               </a>

               <a className='home-main-solutions-item' href="./solutions/kadena-js">

                  <span className="home-main-solutions-item-icon">

                     <span className="kadena-dot"></span>

                  </span>

                  <span className="home-main-solutions-item-label">KadenaJS</span>

                  <span className="home-main-solutions-item-summary">JavaScript library for interacting with the Kadena blockchain.</span>

                  <span className="home-main-solutions-item-link">Learn more &#8594;</span>

               </a>

               <a className='home-main-solutions-item' href="./solutions/marmalade">

                  <span className="home-main-solutions-item-icon">

                     <span className="kadena-dot"></span>

                  </span>

                  <span className="home-main-solutions-item-label">Marmalade</span>

                  <span className="home-main-solutions-item-summary">Kadena's NFT standard for creating and managing digital assets.</span>

                  <span className="home-main-solutions-item-link">Learn more &#8594;</span>

               </a>

               <a className='home-main-solutions-item' href="./solutions/spirekey">

                  <span className="home-main-solutions-item-icon">

                     <span className="kadena-dot"></span>

                  </span>

                  <span className="home-main-solutions-item-label">Spirekey Wallet</span>

                  <span className="home-main-solutions-item-summary">A user-friendly mobile wallet for everyday KDA transactions.</span>

                  <span className="home-main-solutions-item-link">Learn more &#8594;</span>

               </a>

            </div>

         </main>

      </Layout>

   );

}