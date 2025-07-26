# Twilio SMS Setup Guide

This guide will help you set up Twilio SMS functionality for the Crime Report Portal.

## Prerequisites

1. A Twilio account (sign up at [twilio.com](https://www.twilio.com))
2. A verified phone number in your Twilio account
3. Your Twilio Account SID and Auth Token

## Step 1: Get Twilio Credentials

1. Log in to your Twilio Console at [console.twilio.com](https://console.twilio.com)
2. Find your Account SID and Auth Token on the dashboard
3. Note down these values - you'll need them for configuration

## Step 2: Get a Twilio Phone Number

1. In the Twilio Console, go to "Phone Numbers" → "Manage" → "Active numbers"
2. Click "Get a trial number" or "Buy a number"
3. Choose a number that supports SMS capabilities
4. Note down the phone number (e.g., +1234567890)

## Step 3: Configure Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Twilio SMS Settings
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your-actual-account-sid
TWILIO_AUTH_TOKEN=your-actual-auth-token
TWILIO_PHONE_NUMBER=+your-twilio-phone-number
```

Replace the placeholder values with your actual Twilio credentials.

## Step 4: Install Dependencies

Install the Twilio Python package:

```bash
pip install twilio==8.10.0
```

Or update your requirements.txt and run:

```bash
pip install -r requirements.txt
```

## Step 5: Test SMS Functionality

### Option 1: Using Django Management Command

```bash
python manage.py test_sms +1234567890 "Test message from Crime Portal"
```

### Option 2: Using the Web Interface

1. Start your Django server: `python manage.py runserver`
2. Navigate to `/notifications/test-sms/`
3. Enter a phone number with country code (e.g., +1234567890)
4. Enter a test message
5. Click "Send Test SMS"

### Option 3: Using the API

```bash
curl -X POST http://localhost:8000/notifications/api/test-sms/ \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+1234567890",
    "message": "Test SMS from Crime Portal API"
  }'
```

## Step 6: Verify Configuration

The test page will show the status of your Twilio configuration:

- ✅ **Account SID**: Configured
- ✅ **Auth Token**: Configured  
- ✅ **Phone Number**: +1234567890

## Troubleshooting

### Common Issues

1. **"Invalid phone number format"**
   - Make sure to include country code (e.g., +1 for US, +91 for India)
   - Use E.164 format: +[country code][number]

2. **"Twilio credentials not configured"**
   - Check that your `.env` file exists and has the correct variables
   - Restart your Django server after updating environment variables

3. **"SMS sending failed"**
   - Verify your Twilio account has sufficient credits
   - Check that your phone number supports SMS
   - Ensure the recipient number is valid

4. **"Authentication failed"**
   - Double-check your Account SID and Auth Token
   - Make sure there are no extra spaces or characters

### Development Mode

For development and testing, the system will fall back to a mock SMS service if Twilio is not properly configured. This allows you to test the application without sending actual SMS messages.

## Security Notes

- Never commit your `.env` file to version control
- Keep your Twilio Auth Token secure
- Use environment variables for all sensitive configuration
- Consider using Twilio's test credentials for development

## Cost Considerations

- Twilio charges per SMS sent
- Rates vary by country and carrier
- Check [Twilio's pricing page](https://www.twilio.com/sms/pricing) for current rates
- Consider setting up usage alerts in your Twilio console

## Production Deployment

For production deployment:

1. Use a production Twilio account (not trial)
2. Set up proper error monitoring
3. Configure webhook endpoints for delivery status
4. Implement rate limiting
5. Set up usage alerts and billing notifications

## Support

If you encounter issues:

1. Check the Django logs for detailed error messages
2. Verify your Twilio console for any error codes
3. Consult the [Twilio documentation](https://www.twilio.com/docs)
4. Check the Django admin interface for notification status 