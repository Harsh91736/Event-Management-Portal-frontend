// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Your global Tailwind CSS imports
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter for routing
import { Toaster } from 'sonner'; // Import Toaster from sonner

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter should wrap the entire app for routing */}
    <BrowserRouter>
      {/* AuthProvider makes auth context available to all children */}
      <AuthProvider>
        <App />
        {/* Toaster component for displaying notifications */}
        <Toaster position="bottom-right" richColors /> {/* richColors for better styling */}
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);