
const Batch = require('../models/batch');
const User = require('../models/User'); 
const Order = require('../models/Order');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});


const sendBatchTestResultsEmail = async (batchData) => {
    try {
        
        const userEmail = batchData.userName;

        
        if (!userEmail || !userEmail.includes('@')) {
            console.log('⚠️ Invalid email address for batch test results:', batchData.batchId);
            console.log('Email provided:', userEmail);
            return;
        }

        
        const getSafetyInfo = (aflatoxin) => {
            const level = parseFloat(aflatoxin) || 0;
            
            if (level >= 0 && level <= 5) {
                return { 
                    level: 'Safe for Children', 
                    icon: '✅', 
                    color: '#059669', 
                    bgColor: '#d1fae5',
                    message: 'Excellent! Your grain meets the highest safety standards and is safe for all consumers including children.' 
                };
            } else if (level > 5 && level <= 10) {
                return { 
                    level: 'Adults Only', 
                    icon: '⚠️', 
                    color: '#d97706', 
                    bgColor: '#fef3c7',
                    message: 'Your grain is safe for adult consumption but should not be given to children.' 
                };
            } else if (level > 10 && level <= 20) {
                return { 
                    level: 'Animal Feed Only', 
                    icon: '🔶', 
                    color: '#ea580c', 
                    bgColor: '#fed7aa',
                    message: 'This grain should only be used for animal feed and not for human consumption.' 
                };
            } else {
                return { 
                    level: 'Not Safe for Use', 
                    icon: '🚨', 
                    color: '#dc2626', 
                    bgColor: '#fecaca',
                    message: 'This grain does not meet safety standards and should not be used for consumption or feed.' 
                };
            }
        };

        const safetyInfo = getSafetyInfo(batchData.aflatoxin);

        const emailSubject = `🧪 Batch Test Results - ${batchData.batchId}`;
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .batch-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
                    .safety-alert { padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; background: ${safetyInfo.bgColor}; border: 2px solid ${safetyInfo.color}; }
                    .results-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
                    .result-item { background: white; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e5e7eb; }
                    .parameter-name { font-weight: bold; color: #374151; margin-bottom: 5px; }
                    .parameter-value { font-size: 18px; font-weight: bold; color: #1f2937; }
                    .parameter-unit { font-size: 14px; color: #6b7280; }
                    .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
                    .summary-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .highlight { color: #3b82f6; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🧪 Batch Test Results Complete</h1>
                        <p>Your grain quality analysis is ready</p>
                    </div>
                    
                    <div class="content">
                        <!-- Safety Alert -->
                        <div class="safety-alert">
                            <div style="font-size: 48px; margin-bottom: 10px;">${safetyInfo.icon}</div>
                            <h2 style="margin: 10px 0; color: ${safetyInfo.color};">${safetyInfo.level}</h2>
                            <p style="margin: 10px 0; color: #374151;">${safetyInfo.message}</p>
                        </div>

                        <!-- Batch Information -->
                        <div class="batch-info">
                            <h3>Batch Information</h3>
                            <p><strong>Batch ID:</strong> <span class="highlight">${batchData.batchId}</span></p>
                            <p><strong>Supplier:</strong> ${batchData.supplier}</p>
                            <p><strong>Test Date:</strong> ${new Date(batchData.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric'
                            })}</p>
                            <p><strong>Tested by:</strong> ${userEmail}</p>
                        </div>

                        <!-- Test Results Grid -->
                        <h3>Detailed Test Results</h3>
                        <div class="results-grid">
                            <div class="result-item">
                                <div class="parameter-name">Moisture Content</div>
                                <div class="parameter-value">${batchData.moisture_maize_grain}<span class="parameter-unit">%</span></div>
                            </div>
                            <div class="result-item">
                                <div class="parameter-name">Aflatoxin Level</div>
                                <div class="parameter-value" style="color: ${safetyInfo.color};">${batchData.aflatoxin}<span class="parameter-unit">ppb</span></div>
                            </div>
                            <div class="result-item">
                                <div class="parameter-name">Immature Grains</div>
                                <div class="parameter-value">${batchData.Immaturegrains}<span class="parameter-unit">%</span></div>
                            </div>
                            <div class="result-item">
                                <div class="parameter-name">Discolored Grains</div>
                                <div class="parameter-value">${batchData.Discolored_grains}<span class="parameter-unit">%</span></div>
                            </div>
                            <div class="result-item">
                                <div class="parameter-name">Broken Kernels</div>
                                <div class="parameter-value">${batchData.broken_kernels_percent_maize_grain}<span class="parameter-unit">%</span></div>
                            </div>
                            <div class="result-item">
                                <div class="parameter-name">Foreign Matter</div>
                                <div class="parameter-value">${batchData.foreign_matter_percent_maize_grain}<span class="parameter-unit">%</span></div>
                            </div>
                            <div class="result-item">
                                <div class="parameter-name">Pest Damaged</div>
                                <div class="parameter-value">${batchData.pest_damaged}<span class="parameter-unit">%</span></div>
                            </div>
                            <div class="result-item">
                                <div class="parameter-name">Rotten Grains</div>
                                <div class="parameter-value">${batchData.rotten}<span class="parameter-unit">%</span></div>
                            </div>
                            <div class="result-item">
                                <div class="parameter-name">Live Infestation</div>
                                <div class="parameter-value">${batchData.Liveinfestation === 1 ? 'Yes' : 'No'}</div>
                            </div>
                            <div class="result-item">
                                <div class="parameter-name">Abnormal Odours</div>
                                <div class="parameter-value">${batchData.abnormal_odours_maize_grain === 1 ? 'Present' : 'None'}</div>
                            </div>
                        </div>

                        <!-- Summary and Recommendations -->
                        <div class="summary-box">
                            <h3>Quality Summary</h3>
                            <p>Your grain batch <strong>${batchData.batchId}</strong> has been thoroughly tested and analyzed. The most critical factor for food safety is the aflatoxin level, which measures at <strong>${batchData.aflatoxin} ppb</strong>.</p>
                            
                            ${batchData.aflatoxin <= 10 ? `
                            <p style="color: #059669;"><strong>✅ Good News:</strong> Your grain meets acceptable safety standards for human consumption. Consider listing it on our marketplace to reach potential buyers.</p>
                            ` : `
                            <p style="color: #dc2626;"><strong>⚠️ Important:</strong> Due to elevated aflatoxin levels, this grain has limited use applications. Please follow the safety guidelines above.</p>
                            `}
                        </div>

                        <!-- Action Buttons -->
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/batches" class="cta-button">
                                View Your Batches
                            </a>
                            ${batchData.aflatoxin <= 10 ? `
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/marketplace/list" class="cta-button" style="background: #059669; margin-left: 10px;">
                                List on Marketplace
                            </a>
                            ` : ''}
                        </div>

                        <!-- Footer Information -->
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h4 style="margin-top: 0; color: #374151;">📋 Next Steps</h4>
                            <ul style="color: #6b7280; padding-left: 20px;">
                                <li>Review your batch results in your dashboard</li>
                                <li>Store this information for your records</li>
                                ${batchData.aflatoxin <= 10 ? '<li>Consider listing high-quality batches on our marketplace</li>' : '<li>Follow appropriate handling guidelines for this grain</li>'}
                                <li>Contact our support team if you have questions about these results</li>
                            </ul>
                        </div>

                        <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
                            Thank you for using our grain quality testing service. These results are based on standardized testing procedures and current food safety guidelines.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: `"Grain Quality Lab" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: emailSubject,
            html: emailHtml
        });

        console.log('✅ Batch test results email sent to user:', userEmail);

    } catch (error) {
        console.error('❌ Error sending batch test results email:', error);
        // Don't throw error to prevent batch creation from failing
    }
};

// Send order notification to seller
// Note: userName field contains the seller's email address
const sendOrderNotificationToSeller = async (order, batch) => {
    try {
        // userName contains the email address
        const sellerEmail = batch.userName;

        // Basic email validation
        if (!sellerEmail || !sellerEmail.includes('@')) {
            console.log('⚠️ Invalid seller email address for batch:', batch.batchId);
            console.log('Email provided:', sellerEmail);
            return;
        }

        const emailSubject = `🛒 New Order Received - ${order.orderId}`;
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
                    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
                    .info-item { background: white; padding: 15px; border-radius: 6px; }
                    .cta-button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
                    .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; background: #fef3c7; color: #d97706; }
                    .highlight { font-size: 24px; font-weight: bold; color: #10b981; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🛒 New Order Received!</h1>
                        <p>You have a new order for your grain batch</p>
                    </div>
                    
                    <div class="content">
                        <div class="order-info">
                            <h2>Order Details</h2>
                            <p><strong>Order ID:</strong> ${order.orderId}</p>
                            <p><strong>Batch:</strong> ${batch.batchId} (${batch.supplier})</p>
                            <p><strong>Buyer:</strong> ${order.buyerName}</p>
                            <p><strong>Buyer Email:</strong> ${order.buyerEmail}</p>
                            ${order.buyerContact ? `<p><strong>Buyer Phone:</strong> ${order.buyerContact}</p>` : ''}
                            <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                            
                            <div class="status-badge">⏳ Status: Pending Your Confirmation</div>
                        </div>

                        <h3>Order Summary</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <strong>Quantity Ordered</strong><br>
                                <span class="highlight">${order.quantityOrdered} kg</span>
                            </div>
                            <div class="info-item">
                                <strong>Price per kg</strong><br>
                                <span class="highlight">${order.pricePerKg} Rwf</span>
                            </div>
                            <div class="info-item">
                                <strong>Total Amount</strong><br>
                                <span class="highlight">${order.totalAmount.toLocaleString()} Rwf</span>
                            </div>
                            <div class="info-item">
                                <strong>Remaining Stock</strong><br>
                                <span>${batch.availableQuantity} kg</span>
                            </div>
                        </div>

                        ${order.deliveryAddress ? `
                        <h3>Delivery Address</h3>
                        <div class="order-info">
                            <p>${order.deliveryAddress.street}</p>
                            <p>${order.deliveryAddress.city}${order.deliveryAddress.state ? `, ${order.deliveryAddress.state}` : ''}</p>
                            <p>${order.deliveryAddress.postalCode || ''} ${order.deliveryAddress.country}</p>
                        </div>
                        ` : ''}

                        ${order.notes ? `
                        <h3>Buyer Notes</h3>
                        <div class="order-info">
                            <p><em>"${order.notes}"</em></p>
                        </div>
                        ` : ''}

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders" class="cta-button">
                                Manage This Order
                            </a>
                        </div>

                        <p style="color: #666; font-size: 14px; margin-top: 30px;">
                            <strong>Next Steps:</strong><br>
                            1. Review the order details above<br>
                            2. Log into your dashboard to confirm or reject the order<br>
                            3. If confirmed, prepare the grain for shipment<br>
                            4. Update the order status to keep the buyer informed
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: `"Grain Marketplace" <${process.env.EMAIL_USER}>`,
            to: sellerEmail,
            subject: emailSubject,
            html: emailHtml
        });

        console.log('✅ Order notification email sent to seller:', sellerEmail);

    } catch (error) {
        console.error('❌ Error sending order notification to seller:', error);
        // Don't throw error to prevent order creation from failing
    }
};

// Function to send order status update to buyer
const sendOrderStatusUpdateToBuyer = async (order, newStatus, sellerNotes = '', trackingNumber = '', estimatedDelivery = '') => {
    try {
        const statusConfig = {
            pending: { label: 'Pending', icon: '⏳', color: '#d97706', description: 'Order received and awaiting confirmation' },
            confirmed: { label: 'Confirmed', icon: '✅', color: '#059669', description: 'Order confirmed and being prepared' },
            preparing: { label: 'Preparing', icon: '📦', color: '#7c3aed', description: 'Order is being prepared for shipment' },
            shipped: { label: 'Shipped', icon: '🚚', color: '#0891b2', description: 'Order has been shipped' },
            delivered: { label: 'Delivered', icon: '🎉', color: '#059669', description: 'Order successfully delivered' },
            rejected: { label: 'Rejected', icon: '❌', color: '#dc2626', description: 'Order has been rejected' },
            cancelled: { label: 'Cancelled', icon: '🚫', color: '#6b7280', description: 'Order has been cancelled' }
        };

        const status = statusConfig[newStatus] || statusConfig.pending;
        const emailSubject = `${status.icon} Order Update: ${order.orderId} - ${status.label}`;
        
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
                    .status-update { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid ${status.color}; }
                    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
                    .info-item { background: white; padding: 15px; border-radius: 6px; text-align: center; }
                    .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
                    .status-icon { font-size: 48px; margin-bottom: 10px; }
                    .tracking-box { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>${status.icon} Order Status Update</h1>
                        <p>Your order has been updated</p>
                    </div>
                    
                    <div class="content">
                        <div class="status-update">
                            <div class="status-icon">${status.icon}</div>
                            <h2 style="color: ${status.color}; margin: 0;">${status.label}</h2>
                            <p style="margin: 10px 0; color: #666;">${status.description}</p>
                        </div>

                        <div class="order-info">
                            <h3>Order Information</h3>
                            <div class="info-grid">
                                <div class="info-item">
                                    <strong>Order ID</strong><br>
                                    ${order.orderId}
                                </div>
                                <div class="info-item">
                                    <strong>Batch</strong><br>
                                    ${order.batchNumber}
                                </div>
                                <div class="info-item">
                                    <strong>Quantity</strong><br>
                                    ${order.quantityOrdered} kg
                                </div>
                                <div class="info-item">
                                    <strong>Total Amount</strong><br>
                                    ${order.totalAmount.toLocaleString()} Rwf
                                </div>
                            </div>
                            <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric'
                            })}</p>
                            <p><strong>Status Updated:</strong> ${new Date().toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                        </div>

                        ${trackingNumber ? `
                        <div class="tracking-box">
                            <h3 style="margin-top: 0;">📍 Tracking Information</h3>
                            <p><strong>Tracking Number:</strong> <span style="font-family: monospace; font-size: 18px; font-weight: bold;">${trackingNumber}</span></p>
                            ${estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(estimatedDelivery).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
                        </div>
                        ` : ''}

                        ${sellerNotes ? `
                        <div class="order-info">
                            <h3>Message from Seller</h3>
                            <p style="font-style: italic; color: #555;">"${sellerNotes}"</p>
                        </div>
                        ` : ''}

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-orders" class="cta-button">
                                View Order Details
                            </a>
                        </div>

                        ${newStatus === 'confirmed' ? `
                        <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h4 style="margin-top: 0; color: #059669;">🎉 Great News!</h4>
                            <p style="margin-bottom: 0;">Your order has been confirmed and will be prepared for shipment. You'll receive another update when it's ready to ship.</p>
                        </div>
                        ` : ''}

                        ${newStatus === 'shipped' ? `
                        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h4 style="margin-top: 0; color: #1d4ed8;">🚚 On Its Way!</h4>
                            <p style="margin-bottom: 0;">Your order is now on its way to you. Use the tracking number above to monitor its progress.</p>
                        </div>
                        ` : ''}

                        ${newStatus === 'delivered' ? `
                        <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h4 style="margin-top: 0; color: #059669;">🎉 Order Complete!</h4>
                            <p style="margin-bottom: 0;">Your order has been successfully delivered. Thank you for your business! We'd love to hear your feedback.</p>
                        </div>
                        ` : ''}

                        <p style="color: #666; font-size: 14px; margin-top: 30px;">
                            Thank you for choosing our grain marketplace. If you have any questions about your order, please contact the seller or our support team.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: `"Grain Marketplace" <${process.env.EMAIL_USER}>`,
            to: order.buyerEmail,
            subject: emailSubject,
            html: emailHtml
        });

        console.log(`✅ Status update email sent to buyer: ${order.buyerEmail} (${newStatus})`);

    } catch (error) {
        console.error('❌ Error sending status update email to buyer:', error);
        // Don't throw error to prevent status update from failing
    }
};

// Function to send notification emails
const sendMarketListingNotification = async (batch, listingUser) => {
    try {
        const targetUsers = await User.find({
            type: { $in: ['processor', 'institution'] },
            email: { $exists: true, $ne: null }
        });

        if (targetUsers.length === 0) {
            console.log('No target users found for email notification');
            return;
        }

        const emailSubject = `New Quality Grain Batch Available - ${batch.batchId}`;
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .batch-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
                    .quality-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
                    .quality-item { background: white; padding: 15px; border-radius: 6px; text-align: center; }
                    .cta-button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
                    .safety-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
                    .safe { background: #d4edda; color: #155724; }
                    .warning { background: #fff3cd; color: #856404; }
                    .danger { background: #f8d7da; color: #721c24; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🌾 New Quality Grain Batch Available!</h1>
                        <p>A new batch has been listed on the marketplace</p>
                    </div>
                    
                    <div class="content">
                        <div class="batch-info">
                            <h2>Batch Details</h2>
                            <p><strong>Batch ID:</strong> ${batch.batchId}</p>
                            <p><strong>Supplier:</strong> ${batch.supplier}</p>
                            <p><strong>Listed by:</strong> ${listingUser}</p>
                            <p><strong>Available Quantity:</strong> ${batch.availableQuantity} kg</p>
                            <p><strong>Price:</strong> ${batch.pricePerKg} Rwf/kg</p>
                            <p><strong>Total Value:</strong> ${(batch.availableQuantity * batch.pricePerKg).toFixed(2)} Rwf</p>
                            
                            ${getSafetyBadge(batch.aflatoxin)}
                        </div>

                        <h3>Quality Metrics</h3>
                        <div class="quality-grid">
                            <div class="quality-item">
                                <strong>Moisture</strong><br>
                                ${batch.moisture_maize_grain}%
                            </div>
                            <div class="quality-item">
                                <strong>Aflatoxin</strong><br>
                                ${batch.aflatoxin} ppb
                            </div>
                            <div class="quality-item">
                                <strong>Broken Kernels</strong><br>
                                ${batch.broken_kernels_percent_maize_grain}%
                            </div>
                            <div class="quality-item">
                                <strong>Foreign Matter</strong><br>
                                ${batch.foreign_matter_percent_maize_grain}%
                            </div>
                        </div>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/marketplace" class="cta-button">
                                View on Marketplace
                            </a>
                        </div>

                        <p style="color: #666; font-size: 14px; margin-top: 30px;">
                            This notification was sent because you are registered as a processor/institution in our system. 
                            <br>Visit our marketplace to view all available batches and place orders.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const emailPromises = targetUsers.map(user => {
            return transporter.sendMail({
                from: `"Grain Marketplace" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: emailSubject,
                html: emailHtml
            });
        });

        await Promise.all(emailPromises);
        console.log(`Notification emails sent to ${targetUsers.length} users`);

    } catch (error) {
        console.error('Error sending notification emails:', error);
    }
};

