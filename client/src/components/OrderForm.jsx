// // src/components/OrderForm.jsx

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../App.css'; // Assuming you have a CSS file for styling

// // --- 1. API Endpoints from Environment Variables ---
// // Vite automatically makes VITE_ prefixed variables available via import.meta.env
// // Ensure VITE_API_BASE_URL is set in your .env file
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // Construct the full endpoints
// const ORDER_API_ENDPOINT = `${API_BASE_URL}/orders`;
// const PRODUCT_API_ENDPOINT = `${API_BASE_URL}/product`;

// // --- OrderForm Component Definition ---

// const OrderForm = () => {
//     // --- 2. STATE MANAGEMENT ---
//     const [product, setProduct] = useState(null); // Stores fetched product data
//     const [formData, setFormData] = useState({
//         customerName: '',
//         customerEmail: '',
//         studentId: '',
//         size: '',
//         paymentMethod: '',
//         // FIX: If quantity is fixed at 1, you can remove it from state 
//         // OR keep it here but ensure the input field for size is selected before submit.
//         quantity: 1, 
//     });
//     const [file, setFile] = useState(null); // Stores the payment proof file object
//     const [isLoading, setIsLoading] = useState(true);
//     const [message, setMessage] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState(null);

//     // --- 3. FETCH PRODUCT DATA on Mount ---
//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 // FIX: Added timeout for better error handling
//                 const response = await axios.get(PRODUCT_API_ENDPOINT, { timeout: 10000 });
//                 // FIX: Assume the product data is directly in response.data
//                 setProduct(response.data); 
//             } catch (err) {
//                 const errMsg = err.code === 'ECONNABORTED' 
//                     ? 'Request timed out. Check your backend server status.' 
//                     : 'Failed to fetch product details. Ensure backend and product data are ready.';
//                 setError(errMsg);
//                 console.error('Product Fetch Error:', err.response?.data || err.message);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchProduct();
//     }, []);

