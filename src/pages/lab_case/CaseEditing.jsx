import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Toast3 from '../../components/Toast3';
import moment from 'moment';
import ModalBasic from '../../components/ModalBasic';
import LoaderPage from '../../utils/LoadingPage1';

function EmptyState() {
  const navigate = useNavigate();
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({}); // Form data as key-value pairs
  const [oldData, setOldData] = useState({
    patientName: "",
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
  const [isLoaded, setIsLoaded] = useState(false); // Flag to track data retrieval status
  const [additionalData, setAdditionalData] = useState([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const [toast3WarningOpen, setToast3WarningOpen] = useState(false);
  const [toast3ErrorOpen, setToast3ErrorOpen] = useState(false);
  const [toast3SuccessOpen, setToast3SuccessOpen] = useState(true);
  const [toast3InfoOpen, setToast3InfoOpen] = useState(false);
  console.log(oldData);

  useEffect(() => {
    // Function to fetch posts
    const fetchMedicalCases = async () => {
      try {
        // Update loading state to true
        // setLoading(true);

        // Make API call to fetch posts
        const response = await axios.post(`${process.env.API_URL}/medical-case/lab_report/data/create`,{
          medicalCaseid: id,
          
        });
        setOldData({
          patientName: response.data.data.patientName,
          patientVpa: response.data.data.patientVpa,
          vitalSignature: {
              age: response.data.data.vitalSignature.age,
              bmi: response.data.data.vitalSignature.bmi,
              height: response.data.data.vitalSignature.height,
              weight: response.data.data.vitalSignature.weight,
              covidshot_1: response.data.data.vitalSignature.covidshot_1,
              covidshot_2: response.data.data.vitalSignature.covidshot_2
          },
          data:{
            ...response.data.data.data
          },
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        });
        setIsLoaded(true);

      } catch (error) {
        console.error('Error fetching posts:', error);
        // Update loading state to false
        // setLoading(false);
      }
    };
    fetchMedicalCases();
  }, []);

  const handleInputChange = (key, value) => {
    setFormData(prevFormData => ({ ...prevFormData, [key]: value }));
  };

  const handleAddField = () => {
    // Add a new field to the additional data state
    setAdditionalData([...additionalData, { key: '', value: '' }]);
  };

  const handleSubmit = async(e) => {
    console.log("Before:", oldData, id)
    // Save form data to DB (replace with your API endpoint and HTTP method)
    await axios.patch(`${process.env.API_URL}/medical-case/data/update`, {
      medicalCaseid: id,
      data: oldData,
    });

    navigate('/case/list')

    
    
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
                        <input onChange={(e) =>{e.preventDefault(); setNewKey(e.target.value)}}  value={newKey} id="newKey" className="form-input w-full" type="text" />
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
                <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Edit Medical Case 📝</h1>
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
                  <h2 className="text-2xl text-slate-800 font-bold mb-6">Basic Information</h2>
                  <div className="grid gap-5 md:grid-cols-3">

                        <div>
                          {/* Start */}
                          <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="default">
                              {"Patient Name"}
                            </label>
                            <input disabled={true} value={oldData.patientName} id="default" className="form-input w-full" type="text" />
                          </div>
                          {/* End */}
                        </div>

                        <div>
                          {/* Start */}
                          <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="age">
                              {"Age"}
                            </label>
                            <input disabled={true} value={oldData.vitalSignature.age} id="age" className="form-input w-full" type="number" />
                          </div>
                          {/* End */}
                        </div>

                        <div>
                        {/* Start */}
                          <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="patientVpa">
                              {"Virtual Private Identification"}
                            </label>
                            <div className="relative">
                              <input value={oldData.patientVpa.replace(/@upi/g,'')} id="patientVpa" className="form-input w-full pr-8" type="text" />
                              <div disabled={true} className="absolute inset-0 left-auto flex items-center pointer-events-none">
                                <span className="text-sm text-slate-400 font-medium px-3">{"e"}</span>
                              </div>
                            </div>
                          </div>
                        {/* End */}
                      </div>
                      <div>
                        {/* Start */}
                        <div>
                          <label className="block text-sm font-medium mb-1" htmlFor="createdAt">
                            {"Creation Time"}
                          </label>
                          <div className="relative">
                            <input disabled={true} value={moment(oldData.createdAt).calendar()} id="createdAt" className="form-input w-full pr-8" type="text" />
                            <div disabled={true} className="absolute inset-0 left-auto flex items-center pointer-events-none">
                              <span className="text-sm text-slate-400 font-medium px-3">{"e"}</span>
                            </div>
                          </div>
                        </div>
                        {/* End */}
                      </div>

                      <div>
                        {/* Start */}
                        <div>
                          <label className="block text-sm font-medium mb-1" htmlFor="updatedAt">
                            {"Last Updated At"}
                          </label>
                          <div className="relative">
                            <input disabled={true} value={moment(oldData.updatedAt).calendar()} id="updatedAt" className="form-input w-full pr-8" type="text" />
                            <div disabled={true} className="absolute inset-0 left-auto flex items-center pointer-events-none">
                              <span className="text-sm text-slate-400 font-medium px-3">{"e"}</span>
                            </div>
                          </div>
                        </div>
                        {/* End */}
                      </div>
                      

                  </div>
                </div>


                {/* Patient Vital Infromation */}
                <div>
                  <h2 className="text-2xl text-slate-800 font-bold mb-6">Patient Vital Information</h2>
                  <div className="grid gap-5 md:grid-cols-3">

                        {/* Start */}
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="height">
                              {"Patient Recorded Height"}
                            </label>
                            <div className="relative">
                              <input onChange={(e) => setOldData((prev) => ({...prev, vitalSignature:{ ...prev.vitalSignature ,height: e.target.value}}))} value={oldData.vitalSignature.height} id="height" className="form-input w-full pr-8" type="text" />
                              <div disabled={true} className="absolute inset-0 left-auto flex items-center pointer-events-none">
                                <span className="text-sm text-slate-400 font-medium px-3">{"cm"}</span>
                              </div>
                            </div>
                          </div>
                        {/* End */}

                        {/* Start */}
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="weight">
                              {"Patient Recorded Weight"}
                            </label>
                            <div className="relative">
                              <input onChange={(e) => setOldData((prev) => ({...prev, vitalSignature:{ ...prev.vitalSignature ,weight: e.target.value}}))} value={oldData.vitalSignature.weight} id="weight" className="form-input w-full pr-8" type="text" />
                              <div disabled={true} className="absolute inset-0 left-auto flex items-center pointer-events-none">
                                <span className="text-sm text-slate-400 font-medium px-3">{"kg"}</span>
                              </div>
                            </div>
                          </div>
                        {/* End */}

                        <div>
                          {/* Start */}
                          <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="bmi">
                              {"BMI"}
                            </label>
                            <input disabled={true} value={oldData.vitalSignature.bmi} id="bmi" className="form-input w-full" type="number" />
                          </div>
                          {/* End */}
                        </div>

                        <div>
                        {/* Start */}
                        <div>
                          <label className="block text-sm font-medium mb-1" htmlFor="covidshot_1">
                            {"Covid Shot 1"}
                          </label>
                          <div className="relative">
                            <input disabled={true} value={moment(oldData.vitalSignature.covidshot_1).format("DD MMMM YYYY")} id="covidshot_1" className="form-input w-full pr-8" type="text" />
                            <div disabled={true} className="absolute inset-0 left-auto flex items-center pointer-events-none">
                              <span className="text-sm text-slate-400 font-medium px-3">{"e"}</span>
                            </div>
                          </div>
                        </div>
                        {/* End */}
                      </div>

                      <div>
                        {/* Start */}
                        <div>
                          <label className="block text-sm font-medium mb-1" htmlFor="covidshot_2">
                            {"Covid Shot 2"}
                          </label>
                          <div className="relative">
                            <input disabled={true} value={moment(oldData.vitalSignature.covidshot_2).format("DD MMMM YYYY")} id="covidshot_2" className="form-input w-full pr-8" type="text" />
                            <div disabled={true} className="absolute inset-0 left-auto flex items-center pointer-events-none">
                              <span className="text-sm text-slate-400 font-medium px-3">{"e"}</span>
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
                                <ModalFrontEnd />
                              </div>
                              {/* Modal footer */}
                              <div className="px-5 py-4">
                                <div className="flex flex-wrap justify-end space-x-2">
                                  <button className="btn-sm border-slate-200 hover:border-slate-300 text-slate-600" onClick={(e) => { e.stopPropagation(); setBasicModalOpen(false); }}>Close</button>
                                  <button className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white" onClick={(e) => { e.stopPropagation(); handleAdditionalInputChange();}}>I Understand</button>
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