// Helper function to get safety badge HTML
const getSafetyBadge = (aflatoxin) => {
    const level = parseFloat(aflatoxin) || 0;
    
    if (level >= 0 && level <= 5) {
        return '<div class="safety-badge safe">✓ Safe for Children</div>';
    } else if (level > 5 && level <= 10) {
        return '<div class="safety-badge warning">⚠ Adults Only</div>';
    } else if (level > 10 && level <= 20) {
        return '<div class="safety-badge warning">🔶 Animal Feed Only</div>';
    } else {
        return '<div class="safety-badge danger">🚨 Not Safe for Use</div>';
    }
};

// Create a new batch - UPDATED with test results email
const createBatch = async (req, res) => {
    try {
        const batchData = {
            batchId: req.body.batchId,
            supplier: req.body.supplier,
            date: req.body.date,
            userId: req.body.userId,
            userName: req.body.userName,
            moisture_maize_grain: req.body.moisture_maize_grain,
            Immaturegrains: req.body.Immaturegrains,
            Discolored_grains: req.body.Discolored_grains,
            broken_kernels_percent_maize_grain: req.body.broken_kernels_percent_maize_grain,
            foreign_matter_percent_maize_grain: req.body.foreign_matter_percent_maize_grain,
            pest_damaged: req.body.pest_damaged,
            rotten: req.body.rotten,
            Liveinfestation: req.body.Liveinfestation,
            abnormal_odours_maize_grain: req.body.abnormal_odours_maize_grain,
            aflatoxin: req.body.aflatoxin,
            isOnMarket: req.body.isOnMarket || false,
            quantity: req.body.quantity || null,
            availableQuantity: req.body.quantity || null,
            pricePerKg: req.body.pricePerKg || null,
            marketListedAt: req.body.isOnMarket ? new Date() : null
        };

        const requiredFields = [
            'batchId', 'supplier', 'date', 'userId', 'userName',
            'moisture_maize_grain', 'Immaturegrains', 'Discolored_grains',
            'broken_kernels_percent_maize_grain', 'foreign_matter_percent_maize_grain',
            'pest_damaged', 'rotten', "aflatoxin"
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        if (req.body.Liveinfestation !== 0 && req.body.Liveinfestation !== 1) {
            return res.status(400).json({
                success: false,
                message: 'Liveinfestation must be 0 or 1'
            });
        }

        if (req.body.abnormal_odours_maize_grain !== 0 && req.body.abnormal_odours_maize_grain !== 1) {
            return res.status(400).json({
                success: false,
                message: 'abnormal_odours_maize_grain must be 0 or 1'
            });
        }

        if (req.body.isOnMarket) {
            if (!req.body.quantity || req.body.quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Quantity is required and must be greater than 0 when listing on market'
                });
            }
            if (!req.body.pricePerKg || req.body.pricePerKg <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Price per kg is required and must be greater than 0 when listing on market'
                });
            }
        }

        const newBatch = new Batch(batchData);
        const savedBatch = await newBatch.save();

        // 🆕 NEW: Send batch test results email to the user
        await sendBatchTestResultsEmail(batchData);

        // Send marketplace notification if listed on market
        if (req.body.isOnMarket) {
            // For marketplace notifications, use the actual userName (email) as the listing user identifier
            await sendMarketListingNotification(savedBatch, req.body.userName);
        }

        res.status(201).json({
            success: true,
            message: 'Batch created successfully and test results email sent',
            data: savedBatch
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating batch',
            error: error.message
        });
    }
};

