import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const SendLogData = async (data) => {
    

    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      

      if (!response.ok) throw new Error(result.message);

      dispatch(login(result));

      if (result.userType == "Supervisor")
      {
        navigate("/sv-dashboard/manage-exam")
      }
      else if(result.userType == "Admin"){
        navigate("/admin-panel")
      }
      else{
        navigate("/exam")
      }
    } catch (error) {
      toast.error(error.message); 
    }
  };

  return (
    <div className='w-full h-[100vh] flex items-center justify-center'>
        
        <form onSubmit={handleSubmit(SendLogData)} 
        className='bg-white w-1/3 h-2/3 shadow-md rounded-md flex flex-col items-center justify-between p-5 text-xl
                    max-lg:w-2/3 max-sm:w-4/5'>

            <h1 className='text-4xl font-semibold w-full text-left'>Login To Exam Portal</h1>

            <input type="text" name="EmailId"
            {...register('EmailId', { required: true })} 
             placeholder='Email ID' className='form_input w-full h-1/6'/>

            <input type="Password" name="Password"
            {...register('Password', { required: true })}   
            placeholder='Password' className='form_input w-full h-1/6'/>

            <button type="submit" className='submit_btn w-full h-1/6'>Submit</button>
            <p
              className="text-sm font-semibold text-blue-500 mb-2 hover:underline cursor-pointer"
              onClick={() => navigate("/Forgot-Password")}
            >
              Forgot Password
            </p>
            
        </form>
        


    </div>
  )
}

export default LoginPage