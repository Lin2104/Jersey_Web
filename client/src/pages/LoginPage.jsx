// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Import the Auth context

// const LoginPage = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const { login, isLoading } = useAuth();
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
        
//         if (isLoading) return;

//         try {
//             await login(username, password);
//             // On successful login, redirect to the Admin Dashboard
//             navigate('/admin'); 
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     return (
//         <div className="login-container" style={styles.container}>
//             <form onSubmit={handleSubmit} style={styles.form}>
//                 <h2 style={styles.header}>Admin Login</h2>
//                 {error && <p style={styles.error}>{error}</p>}

//                 <div style={styles.group}>
//                     <label style={styles.label} htmlFor="username">Username:</label>
//                     <input
//                         type="text"
//                         id="username"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         required
//                         disabled={isLoading}
//                         style={styles.input}
//                     />
//                 </div>
//                 <div style={styles.group}>
//                     <label style={styles.label} htmlFor="password">Password:</label>
//                     <input
//                         type="password"
//                         id="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                         disabled={isLoading}
//                         style={styles.input}
//                     />
//                 </div>
//                 <button type="submit" disabled={isLoading} style={styles.button}>
//                     {isLoading ? 'Logging In...' : 'Log In'}
//                 </button>
//                 <p style={styles.tip}>
//                     Tip: If this is the first run, you must first use the <code>/api/auth/register</code> route 
//                     (e.g., via Postman) to create the initial admin account.
//                 </p>
//             </form>
//         </div>
//     );
// };

// const styles = {
//     container: {
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: '50px',
//         backgroundColor: '#f4f7f9',
//         minHeight: '100vh',
//     },
//     form: {
//         backgroundColor: 'white',
//         padding: '40px',
//         borderRadius: '12px',
//         boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
//         maxWidth: '400px',
//         width: '100%',
//     },
//     header: {
//         textAlign: 'center',
//         color: '#333',
//         marginBottom: '20px',
//     },
//     group: {
//         marginBottom: '15px',
//     },
//     label: {
//         display: 'block',
//         marginBottom: '8px',
//         fontWeight: 'bold',
//         color: '#555',
//     },
//     input: {
//         width: '100%',
//         padding: '10px',
//         borderRadius: '6px',
//         border: '1px solid #ddd',
//         boxSizing: 'border-box',
//     },
//     button: {
//         width: '100%',
//         padding: '12px',
//         backgroundColor: '#007bff',
//         color: 'white',
//         border: 'none',
//         borderRadius: '6px',
//         cursor: 'pointer',
//         fontSize: '16px',
//         marginTop: '10px',
//     },
//     error: {
//         color: 'red',
//         textAlign: 'center',
//         marginBottom: '15px',
//         border: '1px solid #fdd',
//         padding: '10px',
//         backgroundColor: '#fff0f0',
//         borderRadius: '6px',
//     },
//     tip: {
//         marginTop: '20px',
//         fontSize: '12px',
//         color: '#777',
//         borderTop: '1px dashed #eee',
//         paddingTop: '10px',
//     }
// };

// export default LoginPage;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext.jsx'; // Path adjusted to test resolution

// const LoginPage = () => {
//     const { login, isAuthenticated } = useAuth();
//     const navigate = useNavigate();

//     if (isAuthenticated) {
//         return (
//             <div className="text-center p-12 text-green-600">
//                 You are already logged in as Admin.
//             </div>
//         );
//     }
    
//     // Button to trigger the manual login defined in AuthContext
//     const handleManualLogin = (e) => {
//         e.preventDefault();
//         login(); // Update state in AuthContext
//         navigate('/admin'); // Perform navigation locally
//     };

//     return (
//         <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg">
//             <h2 className="text-2xl font-bold text-center mb-6">Manual Admin Login (For Demo)</h2>
//             <p className="text-gray-500 text-center mb-8">
//                 Click the button below to simulate logging in as the Admin. This bypasses all security checks.
//             </p>

//             <button 
//                 onClick={handleManualLogin}
//                 className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150"
//             >
//                 Login as Mock Admin
//             </button>
//         </div>
//     );
// };

// export default LoginPage;

// src/pages/LoginPage.jsx

// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext.jsx'; 
// import { useNavigate } from 'react-router-dom';

// const LoginPage = () => {
//   const [username, setUsername] = useState('admin'); // Default for convenience
//   const [password, setPassword] = useState('password123'); // Default for convenience
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const success = await login(username, password);
    
//     if (success) {
//       navigate('/admin/orders'); // Redirect to protected route upon success
//     } else {
//       alert('Login failed. Check your admin credentials.');
//     }
//   };

//   return (
//     <div>
//       <h2>🔑 Admin Login</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Username:</label>
//           <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//         </div>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;

// src/pages/LoginPage.jsx (Regenerated with Tailwind)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError(null);

        const success = await login(username, password);

        if (success) {
            navigate('/admin/orders'); // Redirect to protected orders page
        } else {
            setLoginError('Login failed. Please check your username and password.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-gray-200">
                <h2 className="text-3xl font-extrabold text-center text-gray-900">
                    Admin Access
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Sign in to manage orders
                </p>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        required
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <input 
                        type="password" 
                        required
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />

                    {loginError && (
                        <p className="text-sm text-red-600 font-medium text-center">
                            {loginError}
                        </p>
                    )}
                    
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                        >
                            Log In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;