// Put batch on market
const putBatchOnMarket = async (req, res) => {
    try {
        const batchId = req.params.id;
        const { quantity, pricePerKg } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity is required and must be greater than 0'
            });
        }

        if (!pricePerKg || pricePerKg <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Price per kg is required and must be greater than 0'
            });
        }

        const batch = await Batch.findById(batchId);
        
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found'
            });
        }

        if (batch.isOnMarket) {
            return res.status(400).json({
                success: false,
                message: 'Batch is already on the market'
            });
        }

        const updatedBatch = await Batch.findByIdAndUpdate(
            batchId,
            {
                isOnMarket: true,
                quantity: quantity,
                availableQuantity: quantity,
                pricePerKg: pricePerKg,
                marketListedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        await sendMarketListingNotification(updatedBatch, batch.userName);

        res.status(200).json({
            success: true,
            message: 'Batch successfully listed on market and notifications sent',
            data: updatedBatch
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error listing batch on market',
            error: error.message
        });
    }
};

// Remove batch from market
const removeBatchFromMarket = async (req, res) => {
    try {
        const batchId = req.params.id;

        const batch = await Batch.findById(batchId);
        
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found'
            });
        }

        if (!batch.isOnMarket) {
            return res.status(400).json({
                success: false,
                message: 'Batch is not currently on the market'
            });
        }

        const updatedBatch = await Batch.findByIdAndUpdate(
            batchId,
            {
                isOnMarket: false,
                marketListedAt: null
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Batch removed from market',
            data: updatedBatch
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error removing batch from market',
            error: error.message
        });
    }
};

