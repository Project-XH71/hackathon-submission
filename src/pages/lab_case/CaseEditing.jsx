import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import Toast3 from "../../components/Toast3";
import moment from "moment";
import ModalBasic from "../../components/ModalBasic";
import LoaderPage from "../../utils/LoadingPage1";

function EmptyState() {
  const navigate = useNavigate();
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [oldData, setOldData] = useState({
    patientName: "",
    patientVpa: "",
    medicalCaseId: "",
    vitalSignature: {
      age: 0,
      bmi: 0,
    },
    data: {},
    createdAt: "",
    updatedAt: "",
  }); // Old data retrieved from DB
  const [isLoaded, setIsLoaded] = useState(false); // Flag to track data retrieval status
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  console.log(oldData);

  useEffect(() => {
    const fetchMedicalCases = async () => {
      try {
        const response = await axios.get(
          `${process.env.API_URL}/medical-case/lab-report/data/${id}`
        );
        setOldData({
          patientName: response.data.data.patientName,
          patientVpa: response.data.data.patientVpa,
          medicalCaseId: response.data.medicalCaseId,
          vitalSignature: {
            age: response.data.data.vitalSignature.age,
            bmi: response.data.data.vitalSignature.bmi,
          },
          data: {
            ...response.data.data.data,
          },
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        });
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching posts:", error);
        alert(error.message);
      }
    };
    fetchMedicalCases();
  }, []);

  const handleSubmit = async (e) => {
    console.log("Before:", oldData, id);
    setSubmitLoading(true);
    try {
      await axios.patch(
        `${process.env.API_URL}/medical-case/lab-report/data/update`,
        {
          labCaseId: id,
          labReportData: oldData,
        }
      );
      setSubmitLoading(false);
      navigate("/lab/list");
    } catch (error) {
      setSubmitLoading(false);
      alert(error.message);
      console.log(error);
    }
  };

  const handleAdditionalInputChange = () => {
    setBasicModalOpen(false);
    setOldData((prevOldData) => ({
      ...prevOldData,
      data: { ...prevOldData.data, [newKey]: newValue },
    }));
    setNewKey("");
    setNewValue("");
  };

  if (!isLoaded) return <LoaderPage />;
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
                <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
                  Edit Medical Case 📝
                </h1>
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {/* Add board button */}
                <button className="btn bg-red-500 hover:bg-red-700 text-white">
                  <svg
                    className="w-4 h-4 fill-current opacity-50 shrink-0"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="ml-2">Raise Issue</span>
                </button>

                <button
                  onClick={() => handleSubmit()}
                  className="btn bg-green-500 hover:bg-green-700 text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 512 512"
                    id="tick"
                  >
                    <path d="M223.9 329.7c-2.4 2.4-5.8 4.4-8.8 4.4s-6.4-2.1-8.9-4.5l-56-56 17.8-17.8 47.2 47.2L340 177.3l17.5 18.1-133.6 134.3z"></path>
                  </svg>
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
                    <h2 className="text-2xl text-slate-800 font-bold mb-6">
                      Basic Information
                    </h2>
                    <div className="grid gap-5 md:grid-cols-3">
                      <div>
                        {/* NAME */}
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="default"
                          >
                            {"Patient Name"}
                          </label>
                          <input
                            disabled={true}
                            value={oldData.patientName}
                            id="default"
                            className="form-input w-full"
                            type="text"
                          />
                        </div>
                        {/* End */}
                      </div>

                      <div>
                        {/* VPA */}
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="vpa"
                          >
                            {"Patient Name"}
                          </label>
                          <input
                            disabled={true}
                            value={oldData.patientVpa}
                            id="vpa"
                            className="form-input w-full"
                            type="text"
                          />
                        </div>
                        {/* End */}
                      </div>

                      <div>
                        {/* MedicalCaseId */}
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="medical_case_id"
                          >
                            {"Medical Case ID"}
                          </label>
                          <input
                            disabled={true}
                            value={oldData.medicalCaseId}
                            id="medical_case_id"
                            className="form-input w-full"
                            type="text"
                          />
                        </div>
                        {/* End */}
                      </div>

                      <div>
                        {/* Start */}
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="createdAt"
                          >
                            {"Creation Time"}
                          </label>
                          <div className="relative">
                            <input
                              disabled={true}
                              value={moment(oldData.createdAt).calendar()}
                              id="createdAt"
                              className="form-input w-full pr-8"
                              type="text"
                            />
                            <div
                              disabled={true}
                              className="absolute inset-0 left-auto flex items-center pointer-events-none"
                            >
                              <span className="text-sm text-slate-400 font-medium px-3">
                                {"e"}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* End */}
                      </div>

                      <div>
                        {/* Start */}
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="updatedAt"
                          >
                            {"Last Updated At"}
                          </label>
                          <div className="relative">
                            <input
                              disabled={true}
                              value={moment(oldData.updatedAt).calendar()}
                              id="updatedAt"
                              className="form-input w-full pr-8"
                              type="text"
                            />
                            <div
                              disabled={true}
                              className="absolute inset-0 left-auto flex items-center pointer-events-none"
                            >
                              <span className="text-sm text-slate-400 font-medium px-3">
                                {"e"}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* End */}
                      </div>
                    </div>
                  </div>

                  {/* Patient Vital Infromation */}
                  <div>
                    <h2 className="text-2xl text-slate-800 font-bold mb-6">
                      Patient Vital Information
                    </h2>
                    <div className="grid gap-5 md:grid-cols-3">
                      <div>
                        {/* Start */}
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="bmi"
                          >
                            {"BMI"}
                          </label>
                          <input
                            disabled={true}
                            value={oldData.vitalSignature.bmi}
                            id="bmi"
                            className="form-input w-full"
                            type="number"
                          />
                        </div>
                        {/* End */}
                      </div>

                      <div>
                        {/* AGE*/}
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="age"
                          >
                            {"Age"}
                          </label>
                          <input
                            disabled={true}
                            value={oldData.vitalSignature.age}
                            id="age"
                            className="form-input w-full"
                            type="number"
                          />
                        </div>
                        {/* End */}
                      </div>
                    </div>
                  </div>

                  {/* Medical Data Information */}
                  <div>
                    <h2 className="text-2xl text-slate-800 font-bold mb-6">
                      Medical Data
                    </h2>
                    <div className="grid gap-5 md:grid-cols-3">
                      {Object.keys(oldData.data).map(function (key, index) {
                        // oldData.data[key] *= 2;
                        return (
                          <div>
                            {/* Start */}
                            <div>
                              <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="default"
                              >
                                {key}
                              </label>
                              <input
                                disabled={true}
                                value={oldData.data[key]}
                                id="default"
                                className="form-input w-full"
                                type="text"
                              />
                            </div>
                            {/* End */}
                          </div>
                        );
                      })}
                      {/* Start */}
                      <div>
                        {/* Basic Modal */}
                        <div className="m-1.5">
                          {/* Start */}
                          <button
                            className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                            aria-controls="basic-modal"
                            onClick={(e) => {
                              e.stopPropagation();
                              setBasicModalOpen(true);
                            }}
                          >
                            Add Field
                          </button>
                          <ModalBasic
                            id="basic-modal"
                            modalOpen={basicModalOpen}
                            setModalOpen={setBasicModalOpen}
                            title="Basic Modal"
                          >
                            {/* Modal content */}
                            <div className="px-5 pt-4 pb-1">
                              <div>
                                <div className="grid gap-5 md:grid-cols-3">
                                  <div>
                                    {/* Start */}
                                    <div>
                                      <label
                                        className="block text-sm font-medium mb-1"
                                        htmlFor="newKey"
                                      >
                                        {"Key"}
                                      </label>
                                      <input
                                        onChange={(e) => {
                                          e.preventDefault();
                                          setNewKey(e.target.value);
                                        }}
                                        value={newKey}
                                        id="newKey"
                                        className="form-input w-full"
                                        type="text"
                                      />
                                    </div>
                                    {/* End */}
                                  </div>

                                  <div>
                                    {/* Start */}
                                    <div>
                                      <label
                                        className="block text-sm font-medium mb-1"
                                        htmlFor="newValue"
                                      >
                                        {"Value"}
                                      </label>
                                      <input
                                        onChange={(e) => {
                                          e.preventDefault();
                                          setNewValue(e.target.value);
                                        }}
                                        value={newValue}
                                        id="newValue"
                                        className="form-input w-full"
                                        type="text"
                                      />
                                    </div>
                                    {/* End */}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Modal footer */}
                            <div className="px-5 py-4">
                              <div className="flex flex-wrap justify-end space-x-2">
                                <button
                                  className="btn-sm border-slate-200 hover:border-slate-300 text-slate-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setBasicModalOpen(false);
                                  }}
                                >
                                  Close
                                </button>
                                <button
                                  className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAdditionalInputChange();
                                  }}
                                >
                                  I Understand
                                </button>
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
