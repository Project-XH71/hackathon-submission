import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import MedicalItem from './MedicalTableItem';
import { useSelector } from 'react-redux';
import axios from 'axios';
import LoadingPage1 from "../../utils/LoadingPage1";

function InvoicesTable({
  selectedItems
}) {

//   const medicalCases = [
//     {
//         "id": "6d5ff949-9af5-496c-a5a4-8090eec87049",
//         "data": "ZTE5NThhZDQ1MmIxNjU3Zjc1YzU3YWU1NWE1YWEzNjYwYTQ1OTI1MjM1ZjkzNDQ5YTcwNzUxOGY2NjNjMTE1NGI0MDdhNTRlYjdiZDk0MzBhZGZmMGEyZTI5NWIzYzNlZDk3ZmJlOWQ5ZGZmZjY2OTU4MjZiYmJjYWVjNjNmNzM5ZmRjNmVhZjBlZWI2NzdmMDBmZWI0YWJkYTNmYmJkNzM0NzY3NGJlNzhlMjQ0M2FhZDQyNjUyMWFhZGVjMmFmOTNiY2I4MjcwYTRjODFlMmVlYTk5NmY5YzIwNDI4N2I=",
//         "createdAt": "2023-04-11T12:25:47.923Z",
//         "updatedAt": "2023-04-11T12:25:47.923Z",
//         "patientId": "5d2ec659-9e6f-483a-ab91-d2a7e0bccad8",
//         "diagnoses": [
//             {
//                 "id": "e78c469f-5bdf-4231-b635-aa9e21d13324",
//                 "medicalCaseId": "6d5ff949-9af5-496c-a5a4-8090eec87049",
//                 "diagnoses": "heart-cancer",
//                 "diagnoseAt": "2023-04-11T12:28:53.484Z",
//                 "createdAt": "2023-04-11T12:28:54.280Z",
//                 "updatedAt": "2023-04-11T12:28:54.280Z"
//             }
//         ],
//         "patient": {
//             "id": "5d2ec659-9e6f-483a-ab91-d2a7e0bccad8",
//             "userId": "778864ea-76d5-4a03-957c-5635ab5e581e",
//             "metadata": null,
//             "createdAt": "2023-04-03T23:04:11.680Z",
//             "updatedAt": "2023-04-03T23:04:11.680Z",
//             "user": {
//                 "id": "778864ea-76d5-4a03-957c-5635ab5e581e",
//                 "email": "abhisht@gmail.com",
//                 "name": "Abhisht Chouhan",
//                 "createdAt": "2023-03-24T09:32:47.638Z",
//                 "updatedAt": "2023-04-01T10:49:43.579Z",
//                 "user_vpa": {
//                     "id": "d2433217-a1fb-48a9-af05-be6fb2b44731",
//                     "vpa": "imabhisht@uhi",
//                     "userId": "778864ea-76d5-4a03-957c-5635ab5e581e",
//                     "createdAt": "2023-04-03T11:38:23.657Z",
//                     "updatedAt": "2023-04-03T11:38:23.657Z"
//                 }
//             }
//         }
//     },
//     {
//         "id": "d2572c36-f977-4456-af76-bad6ff40f7ae",
//         "data": "MmFhM2ExOTAxMWM3ZGVlM2JkYTI1MzVkYWY0MzlmMmUzZTUyMzc5MWFlYTllMWMwNTc0ODliZDJmNGYxYjc0ZjEyM2JkOGRjOWVlMTM1MmYyNTUyODM3ZDg1NDViMmFhMmQ3ZGNlZWRiNzE1ZmNjYzE4YzYzMWYwODhkYTM1MWViZWVmNzVlY2QyZDQ2M2RkOGIxM2Q3YWQzZGIzMDg3NGI5YmJjOGJkNDcyM2VkODQ0ZDhkMTcxMzk4Y2YzOGQwYTU0ZDNhZTM3NWFjMjhiNzI0ZmYxNDNjOTMyOTAzNTU=",
//         "createdAt": "2023-04-12T12:27:47.517Z",
//         "updatedAt": "2023-04-12T12:27:47.517Z",
//         "patientId": "5d2ec659-9e6f-483a-ab91-d2a7e0bccad8",
//         "diagnoses": [],
//         "patient": {
//             "id": "5d2ec659-9e6f-483a-ab91-d2a7e0bccad8",
//             "userId": "778864ea-76d5-4a03-957c-5635ab5e581e",
//             "metadata": null,
//             "createdAt": "2023-04-03T23:04:11.680Z",
//             "updatedAt": "2023-04-03T23:04:11.680Z",
//             "user": {
//                 "id": "778864ea-76d5-4a03-957c-5635ab5e581e",
//                 "email": "abhisht@gmail.com",
//                 "name": "Abhisht Chouhan",
//                 "createdAt": "2023-03-24T09:32:47.638Z",
//                 "updatedAt": "2023-04-01T10:49:43.579Z",
//                 "user_vpa": {
//                     "id": "d2433217-a1fb-48a9-af05-be6fb2b44731",
//                     "vpa": "imabhisht@uhi",
//                     "userId": "778864ea-76d5-4a03-957c-5635ab5e581e",
//                     "createdAt": "2023-04-03T11:38:23.657Z",
//                     "updatedAt": "2023-04-03T11:38:23.657Z"
//                 }
//             }
//         }
//     }
// ] 
  const { id } = useParams();
  const [selectAll, setSelectAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [list, setList] = useState([]);
  const hospital = useSelector((state) => state.hospital);
  const [medicalCases, setMedicalCases] = useState([]);
  const [loading, setLoading] = useState(false);



  // useEffect(() => {
  //   setList(invoices);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);


  useEffect(() => {
    const fetchMedicalCases = async () => {
      try {
        // Update loading state to true
        setLoading(true);

        // Make API call to fetch posts
        const response = await axios.get(`${process.env.API_URL}/medical_case/data/${id}`);
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
  console.log(medicalCases)

  return (
    <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800">Lab Reports <span className="text-slate-400 font-medium">{medicalCases.length}</span></h2>
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