// Get all available batches on market
const getMarketBatches = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            supplier, 
            minPrice, 
            maxPrice, 
            minQuantity,
            sortBy = 'marketListedAt',
            sortOrder = 'desc'
        } = req.query;
        
        let query = { isOnMarket: true, availableQuantity: { $gt: 0 } };
        
        if (supplier) query.supplier = { $regex: supplier, $options: 'i' };
        if (minPrice) query.pricePerKg = { ...query.pricePerKg, $gte: parseFloat(minPrice) };
        if (maxPrice) query.pricePerKg = { ...query.pricePerKg, $lte: parseFloat(maxPrice) };
        if (minQuantity) query.availableQuantity = { ...query.availableQuantity, $gte: parseFloat(minQuantity) };

        const sortObj = {};
        sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const batches = await Batch.find(query)
            .sort(sortObj)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-__v');

        const total = await Batch.countDocuments(query);

        res.status(200).json({
            success: true,
            data: batches,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching market batches',
            error: error.message
        });
    }
};

// Get market batch details by ID
const getMarketBatchById = async (req, res) => {
    try {
        const batch = await Batch.findOne({ 
            _id: req.params.id, 
            isOnMarket: true,
            availableQuantity: { $gt: 0 }
        });
        
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found on market or out of stock'
            });
        }

        res.status(200).json({
            success: true,
            data: batch
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching market batch',
            error: error.message
        });
    }
};


