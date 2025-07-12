const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token, password, username) => {
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
          to: email,
          subject: 'Welcome to Aflaguard – Monitor Aflatoxins & Access Premium Markets',
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #ffffff; color: #000000; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; max-width: 600px; margin: auto;">
              <div style="text-align: center; padding-bottom: 20px;">
                <!-- Optional: insert logo -->
              </div>
              <h2 style="color: #10B981;">Hello ${username}, Welcome to Aflaguard!</h2>
              <p>Thank you for signing up to <strong>Aflaguard</strong> – your trusted platform for tracking aflatoxin levels in maize grain and connecting to premium buyers who value food safety and quality.</p>
        
              <p style="margin-top: 20px;">To begin using Aflaguard, please log in to your account using the button below:</p>
        
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://aflaguard.vercel.app/login" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Account</a>
              </div>
        
              <p>Track your maize testing history, monitor aflatoxin results, and gain access to high-value markets — all from one dashboard.</p>
        
              <p>If you have any questions or need support, contact us at <a href="mailto:support@aflaguard.com" style="color: #10B981;">support@aflaguard.com</a>.</p>
        
              <hr style="margin: 30px 0;" />
        
              <p style="font-size: 14px; color: #666;">Aflaguard – Your Digital Shield Against Aflatoxins<br/>
              © ${new Date().getFullYear()} Aflaguard. All rights reserved.</p>
            </div>
          `,
        };
        
        
          

        await transporter.sendMail(mailOptions);
        console.log('Verification email sent');
    } catch (error) {
        console.error('Error sending verification email:', error.message);
    }
};

module.exports = { sendVerificationEmail };
