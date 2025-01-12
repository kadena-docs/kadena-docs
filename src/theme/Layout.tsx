import React from 'react';
import Layout from '@theme-original/Layout';
import ConsentBanner from '../components/ConsentBanner';

export default function LayoutWrapper(props) {
  return (
    <>
      <Layout {...props} />
      <ConsentBanner />
    </>
  );
}