const updateBatchQuantity = async (req, res) => {
    console.log('🚀 NEW ORDER CREATION FUNCTION ACTIVATED');
    console.log('Route: POST /:id/purchase');
    console.log('Batch ID:', req.params.id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    try {
        const batchId = req.params.id;
        const { 
            quantityPurchased, 
            buyerUserId, 
            buyerUserName, 
            buyerEmail,
            buyerContact,
            deliveryAddress,
            notes 
        } = req.body;

        // Validation
        if (!quantityPurchased || quantityPurchased <= 0) {
            console.log('❌ Validation failed: Invalid quantity');
            return res.status(400).json({
                success: false,
                message: 'Quantity purchased must be greater than 0'
            });
        }

        if (!buyerUserId || !buyerUserName || !buyerEmail) {
            console.log('❌ Validation failed: Missing buyer info');
            return res.status(400).json({
                success: false,
                message: 'Buyer information (userId, userName, email) is required'
            });
        }

        // CRITICAL: Check if Order model is imported
        if (typeof Order === 'undefined') {
            console.log('❌ CRITICAL ERROR: Order model not imported!');
            console.log('Add this to top of your controller: const Order = require("../models/Order");');
            return res.status(500).json({
                success: false,
                message: 'Server error: Order model not available. Check server logs.'
            });
        }
        console.log('✅ Order model is available');

        // Find batch
        const batch = await Batch.findById(batchId);
        
        if (!batch) {
            console.log('❌ Batch not found with ID:', batchId);
            return res.status(404).json({
                success: false,
                message: 'Batch not found'
            });
        }
        console.log('✅ Batch found:', batch.batchId);

        if (!batch.isOnMarket) {
            console.log('❌ Batch not on market');
            return res.status(400).json({
                success: false,
                message: 'Batch is not available on market'
            });
        }

        if (batch.availableQuantity < quantityPurchased) {
            console.log('❌ Insufficient quantity');
            return res.status(400).json({
                success: false,
                message: `Insufficient quantity. Available: ${batch.availableQuantity}kg`
            });
        }
        console.log('✅ Quantity validation passed');

        const totalAmount = quantityPurchased * batch.pricePerKg;
        console.log('💰 Total amount calculated:', totalAmount);

        // Generate unique order ID
        const orderId = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
        console.log('🏷️ Generated order ID:', orderId);
        
        // Prepare order data
        const orderData = {
            orderId: orderId,
            batchId: batch._id,
            batchNumber: batch.batchId,
            sellerId: batch.userId,
            sellerName: batch.userName,
            buyerId: buyerUserId,
            buyerName: buyerUserName,
            buyerEmail: buyerEmail,
            buyerContact: buyerContact || '',
            quantityOrdered: quantityPurchased,
            pricePerKg: batch.pricePerKg,
            totalAmount: totalAmount,
            deliveryAddress: deliveryAddress || {},
            notes: notes || ''
        };

        console.log('📦 Creating order with data:', JSON.stringify(orderData, null, 2));

        // CREATE THE ORDER - THIS IS THE KEY PART!
        const newOrder = new Order(orderData);
        console.log('📝 Order instance created');

        const savedOrder = await newOrder.save();
        console.log('🎉 ORDER SUCCESSFULLY SAVED TO DATABASE!');
        console.log('Saved order ID:', savedOrder._id);
        console.log('Saved order number:', savedOrder.orderId);

        await sendOrderNotificationToSeller(savedOrder, batch);

        
        if (!savedOrder.orderId) {
            console.log('❌ CRITICAL: Order saved but orderId is missing!');
            return res.status(500).json({
                success: false,
                message: 'Error: Order created but ID generation failed'
            });
        }

        // Update batch quantity
        const newAvailableQuantity = batch.availableQuantity - quantityPurchased;
        console.log('📊 Updating batch quantity from', batch.availableQuantity, 'to', newAvailableQuantity);
        
        const updateData = {
            availableQuantity: newAvailableQuantity
        };

        // Remove from market if sold out
        if (newAvailableQuantity === 0) {
            updateData.isOnMarket = false;
            console.log('🚫 Batch sold out - removing from market');
        }

        const updatedBatch = await Batch.findByIdAndUpdate(
            batchId,
            updateData,
            { new: true, runValidators: true }
        );
        console.log('✅ Batch quantity updated successfully');

        // Prepare response data with ORDER included
        const responseData = {
            order: savedOrder,          // ← THIS IS WHAT WAS MISSING!
            batch: updatedBatch,
            purchaseDetails: {
                quantityPurchased,
                totalAmount: totalAmount,
                remainingQuantity: newAvailableQuantity
            }
        };

        console.log('🎯 Response data structure check:');
        console.log('- Has order?', !!responseData.order);
        console.log('- Order ID:', responseData.order?.orderId);
        console.log('- Has batch?', !!responseData.batch);
        console.log('- Has purchaseDetails?', !!responseData.purchaseDetails);

        const successMessage = newAvailableQuantity === 0 ? 
            'Order created successfully - Batch sold out and removed from market' : 
            'Order created successfully';

        console.log('🎉 SENDING SUCCESS RESPONSE:', successMessage);

        // Send success response
        res.status(200).json({
            success: true,
            message: successMessage,  // ← THIS MESSAGE WILL CHANGE!
            data: responseData
        });

    } catch (error) {
        console.log('💥 ERROR in order creation:', error.message);
        console.log('📄 Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Error processing order',
            error: error.message
        });
    }
};

