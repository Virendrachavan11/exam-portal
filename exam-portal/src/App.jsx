import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';


import RoleBasedRoute from "./components/UI-Data/RoleBasedRoute";
import './App.css';
import Exam_Display from './components/User-comps/Exam-display-comp/Exam_Display';
import ExamHome from './components/User-comps/ExamHome';
import ManageExam from './components/Supervisor-Comps/Exam-manage-comps/ManageExam';
import ExamSettingView from "./components/Supervisor-Comps/Exam-manage-comps/ExamSettingView";
import SvDash from './components/Supervisor-Comps/SvDash';
import DashHomeSv from './components/Supervisor-Comps/Exam-manage-comps/DashHomeSv';
import LoginPage from "./components/Auth-Comps/LoginPage";
import SignupPage from "./components/Auth-Comps/SignupPage";
import ManageCand from "./components/Supervisor-Comps/Manage-cand-comps/ManageCand";
import SvProfileBase from "./components/Supervisor-Comps/Profile-mmt-comps/profileMmtBase";
import ExamLpbase from "./components/Supervisor-Comps/Exam-launchpad-comps/ExamLpbase";
import ResultList from "./components/Supervisor-Comps/Result-manage-comps/ResultList";
import CandResultList from "./components/Supervisor-Comps/Result-manage-comps/CandResultList";
import EndExamScreen from "./components/User-comps/Exam-display-comp/EndExamScreen";
import ForgotPage from "./components/Auth-Comps/ForgotPage";
import CandQnaList from "./components/Supervisor-Comps/Result-manage-comps/CandQnaList";

import Home from "./components/Auth-Comps/Home";

import Adminbase from "./components/Admin-Comps/SuperAdminBaseComp";


const App = () => {
  
  const LogedUser= useSelector((state) => state.auth, shallowEqual);

if (process.env.NODE_ENV === 'production') {
  const PRODUCTION_BACKEND_URL = 'https://exam-portal-backend-hvq6.onrender.com';
  console.log(PRODUCTION_BACKEND_URL)

  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].startsWith('http://localhost:3000')
    ) {
      args[0] = args[0].replace('http://localhost:3000', PRODUCTION_BACKEND_URL);
    }
    return originalFetch(...args);
  };
}

 

// Define all routes here
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
    },
    {
      path: "/login-user",
      element: <LoginPage />,
    },
    {
      path: "/Forgot-Password",
      element: <ForgotPage />,
    },
    {
      path: "/signup-user",
      // element: <SignupPage /> ,
      element: <SignupPage /> ,
    },
    {
      path: "/exam",
      element:
      (
        <RoleBasedRoute allowedRoles={["Candidate"]}>
          <ExamHome LogedUser={LogedUser} />
        </RoleBasedRoute>
      ) ,
      
    },
    {
      path: "/exam/:id/:sid",
      element:
      (
        <RoleBasedRoute allowedRoles={["Candidate"]}>
          <Exam_Display LogedUser={LogedUser} />
        </RoleBasedRoute>
      ) ,
    },
    {
      path: "/exam/End-Exam",
      element:
      (
        <RoleBasedRoute allowedRoles={["Candidate"]}>
          <EndExamScreen LogedUser={LogedUser} />
        </RoleBasedRoute>
      ) ,
      
    },
    {
      path: "/sv-dashboard",
      element: (
        <RoleBasedRoute allowedRoles={["Supervisor"]}>
          <div className="flex">
            <SvDash LogedUser={LogedUser} />
            <Outlet />
          </div>
        </RoleBasedRoute>
      ),
      children: [
        {
          path: "dashboard-home",
          element: <DashHomeSv LogedUser={LogedUser}/>,
        },
        {
          path: "manage-exam",
          element: <ManageExam LogedUser={LogedUser}/>,
        },
        {
          path: "manage-exam/:id",
          element: <ExamSettingView LogedUser={LogedUser}/>,
        },
        {
          path: "manage-candidate",
          element: <ManageCand LogedUser={LogedUser} />,
        },
        {
          path: "profile-manage",
          element: <SvProfileBase LogedUser={LogedUser} />,
        },
        {
          path: "exam-launchpad",
          element: <ExamLpbase LogedUser={LogedUser} />,
        },
        {
          path: "Result-List",
          element: <ResultList LogedUser={LogedUser} />,
        },
        {
          path: "Result-List/CandList",
          element: <CandResultList LogedUser={LogedUser} />,
        },
        {
          path: "Result-List/CandList/qna",
          element: <CandQnaList LogedUser={LogedUser} />,
        },
      ],
    },

    {
      path: "/admin-panel",
      element: (
        <RoleBasedRoute allowedRoles={["Admin"]}>
          {/* <div className="flex">
            <Adminbase />
            <Outlet />
          </div> */}

        <Adminbase LogedUser={LogedUser}/>

        </RoleBasedRoute>


      ),
      children: [

        
      ],
    },
    {
      path: "/unauthorized",
      element: <div>access denied</div>,
    },
  ]);

  return (
    <div>
       <Toaster />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;

