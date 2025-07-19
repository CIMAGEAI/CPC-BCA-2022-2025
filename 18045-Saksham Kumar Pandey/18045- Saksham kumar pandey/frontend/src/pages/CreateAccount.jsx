import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateAccount = () => {
  console.log("✅ CreateAccount component loaded");

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic front-end validation (optional)
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    if (!BACKEND_URL) {
      toast.error("Backend URL not set in .env");
      console.log("❌ VITE_BACKEND_URL is undefined");
      return;
    }

    try {
      console.log("📡 Sending request to:", `${BACKEND_URL}/api/user/register`);
      console.log("🧾 Data being sent:", formData);

      const res = await axios.post(`${BACKEND_URL}/api/user/register`, formData);

      console.log("✅ Server response:", res.data);

      if (res.data.success) {
        toast.success('Account created successfully!');
        navigate('/login');
      } else {
        toast.error(res.data.message || 'Registration failed.');
      }
    } catch (error) {
      toast.error('Something went wrong!');
      console.error("❌ Error while registering:", error.response?.data || error.message);
    }
  };

  return (
    <div className='min-h-[70vh] flex items-center justify-center'>
      <form onSubmit={handleSubmit} className='bg-white p-6 rounded shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-4'>Create Your Account</h2>

        <input
          type='text'
          name='name'
          placeholder='Full Name'
          value={formData.name}
          onChange={handleChange}
          className='w-full p-2 mb-3 border rounded'
          required
        />

        <input
          type='email'
          name='email'
          placeholder='Email'
          value={formData.email}
          onChange={handleChange}
          className='w-full p-2 mb-3 border rounded'
          required
        />

        <input
          type='date'
          name='dob'
          value={formData.dob}
          onChange={handleChange}
          className='w-full p-2 mb-3 border rounded'
          required
        />

        <input
          type='password'
          name='password'
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
          className='w-full p-2 mb-4 border rounded'
          required
        />

        <button
          type='submit'
          className='bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition'
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;