// Get all batches
const getAllBatches = async (req, res) => {
    try {
        const { page = 1, limit = 10, supplier, userId } = req.query;
        
        let query = {};
        if (supplier) query.supplier = supplier;
        if (userId) query.userId = userId;

        const batches = await Batch.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Batch.countDocuments(query);

        res.status(200).json({
            success: true,
            data: batches,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching batches',
            error: error.message
        });
    }
};

// Get batch by ID
const getBatchById = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found'
            });
        }

        res.status(200).json({
            success: true,
            data: batch
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching batch',
            error: error.message
        });
    }
};

// Get batch by batchId
const getBatchByBatchId = async (req, res) => {
    try {
        const batch = await Batch.findOne({ batchId: req.params.batchId });
        
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found'
            });
        }

        res.status(200).json({
            success: true,
            data: batch
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching batch',
            error: error.message
        });
    }
};

// Update batch
const updateBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found'
            });
        }

        const updatedBatch = await Batch.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Batch updated successfully',
            data: updatedBatch
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating batch',
            error: error.message
        });
    }
};

// Delete batch
const deleteBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found'
            });
        }

        await Batch.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Batch deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting batch',
            error: error.message
        });
    }
};

// Get batches by user
const getBatchesByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { page = 1, limit = 10 } = req.query;

        const batches = await Batch.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Batch.countDocuments({ userId });

        res.status(200).json({
            success: true,
            data: batches,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user batches',
            error: error.message
        });
    }
};

