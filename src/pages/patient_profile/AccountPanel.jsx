import React, { useState } from 'react';
import moment from "moment";
import Image from '../../images/user-avatar-80.png';

function AccountPanel(props) {

  const [sync, setSync] = useState(false);

  return (
    <div className="grow">
      {/* Panel body */}
      <div className="p-6 space-y-6">
        <h2 className="text-2xl text-slate-800 font-bold mb-5">Patient Profile</h2>
        {/* Picture */}
        <section>
          <div className="flex items-center">
            <div className="mr-4">
              <img className="w-20 h-20 rounded-full" src={Image} width="80" height="80" alt="User upload" />
            </div>
            <button className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white">Change</button>
          </div>
        </section>
        {/* Business Profile */}
        <section>
          <h2 className="text-xl leading-snug text-slate-800 font-bold mb-1">Medical Information of Patient</h2>
          <div className="text-sm">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.</div>
          <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
            <div className="sm:w-2/3">
              <label className="block text-sm font-medium mb-1" htmlFor="name">Patient Full Name</label>
              <input disabled value={props.patientData.user.name} id="name" className="form-input w-full" type="text" />
            </div>
            <div className="sm:w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="patientVpa">Patient VPA</label>
              <input disabled value={props.patientData.user.user_vpa.vpa} id="patientVpa" className="form-input w-full" type="text" />
            </div>
          </div>
        </section>

        <section>
          <div className="text-sm">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.</div>
          <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
            <div className="sm:w-2/3">
              <label className="block text-sm font-medium mb-1" htmlFor="patientId">Patient ID</label>
              <input value={props.patientData.id} id="patientId" className="form-input w-full" type="text" />
            </div>
            <div className="sm:w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="createdAt">Created At</label>
              <input disabled value={moment(props.patientData.createdAt).calendar()} id="createdAt" className="form-input w-full" type="text" />
            </div>
            
          </div>
        </section>

        {/* Aadhar */}
        <section>
          <h2 className="text-xl leading-snug text-slate-800 font-bold mb-1">Aadhar Card Information</h2>
          <div className="text-sm">Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia.</div>
          <div className="flex flex-wrap mt-5">
            <div className="mr-2">
              <label className="sr-only" htmlFor="aadhar-number">Aadhar Card</label>
              <input disabled value={"XXXX-XXXX-0951"} id="aadhar-number" className="form-input" type="text" />
            </div>
            <button onClick={(e) => {e.preventDefault(); alert("Admin have blocked your Access");}} className="btn border-slate-200 hover:border-slate-300 shadow-sm text-indigo-500">Download Patient Aadhar</button>
          </div>
        </section>
        {/* Password */}
        <section>
          <h2 className="text-xl leading-snug text-slate-800 font-bold mb-1">Password</h2>
          <div className="text-sm">You can set a permanent password if you don't want to use temporary login codes.</div>
          <div className="mt-5">
            <button className="btn border-slate-200 shadow-sm text-indigo-500">Set New Password</button>
          </div>
        </section>
        {/* Smart Sync */}
        <section>
          <h2 className="text-xl leading-snug text-slate-800 font-bold mb-1">Smart Sync update for Mac</h2>
          <div className="text-sm">With this update, online-only files will no longer appear to take up hard drive space.</div>
          <div className="flex items-center mt-5">
            <div className="form-switch">
              <input type="checkbox" id="toggle" className="sr-only" checked={sync} onChange={() => setSync(!sync)} />
              <label className="bg-slate-400" htmlFor="toggle">
                <span className="bg-white shadow-sm" aria-hidden="true"></span>
                <span className="sr-only">Enable smart sync</span>
              </label>
            </div>
            <div className="text-sm text-slate-400 italic ml-2">{sync ? 'On' : 'Off'}</div>
          </div>
        </section>
      </div>
      {/* Panel footer */}
      <footer>
        <div className="flex flex-col px-6 py-5 border-t border-slate-200">
          <div className="flex self-end">
            <button className="btn border-slate-200 hover:border-slate-300 text-slate-600">Cancel</button>
            <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3">Save Changes</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AccountPanel;