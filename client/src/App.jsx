// // import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'
// // import './App.css'

// // // src/App.jsx

// // import OrderForm from './components/OrderForm';
// // import './App.css'; // You can add your styling here

// // function App() {
// //   return (
// //     <div className="App">
// //       <OrderForm />
// //     </div>
// //   );
// // }

// // export default App;
// // src/App.jsx

// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import OrderForm from './components/OrderForm'; // Assuming this is your main form component
// import AdminDashboard from './pages/AdminDashboard'; // Import the new component

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         {/* Simple Navigation Header (optional) */}
//         <nav style={{ padding: '10px', backgroundColor: '#eee' }}>
//           <Link to="/" style={{ marginRight: '15px' }}>Order Form</Link>
//           {/* This is the access link, often hidden or protected in a real app */}
//           <Link to="/admin">Admin Dashboard</Link> 
//         </nav>
        
//         <Routes>
//           {/* Main public route for the order form */}
//           <Route path="/" element={<OrderForm />} /> 
          
//           {/* ⬅️ THE NEW ADMIN ROUTE */}
//           <Route path="/admin" element={<AdminDashboard />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;








// import React, { lazy, Suspense } from 'react'; // ⬅️ ADD lazy and Suspense
// import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';

// import OrderForm from './components/OrderForm';
// import AdminDashboard from './pages/AdminDashboard';
// import LoginPage from './pages/LoginPage';
// import OrderPage from './pages/OrderPage';
// const LazyAdminDashboard = lazy(() => import('./pages/AdminDashboard'));
// const LazyOrdersPage = lazy(() => import('./pages/OrderPage'));

// // Helper component for the navigation bar
// const Navigation = () => {
//     const { isAuthenticated, logout } = useAuth();
//     const navigate = useNavigate();

//     const handleLogout = () => {
//         logout();
//         navigate('/'); // Redirect to homepage after logout
//     };

//     return (
//         <nav style={{ padding: '15px 30px', backgroundColor: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <div className="nav-links">
//                 <Link to="/" style={navLinkStyle}>🛒 Order Form</Link>
//                 {/* Admin link only appears if authenticated */}
//                 {isAuthenticated && (
//                     <Link to="/admin" style={navLinkStyle}>📊 Admin Dashboard</Link>
//                 )}
//             </div>
//             <div className="auth-controls">
//                 {isAuthenticated ? (
//                     <button onClick={handleLogout} style={logoutButtonStyle}>Log Out</button>
//                 ) : (
//                     <Link to="/login" style={navLinkStyle}>🔑 Admin Login</Link>
//                 )}
//             </div>
//         </nav>
//     );
// };

// const navLinkStyle = {
//     color: 'white',
//     textDecoration: 'none',
//     marginRight: '20px',
//     padding: '5px 10px',
//     borderRadius: '4px',
//     transition: 'background-color 0.2s',
// };

// const logoutButtonStyle = {
//     backgroundColor: '#dc3545',
//     color: 'white',
//     border: 'none',
//     padding: '8px 15px',
//     borderRadius: '4px',
//     cursor: 'pointer',
// };


// function App() {
//   return (
//     <Router>
//       {/* <AuthProvider> */}
//         {/* <Navigation /> */}
//         <div style={{ padding: '20px' }}>
//           <Routes>
//             {/* Public Route */}
//             <Route path="/" element={<OrderForm />} /> 

//             {/* Public Login Route */}
//             <Route path="/login" element={<LoginPage />} /> 
//             <Route 
//             path="/admin/*" // Catch all admin paths
//             element={
//               <Suspense fallback={<div style={{textAlign: 'center', padding: '50px'}}>Loading Admin Tools...</div>}>
//                 {/* The ProtectedRoute component handles the authentication check.
//                   It will only render its children (the Lazy components) if the user is authenticated.
//                 */}
//                 <ProtectedRoute requiredRole="admin">
//                   <Routes>
//                     {/* Nested Routes inside the protected area */}
//                     <Route path="/" element={<LazyAdminDashboard />} /> {/* Renders at /admin */}
//                     <Route path="orders" element={<LazyOrdersPage />} /> {/* Renders at /admin/orders */}
//                   </Routes>
//                 </ProtectedRoute>
//               </Suspense>
//             } 
//           />
            
           
            
