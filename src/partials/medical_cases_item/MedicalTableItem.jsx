import React from 'react';
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
function InvoicesTableItem(props) {
  const navigate = useNavigate();

  // Handle button click
  const handleEditButtonClick = (id) => {
    navigate(`/case/edit/${id}`)
    // window.location.href = `/case/edit/${id}`; // Redirect to URL with 'id' parameter
  };
  const handleDelete = async(medicalCaseId) => {
    try {
      console.log("Thisis mdxx: ,",medicalCaseId)
      
      await axios.post(`${process.env.API_URL}/medical-case/data/delete`,{
        medicalCaseId
      });


      navigate('/case/list')
    } catch (error) {
      console.log(error);
    }
  }
  


  const statusColor = (status) => {
    switch (status) {
      case 'Finished':
        return 'bg-emerald-100 text-emerald-600';
      case 'On-Going':
        return 'bg-amber-100 text-amber-600';
      case 'DIA':
        return 'bg-rose-100 text-rose-500';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  };

  const typeIcon = (type) => {
    switch (type) {
      case 'Subscription':
        return (
          <svg className="w-4 h-4 fill-current text-slate-400 shrink-0 mr-2" viewBox="0 0 16 16">
            <path d="M4.3 4.5c1.9-1.9 5.1-1.9 7 0 .7.7 1.2 1.7 1.4 2.7l2-.3c-.2-1.5-.9-2.8-1.9-3.8C10.1.4 5.7.4 2.9 3.1L.7.9 0 7.3l6.4-.7-2.1-2.1zM15.6 8.7l-6.4.7 2.1 2.1c-1.9 1.9-5.1 1.9-7 0-.7-.7-1.2-1.7-1.4-2.7l-2 .3c.2 1.5.9 2.8 1.9 3.8 1.4 1.4 3.1 2 4.9 2 1.8 0 3.6-.7 4.9-2l2.2 2.2.8-6.4z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 fill-current text-slate-400 shrink-0 mr-2" viewBox="0 0 16 16">
            <path d="M11.4 0L10 1.4l2 2H8.4c-2.8 0-5 2.2-5 5V12l-2-2L0 11.4l3.7 3.7c.2.2.4.3.7.3.3 0 .5-.1.7-.3l3.7-3.7L7.4 10l-2 2V8.4c0-1.7 1.3-3 3-3H12l-2 2 1.4 1.4 3.7-3.7c.4-.4.4-1 0-1.4L11.4 0z" />
          </svg>
        );
    }
  };

  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className="flex items-center">
          <label className="inline-flex">
            <span className="sr-only">Select</span>
            <input id={props.id} className="form-checkbox" type="checkbox" onChange={props.handleClick} checked={props.isChecked} />
          </label>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-sky-500">{(props.id).split("-")[1].toUpperCase()}</div>
      </td>    
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className={`font-medium`}>{props.patient.user.user_vpa.vpa}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${statusColor("Finshed")}`}>Finished</div>
      </td >  
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-slate-800">{props.patient.user.name}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div>{moment(props.createdAt).calendar()}</div>
      </td>
      {/* <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div>{props.paiddate}</div>
      </td> */}
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="flex items-center">
          {typeIcon("Subscription")}
          <div className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" onClick={(e) => console.log("hello")} >Check</div>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className="space-x-1">
          <button onClick={(e) => handleEditButtonClick(props.id)} className="text-slate-400 hover:text-slate-500 rounded-full">
            <span className="sr-only">Edit</span>
            <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
            </svg>
          </button>
          <button className="text-slate-400 hover:text-slate-500 rounded-full">
            <span className="sr-only">Download</span>
            <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                <path d="M16 20c.3 0 .5-.1.7-.3l5.7-5.7-1.4-1.4-4 4V8h-2v8.6l-4-4L9.6 14l5.7 5.7c.2.2.4.3.7.3zM9 22h14v2H9z" />
            </svg>
          </button>
          <button onClick={(e) => handleDelete(props.id)} className="text-rose-500 hover:text-rose-600 rounded-full">
            <span className="sr-only">Delete</span>
            <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default InvoicesTableItem;
