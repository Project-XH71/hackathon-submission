import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import SidebarLinkGroup from './SidebarLinkGroup';
import { useDispatch, useSelector } from 'react-redux';






function Sidebar({
  sidebarOpen,
  setSidebarOpen
}) {
  // const roles = (useSelector((state) => state.user.data.roles));
  const roles=["doctor"]
  const SidebarConfiguration = [
    {
      "op":"group",
      "title":"Hospital Administration",
      "sub_menu":[
        {
          "op":"sub_group",
          "title":"Dashboard",
          "path":"dashboard",
          "sub_menu_2":[
            {
              "op":"sub_group_2",
              "title":"Analytics",
              "path":"/dashboard/home",
              logo: () => {
                return(
                  <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                          <path
                            className={`fill-current text-slate-600 ${pathname.includes('inbox') && 'text-indigo-500'}`}
                            d="M16 13v4H8v-4H0l3-9h18l3 9h-8Z"
                          />
                          <path
                            className={`fill-current text-slate-400 ${pathname.includes('inbox') && 'text-indigo-300'}`}
                            d="m23.72 12 .229.686A.984.984 0 0 1 24 13v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-8c0-.107.017-.213.051-.314L.28 12H8v4h8v-4H23.72ZM13 0v7h3l-4 5-4-5h3V0h2Z"
                          />
                    </svg>
                );
              }
            },
            // {
            //   "op":"sub_group_2",
            //   "title":"Hospital Admin",
            //   "path":"/dashboard"
            // },
            // {
            //   "op":"sub_group_2",
            //   "title":"Goverment Admin",
            //   "path":"/dashboard"
            // }
          ]
        },
        {
          "op":"sub_link",
          "title":"Medical Center",
          "path":"case",
          "requireRole":["doctor"],
          "to":"/case/list",
          logo: () => {
            return(
              <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                      <path
                        className={`fill-current text-slate-600 ${pathname.includes('inbox') && 'text-indigo-500'}`}
                        d="M16 13v4H8v-4H0l3-9h18l3 9h-8Z"
                      />
                      <path
                        className={`fill-current text-slate-400 ${pathname.includes('inbox') && 'text-indigo-300'}`}
                        d="m23.72 12 .229.686A.984.984 0 0 1 24 13v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-8c0-.107.017-.213.051-.314L.28 12H8v4h8v-4H23.72ZM13 0v7h3l-4 5-4-5h3V0h2Z"
                      />
                </svg>
            );
          }
        },
        {
          "op":"sub_link",
          "title":"Medical Case",
          "path":"case",
          "requireRole":["doctor"],
          "to":"/case/edit/:id",
          logo: () => {
            return(
              <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
              <path className={`fill-current text-slate-600 ${pathname.includes('calendar') && 'text-indigo-500'}`} d="M1 3h22v20H1z" />
              <path
                className={`fill-current text-slate-400 ${pathname.includes('calendar') && 'text-indigo-300'}`}
                d="M21 3h2v4H1V3h2V1h4v2h10V1h4v2Z"
              />
            </svg>
            );
          }
        }
      ],
      
    },
    {
      "op":"group",
      "title":"Lab Administration",
      "sub_menu":[
        {
          "op":"sub_link",
          "title":"Create Reportss",
          "path":"case",
          "requireRole":["doctor"],
          "to":"/lab/edit",
          logo: () => {
            return(
              <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
              <path
                className={`fill-current text-slate-400 ${pathname.includes('finance') && 'text-indigo-300'}`}
                d="M13 6.068a6.035 6.035 0 0 1 4.932 4.933H24c-.486-5.846-5.154-10.515-11-11v6.067Z"
              />
              <path
                className={`fill-current text-slate-700 ${pathname.includes('finance') && '!text-indigo-500'}`}
                d="M18.007 13c-.474 2.833-2.919 5-5.864 5a5.888 5.888 0 0 1-3.694-1.304L4 20.731C6.131 22.752 8.992 24 12.143 24c6.232 0 11.35-4.851 11.857-11h-5.993Z"
              />
              <path
                className={`fill-current text-slate-600 ${pathname.includes('finance') && 'text-indigo-600'}`}
                d="M6.939 15.007A5.861 5.861 0 0 1 6 11.829c0-2.937 2.167-5.376 5-5.85V0C4.85.507 0 5.614 0 11.83c0 2.695.922 5.174 2.456 7.17l4.483-3.993Z"
              />
            </svg>
            );
          }
        },
        {
          "op":"sub_link",
          "title":"Lab Center",
          "path":"case",
          "requireRole":["doctor"],
          "to":"/lab/list",
          logo: () => {
            return(
              <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                      <path
                        className={`fill-current text-slate-600 ${pathname.includes('inbox') && 'text-indigo-500'}`}
                        d="M16 13v4H8v-4H0l3-9h18l3 9h-8Z"
                      />
                      <path
                        className={`fill-current text-slate-400 ${pathname.includes('inbox') && 'text-indigo-300'}`}
                        d="m23.72 12 .229.686A.984.984 0 0 1 24 13v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-8c0-.107.017-.213.051-.314L.28 12H8v4h8v-4H23.72ZM13 0v7h3l-4 5-4-5h3V0h2Z"
                      />
                </svg>
            );
          }
        },
        {
          "op":"sub_link",
          "title":"Lab Reports",
          "path":"case",
          "requireRole":["doctor"],
          "to":"/case/edit/:id",
          logo: () => {
            return(
              <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
              <circle
                className={`fill-current text-slate-400 ${pathname.includes('utility') && 'text-indigo-300'}`}
                cx="18.5"
                cy="5.5"
                r="4.5"
              />
              <circle
                className={`fill-current text-slate-600 ${pathname.includes('utility') && 'text-indigo-500'}`}
                cx="5.5"
                cy="5.5"
                r="4.5"
              />
              <circle
                className={`fill-current text-slate-600 ${pathname.includes('utility') && 'text-indigo-500'}`}
                cx="18.5"
                cy="18.5"
                r="4.5"
              />
              <circle
                className={`fill-current text-slate-400 ${pathname.includes('utility') && 'text-indigo-300'}`}
                cx="5.5"
                cy="18.5"
                r="4.5"
              />
            </svg>  
            );
          }
        },
        
      ],
      
    },
    {
      "op":"group",
      "title":"Profile Configuration",
      "sub_menu":[
        // {
        //   "op":"sub_group",
        //   "title":"Dashboard",
        //   "path":"dashboard",
        //   "sub_menu_2":[
        //     {
        //       "op":"sub_group_2",
        //       "title":"User Admin",
        //       "path":"/dashboard/home"
        //     },
        //     {
        //       "op":"sub_group_2",
        //       "title":"Hospital Admin",
        //       "path":"/dashboard"
        //     },
        //     {
        //       "op":"sub_group_2",
        //       "title":"Goverment Admin",
        //       "path":"/dashboard"
        //     }
        //   ]
        // },
        {
          "op":"sub_link",
          "title":"System Settings",
          "path":"case",
          "requireRole":["doctor"],
          "to":"/case/list",
          logo: () => {
            return(
              <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                              <path
                                className={`fill-current text-slate-600 ${pathname.includes('settings') && 'text-indigo-500'}`}
                                d="M19.714 14.7l-7.007 7.007-1.414-1.414 7.007-7.007c-.195-.4-.298-.84-.3-1.286a3 3 0 113 3 2.969 2.969 0 01-1.286-.3z"
                              />
                              <path
                                className={`fill-current text-slate-400 ${pathname.includes('settings') && 'text-indigo-300'}`}
                                d="M10.714 18.3c.4-.195.84-.298 1.286-.3a3 3 0 11-3 3c.002-.446.105-.885.3-1.286l-6.007-6.007 1.414-1.414 6.007 6.007z"
                              />
                              <path
                                className={`fill-current text-slate-600 ${pathname.includes('settings') && 'text-indigo-500'}`}
                                d="M5.7 10.714c.195.4.298.84.3 1.286a3 3 0 11-3-3c.446.002.885.105 1.286.3l7.007-7.007 1.414 1.414L5.7 10.714z"
                              />
                              <path
                                className={`fill-current text-slate-400 ${pathname.includes('settings') && 'text-indigo-300'}`}
                                d="M19.707 9.292a3.012 3.012 0 00-1.415 1.415L13.286 5.7c-.4.195-.84.298-1.286.3a3 3 0 113-3 2.969 2.969 0 01-.3 1.286l5.007 5.006z"
                              />
                            </svg>
            );
          }
        },
        {
          "op":"sub_link",
          "title":"My Profile",
          "path":"case",
          "requireRole":["doctor"],
          "to":"/case/edit/:id",
          logo: () => {
            return(
              <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                              <path
                                className={`fill-current text-slate-600 ${pathname.includes('community') && 'text-indigo-500'}`}
                                d="M18.974 8H22a2 2 0 012 2v6h-2v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5h-2v-6a2 2 0 012-2h.974zM20 7a2 2 0 11-.001-3.999A2 2 0 0120 7zM2.974 8H6a2 2 0 012 2v6H6v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5H0v-6a2 2 0 012-2h.974zM4 7a2 2 0 11-.001-3.999A2 2 0 014 7z"
                              />
                              <path
                                className={`fill-current text-slate-400 ${pathname.includes('community') && 'text-indigo-300'}`}
                                d="M12 6a3 3 0 110-6 3 3 0 010 6zm2 18h-4a1 1 0 01-1-1v-6H6v-6a3 3 0 013-3h6a3 3 0 013 3v6h-3v6a1 1 0 01-1 1z"
                              />
                            </svg>
            );
          }
        }
      ],
      
    }
  ]
  

  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true');

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector('body').classList.add('sidebar-expanded');
    } else {
      document.querySelector('body').classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-900 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/" className="block">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <defs>
                <linearGradient x1="28.538%" y1="20.229%" x2="100%" y2="108.156%" id="logo-a">
                  <stop stopColor="#A5B4FC" stopOpacity="0" offset="0%" />
                  <stop stopColor="#A5B4FC" offset="100%" />
                </linearGradient>
                <linearGradient x1="88.638%" y1="29.267%" x2="22.42%" y2="100%" id="logo-b">
                  <stop stopColor="#38BDF8" stopOpacity="0" offset="0%" />
                  <stop stopColor="#38BDF8" offset="100%" />
                </linearGradient>
              </defs>
              <rect fill="#6366F1" width="32" height="32" rx="16" />
              <path d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z" fill="#4F46E5" />
              <path
                d="M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z"
                fill="url(#logo-a)"
              />
              <path
                d="M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z"
                fill="url(#logo-b)"
              />
            </svg>
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">

          { SidebarConfiguration.map((element, index) => {
            return (
              <div key={index}>
                <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
                  <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                    •••
                  </span>
                  <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">{element.title}</span>
                </h3>

                <ul className="mt-3">
                { element.sub_menu.map((sub_element, sub_index) => {
                  if(sub_element.op == "sub_group"){
                    return(
                    
                      <SidebarLinkGroup activecondition={pathname === '/' || pathname.includes(`${sub_element.path}`)}>
                      {(handleClick, open) => {
                        return (
                          <React.Fragment key={sub_index}>
                            <a
                              href="#0"
                              className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                                (pathname === '/' || pathname.includes(`${sub_element.path}`)) && 'hover:text-slate-200'
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                                    <path
                                      className={`fill-current text-slate-400 ${
                                        (pathname === '/' || pathname.includes(`${sub_element.path}`)) && '!text-indigo-500'
                                      }`}
                                      d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
                                    />
                                    <path
                                      className={`fill-current text-slate-600 ${(pathname === '/' || pathname.includes(`${sub_element.path}`)) && 'text-indigo-600'}`}
                                      d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"
                                    />
                                    <path
                                      className={`fill-current text-slate-400 ${(pathname === '/' || pathname.includes(`${sub_element.path}`)) && 'text-indigo-200'}`}
                                      d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z"
                                    />
                                  </svg>
                                  <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    {sub_element.title}
                                  </span>
                                </div>
                                {/* Icon */}
                                <div className="flex shrink-0 ml-2">
                                 {sub_element.logo}
                                </div>
                              </div>
                            </a>
                            <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                              <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>

                                {sub_element.sub_menu_2.map((sub_sub_element, sub_sub_index) => {
                                  return(
                                      <li className="mb-1 last:mb-0" key={sub_sub_index}>
                                        <NavLink
                                          end
                                          to={sub_sub_element.path}
                                          className={({ isActive }) =>
                                            'block text-slate-400 hover:text-slate-200 transition duration-150 truncate ' + (isActive ? '!text-indigo-500' : '')
                                          }
                                        >
                                          <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                            {sub_sub_element.title}
                                          </span>
                                        </NavLink>
                                      </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </React.Fragment>
                        );
                      }}
                    </SidebarLinkGroup>
                  )
                  } 
                  if(sub_element.op == "sub_link" && sub_element.requireRole.some( ai => roles.includes(ai) )){
                      return(
                          <li key={sub_index} className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname.includes(`${sub_element.path}`) && 'bg-slate-900'}`}>
                              <NavLink
                                end
                                to={sub_element.to}
                                className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                                  pathname.includes(`${sub_element.path}`) && 'hover:text-slate-200'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="grow flex items-center">
                                    <sub_element.logo />
                                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                      {sub_element.title}
                                    </span>
                                  </div>
                                  {/* Badge */}
                                  {/* <div className="flex flex-shrink-0 ml-2">
                                    <span className="inline-flex items-center justify-center h-5 text-xs font-medium text-white bg-indigo-500 px-2 rounded">4</span>
                                  </div> */}
                                </div>
                              </NavLink>
                            </li>
                    )
                  }
                  
                })}
                </ul>
              </div>
            )
          })}

          
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="w-6 h-6 fill-current sidebar-expanded:rotate-180" viewBox="0 0 24 24">
                <path className="text-slate-400" d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z" />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;