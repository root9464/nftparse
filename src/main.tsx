import { TonConnectUIProvider } from '@tonconnect/ui-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl='https://taiga-labs.github.io/gorelko.json'>
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>,
);
