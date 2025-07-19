import React, { useContext, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  if (!dashData) {
    return (
      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-600">Loading dashboard data...</h2>
      </div>
    );
  }

  // Validate latestAppointments safely
  const latestAppointments = Array.isArray(dashData.latestAppointments)
    ? dashData.latestAppointments.slice(0, 5)
    : [];

  return (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        {/* Doctor Card */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100'>
          <img className='w-14' src={assets.doctor_icon} alt="Doctor Icon" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>

        {/* Appointment Card */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100'>
          <img className='w-14' src={assets.appointments_icon} alt="Appointments Icon" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        {/* Patient Card */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100'>
          <img className='w-14' src={assets.patients_icon} alt="Patients Icon" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div className='bg-white mt-10 border rounded'>
        <div className='flex items-center gap-2.5 px-4 py-4 border-b'>
          <img src={assets.list_icon} alt="List Icon" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4'>
          {latestAppointments.length === 0 ? (
            <p className='px-6 pb-4 text-gray-500'>No recent bookings found.</p>
          ) : (
            latestAppointments.map((item, index) => (
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                <img
                  className='rounded-full w-10 h-10 object-cover'
                  src={item?.docData?.image || assets.doctor_icon}
                  alt="Doctor"
                />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item?.docData?.name || 'Unknown Doctor'}</p>
                  <p className='text-gray-600'>
                    Booking on {item?.slotDate ? slotDateFormat(item.slotDate) : 'Unknown Date'}
                  </p>
                </div>
                {item.cancelled ? (
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                ) : item.isCompleted ? (
                  <p className='text-green-500 text-xs font-medium'>Completed</p>
                ) : (
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className='w-10 cursor-pointer'
                    src={assets.cancel_icon}
                    alt="Cancel"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;