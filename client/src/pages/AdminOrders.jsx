// // src/pages/AdminOrders.jsx

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext.jsx';

// const AdminOrders = () => {
//     // FIX 1: Initialize orders state to an empty array to prevent map() on undefined.
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { getAuthHeader } = useAuth();
//     const authHeader = getAuthHeader(); // Get the Authorization: Bearer <token> header

//     const fetchOrders = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             // GET request with Authorization header
//             const res = await axios.get('/api/orders', authHeader); 
            
//             // FIX 2: Check the shape of the response data.
//             // If backend sends [{...}, {...}] (array directly):
//             const fetchedOrders = Array.isArray(res.data) 
//                                 ? res.data 
//             // If backend sends { orders: [{...}, {...}] } (nested object):
//                                 : res.data.orders || []; 

//             setOrders(fetchedOrders);
            
//         } catch (err) {
//             setError('Failed to fetch orders. Token may be invalid or expired.');
//             console.error(err.response || err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Example handler for PATCH/DELETE
//     const handleUpdateStatus = async (id, newStatus) => {
//         try {
//             // NOTE: Ensure your Mongoose ID is used here, not a placeholder 'order.id'
//             await axios.patch(`/api/orders/${id}`, { status: newStatus }, authHeader);
//             fetchOrders(); // Refresh the list
//         } catch (err) {
//             alert('Failed to update order.');
//             console.error(err.response || err);
//         }
//     }
    
//     // Example handler for DELETE
//     const handleDelete = async (id) => {
//         if (!window.confirm('Are you sure you want to delete this order?')) return;
//         try {
//             await axios.delete(`/api/orders/${id}`, authHeader);
//             fetchOrders(); // Refresh the list
//         } catch (err) {
//             alert('Failed to delete order.');
//             console.error(err.response || err);
//         }
//     }


//     useEffect(() => {
//         // Only fetch if the auth header token exists (optional, but good practice)
//         if (authHeader.headers && authHeader.headers.Authorization) {
//             fetchOrders();
//         } else {
//             setLoading(false);
//             setError('Authentication token is missing. Please log in.');
//         }
//     }, [authHeader.headers?.Authorization]); // Rerun if the token changes

//     if (loading) return <p>Loading orders...</p>;
//     if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
    
//     // FIX 3: Safety check before mapping (though initialized to [] this is good practice)
//     if (!orders || orders.length === 0) return <p>No orders found in the database.</p>;

//     return (
//         <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
//             <h2>⭐ Admin: All Orders ({orders.length})</h2>
//             <p>This content is only visible if the user is successfully logged in and the API verified the token.</p>
            
//             {/* The .map() is now guaranteed to run on an array */}
//             {orders.map(order => (
//                 // FIX 4: Use MongoDB's _id for the key and API calls
//                 <div key={order._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px' }}>
                    
//                     <p>
//                         <strong>Order ID:</strong> {order._id} 
//                         <br/>
//                         <strong>Customer:</strong> {order.customerName} | 
//                         <strong>Student ID:</strong> {order.studentId}
//                         <br/>
//                         <strong>Item:</strong> **{order.itemName}** (Size: {order.size}) | 
//                         <strong>Total:</strong> {order.itemPrice * order.quantity} MMK
//                         <br/>
//                         <strong>Current Status:</strong> <span style={{ color: order.status === 'Confirmed' ? 'green' : 'orange' }}>{order.status}</span>
//                     </p>

//                     <p>
//                         <a 
//                             href={order.paymentProofImageURL} 
//                             target="_blank" 
//                             rel="noopener noreferrer"
//                             style={{marginRight: '10px'}}
//                         >
//                             View Payment Proof
//                         </a>
//                     </p>

