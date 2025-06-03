import React, { useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Forgetpasscomp from '../Supervisor-Comps/Profile-mmt-comps/PasswordResetComp';
import {useLocation } from 'react-router-dom';

const ForgotPage = ({}) => {

    const location = useLocation();
    const  emailID= location.state?.emailID; 
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

  useEffect(() => {
    if (emailID) {
      setEmail(emailID);
    }
  }, [emailID]); 


  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-md p-8 flex flex-col gap-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Forgot Password</h1>

        <div className="w-full">
        <label className="block text-sm font-medium text-gray-600 mb-1">
            Email Address
        </label>
        <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly={!!emailID} 
        />
        </div>

        <Forgetpasscomp email={email} />

        {!emailID ? (
        <p
            className="text-sm font-medium text-blue-500 hover:underline cursor-pointer text-center"
            onClick={() => navigate("/login-user")}
        >
            Back to Login
        </p>
        ) : (
        <p
            className="text-sm font-medium text-blue-500 hover:underline cursor-pointer text-center"
            onClick={() => navigate("/exam")}
        >
            Back to Home
        </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPage;
