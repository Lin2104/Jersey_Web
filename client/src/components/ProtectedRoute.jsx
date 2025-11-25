// import React from 'react';
// import { Navigate, useLocation, Outlet } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext.jsx';

// /**
//  * Component that guards access to routes.
//  * Redirects unauthenticated users to the login page.
//  */
// const ProtectedRoute = ({ children, requiredRole}) => {
//     const { isAuthenticated, isLoading, user } = useAuth();
//     const location = useLocation();

//     if (isLoading) {
//         // Show a simple loading indicator while authentication status is being determined
//         return <div style={{ textAlign: 'center', padding: '50px' }}>Loading authentication status...</div>;
//     }

//     if (!isAuthenticated) {
//         // User is not logged in, redirect them to the login page
//         // We store the current location so they can be redirected back after successful login
//         return <Navigate to="/login" state={{ from: location }} replace />;
//     }

//     // Optional: Check if the user has the required role (e.g., 'admin')
//     if (user && user.role !== requiredRole) {
//         return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>
//             Access Denied. You do not have the required permissions.
//         </div>;
//     }

//     // User is authenticated and authorized, render the child components (the Dashboard)
//     return children;
// };

// export default ProtectedRoute;
// src/components/ProtectedRoute.jsx (Refactored)




// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;