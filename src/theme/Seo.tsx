import React from 'react';
import { useLocation } from '@docusaurus/router';
import { useDocusaurusContext } from '@docusaurus/core';
import { Helmet } from 'react-helmet';

interface SeoProps {
  title: string;
  description: string;
  image?: string;
}

const Seo: React.FC<SeoProps> = ({ title, description, image }) => {
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();
  const siteUrl = siteConfig.url; // Dynamically fetch the site URL
  const fullUrl = `${siteUrl}${location.pathname}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default Seo;