// Order Management Functions

// Get all orders for batches owned by a specific user (seller)
const getOrdersForSeller = async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const { 
            page = 1, 
            limit = 10, 
            status, 
            sortBy = 'orderDate',
            sortOrder = 'desc',
            startDate,
            endDate
        } = req.query;

        let query = { sellerId };
        
        if (status) {
            query.status = status;
        }

        if (startDate || endDate) {
            query.orderDate = {};
            if (startDate) query.orderDate.$gte = new Date(startDate);
            if (endDate) query.orderDate.$lte = new Date(endDate);
        }

        const sortObj = {};
        sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const orders = await Order.find(query)
            .populate('batchId', 'batchId supplier aflatoxin moisture_maize_grain')
            .sort(sortObj)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Order.countDocuments(query);

        const stats = await Order.aggregate([
            { $match: { sellerId } },
            { 
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: orders,
            statistics: stats,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { status, sellerNotes, trackingNumber, estimatedDelivery } = req.body;
        const sellerId = req.body.sellerId;

        const validStatuses = ['pending', 'confirmed', 'rejected', 'preparing', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`
            });
        }

        const order = await Order.findOne({ orderId });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.sellerId !== sellerId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this order'
            });
        }

        const updateData = {
            status,
            sellerNotes: sellerNotes || order.sellerNotes,
            trackingNumber: trackingNumber || order.trackingNumber,
            estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : order.estimatedDelivery
        };

        const now = new Date();
        switch (status) {
            case 'confirmed':
                updateData.confirmedAt = now;
                break;
            case 'shipped':
                updateData.shippedAt = now;
                break;
            case 'delivered':
                updateData.deliveredAt = now;
                break;
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { orderId },
            updateData,
            { new: true, runValidators: true }
        ).populate('batchId', 'batchId supplier');

        if ((status === 'cancelled' || status === 'rejected') && order.status === 'pending') {
            await Batch.findByIdAndUpdate(
                order.batchId,
                { 
                    $inc: { availableQuantity: order.quantityOrdered },
                    isOnMarket: true
                }
            );
        }

        await sendOrderStatusUpdateToBuyer(
            updatedOrder, 
            status, 
            sellerNotes, 
            trackingNumber, 
            estimatedDelivery
        );

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            data: updatedOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
};

// Get specific order details
const getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const sellerId = req.query.sellerId;

        const order = await Order.findOne({ orderId })
            .populate('batchId', 'batchId supplier aflatoxin moisture_maize_grain broken_kernels_percent_maize_grain foreign_matter_percent_maize_grain');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (sellerId && order.sellerId !== sellerId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to view this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order details',
            error: error.message
        });
    }
};

// Get orders for a specific batch
const getOrdersForBatch = async (req, res) => {
    try {
        const batchId = req.params.batchId;
        const sellerId = req.query.sellerId;

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found'
            });
        }

        if (sellerId && batch.userId !== sellerId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to view orders for this batch'
            });
        }

        const orders = await Order.find({ batchId })
            .sort({ orderDate: -1 });

        res.status(200).json({
            success: true,
            data: orders,
            batch: {
                batchId: batch.batchId,
                supplier: batch.supplier,
                totalQuantity: batch.quantity,
                availableQuantity: batch.availableQuantity
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching batch orders',
            error: error.message
        });
    }
};

// Get orders for buyer
const getOrdersForBuyer = async (req, res) => {
    try {
        const buyerId = req.params.buyerId;
        const { page = 1, limit = 10, status } = req.query;

        let query = { buyerId };
        if (status) query.status = status;

        const orders = await Order.find(query)
            .populate('batchId', 'batchId supplier aflatoxin moisture_maize_grain')
            .sort({ orderDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching buyer orders',
            error: error.message
        });
    }
};

module.exports = {
    // Original batch functions
    createBatch,
    getAllBatches,
    getBatchById,
    getBatchByBatchId,
    updateBatch,
    deleteBatch,
    getBatchesByUser,
    
    // Marketplace functions
    putBatchOnMarket,
    removeBatchFromMarket,
    getMarketBatches,
    getMarketBatchById,
    updateBatchQuantity,
    
    // Order management functions
    getOrdersForSeller,
    updateOrderStatus,
    getOrderDetails,
    getOrdersForBatch,
    getOrdersForBuyer
};