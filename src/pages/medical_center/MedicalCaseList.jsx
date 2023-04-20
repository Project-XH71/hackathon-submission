import React, { useState } from 'react';
import ModalBasic from '../../components/ModalBasic';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import DeleteButton from '../../partials/actions/DeleteButton';
import DateSelect from '../../components/DateSelect';
import FilterButton from '../../components/DropdownFilter';
import MedicalTable from '../../partials/medical_cases_item/MedicalTable';
import PaginationClassic from '../../components/PaginationClassic';
import Tooltip from '../../components/Tooltip';

import { useParams, useNavigate } from 'react-router-dom';

function SearchForm({
  placeholder,
  setSearchFunction,
  searchValue,
  onClick
}) {

  const click = (e) => {
    e.preventDefault();
    onClick();
  }

  return (
    <form className="relative">
      <label htmlFor="action-search" className="sr-only">Search</label>
      <input value={searchValue} onChange={(e) => setSearchFunction(e.target.value)} id="action-search" className="form-input pl-9 focus:border-slate-300" type="search" placeholder={placeholder} />
      <button onClick={click} className="absolute inset-0 right-auto group" type="submit" aria-label="Search">
        <svg className="w-4 h-4 shrink-0 fill-current text-slate-400 group-hover:text-slate-500 ml-3 mr-2" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
          <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
        </svg>
      </button>
    </form>
  );
}


function Invoices() {
  const navigate = useNavigate();
  // const [ vpa, setVpa ] = useState('');
  const [search,setSearch] = useState('');
  const [searchButtonIsPressed, setSearchButtonIsPressed] = useState(false);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const handleSelectedItems = (selectedItems) => {
    setSelectedItems([...selectedItems]);
  };

  const searchButtonPressed = async() => {
    alert("This is Searched Event: " ,search);
    setSearchButtonIsPressed(true);
  }

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
            <div className="sm:flex sm:justify-between sm:items-center mb-5">

              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Medical Cases ⚕️</h1>
              </div>
              

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {/* Search form */}
                <SearchForm onClick={searchButtonPressed} searchValue={search} setSearchFunction={setSearch} placeholder="Search Cases" />

                {/* Basic Modal */}
                
                {/* Create invoice button */}
                <button onClick={(e) => { navigate("/case/create")}} className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                  <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="hidden xs:block ml-2">Create Medical Cases</span>
                </button>
              </div>
              

            </div>

            {/* More actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-5">

              {/* Left side */}
              <div className="mb-4 sm:mb-0">
                <ul className="flex flex-wrap -m-1">
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-indigo-500 text-white duration-150 ease-in-out">All <span className="ml-1 text-indigo-200">67</span></button>
                  </li>
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out">Paid <span className="ml-1 text-slate-400">14</span></button>
                  </li>
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out">Due <span className="ml-1 text-slate-400">34</span></button>
                  </li>
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out">Overdue <span className="ml-1 text-slate-400">19</span></button>
                  </li>
                </ul>
              </div>

              {/* Right side */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {/* Delete button */}
                <DeleteButton selectedItems={selectedItems} />
                {/* Dropdown */}
                <DateSelect />
                {/* Filter button */}
                <FilterButton align="right" />
              </div>

            </div>

            

            {/* Table */}
            <MedicalTable sButton={searchButtonIsPressed} searchQuery={search} selectedItems={handleSelectedItems} />

            {/* Pagination */}
            <div className="mt-8">
              <PaginationClassic /> 
            </div>

          </div>
        </main>

      </div>

    </div>
  );
}

export default Invoices;