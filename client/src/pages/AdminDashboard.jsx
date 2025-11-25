// // src/pages/AdminDashboard.jsx (UPDATED)

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// // Assuming a CSS file is linked for styling

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const ORDERS_API_ENDPOINT = `${API_BASE_URL}/orders`;

// // Define allowed statuses for the dropdown
// const STATUS_OPTIONS = [
//     'Pending Payment Verification',
//     'Confirmed',
//     'Processing',
//     'Delivered',
//     'Cancelled'
// ];

// const AdminDashboard = () => {
//     const [orders, setOrders] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [message, setMessage] = useState(''); // For success/error messages

//     // Function to fetch all orders
//     const fetchOrders = async () => {
//         setIsLoading(true);
//         setError(null);
//         try {
//             const response = await axios.get(ORDERS_API_ENDPOINT);
//             setOrders(response.data.orders || response.data);
//         } catch (err) {
//             setError("Failed to load orders from the server.");
//             console.error("Error fetching orders:", err);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchOrders();
//     }, []);

//     // Function to handle the status update API call
//     const handleUpdateStatus = async (orderId, newStatus) => {
//         setMessage(''); // Clear previous message
//         if (!window.confirm(`Are you sure you want to change order ${orderId.slice(-6).toUpperCase()} status to "${newStatus}"?`)) {
//             return;
//         }

//         try {
//             const response = await axios.patch(`${ORDERS_API_ENDPOINT}/${orderId}`, {
//                 status: newStatus
//             });
            
//             // Update the state with the new order data
//             setOrders(prevOrders => 
//                 prevOrders.map(order => 
//                     order._id === orderId ? response.data : order
//                 )
//             );
//             setMessage(`✅ Order ${orderId.slice(-6).toUpperCase()} status updated to ${newStatus}.`);

//         } catch (err) {
//             const msg = err.response?.data?.message || 'Failed to update status.';
//             setMessage(`❌ Error updating order: ${msg}`);
//             console.error("Update Status Error:", err);
//         }
//     };

//     if (isLoading) return <div className="admin-loading">Loading Order Dashboard...</div>;
//     if (error) return <div className="admin-error" style={{ color: 'red' }}>{error}</div>;

//     return (
//         <div className="admin-dashboard-container">
//             <h1>Admin Order Management ({orders.length} Orders)</h1>
//             <p className="status-message" style={{ color: message.startsWith('✅') ? 'green' : 'red' }}>
//                 {message}
//             </p>

//             <table className="orders-table">
//                 <thead>
//                     {/* ... (table headers remain the same) ... */}
//                     <tr>
//                         <th>Order ID</th>
//                         <th>Customer</th>
//                         <th>Student ID</th>
//                         <th>Item Details</th>
//                         <th>Total</th>
//                         <th>Status</th>
//                         <th>Payment Proof</th>
//                         <th>Date</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {orders.map((order) => (
//                         <tr key={order._id}>
//                             <td>{order._id.slice(-6).toUpperCase()}</td>
//                             <td>{order.customerName}<br /><small>{order.customerEmail}</small></td>
//                             <td>{order.studentId}</td>
//                             <td>
//                                 {order.itemName} ({order.size}) x {order.quantity}
//                             </td>
//                             <td>{order.itemPrice * order.quantity} MMK</td>
//                             <td>
//                                 <span className={`status-tag status-${order.status.toLowerCase().replace(/\s/g, '-')}`}>
//                                     {order.status}
//                                 </span>
//                             </td>
//                             <td>
//                                 <a 
//                                     href={order.paymentProofImageURL} 
//                                     target="_blank" 
//                                     rel="noopener noreferrer"
//                                     className="proof-link"
//                                 >
//                                     View Proof
//                                 </a>
//                             </td>
//                             <td>{new Date(order.createdAt).toLocaleDateString()}</td>
//                             <td>
//                                 {/* ⬅️ STATUS UPDATE DROPDOWN */}
//                                 <select 
//                                     value={order.status}
//                                     onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
//                                     className={`status-select status-${order.status.toLowerCase().replace(/\s/g, '-')}`}
//                                 >
//                                     {STATUS_OPTIONS.map(status => (
//                                         <option key={status} value={status}>{status}</option>
//                                     ))}
//                                 </select>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default AdminDashboard;
import React from 'react';
import { useAuth } from '../context/AuthContext'; // Import the Auth context
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    // Get the authenticated user's data and the logout function
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Use a local handler for logging out and redirecting
    const handleLogout = () => {
        logout(); // Clear token and user state
        navigate('/login'); // Redirect to the login page
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Admin Dashboard</h1>
                <nav>
                    <button onClick={() => navigate('/admin/orders')} style={styles.navButton}>
                        View Orders
                    </button>
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        Logout
                    </button>
                </nav>
            </header>
            
            <main style={styles.main}>
                <div style={styles.welcomeCard}>
                    <h2 style={styles.welcomeText}>
                        Welcome, {user ? user.username : 'Administrator'}!
                    </h2>
                    <p style={styles.roleText}>
                        Your Role: <strong style={{ color: '#007bff' }}>{user ? user.role.toUpperCase() : 'N/A'}</strong>
                    </p>
                    <p style={styles.infoText}>
                        This page is protected by the **ProtectedRoute** and is only accessible to users with the 'admin' role.
                    </p>
                </div>
                
                <section style={styles.section}>
                    <h3 style={styles.sectionTitle}>Dashboard Overview</h3>
                    <p>Place your admin-specific widgets, charts, and summary statistics here.</p>
                </section>
                
                <section style={styles.section}>
                    <h3 style={styles.sectionTitle}>Quick Links</h3>
                    <ul style={styles.list}>
                        <li><a href="/admin/products" style={styles.link}>Manage Products</a></li>
                        <li><a href="/admin/users" style={styles.link}>Manage Users</a></li>
                    </ul>
                </section>
            </main>
        </div>
    );
};

// Basic inline styles for demonstration
const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 0',
        borderBottom: '2px solid #eee',
        marginBottom: '20px',
    },
    title: {
        color: '#333',
        margin: 0,
    },
    navButton: {
        padding: '10px 15px',
        marginRight: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    logoutButton: {
        padding: '10px 15px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    main: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '20px',
    },
    welcomeCard: {
        padding: '30px',
        backgroundColor: '#e9ecef',
        borderRadius: '8px',
        borderLeft: '5px solid #007bff',
    },
    welcomeText: {
        margin: '0 0 10px 0',
        color: '#333',
    },
    roleText: {
        margin: '0 0 15px 0',
        fontSize: '1.1em',
    },
    infoText: {
        fontSize: '0.9em',
        color: '#6c757d',
    },
    section: {
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    sectionTitle: {
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
        marginBottom: '15px',
        color: '#007bff',
    },
    list: {
        listStyleType: 'none',
        padding: 0,
    },
    link: {
        display: 'block',
        padding: '8px 0',
        color: '#007bff',
        textDecoration: 'none',
    }
};

export default AdminDashboard;