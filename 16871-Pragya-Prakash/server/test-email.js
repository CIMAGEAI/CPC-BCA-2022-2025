require('dotenv').config();
const { sendEmail, generateOTP } = require('./config/emailService');

async function testEmailService() {
  console.log('Testing email service...');
  
  // Test OTP generation
  const otp = generateOTP();
  console.log('Generated OTP:', otp);
  
  // Test email sending
  const testEmail = process.env.EMAIL_USER; // Send to yourself for testing
  
  if (!testEmail) {
    console.error('Please set EMAIL_USER in your .env file');
    return;
  }
  
  try {
    const result = await sendEmail(testEmail, 'otpVerification', {
      otp,
      userName: 'Test User'
    });
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.error('❌ Email sending failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Email service error:', error.message);
  }
}

// Run the test
testEmailService(); 