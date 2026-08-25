import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error filter for benign Vite WebSocket / WakeLock sandbox errors
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = String(event.reason?.message || event.reason || '');
    if (
      reasonStr.includes('WebSocket') ||
      reasonStr.includes('websocket') ||
      reasonStr.includes('WakeLock') ||
      reasonStr.includes('permissions policy')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = String(event.message || '');
    if (
      msg.includes('WebSocket') ||
      msg.includes('websocket') ||
      msg.includes('WakeLock') ||
      msg.includes('permissions policy')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
