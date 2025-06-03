import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const AddCandComp = ({ SvUser,handleCandAdded }) => {


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      EmailId: "",
      Password: "",
      nameofCand: "",
      rollNo: "",
    },
  });

  const [preview, setPreview] = useState(null); // For image preview

  const SendLogData = async (data) => {
    const { EmailId, Password, nameofCand, rollNo, photo } = data;
  
    const formData = new FormData();
    formData.append("EmailId", EmailId);
    formData.append("Password", Password);
    formData.append("nameofCand", nameofCand);
    formData.append("rollNo", rollNo);
    formData.append("createdby", SvUser); // Add createdby to the request
    if (photo[0]) {
      formData.append("photo", photo[0]); // Append image if uploaded
    }
  
    toast.promise(
      fetch("http://localhost:3000/user/signup", {
        method: "POST",
        body: formData,
      }).then(async (response) => {
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || 'Failed to create candidate account');
        }
  
        // Success logic
        if (handleCandAdded) {
          handleCandAdded(data.candidate);
        }
  
        reset();
        setPreview(null);
  
        return data.candidate?.nameofCand || "Candidate"; // used in success message
      }),
      {
        loading: "Creating account...",
        success: (name) => `${name}'s account added successfully!`,
        error: (err) => `${err.message} `,
      }
    );
  };
  

  // Update preview when an image is selected
  const handleImagePreview = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  return (
    <form
    onSubmit={handleSubmit(SendLogData, (formErrors) => {
      const firstError = Object.values(formErrors)[0];
      toast.error(firstError?.message || "Please fill all required fields.");
    })}
      className="w-full h-full col-start-1 col-end-6 row-start-2 row-end-6 bg-white shadow-md p-3 rounded-md grid grid-cols-3 grid-rows-6 gap-2
                  max-lg:col-end-9 max-lg:row-end-5 max-[500px]:grid-cols-2">

      <div className="font-semibold text-xl w-full mb-2 row-start-1 row-end-2 col-start-1 col-end-3">
        Add Candidate
      </div>

      <div className="flex flex-col justify-end items-center place-self-end h-5/6 row-start-1 row-end-7 col-start-1 col-end-2 
                      w-full  bg-orange-100 rounded-lg p-1">

        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-5/6 w-full rounded-lg object-cover mb-1"
          />
        ) : (
          <p className="h-5/6 w-full flex items-center justify-center text-xl">+ Add Photo</p>
        )}

        <input
          type="file"
          accept="image/*"
          className="form_input h-1/6 w-full rounded-lg border bg-white"
          {...register('photo')}
          onChange={handleImagePreview} // Update preview on image selection
        />

      </div>

      <input
        type="text"
        className="form_input flex flex-col row-start-2 row-end-3 col-start-2 col-end-4 place-self-center w-full "
        placeholder="Email ID of Candidate"
        {...register('EmailId', { required: "Email ID is required" })}
      />


      <input
        type="password"
        className="form_input flex flex-col row-start-3 row-end-4 col-start-2 col-end-4 place-self-center w-full"
        placeholder="Password"
        {...register('Password', { required: "Password is required" })}
      />
      
      <input
        type="text"
        className="form_input flex flex-col row-start-4 row-end-5 col-start-2 col-end-4 place-self-center w-full"
        placeholder="Name of Candidate"
        {...register('nameofCand', { required: "Name of Candidate is required" })}
      />


      <input
        type="text"
        className="form_input flex flex-col row-start-5 row-end-6 col-start-2 col-end-4 place-self-center w-full"
        placeholder="Roll No"
        {...register('rollNo', { required: "Roll no of Candidate is required" })}
      />




      <button
        type="submit"
        className="submit_btn w-full h-full place-self-center px-3 row-start-6 row-end-7 col-start-2 col-end-4 max-sm:text-sm max-[350px]:text-[10px]"
      >
        Create Candidate Account +
      </button>
    </form>
  );
};

export default AddCandComp;
