// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext'; // To get the logout function/user status

// // Get the base URL from environment variables (must match AuthContext)
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
// const ORDERS_ENDPOINT = `${API_BASE_URL}/orders`; // No trailing slash!
// const response = await axios.get(ORDERS_ENDPOINT); // axios.get('http://localhost:5000/api/orders')
// /**
//  * @desc Component to fetch and display protected order data.
//  * This route should be secured by ProtectedRoute with allowedRoles=['admin'].
//  */
// const OrdersPage = () => {
//     const { user, logout } = useAuth();
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Fetch orders runs only once on component mount
//     useEffect(() => {
//         const fetchOrders = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 // Axios uses the Authorization header automatically set by AuthContext.js!
//                 const response = await axios.get(ORDERS_ENDPOINT);
//                 setOrders(response.data.data); // Assuming backend response is { data: [...] }
//             } catch (err) {
//                 // If the backend returns 401/403 (Token/Role failure), we should handle it
//                 if (err.response && (err.response.status === 401 || err.response.status === 403)) {
//                     setError('Access Denied. Please log in again or check user permissions.');
//                     logout(); // Force logout if token is expired or invalid
//                 } else {
//                     setError(err.message || 'Failed to fetch orders.');
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         // Only fetch if the user object is available (i.e., we are theoretically logged in)
//         if (user) {
//             fetchOrders();
//         } else {
//             // Should not happen if ProtectedRoute is configured correctly, but good for safety
//             setError('User data missing. Please log in.');
//             setLoading(false);
//         }
//     }, [user, logout]);


//     if (loading) return <p style={styles.message}>Loading orders...</p>;
//     if (error) return <p style={styles.error}>Error: {error}</p>;

//     return (
//         <div style={styles.container}>
//             <h1 style={styles.header}>Orders Management ({orders.length} Total)</h1>
//             <p style={styles.info}>
//                 This data is fetched from the **protected** <code>GET /api/orders</code> endpoint.
//             </p>

//             {orders.length === 0 ? (
//                 <p style={styles.message}>No orders found.</p>
//             ) : (
//                 <div style={styles.ordersList}>
//                     {orders.map(order => (
//                         <div key={order._id} style={styles.orderItem}>
//                             <h3 style={styles.orderId}>Order ID: {order._id}</h3>
//                             <p>Status: <strong>{order.status || 'Pending'}</strong></p>
//                             <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
//                             {/* Display more order details here */}
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// // --- Basic Inline Styles ---
// const styles = {
//     container: {
//         padding: '30px',
//         maxWidth: '1000px',
//         margin: '0 auto',
//         fontFamily: 'Arial, sans-serif',
//     },
//     header: {
//         borderBottom: '2px solid #007bff',
//         paddingBottom: '10px',
//         marginBottom: '20px',
//     },
//     info: {
//         backgroundColor: '#e9f7ef',
//         padding: '10px',
//         borderRadius: '5px',
//         marginBottom: '20px',
//         color: '#333',
//     },
//     ordersList: {
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//         gap: '20px',
//     },
//     orderItem: {
//         padding: '15px',
//         border: '1px solid #ddd',
//         borderRadius: '8px',
//         boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
//         backgroundColor: 'white',
//     },
//     orderId: {
//         fontSize: '1.1em',
//         color: '#007bff',
//         marginBottom: '5px',
//     },
//     message: {
//         textAlign: 'center',
//         padding: '20px',
//         backgroundColor: '#fffbe6',
//         border: '1px solid #ffe0b2',
//         borderRadius: '5px',
//     },
//     error: {
//         color: 'white',
//         backgroundColor: '#dc3545',
//         padding: '15px',
//         borderRadius: '5px',
//         textAlign: 'center',
//     }
// };

// export default OrdersPage;