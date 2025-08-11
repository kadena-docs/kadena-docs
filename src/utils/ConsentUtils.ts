export const resetConsent = () => {
     localStorage.removeItem('ga_consent');
     window.location.reload();
};