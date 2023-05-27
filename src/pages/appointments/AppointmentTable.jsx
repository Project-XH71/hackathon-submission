import React, { useState, useEffect } from 'react';
import AppointmentTableItem from './AppointmentTableItem';
import { useSelector } from 'react-redux';
import axios from 'axios';
import LoadingPage1 from "../../utils/LoadingPage1";

function InvoicesTable({
  selectedItems,
  searchQuery,
  sButton
}) {

  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const hospital = useSelector((state) => state.hospital);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);


  if(sButton){
    const fetchMedicalCases = async () => {
      try {

        // Make API call to fetch posts
        const response = await axios.get(`${process.env.API_URL}/v2/medical_case/search/vpa`,{
          vpa: searchQuery
        });
        setAppointments(response.data);

        // Update loading state to false
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Update loading state to false
        setLoading(false);
      }
    };

    
    fetchMedicalCases();
  }

  useEffect(() => {
    // Function to fetch posts
    const fetchAppointments = async () => {
      try {

        // Make API call to fetch posts
        const response = await axios.post(`${process.env.API_URL}/appointment/fetch`,{
          filter: "get-doctor-appointments"
        });
        console.log(response.data)
        setAppointments(response.data);

        // Update loading state to false
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Update loading state to false
        setLoading(false);
      }
    };

    
    fetchAppointments();
  }, []);

  useEffect(() => {
    selectedItems(isCheck);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheck]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setIsCheck(appointments.map(li => li.id));
    if (selectAll) {
      setIsCheck([]);
    }
  };

  const handleClick = e => {
    const { id, checked } = e.target;
    setSelectAll(false);
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter(item => item !== id));
    }
  };

  if(loading) return (<LoadingPage1 />)

  return (
    <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800">Cases <span className="text-slate-400 font-medium">{appointments.length}</span></h2>
      </header>
      <div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 border-t border-b border-slate-200">
              <tr>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                  <div className="flex items-center">
                    <label className="inline-flex">
                      <span className="sr-only">Select all</span>
                      <input className="form-checkbox" type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    </label>
                  </div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Id</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Patient Name</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Status</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Doctor</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Appointment Time</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Reason</div>
                </th>
                {/* <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Type</div>
                </th> */}
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Actions</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-slate-200">
              {
                appointments.map(item => {
                  return (
                    <AppointmentTableItem
                      key={item.id}
                      id={item.id}
                      patientName={item.patient.user.name}
                      doctorName={item.doctor.user.name}
                      status={item.status}
                      time={item.time}
                      type={item.type}
                      // status={invoice.status}
                      // customer={invoice.customer}
                      // issueddate={invoice.issueddate}
                      // paiddate={invoice.paiddate}
                      // type={invoice.type}
                      handleClick={handleClick}
                      isChecked={isCheck.includes(item.id)}
                    />
                  )
                })
              }
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default InvoicesTable;
