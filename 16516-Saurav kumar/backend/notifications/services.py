"""
SMS notification services for Crime Report Portal.
"""

import logging
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from twilio.rest import Client
from twilio.base.exceptions import TwilioException

logger = logging.getLogger(__name__)


class SMSService:
    """
    Base SMS service class.
    """
    
    def __init__(self):
        self.provider = getattr(settings, 'SMS_PROVIDER', 'twilio')
    
    def send_sms(self, to_number, message, from_number=None):
        """
        Send SMS message.
        
        Args:
            to_number (str): Recipient phone number
            message (str): SMS message content
            from_number (str): Sender phone number (optional)
            
        Returns:
            dict: Result with success status and message
        """
        raise NotImplementedError("Subclasses must implement send_sms")


class TwilioSMSService(SMSService):
    """
    Twilio SMS service implementation.
    """
    
    def __init__(self):
        super().__init__()
        
        # Get Twilio credentials from settings
        self.account_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', '')
        self.auth_token = getattr(settings, 'TWILIO_AUTH_TOKEN', '')
        self.from_number = getattr(settings, 'TWILIO_PHONE_NUMBER', '')
        
        if not self.account_sid or not self.auth_token:
            raise ImproperlyConfigured(
                "Twilio credentials not configured. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in settings."
            )
        
        if not self.from_number:
            raise ImproperlyConfigured(
                "Twilio phone number not configured. Please set TWILIO_PHONE_NUMBER in settings."
            )
        
        # Initialize Twilio client
        try:
            self.client = Client(self.account_sid, self.auth_token)
        except Exception as e:
            logger.error(f"Failed to initialize Twilio client: {e}")
            raise
    
    def send_sms(self, to_number, message, from_number=None):
        """
        Send SMS using Twilio.
        
        Args:
            to_number (str): Recipient phone number (with country code)
            message (str): SMS message content
            from_number (str): Sender phone number (optional, uses default if not provided)
            
        Returns:
            dict: Result with success status, message, and Twilio SID if successful
        """
        try:
            # Use default from number if not provided
            sender_number = from_number or self.from_number
            
            # Validate phone number format
            if not self._validate_phone_number(to_number):
                return {
                    'success': False,
                    'message': 'Invalid phone number format. Please include country code.',
                    'error': 'INVALID_PHONE_NUMBER'
                }
            
            # Send SMS via Twilio
            message_obj = self.client.messages.create(
                body=message,
                from_=sender_number,
                to=to_number
            )
            
            logger.info(f"SMS sent successfully to {to_number}. SID: {message_obj.sid}")
            
            return {
                'success': True,
                'message': 'SMS sent successfully',
                'sid': message_obj.sid,
                'status': message_obj.status
            }
            
        except TwilioException as e:
            error_msg = f"Twilio SMS error: {str(e)}"
            logger.error(error_msg)
            return {
                'success': False,
                'message': error_msg,
                'error': 'TWILIO_ERROR',
                'twilio_error_code': getattr(e, 'code', None)
            }
            
        except Exception as e:
            error_msg = f"Unexpected error sending SMS: {str(e)}"
            logger.error(error_msg)
            return {
                'success': False,
                'message': error_msg,
                'error': 'UNEXPECTED_ERROR'
            }
    
    def _validate_phone_number(self, phone_number):
        """
        Basic phone number validation.
        
        Args:
            phone_number (str): Phone number to validate
            
        Returns:
            bool: True if valid format
        """
        import re
        
        # Basic E.164 format validation (country code + number)
        pattern = r'^\+[1-9]\d{1,14}$'
        return bool(re.match(pattern, phone_number))
    
    def get_message_status(self, message_sid):
        """
        Get the status of a sent message.
        
        Args:
            message_sid (str): Twilio message SID
            
        Returns:
            dict: Message status information
        """
        try:
            message = self.client.messages(message_sid).fetch()
            return {
                'success': True,
                'status': message.status,
                'direction': message.direction,
                'date_created': message.date_created,
                'date_sent': message.date_sent,
                'error_code': message.error_code,
                'error_message': message.error_message
            }
        except TwilioException as e:
            logger.error(f"Error fetching message status: {e}")
            return {
                'success': False,
                'message': str(e)
            }


class MockSMSService(SMSService):
    """
    Mock SMS service for testing and development.
    """
    
    def send_sms(self, to_number, message, from_number=None):
        """
        Mock SMS sending for development/testing.
        """
        logger.info(f"[MOCK SMS] To: {to_number}, From: {from_number or 'DEFAULT'}, Message: {message}")
        
        return {
            'success': True,
            'message': 'Mock SMS sent successfully (development mode)',
            'sid': 'mock_sid_12345',
            'status': 'delivered'
        }


def get_sms_service():
    """
    Factory function to get the appropriate SMS service.
    
    Returns:
        SMSService: Configured SMS service instance
    """
    provider = getattr(settings, 'SMS_PROVIDER', 'twilio')
    
    if provider == 'twilio':
        try:
            return TwilioSMSService()
        except ImproperlyConfigured:
            logger.warning("Twilio not properly configured, falling back to mock service")
            return MockSMSService()
    elif provider == 'mock':
        return MockSMSService()
    else:
        logger.warning(f"Unknown SMS provider: {provider}, using mock service")
        return MockSMSService() 