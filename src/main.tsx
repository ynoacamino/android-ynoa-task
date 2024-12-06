import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import { Toaster } from './components/ui/toaster';
import { TaskProvider } from './components/providers/TaskProvider';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  // <React.StrictMode>
  <TaskProvider>
    <App />
    <Toaster />
  </TaskProvider>,
  // </React.StrictMode>,
);
