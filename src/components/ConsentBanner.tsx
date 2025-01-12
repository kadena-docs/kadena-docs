import React from 'react';
import CookieConsent from 'react-cookie-consent';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const loadGoogleAnalytics = (trackingID: string) => {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', trackingID);
};

const ConsentBanner: React.FC = () => {
  const trackingID = 'G-J507K728FR';

  const handleAccept = () => {
    localStorage.setItem('ga_consent', 'true');
    loadGoogleAnalytics(trackingID); // Load Google Analytics
  };

  const handleDecline = () => {
    localStorage.setItem('ga_consent', 'false');
  };

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      onAccept={handleAccept}
      onDecline={handleDecline}
      enableDeclineButton
      style={{ background: '#2B373B', color: 'white' }}
      buttonStyle={{ backgroundColor: '#4CAF50', color: 'white' }}
      declineButtonStyle={{ backgroundColor: '#f44336', color: 'white' }}
    >
      This website uses cookies for analytics to enhance your experience. Click ‘Accept’ to consent to Google Analytics.
    </CookieConsent>
  );
};

export default ConsentBanner;