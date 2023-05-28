import React, { useEffect, useState , lazy, Suspense} from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import * as reactRouterDom from "react-router-dom";


import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Fintech from './pages/Fintech';
import Customers from './pages/ecommerce/Customers';
import Orders from './pages/ecommerce/Orders';
import Invoices from './pages/ecommerce/Invoices';
import Shop from './pages/ecommerce/Shop';
import Shop2 from './pages/ecommerce/Shop2';
import Product from './pages/ecommerce/Product';
import Cart from './pages/ecommerce/Cart';
import Cart2 from './pages/ecommerce/Cart2';
import Cart3 from './pages/ecommerce/Cart3';
import Pay from './pages/ecommerce/Pay';
import Campaigns from './pages/Campaigns';
import UsersTabs from './pages/community/UsersTabs';
import UsersTiles from './pages/community/UsersTiles';
import Profile from './pages/community/Profile';
import Feed from './pages/community/Feed';
import Forum from './pages/community/Forum';
import ForumPost from './pages/community/ForumPost';
import Meetups from './pages/community/Meetups';
import MeetupsPost from './pages/community/MeetupsPost';
import CreditCards from './pages/finance/CreditCards';
import Transactions from './pages/finance/Transactions';
import TransactionDetails from './pages/finance/TransactionDetails';
import JobListing from './pages/job/JobListing';
import JobPost from './pages/job/JobPost';
import CompanyProfile from './pages/job/CompanyProfile';
import Messages from './pages/Messages';
import TasksKanban from './pages/tasks/TasksKanban';
import TasksList from './pages/tasks/TasksList';
import Inbox from './pages/Inbox';
import Calendar from './pages/Calendar';
import Account from './pages/settings/Account';
import Notifications from './pages/settings/Notifications';
import Apps from './pages/settings/Apps';
import Plans from './pages/settings/Plans';
import Billing from './pages/settings/Billing';
import Feedback from './pages/settings/Feedback';
import Changelog from './pages/utility/Changelog';
import Roadmap from './pages/utility/Roadmap';
import Faqs from './pages/utility/Faqs';
import EmptyState from './pages/utility/EmptyState';
import PageNotFound from './pages/utility/PageNotFound';
import KnowledgeBase from './pages/utility/KnowledgeBase';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Onboarding01 from './pages/Onboarding01';
import Onboarding02 from './pages/Onboarding02';
import Onboarding03 from './pages/Onboarding03';
import Onboarding04 from './pages/Onboarding04';
import ButtonPage from './pages/component/ButtonPage';
import FormPage from './pages/component/FormPage';
import DropdownPage from './pages/component/DropdownPage';
import AlertPage from './pages/component/AlertPage';
import ModalPage from './pages/component/ModalPage';
import PaginationPage from './pages/component/PaginationPage';
import TabsPage from './pages/component/TabsPage';
import BreadcrumbPage from './pages/component/BreadcrumbPage';
import BadgePage from './pages/component/BadgePage';
import AvatarPage from './pages/component/AvatarPage';
import TooltipPage from './pages/component/TooltipPage';
import AccordionPage from './pages/component/AccordionPage';
import IconsPage from './pages/component/IconsPage';




// import DashboardHome from './pages/Dashboard_Home';
const DashboardHome = lazy(() => import('./pages/Dashboard_Home'));

import MedicalCaseList from './pages/medical_center/MedicalCaseList';
import LabCaseList from './pages/lab_center/MedicalCaseList';

import SuperTokensRequest from 'supertokens-website';
import axios from "axios";
SuperTokensRequest.addAxiosInterceptors(axios);

// import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";
import SuperTokens, { SuperTokensWrapper, getSuperTokensRoutesForReactRouterDom,  } from "supertokens-auth-react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";


import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from "./redux/UserSlice";
import { fetchHospital } from "./redux/MyHospitalSlice";

import { ProgressBar } from "react-loader-spinner";
import LoaderPage from './utils/LoadingPage1';
import CaseEditing from "./pages/medical_case/CaseEditing"
import LabCaseEditing from "./pages/lab_case/CaseEditing"
import CaseCreating from "./pages/medical_case/CaseCreating"
import LabCaseCreating from "./pages/lab_case/CaseCreating"


