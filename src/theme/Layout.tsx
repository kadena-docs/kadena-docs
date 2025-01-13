import React from 'react';
import Layout from '@theme-original/Layout';
import CookieConsentBanner from '../components/CookieConsentBanner';


export default function LayoutWrapper(props) {
  return (
    <>
      <Layout {...props} />
      <CookieConsentBanner />
    </>
  );
}