//             {/* Fallback 404 Route */}
//             <Route path="*" element={<h1 style={{textAlign: 'center'}}>404 - Page Not Found</h1>} />
//           </Routes>
//         </div>
//       {/* </AuthProvider> */}
//     </Router>
//   );
// }

// export default App;
// src/App.jsx

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext.jsx'; // Note the explicit .jsx
// import OrderForm from './components/OrderForm.jsx';         // Note the explicit .jsx
// import LoginPage from './pages/LoginPage.jsx';       // Note the explicit .jsx
// import AdminDashboard from './pages/AdminDashboard.jsx'; // Note the explicit .jsx
// import OrderListPage from './pages/OrderPage.jsx';   // Note the explicit .jsx

// // NOTE: All ProtectedRoute components are removed.
// // Admin routes are now PUBLICLY ACCESSIBLE.

// const App = () => {
//   return (
//     <Router>
//       <AuthProvider>
//         <div className="App">
//           <h1>Application Header</h1>
//           <Routes>
//             <Route path="/" element={<OrderForm />} />
//             <Route path="/login" element={<LoginPage />} />

//             {/* ADMIN ROUTES - These are now publicly accessible!
//               No ProtectedRoute wrapper is used.
//             */}
//             <Route path="/admin/dashboard" element={<AdminDashboard />} />
//             <Route path="/admin/orders" element={<OrderListPage />} />

//             {/* Other routes... */}
//           </Routes>
//         </div>
//       </AuthProvider>
//     </Router>
//   );
// };

// export default App;


// import React, { lazy, Suspense } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext.jsx'; // Added .jsx
// // import Navigation from './components/Navigation.jsx'; // Added .jsx
// import OrderForm from './components/OrderForm.jsx'; // Added .jsx
// import LoginPage from './pages/LoginPage.jsx';     // Added .jsx

// // Lazy load Admin components to optimize initial load, but they are NOT protected
// const LazyAdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
// const LazyOrdersPage = lazy(() => import('./pages/OrderPage.jsx'));

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         {/* Navigation is global */}
//         <Navigation />
//         <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
//           <Routes>
//             {/* 1. Public Route (Customer Order Form) */}
//             <Route path="/" element={<OrderForm />} /> 

//             {/* 2. Public Login Route (Manual Button) */}
//             <Route path="/login" element={<LoginPage />} /> 
            
//             {/* 🛑 ADMIN ROUTES - COMPLETELY UNPROTECTED 🛑 */}
            
//             {/* 3. Admin Dashboard Route */}
//             <Route 
//               path="/admin" 
//               element={
//                 <Suspense fallback={<div className="text-center p-12">Loading Admin Dashboard...</div>}>
//                   <LazyAdminDashboard />
//                 </Suspense>
//               } 
//             />

//             {/* 4. ORDERS MANAGEMENT ROUTE (This will now fetch orders without a token) */}
//             <Route 
//               path="/admin/orders" 
//               element={
//                 <Suspense fallback={<div className="text-center p-12">Loading Orders Page...</div>}>
//                   <LazyOrdersPage />
//                 </Suspense>
//               } 
//             />

//             {/* Fallback 404 Route */}
//             <Route path="*" element={<h1 className="text-xl text-center mt-10">404 - Page Not Found</h1>} />
//           </Routes>
//         </div>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;


// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; 
import ProtectedRoute from './components/ProtectedRoute.jsx'; 

// Pages
import OrderForm from './components/OrderForm.jsx';       // Default Public Route
import LoginPage from './pages/LoginPage.jsx';       // Admin Login
import AdminOrders from './pages/AdminOrders.jsx';   // Protected Admin Route

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          {/* <header>
            <nav>
              <a href="/">Order Form (Public)</a> | 
              <a href="/admin/login">Admin Login</a> |
              <a href="/admin/orders">Admin Orders (Protected)</a>
            </nav>
          </header> */}
          <hr/>
          <Routes>
            {/* 1. PUBLIC DEFAULT ROUTE */}
            <Route path="/" element={<OrderForm />} /> 

            {/* 2. ADMIN LOGIN ROUTE */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* 3. PROTECTED ADMIN ROUTE */}
            <Route 
              path="/admin/orders" 
              element={
                <ProtectedRoute>
                  <AdminOrders />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all for 404s */}
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;