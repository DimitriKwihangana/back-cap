const nodemailer = require('nodemailer');

const sendBatchTestingNotification = async (laboratoryEmail, userName, batchId, supplier, date) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Aflaguard Support" <${process.env.EMAIL}>`,
            to: laboratoryEmail,
            subject: 'New Batch Submitted for Aflatoxin Testing - Action Required',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #ffffff; color: #000000; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; max-width: 600px; margin: auto;">
                    <div style="text-align: center; padding-bottom: 20px;">
                        <!-- Optional: insert logo -->
                    </div>
                    
                    <h2 style="color: #10B981;">New Batch Testing Request</h2>
                    
                    <p>Hello,</p>
                    
                    <p>A new batch has been submitted for aflatoxin testing through the Aflaguard platform.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #333; margin-top: 0;">Batch Details:</h3>
                        <p><strong>Submitted by:</strong> ${userName}</p>
                        <p><strong>Batch ID:</strong> ${batchId}</p>
                        <p><strong>Supplier:</strong> ${supplier}</p>
                        <p><strong>Date Submitted:</strong> ${date}</p>
                    </div>
                    
                    <p>Please process this batch according to your standard testing procedures and update the results in the Aflaguard system once testing is complete.</p>
                    
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="https://aflaguard.vercel.app/laboratory" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Access Laboratory Portal</a>
                    </div>
                    
                    <p>If you have any questions about this batch or need additional information, please contact us at <a href="mailto:support@aflaguard.com" style="color: #10B981;">support@aflaguard.com</a>.</p>
                    
                    <hr style="margin: 30px 0;" />
                    
                    <p style="font-size: 14px; color: #666;">Aflaguard – Your Digital Shield Against Aflatoxins<br/>
                    © ${new Date().getFullYear()} Aflaguard. All rights reserved.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Batch testing notification sent to laboratory');
    } catch (error) {
        console.error('Error sending batch testing notification:', error.message);
    }
};

module.exports = { sendBatchTestingNotification };