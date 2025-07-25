import React, { useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ThemeContext } from '../../context/ThemeContext';

const AddFaculty = () => {
  const { darkMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    password: '',
    facultyClass: '',
    batch: '',
  });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post('http://localhost:5000/api/admin/add-faculty', formData);
    
    // ✅ Show toast BEFORE clearing name
    toast.success(`✅ Welcome to ${formData.name}`);

    setFormData({ name: '', userId: '', password: '', facultyClass: '', batch: '' });
  } catch (error) {
    const msg = error.response?.data?.message || '❌ Failed to add faculty';
    toast.error(msg);
  }
};


  const inputClass = 'w-full p-2 rounded bg-white text-black';

  return (
    <div className={`${darkMode ? 'text-white' : 'text-black'} max-w-xl mx-auto p-6 rounded-xl`}>
      <h1 className="text-2xl font-bold mb-4 text-cyan-400">Add New Faculty</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Name:</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label>User ID:</label>
          <input
            type="text"
            required
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label>Class:</label>
          <input
            type="text"
            required
            value={formData.facultyClass}
            onChange={(e) => setFormData({ ...formData, facultyClass: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label>Batch:</label>
          <input
            type="text"
            required
            value={formData.batch}
            onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 rounded"
        >
          Add Faculty
        </button>
      </form>
    </div>
  );
};

export default AddFaculty;
