const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
    // 1. DEV-FRIENDLY FALLBACK
    // Agar env me SMTP set nahi hai, toh seedha terminal (console) mein email print kar do
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        console.log('\n--- EMAIL (dev mode) ---');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`HTML Content:\n${html}`);
        console.log('--- END EMAIL ---\n');
        
        // Yahin se wapas laut jao, aage nodemailer ko trigger mat karo
        return; 
    }

    // 2. ACTUAL EMAIL SENDING (Agar SMTP set hai)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false, // 465 port ke liye true hota hai, baaki ke liye false
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM || 'BizSphere <no-reply@bizsphere.com>',
        to,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
