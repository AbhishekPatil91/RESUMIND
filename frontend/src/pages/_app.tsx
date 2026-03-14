import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const loadUser = useAuthStore((s) => s.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f1629',
            color: '#f1f5f9',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          },
          success: {
            iconTheme: { primary: '#6366f1', secondary: '#0f1629' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0f1629' },
          },
        }}
      />
    </>
  );
}