// First Reponseders

import TrafficAlert from "./pages/ambulance/TrafficAlert";


// Appointments

import Appointment from "./pages/appointments/AppointmentTablePage";
import AppointmentEditPage from "./pages/appointments/AppointmentEditPage";
// 

import PatientProfile from "./pages/patient_profile/PatientProfile";

SuperTokens.init({
    appInfo: {
        appName: "Hackathon",
        apiDomain: process.env.API_URL,
        websiteDomain: process.env.WEBSITE_DOMAIN,
        apiBasePath: "/auth",
        websiteBasePath: "/auth",
    },
    recipeList: [
        EmailPassword.init({
          style: `
          [data-supertokens~=button] {
            background-color: #252571;
            border: 0px;
            width: 30%;
            margin: 0 auto;
          }
          [data-supertokens~=container] {
            --palette-superTokensBrandingBackground: #ffffff;
            --palette-superTokensBrandingText: #ffffff;
          }
            `
        }),
        Session.init()
    ]
});


function App() {

  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const hospital = useSelector((state) => state.hospital)
  

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  useEffect(() => {

    const getUser = async() => {
      if(await Session.doesSessionExist()){
        dispatch(fetchUser())
        // if(alphax.data.roles.includes("doctor")){
        //   dispatch(fetchHospital())
        // }
      }
    }

    getUser();
  },[dispatch]);


  if(!user) return <LoaderPage/>
  if(user){
    if(user.data && user.data.roles ){
      if(user.data.roles.includes("doctor")){
        if(!hospital.data) dispatch(fetchHospital())
      }
    }
  }
  return (
    <>
      <SuperTokensWrapper>

        <Suspense fallback={<LoaderPage />}>
        <Routes>

            {getSuperTokensRoutesForReactRouterDom(reactRouterDom)}
            <Route exact path="/" element={
              <SessionAuth>
                  <DashboardHome />
              </SessionAuth>
            } />
            <Route exact path="/dashboard/home" element={
              <SessionAuth>
                  <DashboardHome />
              </SessionAuth>
            } />
            <Route exact path="/case/list" element={
              <Suspense fallback={<LoaderPage />}>
                <SessionAuth>
                    <MedicalCaseList />
                </SessionAuth>
              </Suspense>
            } />
            <Route exact path="/lab/list" element={
              <Suspense fallback={<LoaderPage />}>
                <SessionAuth>
                    <LabCaseList />
                </SessionAuth>
              </Suspense>
            } />
            <Route exact path="/case/edit/:id" element={
              <Suspense fallback={<LoaderPage />}>
                <SessionAuth>
                    <CaseEditing />
                </SessionAuth>
              </Suspense>
            } />
             <Route exact path="/case/create" element={
              <Suspense fallback={<LoaderPage />}>
                <SessionAuth>
                    <CaseCreating />
                </SessionAuth>
              </Suspense>
            } />

            <Route exact path="/case/lab/edit/:id" element={
              <Suspense fallback={<LoaderPage />}>
                <SessionAuth>
                    <LabCaseEditing />
                </SessionAuth>
              </Suspense>
            } />
            <Route exact path="/case/lab/create" element={
              <Suspense fallback={<LoaderPage />}>
                <SessionAuth>
                    <LabCaseCreating />
                </SessionAuth>
              </Suspense>
            } />

            <Route exact path="/traffic/alert" element={
              <Suspense fallback={<LoaderPage />}>
                <SessionAuth>
                    <TrafficAlert />
                </SessionAuth>
              </Suspense>
            } />

            <Route exact path="/appointments" element={
              <Suspense fallback={<LoaderPage />}>
                <SessionAuth>
                    <Appointment />
                </SessionAuth>
              </Suspense>
            } />

            <Route exact path="/patient/profile/:id" element={
              <Suspense fallback={<LoaderPage />}>
                <SessionAuth>
                    <PatientProfile />
                </SessionAuth>
              </Suspense>
            } />

            <Route exact path="/appointments/edit/:id" element={
              <Suspense fallback={<LoaderPage />}>
                <SessionAuth>
                    <AppointmentEditPage />
                </SessionAuth>
              </Suspense>
            } />
            <Route path="/dashboard/analytics" element={<Analytics />} />
            <Route path="/dashboard/fintech" element={<Fintech />} />
            <Route path="/ecommerce/customers" element={<Customers />} />
            <Route path="/ecommerce/orders" element={<Orders />} />
            <Route path="/ecommerce/invoices" element={<Invoices />} />
            <Route path="/ecommerce/shop" element={<Shop />} />
            <Route path="/ecommerce/shop-2" element={<Shop2 />} />
            <Route path="/ecommerce/product" element={<Product />} />
            <Route path="/ecommerce/cart" element={<Cart />} />
            <Route path="/ecommerce/cart-2" element={<Cart2 />} />
            <Route path="/ecommerce/cart-3" element={<Cart3 />} />
            <Route path="/ecommerce/pay" element={<Pay />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/community/users-tabs" element={<UsersTabs />} />
            <Route path="/community/users-tiles" element={<UsersTiles />} />
            <Route path="/community/profile" element={<Profile />} />
            <Route path="/community/feed" element={<Feed />} />
            <Route path="/community/forum" element={<Forum />} />
            <Route path="/community/forum-post" element={<ForumPost />} />
            <Route path="/community/meetups" element={<Meetups />} />
            <Route path="/community/meetups-post" element={<MeetupsPost />} />
            <Route path="/finance/cards" element={<CreditCards />} />
            <Route path="/finance/transactions" element={<Transactions />} />
            <Route path="/finance/transaction-details" element={<TransactionDetails />} />
            <Route path="/job/job-listing" element={<JobListing />} />
            <Route path="/job/job-post" element={<JobPost />} />
            <Route path="/job/company-profile" element={<CompanyProfile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/tasks/kanban" element={<TasksKanban />} />
            <Route path="/tasks/list" element={<TasksList />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/settings/account" element={<Account />} />
            <Route path="/settings/notifications" element={<Notifications />} />
            <Route path="/settings/apps" element={<Apps />} />
            <Route path="/settings/plans" element={<Plans />} />
            <Route path="/settings/billing" element={<Billing />} />
            <Route path="/settings/feedback" element={<Feedback />} />
            <Route path="/utility/changelog" element={<Changelog />} />
            <Route path="/utility/roadmap" element={<Roadmap />} />
            <Route path="/utility/faqs" element={<Faqs />} />
            <Route path="/utility/empty-state" element={<EmptyState />} />
            <Route path="/utility/404" element={<PageNotFound />} />
            <Route path="/utility/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/onboarding-01" element={<Onboarding01 />} />
            <Route path="/onboarding-02" element={<Onboarding02 />} />
            <Route path="/onboarding-03" element={<Onboarding03 />} />
            <Route path="/onboarding-04" element={<Onboarding04 />} />
            <Route path="/component/button" element={<ButtonPage />} />
            <Route path="/component/form" element={<FormPage />} />
            <Route path="/component/dropdown" element={<DropdownPage />} />
            <Route path="/component/alert" element={<AlertPage />} />
            <Route path="/component/modal" element={<ModalPage />} />
            <Route path="/component/pagination" element={<PaginationPage />} />
            <Route path="/component/tabs" element={<TabsPage />} />
            <Route path="/component/breadcrumb" element={<BreadcrumbPage />} />
            <Route path="/component/badge" element={<BadgePage />} />
            <Route path="/component/avatar" element={<AvatarPage />} />
            <Route path="/component/tooltip" element={<TooltipPage />} />
            <Route path="/component/accordion" element={<AccordionPage />} />
            <Route path="/component/icons" element={<IconsPage />} />
            <Route path="*" element={<PageNotFound />} />

        </Routes>

        </Suspense>
      </SuperTokensWrapper>
    </>
  );
}

export default App;