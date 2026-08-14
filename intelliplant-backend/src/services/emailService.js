const resend = require('../config/resend');

const sendVerificationEmail = async (toEmail, code) => {
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: toEmail,
        subject: 'Verify your email',
        html: `<p>Your verification code is: <strong>${code}</strong></p>`
    });
};

module.exports = { sendVerificationEmail };