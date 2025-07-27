import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

// Enhanced Input Field Component - Memoized to prevent re-renders
const InputField = ({ 
  name, 
  label, 
  type = 'text', 
  icon: Icon, 
  showToggle = false,
  toggleState = false,
  onToggle = () => {},
  maxLength = null,
  value,
  onChange,
  onBlur,
  hasError,
  isValid,
  errorMessage
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} *
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 ${hasError ? 'text-red-400' : isValid ? 'text-green-400' : 'text-gray-400'}`} />
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          maxLength={maxLength}
          className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
            hasError 
              ? 'border-red-500 bg-red-50' 
              : isValid 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300'
          }`}
          placeholder={label}
        />
        {/* Success/Error icons */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {showToggle ? (
            <button
              type="button"
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-600"
            >
              {toggleState ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          ) : (
            <>
              {hasError && <XCircle className="h-5 w-5 text-red-400" />}
              {isValid && <CheckCircle className="h-5 w-5 text-green-400" />}
            </>
          )}
        </div>
      </div>
      {/* Error message */}
      {hasError && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {errorMessage}
        </p>
      )}
      {/* Success message */}
      {isValid && (
        <p className="mt-1 text-sm text-green-600 flex items-center">
          <CheckCircle className="h-4 w-4 mr-1" />
          {name === 'password' ? 'Strong password' : 'Valid input'}
        </p>
      )}
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation patterns
  const validationPatterns = useMemo(() => ({
    firstName: /^[A-Za-z]{3,}$/,
    lastName: /^[A-Za-z]{3,}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^[6-9]\d{9}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  }), []);

  // Error messages
  const errorMessages = useMemo(() => ({
    firstName: 'First name must be at least 3 characters and contain only letters',
    lastName: 'Last name must be at least 3 characters and contain only letters',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid 10-digit Indian mobile number',
    password: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
    confirmPassword: 'Passwords do not match'
  }), []);

  // Real-time validation function
  const validateField = useCallback((name, value) => {
    if (!value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!validationPatterns[name].test(value)) {
          return errorMessages[name];
        }
        break;
      
      case 'email':
        if (!validationPatterns.email.test(value)) {
          return errorMessages.email;
        }
        break;
      
      case 'phone':
        if (!validationPatterns.phone.test(value)) {
          return errorMessages.phone;
        }
        break;
      
      case 'password':
        if (!validationPatterns.password.test(value)) {
          return errorMessages.password;
        }
        break;
      
      case 'confirmPassword':
        if (value !== formData.password) {
          return errorMessages.confirmPassword;
        }
        break;
    }
    
    return '';
  }, [validationPatterns, errorMessages, formData.password]);

  // Handle input change with real-time validation
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Convert email to lowercase
    if (name === 'email') {
      processedValue = value.toLowerCase();
    }

    // Only allow letters for first and last name
    if (name === 'firstName' || name === 'lastName') {
      processedValue = value.replace(/[^A-Za-z]/g, '');
    }

    // Only allow numbers for phone
    if (name === 'phone') {
      processedValue = value.replace(/\D/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Real-time validation - only if field has been touched
    if (touched[name]) {
      const error = validateField(name, processedValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [touched, validateField]);

  // Handle field blur (mark as touched and validate)
  const handleFieldBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [validateField]);

  // Validate entire form
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validateField]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true
    });

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      console.log('Attempting to register user...');
      // Register the user
      const result = await register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        password: formData.password
      });

      console.log('Registration result:', result);

      if (result.success) {
        // Registration successful, navigate to OTP verification
        console.log('Registration successful, navigating to OTP verification');
        navigate('/verify-otp', { 
          state: { 
            userId: result.userId, 
            email: formData.email 
          } 
        });
      } else {
        // Registration failed, show error
        console.log('Registration failed:', result.error);
        setErrors({ general: result.error || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      // Show backend validation errors if present
      if (error.response?.data?.errors) {
        const newErrors = {};
        error.response.data.errors.forEach(err => {
          // Map backend field names to frontend field names if needed
          if (err.param === 'name') {
            newErrors.firstName = err.msg;
            newErrors.lastName = err.msg;
          } else if (err.param === 'email') {
            newErrors.email = err.msg;
          } else if (err.param === 'password') {
            newErrors.password = err.msg;
          } else if (err.param === 'phone') {
            newErrors.phone = err.msg;
          } else {
            newErrors[err.param] = err.msg;
          }
        });
        setErrors(newErrors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, register, navigate]);

  // Memoized password requirements
  const passwordRequirements = useMemo(() => {
    const password = formData.password;
    return [
      { text: 'At least 8 characters', met: password.length >= 8 },
      { text: 'One lowercase letter', met: /[a-z]/.test(password) },
      { text: 'One uppercase letter', met: /[A-Z]/.test(password) },
      { text: 'One number', met: /\d/.test(password) },
      { text: 'One special character (@$!%*?&)', met: /[@$!%*?&]/.test(password) }
    ];
  }, [formData.password]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">
            Join Parampara Foods and discover authentic traditional flavors
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
        >
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                name="firstName"
                label="First Name"
                icon={User}
                maxLength={20}
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={handleFieldBlur}
                hasError={!!errors.firstName && touched.firstName}
                isValid={touched.firstName && !errors.firstName && formData.firstName}
                errorMessage={errors.firstName}
              />
              <InputField
                name="lastName"
                label="Last Name"
                icon={User}
                maxLength={20}
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={handleFieldBlur}
                hasError={!!errors.lastName && touched.lastName}
                isValid={touched.lastName && !errors.lastName && formData.lastName}
                errorMessage={errors.lastName}
              />
            </div>

            <InputField
              name="email"
              label="Email Address"
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
              hasError={!!errors.email && touched.email}
              isValid={touched.email && !errors.email && formData.email}
              errorMessage={errors.email}
            />

            <InputField
              name="phone"
              label="Phone Number"
              type="tel"
              icon={Phone}
              maxLength={10}
              value={formData.phone}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
              hasError={!!errors.phone && touched.phone}
              isValid={touched.phone && !errors.phone && formData.phone}
              errorMessage={errors.phone}
            />

            <InputField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              showToggle={true}
              toggleState={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
              hasError={!!errors.password && touched.password}
              isValid={touched.password && !errors.password && formData.password}
              errorMessage={errors.password}
            />

            <InputField
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              icon={Lock}
              showToggle={true}
              toggleState={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
              hasError={!!errors.confirmPassword && touched.confirmPassword}
              isValid={touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword}
              errorMessage={errors.confirmPassword}
            />

            {/* Password requirements */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {passwordRequirements.map((req, index) => (
                  <li key={index} className={`flex items-center ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
                    <CheckCircle className={`h-3 w-3 mr-1 ${req.met ? 'text-green-500' : 'text-gray-400'}`} />
                    {req.text}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Sign in to your account
              </Link>
            </div>
          </div>

          {/* Terms and Privacy */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-orange-600 hover:text-orange-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-orange-600 hover:text-orange-500">
                Privacy Policy
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
