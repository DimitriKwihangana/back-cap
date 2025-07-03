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

        const verificationLink = `http://localhost:5000/verify-email?token=${token}`;
        const mailOptions = {
            from: `"Aflakiosk Training" <${process.env.EMAIL}>`,
            to: email,
            subject: 'Welcome to Aflakiosk Learning Platform – Food Safety Course Access',
            html: `
            <div style="font-family: Arial, sans-serif; background-color: #ffffff; color: #000000; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; max-width: 600px; margin: auto;">
              <div style="text-align: center; padding-bottom: 20px;">
                
              
              </div>
              <h2 style="color: #2e7d32;">Welcome to Aflakiosk Learning Platform, ${username}!</h2>
              <p>We’re excited to have you join our <strong>Food Safety Training Program</strong>. This course is designed to empower you with the knowledge and practices necessary to ensure food safety across every stage of the value chain.</p>
          
              <h3 style="color: #2e7d32;">Your Account Credentials:</h3>
              <ul style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; list-style-type: none;">
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Password:</strong> ${password}</li>
              </ul>
          
              <p style="margin-top: 20px;">To get started, please log in to your account using the button below:</p>
          
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://learning-platform-front-end.vercel.app/login" style="background-color: #2e7d32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Account</a>
              </div>
          
              <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:contact@aflakiosk.com" style="color: #2e7d32;">contact@aflakiosk.com</a>.</p>
          
              <hr style="margin: 30px 0;" />
          
              <p style="font-size: 14px; color: #666;">Aflakiosk – Empowering Agriculture Through Data and Learning<br/>
              © ${new Date().getFullYear()} Aflakiosk. All rights reserved.</p>
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
