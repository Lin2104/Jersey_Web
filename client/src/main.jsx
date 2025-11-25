// src/main.jsx (FIXED)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// ⬅️ CRITICAL FIX: You MUST import AuthProvider from your context file!
import { AuthProvider } from './context/AuthContext.jsx'; 
// import AppWrapper from './components/AppWrapper.jsx'; // ⬅️ NEW IMPORT

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
<App />    </AuthProvider>
  </React.StrictMode>,
);