//                     <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
//                         {order.status !== 'Confirmed' && (
//                             <button 
//                                 onClick={() => handleUpdateStatus(order._id, 'Confirmed')}
//                                 style={{ backgroundColor: 'green', color: 'white' }}
//                             >
//                                 Mark Confirmed
//                             </button>
//                         )}
//                         {order.status !== 'Delivered' && (
//                             <button 
//                                 onClick={() => handleUpdateStatus(order._id, 'Delivered')}
//                                 style={{ backgroundColor: 'blue', color: 'white' }}
//                             >
//                                 Mark Delivered
//                             </button>
//                         )}
//                         <button 
//                             onClick={() => handleDelete(order._id)}
//                             style={{ backgroundColor: 'red', color: 'white' }}
//                         >
//                             Delete Order
//                         </button>
//                     </div>

//                 </div>
//             ))}
//         </div>
//     );
// };

// export default AdminOrders;

// src/pages/AdminOrders.jsx (Regenerated with Tailwind)

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext.jsx';

// const AdminOrders = () => {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { getAuthHeader, logout } = useAuth(); // Added logout
//     const authHeader = getAuthHeader(); 

//     const fetchOrders = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const res = await axios.get('/api/orders', authHeader); 
            
//             // Assume the backend sends the array directly (res.data)
//             const fetchedOrders = Array.isArray(res.data) 
//                                 ? res.data 
//                                 : res.data.orders || []; 

//             setOrders(fetchedOrders);
            
