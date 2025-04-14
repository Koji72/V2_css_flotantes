import { AppProps } from 'next/app';
import { useEffect } from 'react';
// No necesitamos importar iconos aquí si no los renderizamos dinámicamente
import '../styles/globals.css';
import '../styles/floating-elements.css';
import '../styles/cache-metrics.css';
import '../styles/panel-validation.css';
import '../styles/panel-documentation.css';
import '../styles/notification-system.css';
import { NotificationProvider } from '../components/NotificationSystem';

// Logging helper simple para el cliente
const log = (level: 'info' | 'warn' | 'error', message: string, data?: any) => {
  const prefix = `[App:${level.toUpperCase()}]`;
  if (data) {
    console[level](prefix, message, data);
  } else {
    console[level](prefix, message);
  }
};

function MyApp({ Component, pageProps }: AppProps) {
  // Ya no necesitamos el hook useLucideIcons
  log('info', 'MyApp component rendered.');
  
  return (
    <NotificationProvider>
      <Component {...pageProps} />
    </NotificationProvider>
  );
}

export default MyApp; 