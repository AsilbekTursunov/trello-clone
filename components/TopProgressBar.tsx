// components/TopProgressBar.tsx
'use client'; // Mark as client component for App Router
import { useEffect } from 'react';
import Router from 'next/router'; // For Pages Router
import NProgress from 'nprogress';

export default function TopProgressBar() {
  useEffect(() => {
    const handleRouteChangeStart = () => NProgress.start();
    const handleRouteChangeComplete = () => NProgress.done();
    const handleRouteChangeError = () => NProgress.done();

    Router.events.on('routeChangeStart', handleRouteChangeStart);
    Router.events.on('routeChangeComplete', handleRouteChangeComplete);
    Router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      Router.events.off('routeChangeStart', handleRouteChangeStart);
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
      Router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, []);

  return null; // This component doesn't render anything visible directly
}