//     // --- 4. HANDLERS ---
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleFileChange = (e) => {
//         // Store the actual file object from the input field
//         setFile(e.target.files[0]);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         setMessage('');

//         // --- Basic Validation ---
//         if (!formData.size) {
//             setMessage('❌ Please select a size.');
//             setIsSubmitting(false);
//             return;
//         }
//         if (!formData.paymentMethod) {
//             setMessage('❌ Please select a payment method.');
//             setIsSubmitting(false);
//             return;
//         }
//         if (!file) {
//             setMessage('❌ Payment proof image is required.');
//             setIsSubmitting(false);
//             return;
//         }

//         // Create multipart/form-data object required for file uploads
//         const submitData = new FormData();

//         // Append all form data fields
//         Object.keys(formData).forEach(key => {
//             submitData.append(key, formData[key]);
//         });

//         // Append product ID to tie the order to the correct item (Highly recommended)
//         submitData.append('productId', product._id); // Assuming product data has an _id field

//         // Append the file (key must match Multer config in orderRoutes: 'paymentProof')
//         submitData.append('paymentProof', file);
        
//         try {
//             // FIX: Added custom headers to ensure file upload is handled correctly
//             const response = await axios.post(ORDER_API_ENDPOINT, submitData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             setMessage(`✅ Order Success! ID: ${response.data._id}. Please check your email inbox.`);
            
//             // Reset form
//             setFormData({ customerName: '', customerEmail: '', studentId: '', size: '', paymentMethod: '', quantity: 1 }); 
//             setFile(null); 
//             // Reset file input element explicitly
//             document.getElementById('paymentProof').value = ''; 
            
//         } catch (error) {
//             const msg = error.response?.data?.message || 'Server error occurred.';
//             setMessage(`❌ Submission Failed: ${msg}`);
//             console.error('Submission Error:', error.response?.data || error);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // --- 5. RENDER LOGIC AND DATA DERIVATION ---
//     if (isLoading) return <div className="loading-spinner">Loading jersey details...</div>;
//     if (error) return <div className="error-message" style={{ color: 'red', padding: '20px' }}>{error}</div>;
//     if (!product) return <div className="error-message">No product data available.</div>;

//     // Filter media for display
//     const productImages = product.media.filter(m => m.type === 'image');
//     const productVideo = product.media.find(m => m.type === 'video');

//     // Derive dynamic data for payment selection
//     const paymentMethods = Object.keys(product.qrCodes); 
//     const selectedQRUrl = formData.paymentMethod 
//                             ? product.qrCodes[formData.paymentMethod] 
//                             : null;

//     // --- 6. JSX RENDER ---
//     return (
//         <div className="order-form-container">
//             <header className="product-header">
//                 <h1>{product.name}</h1>
//                 <p className="product-price">Price: **{product.price} MMK**</p>
//                 <p className="product-description">Description: {product.description}</p>
//             </header>
            
//             <section className="product-media-gallery">
//                 <h2>Product Gallery</h2>
//                 <div className="media-container">
//                     {/* Display all images */}
//                     {productImages.map((media, index) => (
//                         <img 
//                             key={index}
//                             // FIX: Ensure media.url is correctly formatted (e.g., handles relative vs. absolute paths)
//                             src={media.url} 
//                             alt={`${product.name} - View ${index + 1}`}
//                             className="product-image-thumb"
//                         />
//                     ))}

//                     {/* Display video if available */}
//                     {productVideo && (
//                         <video 
//                             src={productVideo.url} 
//                             controls 
//                             className="product-video"
//                             // FIX: Added loop and muted for better UX on load
//                             loop muted
//                         >
//                             Your browser does not support the video tag.
//                         </video>
//                     )}
//                 </div>
//             </section>
            
//             <hr />

//             <form onSubmit={handleSubmit} className="order-form">
                
//                 <fieldset>
//                     <legend>Customer & Order Details</legend>
//                     <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Full Name" required />
//                     <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder="Email" required />
//                     <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="Student ID" required />

//                     {/* Size Selection (Dynamic from DB) */}
//                     <select name="size" value={formData.size} onChange={handleChange} required>
//                         <option value="" disabled>Choose size</option>
//                         {product.availableSizes.map(s => (
//                             <option key={s} value={s}>{s}</option>
//                         ))}
//                     </select>
//                 </fieldset>

//                 <fieldset>
//                     <legend>Payment</legend>
//                     {/* Payment Method Selection (Dynamic from DB) */}
//                     <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
//                         <option value="" disabled>Select a payment method</option>
//                         {paymentMethods.map(method => (
//                             <option key={method} value={method}>{method}</option>
//                         ))}
//                     </select>
                    
//                     {/* DYNAMIC QR CODE DISPLAY */}
//                     <div className="qr-container">
//                         <h3>Payment QR Code</h3>
//                         {selectedQRUrl ? (
//                             <>
//                                 {/* FIX: Ensure the image source is correct */}
//                                 <img 
//                                     src={selectedQRUrl} 
//                                     alt={`${formData.paymentMethod} QR Code`} 
//                                     className="qr-image" 
//                                 /> 
//                                 <p>Scan the **{formData.paymentMethod}** QR code above to complete payment.</p>
//                             </>
//                         ) : (
//                             <p>Please select a payment method to view the QR code.</p>
//                         )}
//                     </div>
                    

// [Image of a QR code]


//                     {/* Payment Proof Upload */}
//                     <label htmlFor="paymentProof">Upload Payment Proof (Screenshot):</label>
//                     <input 
//                         type="file" 
//                         id="paymentProof" 
//                         name="paymentProof" 
//                         accept="image/png, image/jpeg, image/jpg" 
//                         onChange={handleFileChange} 
//                         required 
//                     />
//                 </fieldset>
                
//                 <button type="submit" disabled={isSubmitting}>
//                     {isSubmitting ? 'Submitting...' : 'Place Order'}
//                 </button>
//             </form>

//             <p className="response-message" style={{ color: message.startsWith('✅') ? 'green' : 'red' }}>
//                 {message}
//             </p>
//         </div>
//     );
// };

// export default OrderForm;

// src/components/OrderForm.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Assuming you have a CSS file for styling

// --- 1. API Endpoints from Environment Variables ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ORDER_API_ENDPOINT = `${API_BASE_URL}/orders`;
const PRODUCT_API_ENDPOINT = `${API_BASE_URL}/product`;
const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL || API_BASE_URL;

// --- OrderForm Component Definition ---

const OrderForm = () => {
    // --- 2. STATE MANAGEMENT ---
    const [product, setProduct] = useState(null); 
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        studentId: '',
        size: '',
        paymentMethod: '',
        quantity: 1, 
    });
    const [file, setFile] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // 🚨 NEW STATE FOR SLIDER FUNCTIONALITY 🚨
    const [currentSlide, setCurrentSlide] = useState(0); 

    // --- 3. FETCH PRODUCT DATA on Mount ---
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(PRODUCT_API_ENDPOINT, { timeout: 10000 });
                setProduct(response.data); 
            } catch (err) {
                const errMsg = err.code === 'ECONNABORTED' 
                    ? 'Request timed out. Check your backend server status.' 
                    : 'Failed to fetch product details. Ensure backend and product data are ready.';
                setError(errMsg);
                console.error('Product Fetch Error:', err.response?.data || err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, []);

    // --- 4. HANDLERS ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    
    // 🚨 NEW SLIDER HANDLER 🚨
    const handleSlideChange = (newIndex) => {
        const totalMedia = (product?.media || []).length;
        if (totalMedia === 0) return;
        
        // Loop back to start or end if boundaries are hit
        let nextIndex = newIndex;
        if (newIndex < 0) {
            nextIndex = totalMedia - 1;
        } else if (newIndex >= totalMedia) {
            nextIndex = 0;
        }
        setCurrentSlide(nextIndex);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        // --- Basic Validation ---
        if (!formData.size || !formData.paymentMethod || !file) {
             setMessage('❌ Please fill all required fields and upload payment proof.');
            setIsSubmitting(false);
            return;
        }

        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key]);
        });
        
        submitData.append('productId', product._id); 
        submitData.append('paymentProof', file);
        
        try {
            const response = await axios.post(ORDER_API_ENDPOINT, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage(`✅ Order Success! ID: ${response.data._id.substring(18).toUpperCase()}. Please check your email Inbox. Don't forget to check Spam box. We'll send you within 1 minute.`);
            
            // Reset form
            setFormData({ customerName: '', customerEmail: '', studentId: '', size: '', paymentMethod: '', quantity: 1 }); 
            setFile(null); 
            document.getElementById('paymentProof').value = ''; 
            
        } catch (error) {
            const msg = error.response?.data?.message || 'Server error occurred.';
            setMessage(`❌ Submission Failed: ${msg}`);
            console.error('Submission Error:', error.response?.data || error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- 5. RENDER LOGIC AND DATA DERIVATION ---
    if (isLoading) return <div className="loading-spinner">Loading jersey details...</div>;
    if (error) return <div className="error-message" style={{ color: 'red', padding: '20px' }}>{error}</div>;
    if (!product) return <div className="error-message">No product data available.</div>;

    // Combine all media into one array for the slider
    // const productMedia = product.media.filter(m => m.type === 'image' || m.type === 'video');
    // const currentMedia = productMedia[currentSlide];
    const productMedia = product.media.filter(m => m.type === 'image' || m.type === 'video');
const currentMedia = productMedia[currentSlide];

// 🚨 NEW: CALCULATE RESOLVED MEDIA URL HERE 🚨
let resolvedMediaUrl = '';
if (currentMedia) {
    const url = currentMedia.url;
    // Check if the URL is absolute (starts with http/https)
    if (url.startsWith('http')) {
        resolvedMediaUrl = url;
    } else {
        // If not absolute, prepend the base path
        resolvedMediaUrl = `${MEDIA_BASE_URL}/${url}`;
    }
}

    // Derive dynamic data for payment selection
    const paymentMethods = Object.keys(product.qrCodes); 
    const selectedQRUrl = formData.paymentMethod 
                            ? product.qrCodes[formData.paymentMethod] 
                            : null;

                            

    // --- 6. JSX RENDER ---
    return (
        <div className="order-form-container p-4 max-w-4xl mx-auto bg-white shadow-lg rounded-lg"> 
           
             <header className="product-header text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                
            </header>
            {/* 🚨 UPDATED MEDIA GALLERY WITH SLIDER 🚨 */}
            <section className="product-media-gallery">
                <h2 className="text-amber-500"><strong>Product Gallery</strong></h2>
                
                <div className="slider-container" style={{ position: 'relative', width: 'auto', height: 'auto', margin: '0 auto', overflow: 'hidden' }}>
                    
                    {/* Display Current Media */}
                    {currentMedia && (
                        <div className="current-media-item" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {currentMedia.type === 'image' ? (
                                <img 
                                    // 🚀 FIX APPLIED: Use the pre-calculated variable
                                    src={resolvedMediaUrl} 
                                    alt={`${product.name} - View ${currentSlide + 1}`}
                                    // Keeping old styles since they had no error
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                />
                            ) : (
                                <video 
                                    // 🚀 FIX APPLIED: Use the pre-calculated variable
                                    src={resolvedMediaUrl} 
                                    controls 
                                    className="product-video"
                                    loop muted
                                    // Keeping old styles since they had no error
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    )}

                    {/* Slider Controls (NO CHANGE) */}
                    {productMedia.length > 1 && (
                        <>
                            <button 
                                onClick={() => handleSlideChange(currentSlide - 1)}
                                className="slider-control prev"
                                style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', zIndex: 10 }}
                            >
                                &#10094;
                            </button>
                            <button 
                                onClick={() => handleSlideChange(currentSlide + 1)}
                                className="slider-control next"
                                style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', zIndex: 10 }}
                            >
                                &#10095;
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnail Indicators (NO CHANGE) */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', gap: '5px' }}>
                    {productMedia.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1px solid #333', background: currentSlide === index ? '#333' : '#fff', cursor: 'pointer' }}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

            </section>
             <header className="product-header text-center mb-6">
                {/* <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1> */}
                <p className="product-price text-xl font-semibold  mt-1">Price: {product.price} MMK</p>
                <p className="product-description text-gray-600 text-indigo-600 mt-2">{product.description}</p>
            </header>
            {/* ------------------------------------------------ */}
            
            <hr className="my-8 border-gray-200" />

            {/* 🚨 STYLED FORM START 🚨 */}
            <form onSubmit={handleSubmit} className="space-y-6 order-form">
                
                {/* Customer & Order Details */}
                <fieldset className="border border-gray-300 p-4 rounded-xl shadow-sm space-y-4">
                    <legend className="px-2 text-xl font-semibold text-gray-800">Customer & Order Details</legend>
                    
                    {/* Input Fields */}
                    <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Full Name" required 
                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />
                    
                    <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder="Email" required 
                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />
                    
                    <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="Student ID" required 
                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />

                    {/* Size Selection */}
                    <select name="size" value={formData.size} onChange={handleChange} required 
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 appearance-none">
                        <option value="" disabled>Choose size</option>
                        {product.availableSizes.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </fieldset>

                {/* Payment Fieldset */}
                <fieldset className="border border-gray-300 p-4 rounded-xl shadow-sm space-y-4">
                    <legend className="px-2 text-xl font-semibold text-gray-800">Payment</legend>
                    
                    {/* Payment Method Selection */}
                    <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required 
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 appearance-none">
                        <option value="" disabled>Select a payment method</option>
                        {paymentMethods.map(method => (
                            <option key={method} value={method}>{method}</option>
                        ))}
                    </select>
                    
                    {/* 🚨 DYNAMIC QR CODE & PAYMENT PROOF (Side-by-Side on Desktop) 🚨 */}
                    <div className="flex flex-col md:flex-row gap-4">
                        
                        {/* 1. DYNAMIC QR CODE DISPLAY */}
                        <div className="qr-container md:w-1/2 p-3 border border-gray-200 rounded-lg bg-gray-50 text-center">
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Payment QR Code</h3>
                            {selectedQRUrl ? (
                                <>
                                    <img 
                                        src={selectedQRUrl} 
                                        alt={`${formData.paymentMethod} QR Code`} 
                                        // 🚨 Reduced Size 🚨
                                        className="qr-image w-100 h-100 mx-auto object-contain border p-1 rounded-md" 
                                    /> 
                                    <p className="mt-2 text-sm text-gray-600">Scan the **{formData.paymentMethod}** QR code above.</p>
                                </>
                            ) : (
                                <p className="text-sm text-gray-500 p-8">Please select a payment method to view the QR code.</p>
                            )}
                        </div>
                        
                        {/* 2. Payment Proof Upload */}
                        <div className="md:w-1/2 space-y-2 flex flex-col justify-center border border-gray-200 p-3 rounded-lg bg-gray-50">
                            <label htmlFor="paymentProof" className="block text-md font-medium text-gray-700">
                                📸 Upload Payment Proof (Screenshot):
                            </label>
                            <input 
                                type="file" 
                                id="paymentProof" 
                                name="paymentProof" 
                                accept="image/png, image/jpeg, image/jpg" 
                                onChange={handleFileChange} 
                                required 
                                // Styled File Input
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                            />
                        </div>
                    </div>
                </fieldset>
                
                <button type="submit" disabled={isSubmitting}
                        className="w-full py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-lg disabled:bg-indigo-400">
                    {isSubmitting ? 'Submitting...' : '✅ Place Order'}
                </button>
            </form>
            {/* STYLED FORM END */}

            <p className="response-message text-center mt-4 font-medium" style={{ color: message.startsWith('✅') ? 'green' : 'red' }}>
                {message}
            </p>
        </div>
    );
};

export default OrderForm;
