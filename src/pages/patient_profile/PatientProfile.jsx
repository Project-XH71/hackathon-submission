import React, { useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import axios from "axios";
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SettingsSidebar from './SettingsSidebar';
import AccountPanel from './AccountPanel';
import LoaderPage from '../../utils/LoadingPage1';

function Account() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);
  let { id } = useParams();


  React.useEffect(() =>{
    const fetchPatientInformation = async() => {
      try {
        const response = await axios.post(`${process.env.API_URL}/patient/get`,{
          patientId: id
        })
        setPatientData(response.data)
        setLoading(false);
      } catch (error) {
        console.log(error);
        alert(error.message)
      }
    }

    fetchPatientInformation();
  }, [])

  if(loading) return <LoaderPage />
  console.log(patientData);
  
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */} 
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Page header */}
            <div className="mb-8">
              {/* Title */}
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Patient Information  ✨</h1>
            </div>

            {/* Content */} 
            <div className="bg-white shadow-lg rounded-sm mb-8">
              <div className="flex flex-col md:flex-row md:-mr-px">
                {/* <SettingsSidebar patientData={patientData} id  /> */}
                <AccountPanel  patientData={patientData} id />
              </div>
            </div>

          </div>
        </main>

      </div>
      
    </div>
  );
}

export default Account;