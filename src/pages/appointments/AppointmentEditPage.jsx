import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import DropdownClassic from './DropdownClassic';
import axios from 'axios';
import LoaderPage from '../../utils/LoadingPage1';
import moment from 'moment';  

function EmptyState() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams();
  const [appointmentData,setAppointmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('pending');
  const navigate = useNavigate();

  const options = {
    0: 'pending',
    1: 'completed',
    2: 'cancelled',
    3: 'NA',
    4: 'NA'
  }

  const handleSubmit = async() => {
    try {
      const alpha = await axios.post(`${process.env.API_URL}/appointment/update`,{
        appointmentId: id,
        status: options[status]
      });

      alert('Appointment Updated');
      navigate('/appointments')
      
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  }


  React.useEffect(() => {
    document.title = 'Appointment | GFG Health';
    const fetchAppointmentData = async() => {
      try {
        const alpha = await axios.post(`${process.env.API_URL}/appointment/fetch`,{
          appointmentId: id
        });

        setAppointmentData(alpha.data);
        setLoading(false);
      } catch (error) {
        alert(error.message);
        console.log(error);
      }
    }

    fetchAppointmentData();

  }, [id]);


  
  if(loading) return <LoaderPage />
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-white">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">

              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Appointment 📖</h1>
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">

                {/* Add board button */}
                <button onClick={(e) => {e.preventDefault(); handleSubmit(); } } className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                  <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="ml-2">Update</span>
                </button>

              </div>

            </div>

            <div className="border-t border-slate-200">
              <div className="max-w-2xl m-auto mt-16">                  
                <section>
                  <h2 className="text-xl leading-snug text-slate-800 font-bold mb-1">Medical Appointment</h2>
                  <div className="text-sm">{appointmentData.description}</div>
                  <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                    <div className="sm:w-2/3">
                      <label className="block text-sm font-medium mb-1" htmlFor="name">Patient Full Name</label>
                      <input disabled value={appointmentData.patient.user.name} id="name" className="form-input w-full" type="text" />
                    </div>
                    <div className="sm:w-1/3">
                      <label className="block text-sm font-medium mb-1" htmlFor="patientVpa">Patient VPA</label>
                      <input disabled value={appointmentData.patient.user.user_vpa.vpa} id="patientVpa" className="form-input w-full" type="text" />
                    </div>
                  </div>
                </section>
                <section className='mt-8'>
                  <h2 className="text-xl leading-snug text-slate-800 font-bold mb-1">Doctor Information</h2>
                  <div className="text-sm">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.</div>
                  <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                    <div className="sm:w-2/3">
                      <label className="block text-sm font-medium mb-1" htmlFor="name">Doctor Name</label>
                      <input disabled value={appointmentData.doctor.user.name} id="name" className="form-input w-full" type="text" />
                    </div>
                    <div className="sm:w-1/3">
                      <label className="block text-sm font-medium mb-1" htmlFor="patientVpa">Appointment Time</label>
                      <input disabled value={moment(appointmentData.time).calendar()} id="name" className="form-input w-full" type="text" />
                    </div>
                  </div>
                </section>

                <section className='mt-8'>
                  <h2 className="text-xl leading-snug text-slate-800 font-bold mb-1">Doctor Information</h2>
                  <div className="text-sm">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.</div>
                  <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                    {/* <div className="sm:w-2/3">
                      <label className="block text-sm font-medium mb-1" htmlFor="name">Doctor Name</label>
                      <input disabled value={appointmentData.doctor.user.name} id="name" className="form-input w-full" type="text" />
                    </div> */}
                    <div className="sm:w-1/3">
                      <label className="block text-sm font-medium mb-1" htmlFor="patientVpa">Change Status</label>
                      <DropdownClassic setStatus={setStatus} />
                    </div>
                  </div>
                </section>
              </div>
            </div>

          </div>
        </main>

      </div>

    </div>
  );
}

export default EmptyState;