import React, { useState, useEffect } from 'react';
import MedicalItem from './MedicalTableItem';
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
  const [medicalCases, setMedicalCases] = useState([]);
  const [loading, setLoading] = useState(false);


  if(sButton){
    const fetchMedicalCases = async () => {
      try {
        // Update loading state to true
        setLoading(true);

        // Make API call to fetch posts
        const response = await axios.get(`${process.env.API_URL}/v2/medical_case/search/vpa`,{
          vpa: searchQuery
        });
        setMedicalCases(response.data);

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
    const fetchMedicalCases = async () => {
      try {
        // Update loading state to true
        setLoading(true);

        // Make API call to fetch posts
        const response = await axios.get(`${process.env.API_URL}/hospital/medical-case/get`,{
          hospitalId: hospital.data.id
        });
        setMedicalCases(response.data);

        // Update loading state to false
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Update loading state to false
        setLoading(false);
      }
    };

    
    fetchMedicalCases();
  }, []);

  useEffect(() => {
    selectedItems(isCheck);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheck]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setIsCheck(medicalCases.map(li => li.id));
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
        <h2 className="font-semibold text-slate-800">Cases <span className="text-slate-400 font-medium">{medicalCases.length}</span></h2>
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
                  <div className="font-semibold text-left">VPA</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Status</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Patients</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Issued on</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Dignoses</div>
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
                medicalCases.map(item => {
                  return (
                    <MedicalItem
                      key={item.id}
                      id={item.id}
                      patient={item.patient}
                      createdAt={item.createdAt}
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
