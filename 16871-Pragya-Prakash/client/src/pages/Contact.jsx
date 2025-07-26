  import { useState } from 'react';
  import { motion } from 'framer-motion';
  import { useForm } from 'react-hook-form';
  import { 
    MapPin, 
    Phone, 
    Mail, 
    Clock, 
    Send,
    MessageSquare,
    User,
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff
  } from 'lucide-react';
  import api from '../utils/api';

  const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
      register,
      handleSubmit,
      formState: { errors, isDirty, touchedFields },
      reset,
      watch,
      trigger
    } = useForm({
      mode: 'onChange',
      defaultValues: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      }
    });

    // Watch form values for real-time validation
    const watchedValues = watch();

    const onSubmit = async (data) => {
      setIsSubmitting(true);
      setSubmitStatus(null);
      
      try {
        const response = await api.post('/contacts/submit', data);
        
        if (response.data.success) {
          setSubmitStatus('success');
          reset();
          
          // Reset status after 5 seconds
          setTimeout(() => setSubmitStatus(null), 5000);
        } else {
          setSubmitStatus('error');
          setTimeout(() => setSubmitStatus(null), 5000);
        }
      } catch (error) {
        console.error('Contact submission error:', error);
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus(null), 5000);
      } finally {
        setIsSubmitting(false);
      }
    };

    // Validation patterns
    const patterns = {
      name: /^[a-zA-Z\s]{2,50}$/,
      email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      phone: /^(\+91[\-\s]?)?[789]\d{9}$/,
      message: /^[\s\S]{10,1000}$/
    };

    // Real-time validation trigger
    const handleInputChange = async (fieldName) => {
      if (touchedFields[fieldName]) {
        await trigger(fieldName);
      }
    };

    const contactInfo = [
      {
        icon: MapPin,
        title: 'Visit Us',
        details: [
          '123 Traditional Street',
          'Mumbai, Maharashtra 400001',
          'India'
        ]
      },
      {
        icon: Phone,
        title: 'Call Us',
        details: [
          '+91 98765 43210',
          '+91 98765 43211',
          'Mon-Sat: 9:00 AM - 8:00 PM'
        ]
      },
      {
        icon: Mail,
        title: 'Email Us',
        details: [
          'info@paramparafoods.com',
          'support@paramparafoods.com',
          'orders@paramparafoods.com'
        ]
      },
      {
        icon: Clock,
        title: 'Business Hours',
        details: [
          'Monday - Saturday: 9:00 AM - 8:00 PM',
          'Sunday: 10:00 AM - 6:00 PM',
          'Online orders: 24/7'
        ]
      }
    ];

    const faqs = [
      {
        question: "How long does delivery take?",
        answer: "Standard delivery takes 2-3 business days. Express delivery is available for same-day delivery in select areas."
      },
      {
        question: "Do you ship nationwide?",
        answer: "Yes, we ship to all major cities and towns across India. Delivery times may vary based on location."
      },
      {
        question: "Are your products vegetarian?",
        answer: "Most of our products are vegetarian. We clearly label all products with dietary information including vegetarian, vegan, and gluten-free options."
      },
      {
        question: "What is your return policy?",
        answer: "We offer a 7-day return policy for unopened products in their original packaging. Damaged or defective items are replaced immediately."
      },
      {
        question: "Do you offer bulk orders?",
        answer: "Yes, we offer special pricing for bulk orders and corporate gifting. Please contact us for custom quotes."
      }
    ];

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-orange-600 to-orange-700 text-white py-12 sm:py-16 md:py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                Get in Touch
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed px-4">
                We'd love to hear from you! Whether you have questions about our products, 
                need support, or want to share feedback, we're here to help.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-16">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="order-2 xl:order-1"
              >
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                      <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Send us a Message</h2>
                      <p className="text-sm sm:text-base text-gray-600">We'll get back to you within 24 hours</p>
                    </div>
                  </div>

                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <p className="text-green-700 text-sm sm:text-base">Thank you! Your message has been sent successfully.</p>
                      </div>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                        <p className="text-red-700 text-sm sm:text-base">Failed to send message. Please try again.</p>
                      </div>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            {...register('firstName', { 
                              required: 'First name is required',
                              pattern: {
                                value: patterns.name,
                                message: 'First name must be 2-50 characters and contain only letters'
                              },
                              minLength: {
                                value: 2,
                                message: 'First name must be at least 2 characters'
                              },
                              maxLength: {
                                value: 50,
                                message: 'First name cannot exceed 50 characters'
                              }
                            })}
                            onChange={(e) => {
                              register('firstName').onChange(e);
                              handleInputChange('firstName');
                            }}
                            className={`w-full pl-10 pr-3 py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 ${
                              errors.firstName 
                                ? 'border-red-300 bg-red-50' 
                                : watchedValues.firstName 
                                  ? 'border-green-300 bg-green-50' 
                                  : 'border-gray-300 hover:border-gray-400'
                            }`}
                            placeholder="Enter your first name"
                            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                          />
                        </div>
                        {errors.firstName && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            id="firstName-error"
                            className="mt-1 text-xs sm:text-sm text-red-600 flex items-center"
                          >
                            <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                            {errors.firstName.message}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            {...register('lastName', { 
                              required: 'Last name is required',
                              pattern: {
                                value: patterns.name,
                                message: 'Last name must be 2-50 characters and contain only letters'
                              },
                              minLength: {
                                value: 2,
                                message: 'Last name must be at least 2 characters'
                              },
                              maxLength: {
                                value: 50,
                                message: 'Last name cannot exceed 50 characters'
                              }
                            })}
                            onChange={(e) => {
                              register('lastName').onChange(e);
                              handleInputChange('lastName');
                            }}
                            className={`w-full pl-10 pr-3 py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 ${
                              errors.lastName 
                                ? 'border-red-300 bg-red-50' 
                                : watchedValues.lastName 
                                  ? 'border-green-300 bg-green-50' 
                                  : 'border-gray-300 hover:border-gray-400'
                            }`}
                            placeholder="Enter your last name"
                            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                          />
                        </div>
                        {errors.lastName && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            id="lastName-error"
                            className="mt-1 text-xs sm:text-sm text-red-600 flex items-center"
                          >
                            <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                            {errors.lastName.message}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          {...register('email', { 
                            required: 'Email address is required',
                            pattern: {
                              value: patterns.email,
                              message: 'Please enter a valid email address'
                            },
                            validate: {
                              noSpaces: (value) => !value.includes(' ') || 'Email address cannot contain spaces',
                              validDomain: (value) => {
                                const domain = value.split('@')[1];
                                return domain && domain.includes('.') || 'Please enter a valid email domain';
                              }
                            }
                          })}
                          onChange={(e) => {
                            register('email').onChange(e);
                            handleInputChange('email');
                          }}
                          className={`w-full pl-10 pr-3 py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 ${
                            errors.email 
                              ? 'border-red-300 bg-red-50' 
                              : watchedValues.email && !errors.email
                                ? 'border-green-300 bg-green-50' 
                                : 'border-gray-300 hover:border-gray-400'
                          }`}
                          placeholder="Enter your email address"
                          aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                      </div>
                      {errors.email && (
                        <motion.p 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          id="email-error"
                          className="mt-1 text-xs sm:text-sm text-red-600 flex items-center"
                        >
                          <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                          {errors.email.message}
                        </motion.p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-gray-500 text-xs">(Optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          {...register('phone', {
                            pattern: {
                              value: patterns.phone,
                              message: 'Please enter a valid Indian phone number (10 digits starting with 7, 8, or 9)'
                            },
                            validate: {
                              validFormat: (value) => {
                                if (!value) return true; // Optional field
                                const cleanValue = value.replace(/[\s\-\(\)]/g, '');
                                return /^(\+91)?[789]\d{9}$/.test(cleanValue) || 'Invalid phone number format';
                              }
                            }
                          })}
                          onChange={(e) => {
                            register('phone').onChange(e);
                            handleInputChange('phone');
                          }}
                          className={`w-full pl-10 pr-3 py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 ${
                            errors.phone 
                              ? 'border-red-300 bg-red-50' 
                              : watchedValues.phone && !errors.phone
                                ? 'border-green-300 bg-green-50' 
                                : 'border-gray-300 hover:border-gray-400'
                          }`}
                          placeholder="+91 98765 43210"
                          aria-describedby={errors.phone ? 'phone-error' : undefined}
                        />
                      </div>
                      {errors.phone && (
                        <motion.p 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          id="phone-error"
                          className="mt-1 text-xs sm:text-sm text-red-600 flex items-center"
                        >
                          <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                          {errors.phone.message}
                        </motion.p>
                      )}
                    </div>

                    {/* Subject Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('subject', { 
                          required: 'Please select a subject',
                          validate: {
                            notEmpty: (value) => value !== '' || 'Please select a subject'
                          }
                        })}
                        onChange={(e) => {
                          register('subject').onChange(e);
                          handleInputChange('subject');
                        }}
                        className={`w-full px-3 py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 ${
                          errors.subject 
                            ? 'border-red-300 bg-red-50' 
                            : watchedValues.subject 
                              ? 'border-green-300 bg-green-50' 
                              : 'border-gray-300 hover:border-gray-400'
                        }`}
                        aria-describedby={errors.subject ? 'subject-error' : undefined}
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Support</option>
                        <option value="product">Product Information</option>
                        <option value="feedback">Feedback</option>
                        <option value="partnership">Partnership</option>
                        <option value="complaint">Complaint</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.subject && (
                        <motion.p 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          id="subject-error"
                          className="mt-1 text-xs sm:text-sm text-red-600 flex items-center"
                        >
                          <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                          {errors.subject.message}
                        </motion.p>
                      )}
                    </div>

                    {/* Message Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <textarea
                          {...register('message', { 
                            required: 'Message is required',
                            minLength: {
                              value: 10,
                              message: 'Message must be at least 10 characters long'
                            },
                            maxLength: {
                              value: 1000,
                              message: 'Message cannot exceed 1000 characters'
                            },
                            validate: {
                              notOnlySpaces: (value) => {
                                const trimmed = value.trim();
                                return trimmed.length >= 10 || 'Message must contain meaningful content';
                              }
                            }
                          })}
                          onChange={(e) => {
                            register('message').onChange(e);
                            handleInputChange('message');
                          }}
                          rows={5}
                          className={`w-full px-3 py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 resize-none ${
                            errors.message 
                              ? 'border-red-300 bg-red-50' 
                              : watchedValues.message && !errors.message
                                ? 'border-green-300 bg-green-50' 
                                : 'border-gray-300 hover:border-gray-400'
                          }`}
                          placeholder="Tell us how we can help you... (Minimum 10 characters)"
                          aria-describedby={errors.message ? 'message-error' : 'message-help'}
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                          {watchedValues.message?.length || 0}/1000
                        </div>
                      </div>
                      {errors.message && (
                        <motion.p 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          id="message-error"
                          className="mt-1 text-xs sm:text-sm text-red-600 flex items-center"
                        >
                          <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                          {errors.message.message}
                        </motion.p>
                      )}
                      {!errors.message && watchedValues.message && (
                        <p id="message-help" className="mt-1 text-xs sm:text-sm text-gray-500">
                          Message looks good! ({watchedValues.message.length} characters)
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || Object.keys(errors).length > 0}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6 sm:space-y-8 order-1 xl:order-2"
              >
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                        <info.icon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{info.title}</h3>
                        <div className="space-y-1">
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-sm sm:text-base text-gray-600">{detail}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">
                Find answers to common questions about our products and services
              </p>
            </motion.div>

            <div className="space-y-4 sm:space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-4 sm:p-6"
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Find Us
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">
                Visit our store to experience the authentic taste of traditional Indian foods
              </p>
            </motion.div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-64 sm:h-80 md:h-96 bg-gray-200 flex items-center justify-center">
                <div className="text-center p-4">
                  <MapPin className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm sm:text-base text-gray-600">Interactive map will be displayed here</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    123 Traditional Street, Mumbai, Maharashtra 400001, India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  export default Contact; 