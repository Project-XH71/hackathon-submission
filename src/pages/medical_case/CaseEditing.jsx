import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Toast3 from '../../components/Toast3';

function EmptyState() {

  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({}); // Form data as key-value pairs
  const [oldData, setOldData] = useState({}); // Old data retrieved from DB
  const [isLoaded, setIsLoaded] = useState(false); // Flag to track data retrieval status
  const [additionalData, setAdditionalData] = useState([]);


  const [toast3WarningOpen, setToast3WarningOpen] = useState(false);
  const [toast3ErrorOpen, setToast3ErrorOpen] = useState(false);
  const [toast3SuccessOpen, setToast3SuccessOpen] = useState(true);
  const [toast3InfoOpen, setToast3InfoOpen] = useState(false);

  useEffect(() => {
    // Function to fetch posts
    const fetchMedicalCases = async () => {
      try {
        // Update loading state to true
        // setLoading(true);

        // Make API call to fetch posts
        const response = await axios.get(`${process.env.API_URL}/medical-case/data/${id}`);
        setOldData(response.data.data);
        setIsLoaded(true);
        console.log(response.data)

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
    e.preventDefault();

    // Save form data to DB (replace with your API endpoint and HTTP method)
    const data = await axios.post(`${process.env.API_URL}/medical-case/update`, {
      medicalCaseId: id,
      ...formData,
    });
    
  };

  const handleAdditionalInputChange = (index, e) => {
    // Update the additional data state with user input
    const { name, value } = e.target;
    const updatedData = [...additionalData];
    updatedData[index][name] = value;
    setAdditionalData(updatedData);
  };


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

              </div>

            </div>

            <div className="border-t border-slate-200">
              {/* <div className="max-w-2xl m-auto mt-16">

                <div className="text-center px-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-t from-slate-200 to-slate-100 mb-4">
                    <svg className="w-5 h-6 fill-current" viewBox="0 0 20 24">
                      <path className="text-slate-500" d="M10 10.562l9-5-8.514-4.73a1 1 0 00-.972 0L1 5.562l9 5z" />
                      <path className="text-slate-300" d="M9 12.294l-9-5v10.412a1 1 0 00.514.874L9 23.294v-11z" />
                      <path className="text-slate-400" d="M11 12.294v11l8.486-4.714a1 1 0 00.514-.874V7.295l-9 4.999z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl text-slate-800 font-bold mb-2">Pay your bills in just a few clicks</h2>
                  <div className="mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                  <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                    <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="ml-2">Add Event</span>
                  </button>
                </div>

              </div> */}
              <div className="bg-gray-100 min-h-screen flex items-center justify-center">
                {/* Form */}
                {isLoaded ? ( // Render form only when data is loaded
                  <form className="max-w-md mx-auto p-4" onSubmit={handleSubmit}>
                  {/* Render your form elements */}
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="mb-4 px-4 py-2 w-full border rounded"
                  />
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Age"
                    className="mb-4 px-4 py-2 w-full border rounded"
                  />
                  {/* Render additional data fields */}
                  {additionalData.map((field, index) => (
                    <div key={index} className="flex mb-4">
                      <input
                        type="text"
                        name="key"
                        value={field.key}
                        onChange={e => handleAdditionalInputChange(index, e)}
                        placeholder="Key"
                        className="mr-2 px-4 py-2 flex-grow border rounded"
                      />
                      <input
                        type="text"
                        name="value"
                        value={field.value}
                        onChange={e => handleAdditionalInputChange(index, e)}
                        placeholder="Value"
                        className="mr=2 px-4 py-2 flex-grow border rounded"
                        />
                        <button
                        type="button"
                        onClick={() => handleRemoveField(index)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                        Remove
                        </button>
                        </div>
                        ))}
                        {/* Render "Add Field" button */}
                        <button
                                 type="button"
                                 onClick={handleAddField}
                                 className="bg-blue-500 text-white px-4 py-2 rounded"
                               >
                        Add Field
                        </button>
                        {/* Render Submit button */}
                        <button
                                 type="submit"
                                 className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                               >
                        Submit
                        </button>
                        </form>
                ) : (
                  // Render loading message while data is being retrieved
                  <p className="text-center mt-8">Loading form data...</p>
                )}
              </div>
            </div>

          </div>
        </main>

      </div>

    </div>
  );
}

export default EmptyState;