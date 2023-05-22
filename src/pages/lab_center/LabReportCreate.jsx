import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Toast3 from '../../components/Toast3';
import moment from 'moment';
import ModalBasic from '../../components/ModalBasic';
import LoaderPage from '../../utils/LoadingPage1';

function EmptyState() {
  const hospitalData = useSelector(state => state.hospital);
  const hospitalId = hospitalData.data.id;
  const userData = useSelector(state => state.user);
  const doctorId = userData.data.auth.metadata.doctorId;
  const navigate = useNavigate();
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  // const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({}); // Form data as key-value pairs
  const [oldData, setOldData] = useState({
    patientVpa: "",
    vitalSignature: {
        age: 0,
        bmi: 0,
        height: 0,
        weight: 0,
        covidshot_1: "",
        covidshot_2: ""
    },
    data:{},
    createdAt: "",
    updatedAt: ""
}); // Old data retrieved from DB
  const [isLoaded, setIsLoaded] = useState(true); // Flag to track data retrieval status
  const [additionalData, setAdditionalData] = useState([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  console.log(oldData);

  const handleInputChange = (key, value) => {
    setFormData(prevFormData => ({ ...prevFormData, [key]: value }));
  };


  const handleSubmit = async(e) => {
    // Save form data to DB (replace with your API endpoint and HTTP method)
    await axios.post(`${process.env.API_URL}/medical-case/data/create`, {
      doctorId: doctorId,
      medicalRecordData: oldData,
      hospitalId: hospitalId,
      patientVpa: oldData.patientVpa,
    });
    navigate('/case/list');
  };

  const handleAdditionalInputChange = () => {
    setBasicModalOpen(false);
    setOldData(prevOldData => ({ ...prevOldData, data: { ...prevOldData.data, [newKey]: newValue} }));
    setNewKey('');
    setNewValue('');
  };


  const ModalFrontEnd = () => {
    return(
          <div>
              <div className="grid gap-5 md:grid-cols-3">
                    <div>
                      {/* Start */}
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="newKey">
                          {"Key"}
                        </label>
                        <input onChange={(e) =>{setNewKey(e.target.value)}}  value={newKey} id="newKey" className="form-input w-full" type="text" />
                      </div>
                      {/* End */}
                    </div>

                    <div>
                      {/* Start */}
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="newValue">
                          {"Value"}
                        </label>
                        <input onChange={(e) => {e.preventDefault(); setNewValue(e.target.value); }} value={newValue} id="newValue" className="form-input w-full" type="text" />
                      </div>
                      {/* End */}
                    </div>
                  </div>
          </div>
    )
  }

  if(!isLoaded) return <LoaderPage/>
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-white">
      {/* <Toast3 type="warning" open={toast3WarningOpen} setOpen={setToast3WarningOpen}>
        A warning toast.
      </Toast3>

                       

      <Toast3 type="error" open={toast3ErrorOpen} setOpen={setToast3ErrorOpen}>
        A dangerous toast.
      </Toast3>

      <Toast3 open={toast3InfoOpen} setOpen={setToast3InfoOpen}>
        An informational toast.
      </Toast3> */}

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
            
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Create Medical Case 📝</h1>
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">

                {/* Add board button */}
                <button className="btn bg-red-500 hover:bg-red-700 text-white">
                  <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="ml-2">Raise Issue</span>
                </button>

                <button onClick={() => handleSubmit()} className="btn bg-green-500 hover:bg-green-700 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512" id="tick"><path d="M223.9 329.7c-2.4 2.4-5.8 4.4-8.8 4.4s-6.4-2.1-8.9-4.5l-56-56 17.8-17.8 47.2 47.2L340 177.3l17.5 18.1-133.6 134.3z"></path></svg>
                  <span className="ml-2">Submit</span>
                </button>

              </div>

            </div>

            <div className="border-t border-slate-200">
            <div className="border-t border-slate-200">
              {/* Components */}
              <div className="space-y-8 mt-8">

                {/* Basic Infromation */}
                <div>
                  <h2 className="text-2xl text-slate-800 font-bold mb-6">Medical Information</h2>
                  <div className="grid gap-5 md:grid-cols-3">

                        <div>
                        {/* Start */}
                          <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="patientVpa">
                              {"Virtual Private Identification"}
                            </label>
                            <div className="relative">
                              <input onChange={(e) => setOldData((x) => ({...x, patientVpa: e.target.value}))} value={oldData.patientVpa.replace(/@upi/g,'')} id="patientVpa" className="form-input w-full pr-8" type="text" />
                              <div className="absolute inset-0 left-auto flex items-center pointer-events-none">
                                <span className="text-sm text-slate-400 font-medium px-3">{"@uhi"}</span>
                              </div>
                            </div>
                          </div>
                        {/* End */}
                      </div>
                      

                  </div>
                </div>


                

                {/* Medical Data Information */}
                <div>
                  <h2 className="text-2xl text-slate-800 font-bold mb-6">Medical Data</h2>
                  <div className="grid gap-5 md:grid-cols-3">
                        {Object.keys(oldData.data).map(function(key, index) {
                          // oldData.data[key] *= 2;
                          return(
                            <div>
                            {/* Start */}
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="default">
                                  {key}
                                </label>
                                <input disabled={true} value={oldData.data[key]} id="default" className="form-input w-full" type="text" />
                              </div>
                              {/* End */}
                            </div>
                          )
                          })
                        }
                        {/* Start */}
                        <div>
                          {/* Basic Modal */}
                          <div className="m-1.5">
                            {/* Start */}
                            <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white" aria-controls="basic-modal" onClick={(e) => { e.stopPropagation(); setBasicModalOpen(true); }}>Add Field</button>
                            <ModalBasic id="basic-modal" modalOpen={basicModalOpen} setModalOpen={setBasicModalOpen} title="Basic Modal">
                              {/* Modal content */}
                              <div className="px-5 pt-4 pb-1">
                                <div>
                                  <div className="grid gap-5 md:grid-cols-3">
                                    <div>
                                        {/* Start */}
                                        <div>
                                          <label className="block text-sm font-medium mb-1" htmlFor="newKey">
                                            {"Key"}
                                          </label>
                                          <input onChange={(e) =>{setNewKey(e.target.value)}}  value={newKey} id="newKey" className="form-input w-full" type="text" />
                                        </div>
                                        {/* End */}
                                      </div>

                                      <div>
                                        {/* Start */}
                                        <div>
                                          <label className="block text-sm font-medium mb-1" htmlFor="newValue">
                                            {"Value"}
                                          </label>
                                          <input onChange={(e) => {e.preventDefault(); setNewValue(e.target.value); }} value={newValue} id="newValue" className="form-input w-full" type="text" />
                                        </div>
                                        {/* End */}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              {/* Modal footer */}
                              <div className="px-5 py-4">
                                <div className="flex flex-wrap justify-end space-x-2">
                                  <button className="btn-sm  text-white bg-red-500 hover:bg-red-600 border-slate-200 hover:border-slate-300" onClick={(e) => { e.stopPropagation(); setBasicModalOpen(false); }}>Cancel</button>
                                  <button className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white" onClick={(e) => { e.stopPropagation(); handleAdditionalInputChange();}}>Add</button>
                                </div>
                              </div>
                            </ModalBasic>
                            {/* End */}
                          </div>
                        </div>
                        
                  </div>
                </div>


          
              </div>
            </div> 
            </div>

          </div>
        </main>

      </div>

    </div>
  );
}

export default EmptyState;