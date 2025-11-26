// // D:/single-preorder-mern/client/src/context/AuthContext.js

// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// const setAuthHeader = (token) => {
//     if (token) {
//         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     } else {
//         delete axios.defaults.headers.common['Authorization'];
//     }
// };

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const initializeAuthState = () => {
//         const storedToken = localStorage.getItem('token');
//         setAuthHeader(storedToken);
//         const storedUser = localStorage.getItem('user');
//         return storedUser ? JSON.parse(storedUser) : null;
//     };

//     const [user, setUser] = useState(initializeAuthState);
//     const [isLoading, setIsLoading] = useState(true);
//     const isAuthenticated = !!user;

//     const login = async (username, password) => {
//         setIsLoading(true);
//         try {
//             const response = await axios.post(`${API_BASE_URL}/auth/login`, {
//                 username,
//                 password,
//             });

//             const { token, ...userData } = response.data;
            
//             localStorage.setItem('token', token);
//             localStorage.setItem('user', JSON.stringify(userData));
            
//             setAuthHeader(token); 
            
//             setUser(userData);
//             return userData;
            
//         } catch (error) {
//             const errorMessage = error.response?.data?.message || 'Login failed. Check server connection.';
//             throw new Error(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const logout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
        
//         setAuthHeader(null); 
        
//         setUser(null);
//         setIsLoading(false);
//     };

//     useEffect(() => {
//         // Sets loading state to false after initial token check
//         setIsLoading(false);
//     }, []);

//     const contextValue = {
//         user,
//         isAuthenticated,
//         isLoading,
//         login,
//         logout,
//     };

//     return (
//         <AuthContext.Provider value={contextValue}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     return useContext(AuthContext);
// };
// src/context/AuthContext.jsx

// import React, { createContext, useState, useContext } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   // Use a simple state to simulate being logged in (e.g., as an admin)
//   const [user, setUser] = useState(null); 

//   // Function to manually set the user and simulate a successful login
//   const manualLogin = () => {
//     // In a real app, this would involve fetching and storing a JWT/token.
//     // Here, we just set a dummy user object.
//     setUser({ id: 1, role: 'admin', name: 'Simulated Admin' });
//     console.log('Manual Admin Login Simulated.');
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   // The 'user' is considered logged in if the 'user' object is not null
//   const isAuthenticated = !!user;

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated, manualLogin, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// import React, { createContext, useContext, useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Hardcoded admin user data
// const MOCK_ADMIN_USER = {
//     id: 'mock-admin-123',
//     name: 'Mock Admin User',
//     email: 'admin@example.com',
//     role: 'admin',
// };

// const AuthContext = createContext({
//     user: null,
//     isAuthenticated: false,
//     isLoading: false, 
//     login: () => {},
//     logout: () => {},
// });

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//     const navigate = useNavigate();
//     // State tracks whether the mock user is "logged in"
//     const [user, setUser] = useState(null); 

//     // Manual Login: Sets the admin user and redirects
//     const login = () => {
//         setUser(MOCK_ADMIN_USER);
//         navigate('/admin'); 
//     };

//     // Manual Logout: Clears the user state
//     const logout = () => {
//         setUser(null);
//         navigate('/'); 
//     };

//     const isAuthenticated = !!user;

//     const contextValue = useMemo(() => ({
//         user,
//         isAuthenticated,
//         isLoading: false, // Always false now
//         login,
//         logout,
//     }), [user, isAuthenticated]);

//     return (
//         <AuthContext.Provider value={contextValue}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// src/context/AuthContext.jsx

// src/context/AuthContext.jsx (Regenerated)

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'; 

const AuthContext = createContext();

// FIX 1: Base URL now points to the auth segment
// const API_BASE_PATH = '/admin'; 
const ADMIN_API_ENDPOINT = `${API_BASE_URL}/admin`;

export const AuthProvider = ({ children }) => {
  // Initialize state from Local Storage for persistence
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('adminUser')) || null
  ); 

  useEffect(() => {
    // Keep Local Storage in sync with user state
    if (user) {
        localStorage.setItem('adminUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('adminUser');
    }
  }, [user]);

  // Function to perform login and receive JWT
  const login = async (username, password) => {
    try {
      // FIX 2: Request now targets /api/auth/login
      const response = await axios.post(
        ADMIN_API_ENDPOINT + 'login', 
        { username, password }
      );
      
      setUser(response.data); 
      return true;
    } catch (error) {
      console.error('Admin Login failed:', error.response?.data?.message || error.message);
      setUser(null); 
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };
  
  // Utility function to get auth headers for protected API calls
  const getAuthHeader = () => {
    if (user && user.token) {
        return {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
    }
    return {};
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