//         } catch (err) {
//             // Check for 401/403 errors which indicate token issues
//             if (err.response && (err.response.status === 401 || err.response.status === 403)) {
//                 setError('Session expired or access denied. Please log in again.');
//                 logout(); // Log out the user automatically
//             } else {
//                 setError('Failed to fetch orders. Internal server error.');
//                 console.error(err.response || err);
//             }
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     const handleUpdateStatus = async (id, newStatus) => {
//         try {
//             await axios.patch(`/api/orders/${id}`, { status: newStatus }, authHeader);
//             fetchOrders(); // Refresh the list
//         } catch (err) {
//             alert('Failed to update order. Check console for details.');
//             console.error(err.response || err);
//         }
//     }
    
//     const handleDelete = async (id) => {
//         if (!window.confirm('Are you absolutely sure you want to delete this order? This action is permanent and notifies the customer of cancellation.')) return;
//         try {
//             await axios.delete(`/api/orders/${id}`, authHeader);
//             fetchOrders(); // Refresh the list
//         } catch (err) {
//             alert('Failed to delete order. Check console for details.');
//             console.error(err.response || err);
//         }
//     }

//     useEffect(() => {
//         if (authHeader.headers && authHeader.headers.Authorization) {
//             fetchOrders();
//         } else {
//             setLoading(false);
//             setError('Authentication token is missing. Please log in.');
//         }
//     }, [authHeader.headers?.Authorization]); 

//     // Helper for status colors
//     const getStatusColor = (status) => {
//         switch (status) {
//             case 'Confirmed':
//                 return 'bg-green-100 text-green-800';
//             case 'Pending':
//                 return 'bg-yellow-100 text-yellow-800';
//             case 'Delivered':
//                 return 'bg-blue-100 text-blue-800';
//             default:
//                 return 'bg-gray-100 text-gray-800';
//         }
//     };

//     if (loading) return <p className="text-center mt-10 text-lg text-indigo-600">Loading orders...</p>;
//     if (error) return <p className="text-center mt-10 text-lg text-red-600 font-bold">Error: {error}</p>;
//     if (!orders || orders.length === 0) return <p className="text-center mt-10 text-lg text-gray-500">No orders found in the database.</p>;

//     return (
//         <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg min-h-screen">
//             <div className="flex justify-between items-center mb-6 border-b pb-4">
//                 <h2 className="text-3xl font-extrabold text-gray-900">
//                     ⭐ Admin Dashboard ({orders.length} Orders)
//                 </h2>
//                 <button
//                     onClick={logout}
//                     className="py-2 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition duration-150 shadow-md"
//                 >
//                     Logout
//                 </button>
//             </div>
            
//             <div className="space-y-6">
//                 {orders.map(order => (
//                     <div 
//                         key={order._id} 
//                         className="p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition duration-200 bg-white"
//                     >
//                         <div className="flex justify-between items-start mb-3">
//                             <h3 className="text-xl font-semibold text-gray-800">
//                                 Order ID: #{order._id.substring(18).toUpperCase()}
//                             </h3>
//                             <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
//                                 {order.status}
//                             </span>
//                         </div>
                        
//                         <div className="text-sm text-gray-600 space-y-1">
//                             <p><strong>Customer:</strong> {order.customerName} (ID: {order.studentId})</p>
//                             <p><strong>Item:</strong> {order.itemName} (Size: {order.size}, Qty: {order.quantity})</p>
//                             <p><strong>Total:</strong> <span className="text-green-600 font-bold">{order.itemPrice * order.quantity} MMK</span></p>
//                             <p><strong>Payment:</strong> {order.paymentMethod}</p>
//                             <a 
//                                 href={order.paymentProofImageURL} 
//                                 target="_blank" 
//                                 rel="noopener noreferrer"
//                                 className="text-indigo-600 hover:text-indigo-800 font-medium underline block mt-2"
//                             >
//                                 View Payment Proof
//                             </a>
//                         </div>

//                         <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
//                             {order.status !== 'Confirmed' && order.status !== 'Delivered' && (
//                                 <button 
//                                     onClick={() => handleUpdateStatus(order._id, 'Confirmed')}
//                                     className="py-2 px-4 text-sm font-medium rounded-lg text-white bg-green-500 hover:bg-green-600 transition shadow-md"
//                                 >
//                                     Confirm Payment
//                                 </button>
//                             )}
//                             {order.status === 'Confirmed' && (
//                                 <button 
//                                     onClick={() => handleUpdateStatus(order._id, 'Delivered')}
//                                     className="py-2 px-4 text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition shadow-md"
//                                 >
//                                     Mark Delivered
//                                 </button>
//                             )}
//                             <button 
//                                 onClick={() => handleDelete(order._id)}
//                                 className="py-2 px-4 text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 transition shadow-md"
//                             >
//                                 Delete/Cancel
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default AdminOrders;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 🚨 PAGINATION STATE ADDED 🚨
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0); // Total count for display
    const ordersPerPage = 5; // Must match the default limit in your backend route

    const { getAuthHeader, logout } = useAuth(); 
    const authHeader = getAuthHeader(); 

    // 🚨 UPDATED: Accepts pageNumber parameter 🚨
    const fetchOrders = async (pageNumber) => {
        setLoading(true);
        setError(null);
        try {
            // API call now includes pagination query parameters
            const res = await axios.get(`/api/orders?page=${pageNumber}&limit=${ordersPerPage}`, authHeader); 
            
            // Assuming backend returns an object with orders array and metadata: { orders: [...], page: 1, totalPages: 5, totalResults: 50 }
            setOrders(res.data.orders);
            setCurrentPage(res.data.page);
            setTotalPages(res.data.totalPages);
            setTotalResults(res.data.totalResults);
            
        } catch (err) {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError('Session expired or access denied. Redirecting to login.');
                logout(); 
            } else {
                setError('Failed to fetch orders. Internal server error.');
            }
            console.error(err.response || err);
        } finally {
            setLoading(false);
        }
    };
    
    // 🚨 NEW: Handler for page change 🚨
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            fetchOrders(page); // Fetch data for the new page
        }
    };
    
    // UPDATED: Refresh current page after action
    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await axios.patch(`/api/orders/${id}`, { status: newStatus }, authHeader);
            fetchOrders(currentPage); // Refresh the current page list
        } catch (err) {
            alert('Failed to update order. Check console for details.');
            console.error(err.response || err);
        }
    }
    
    // UPDATED: Refresh current page after action
    const handleDelete = async (id) => {
        if (!window.confirm('Are you absolutely sure you want to delete this order? This action is permanent and notifies the customer of cancellation.')) return;
        try {
            await axios.delete(`/api/orders/${id}`, authHeader);
            // After deletion, refresh the current page, or go back if the page becomes empty
            fetchOrders(currentPage); 
        } catch (err) {
            alert('Failed to delete order. Check console for details.');
            console.error(err.response || err);
        }
    }

    // UPDATED: Calls fetchOrders with the current page state
    useEffect(() => {
        if (authHeader.headers?.Authorization) {
            fetchOrders(currentPage);
        } else {
            setLoading(false);
            setError('Authentication token is missing. Please log in.');
        }
    }, [authHeader.headers?.Authorization]); 

    // Helper for status colors (unchanged)
    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Delivered':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <p className="text-center mt-10 text-lg text-indigo-600">Loading orders...</p>;
    if (error) return <p className="text-center mt-10 text-lg text-red-600 font-bold">Error: {error}</p>;
    if (totalResults === 0) return <p className="text-center mt-10 text-lg text-gray-500">No orders found in the database.</p>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg min-h-screen">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-3xl font-extrabold text-gray-900">
                    ⭐ Admin Dashboard (<span className="text-indigo-600">{totalResults}</span> Total Orders)
                </h2>
                <button
                    onClick={logout}
                    className="py-2 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition duration-150 shadow-md"
                >
                    Logout
                </button>
            </div>
            
            {/* 🚨 PAGINATION CONTROLS UI 🚨 */}
            <div className="flex justify-center items-center space-x-4 mt-6 mb-8">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="px-4 py-2 border rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition duration-150"
                >
                    Previous
                </button>
                <span className="text-gray-700 font-semibold">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="px-4 py-2 border rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition duration-150"
                >
                    Next
                </button>
            </div>
            
            <div className="space-y-6">
                {orders.length > 0 ? (
                    orders.map(order => (
                        <div 
                            key={order._id} 
                            className="p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition duration-200 bg-white"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Order ID: #{order._id.substring(18).toUpperCase()}
                                </h3>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                            
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><strong>Customer:</strong> {order.customerName} (ID: {order.studentId})</p>
                                <p><strong>Item:</strong> {order.itemName} (Size: {order.size}, Qty: {order.quantity})</p>
                                <p><strong>Total:</strong> <span className="text-green-600 font-bold">{order.itemPrice * order.quantity} MMK</span></p>
                                <p><strong>Payment:</strong> {order.paymentMethod}</p>
                                <a 
                                    href={order.paymentProofImageURL} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 font-medium underline block mt-2"
                                >
                                    View Payment Proof
                                </a>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
                                {order.status !== 'Confirmed' && order.status !== 'Delivered' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(order._id, 'Confirmed')}
                                        className="py-2 px-4 text-sm font-medium rounded-lg text-white bg-green-500 hover:bg-green-600 transition shadow-md"
                                    >
                                        Confirm Payment
                                    </button>
                                )}
                                {order.status === 'Confirmed' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                                        className="py-2 px-4 text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition shadow-md"
                                    >
                                        Mark Delivered
                                    </button>
                                )}
                                <button 
                                    onClick={() => handleDelete(order._id)}
                                    className="py-2 px-4 text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 transition shadow-md"
                                >
                                    Delete/Cancel
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    // This case handles a successful fetch that returned zero orders for the current page
                    <p className="text-center mt-10 text-gray-500">No orders found on page {currentPage}.</p>
                )}
            </div>
            
            {/* 🚨 PAGINATION FOOTER 🚨 */}
            {totalResults > 0 && (
                <div className="flex justify-center items-center space-x-4 mt-8 pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500">
                        Showing <span className="font-semibold">{orders.length}</span> results on this page. 
                        Total orders in system: <span className="font-semibold">{totalResults}</span>
                    </span>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;