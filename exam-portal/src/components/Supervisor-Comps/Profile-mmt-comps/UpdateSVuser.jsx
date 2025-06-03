import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { logout } from "../../../features/authSlice";
import { useDispatch } from "react-redux";


const UpdateSVuser = ({SvUser}) => {


  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [sv, setSv] = useState(null);
  const [preview, setPreview] = useState(null); // For image preview
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSv = async () => {
      try {
        const response = await fetch(`http://localhost:3000/ProfileSv/${SvUser.user?.replace(/['"]+/g, "") }`);
        const data = await response.json();
        setSv(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the Supervisor:", error);
        setLoading(false);
      }
    };

    fetchSv();
  }, [SvUser]);

  useEffect(() => {
    if (sv) {
      setValue("nameofsv", sv.nameofsv || "");
      setValue("orgName", sv.orgName || "");
      setValue("photo", sv.photo || "");
      if (sv.photo) {
        setPreview(`http://localhost:3000/${sv.photo}`); // Adjust based on your image path
      }
    }
  }, [sv, setValue]);

  const UpdateSvFun = async (data) => {
    const { nameofsv, orgName, photo } = data;
    
    const formData = new FormData();
    formData.append("nameofsv", nameofsv);
    formData.append("orgName", orgName);
    if (photo && photo[0]) {
      formData.append("photo", photo[0]);
    }
  
    try {
      const response = await fetch(`http://localhost:3000/ProfileSv/Update-supervisor/${SvUser.user?.replace(/['"]+/g, "") }`, {
        method: "PUT",
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toast.success("Supervisor updated successfully!");
  
        // 🔥 Fetch updated data from the server and update the state
        const updatedResponse = await fetch(`http://localhost:3000/ProfileSv/${SvUser.user?.replace(/['"]+/g, "") }`);
        const updatedData = await updatedResponse.json();
        setSv(updatedData);
        dispatch(logout())
      
  
        // Reset form with updated values
        reset(updatedData);
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
    
  };

  const handleImagePreview = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (

      
      <form
      onSubmit={handleSubmit(UpdateSvFun)}
      className="w-full h-full flex-col  col-start-1 col-end-5 row-start-2 row-end-9 bg-white shadow-md p-3 rounded-md grid grid-cols-2 grid-rows-6 gap-2
      max-lg:grid-cols-1 max-lg:col-end-9 max-lg:row-end-5 "
    >
      <div className="font-semibold text-xl w-full mb-2 row-start-1 row-end-2 col-start-1 col-end-3 max-lg:col-end-2 ">
        Supervisor Info
      </div>

      <div className="flex flex-col justify-end items-center place-self-end h-5/6 row-start-2 row-end-7 col-start-1 col-end-2 
                      w-full rounded-lg max-lg:flex-row max-lg:row-end-4 max-lg:col-end-2 ">
      {preview ? (
       
        <img
        src={preview}
        alt=""
        className="w-full h-full row-start-1 row-end-4 col-start-1 col-end-2
          border border-orange-500 rounded-md object-cover m-1 max-lg:object-contain max-lg:w-1/3"
      />
        ) : (
          <p className="h-5/6 w-full flex items-center justify-center text-xl">+ Add Photo</p>
        )}
          <input
            type="file"
            accept="image/*"
            className="form_input h-1/6 w-full rounded-lg border bg-white justify-self-start self-end max-lg:h-full max-lg:w-2/3"
            {...register("photo")}
            onChange={handleImagePreview}
          />
      </div>


      <div className='flex flex-col place-self-center w-full'>
          <label htmlFor="nameofsv" className='text-xs text-orange-500'>Name of Supervisor: </label>
          <input
              type="text"
              className='form_input'
              id="nameofsv"
              {...register('nameofsv', { required: "Exam Type is required" })}
          />
      </div>

      <div className='flex flex-col place-self-center w-full'>
          <label htmlFor="orgName" className='text-xs text-orange-500'>Company / School: </label>
          <input
              type="text"
              className='form_input'
              id="orgName"
              {...register('orgName', { required: "Exam Type is required" })}
          />
      </div>


        <button type="submit" className="update_btn row-start-6 row-end-7 col-start-2 col-end-3 max-lg:col-start-1 max-lg:col-end-2 justify-self-start self-end h-2/3 w-full">
          Update Supervisor
        </button>
      </form>
   
  );
};

export default UpdateSVuser;