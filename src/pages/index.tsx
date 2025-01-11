import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React from 'react';
import Layout from '@theme/Layout';
import { DocSearch } from '@docsearch/react';
import { Analytics } from "@vercel/analytics/react"

import KadenaImgAPI from '/static/img/kadena-docs-api-reference.jpg';
import KadenaImgFunction from '/static/img/kadena-docs-function-ref.jpg';
import KadenaImgHowTo from '/static/img/kadena-docs-howto-guides.jpg';
import KadenaImgQuick from '/static/img/kadena-docs-quickstart.jpg';
import KadenaImgResources from '/static/img/kadena-docs-resources.jpg';
import KadenaImgSC from '/static/img/kadena-docs-smart-contracts.jpg';

export default function Home(): JSX.Element {

   const {siteConfig} = useDocusaurusContext();

   return (

      <Layout description="">
               <Analytics />
         <header className='home-header'>

            <div className='home-header-gap left'></div>

            <div className='home-header-main'>

               <h1 className='home-header-title'>Kadena Developer Documentation</h1>

               <p className='home-header-excerpt'>Kadena developer-focused documentation provides everything you need to start building for the Kadena blockchain, accelerate your development process, and deploy your applications on the Kadena network.</p>

               <div className='home-header-algolia'>

                  <DocSearch appId="6UVWQF4IS8" apiKey="b89b66367ee8fd13c34fb502b67609be" indexName="enterprise-kadena" />

               </div>

            </div>

            <div className='home-header-gap right'></div>

         </header>

         <main className='home-main'>

            <h2 className='home-section-heading'>Let's get started</h2>

            <span className='home-section-excerpt'>From introductory tutorials to comprehensive API documentation, we've got you covered.</span>

            <div className='home-main-sections'>

               <a className='home-main-sections-item' href="./quickstart">

                  <div className='home-main-sections-item-cover' style={{backgroundImage: "url(" + KadenaImgQuick + ")"}}></div>

                  <div className='home-main-sections-item-content'>

                     <span className="home-main-sections-item-label">Quick Start</span>

                     <p className="home-main-sections-item-summary">Start here to set up your development environment and build your first project.</p>

                  </div>

               </a>

               <a className='home-main-sections-item' href="./api">

                  <div className='home-main-sections-item-cover' style={{backgroundImage: "url(" + KadenaImgAPI + ")"}}></div>

                  <div className='home-main-sections-item-content'>

                     <span className="home-main-sections-item-label">API Reference</span>

                     <p className="home-main-sections-item-summary">Connect to API endpoints to interact with smart contracts and the Kadena blockchain network.</p>

                  </div>

               </a>

               <a className='home-main-sections-item' href="./reference">

                  <div className='home-main-sections-item-cover' style={{backgroundImage: "url(" + KadenaImgFunction + ")"}}></div>

                  <div className='home-main-sections-item-content'>

                     <span className="home-main-sections-item-label">Function Reference</span>

                     <p className="home-main-sections-item-summary">Get fast access to Pact built-in functions to perform many types of common programming tasks.</p>

                  </div>

               </a>

               <a className='home-main-sections-item' href="./smart-contract-dev">

                  <div className='home-main-sections-item-cover' style={{backgroundImage: "url(" + KadenaImgSC + ")"}}></div>

                  <div className='home-main-sections-item-content'>

                     <span className="home-main-sections-item-label">Smart Contracts</span>

                     <p className="home-main-sections-item-summary">Learn how to write smart contracts using the Pact smart contract programming language.</p>

                  </div>

               </a>

               <a className='home-main-sections-item' href="./guides">

                  <div className='home-main-sections-item-cover' style={{backgroundImage: "url(" + KadenaImgHowTo + ")"}}></div>

                  <div className='home-main-sections-item-content'>

                     <span className="home-main-sections-item-label">How-To Guides</span>

                     <p className="home-main-sections-item-summary">Follow the examples in the how-to guides to learn patterns for how to perform common tasks.</p>

                  </div>

               </a>

               <a className='home-main-sections-item' href="./resources">

                  <div className='home-main-sections-item-cover' style={{backgroundImage: "url(" + KadenaImgResources + ")"}}></div>

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

         </main>

      </Layout>

   );

}