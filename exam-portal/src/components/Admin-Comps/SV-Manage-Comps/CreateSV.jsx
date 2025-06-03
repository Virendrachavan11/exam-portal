import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

const CreateSV = ({ SuperAdmUser, handleSVAdded }) => {
  const createdby = SuperAdmUser;
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      EmailId: '',
      Password: '',
      nameofuser: '',
      org: '',
      ContactNumber: '',
    },
  });

  const handleImagePreview = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleValidationErrors = async () => {
    const valid = await trigger();
    if (!valid) {
      const firstField = Object.keys(errors)[0];
      if (firstField) {
        toast.error(errors[firstField]?.message);
      }
    }
  };

  const SendLogData = async (data) => {
    const { EmailId, Password, nameofuser, photo, org, ContactNumber } = data;
  
    const formData = new FormData();
    formData.append('EmailId', EmailId);
    formData.append('Password', Password);
    formData.append('nameofuser', nameofuser);
    formData.append('org', org);
    formData.append('ContactNumber', ContactNumber);
    formData.append('createdby', createdby);
    if (photo?.[0]) {
      formData.append('photo', photo[0]);
    }
  
    const signupPromise = fetch('http://localhost:3000/user/signup', {
      method: 'POST',
      body: formData,
    }).then(async (response) => {
      const result = await response.json();
      console.log(result )
      if (!response.ok) {
        throw new Error(result.message);
      }
      return result;
    });
  
    toast.promise(signupPromise, {
      loading: 'Creating Supervisor...',
      success: (res) => {
        reset();
        setPreview(null);
        
        handleSVAdded?.(res.newSv);
        return res.message || 'Supervisor created!';
      },
      error: (err) =>  err.message || 'Failed to create supervisor!',
    });
  };
  

  return (
    <form
      onSubmit={handleSubmit(SendLogData, handleValidationErrors)}
      className="w-full h-full col-start-1 col-end-5 row-start-2 row-end-6 bg-white shadow-md p-3 rounded-md grid grid-cols-3 grid-rows-6 gap-2
                  max-lg:col-end-7 max-lg:row-end-4 max-sm:grid-cols-2 max-sm:grid-rows-6"
    >
      <div className="font-semibold text-xl w-full mb-2 row-start-1 row-end-2 col-start-1 col-end-4 max-sm:col-end-3">
        Add Supervisor
      </div>

      <div className="flex flex-col justify-end items-center place-self-end h-full row-start-2 row-end-7 col-start-1 col-end-2 
                      w-full rounded-lg max-sm:flex-row max-sm:row-end-4 max-sm:col-end-3 bg-orange-100">
      {preview ? (
       
        <img
        src={preview}
        alt=""
        className="w-full h-full row-start-1 row-end-3 col-start-1 col-end-2
          border border-orange-500 rounded-md object-cover m-1 max-lg:object-contain max-sm:w-1/3"
      />
        ) : (
          <p className="h-5/6 w-full flex items-center justify-center text-xl">+ Add Photo</p>
        )}
          <input
            type="file"
            accept="image/*"
            className="form_input h-1/6 w-full rounded-lg border bg-white justify-self-start self-end max-sm:h-full max-sm:w-2/3"
            {...register("photo")}
            onChange={handleImagePreview}
          />
      </div>

      <input
        type="text"
        placeholder="Email ID of Supervisor"
        className="form_input row-start-2 row-end-3 col-start-2 col-end-4 place-self-center w-full max-sm:col-auto max-sm:row-auto"
        {...register('EmailId', {
          required: 'Email ID is required',
        })}
      />

      <input
        type="password"
        placeholder="Password"
        className="form_input row-start-3 row-end-4 col-start-2 col-end-4 place-self-center w-full max-sm:col-auto max-sm:row-auto"
        {...register('Password', {
          required: 'Password is required',
        })}
      />

      <input
        type="text"
        placeholder="Name of Supervisor"
        className="form_input row-start-4 row-end-5 col-start-2 col-end-4 place-self-center w-full max-sm:col-auto max-sm:row-auto"
        {...register('nameofuser', {
          required: 'Name of Supervisor is required',
        })}
      />

      <input
        type="number"
        placeholder="Contact Number"
        className="form_input row-start-5 row-end-6 col-start-2 col-end-3 place-self-center w-full max-sm:col-auto max-sm:row-auto"
        {...register('ContactNumber', {
          required: 'Contact Number is required',
        })}
      />

      <input
        type="text"
        placeholder="Company / School"
        className="form_input row-start-5 row-end-6 col-start-3 col-end-4 place-self-center w-full max-sm:col-auto max-sm:row-auto"
        {...register('org')}
      />

      <button
        type="submit"
        className="submit_btn w-full h-full place-self-center px-3 row-start-6 row-end-7 col-start-2 col-end-4 max-sm:col-auto max-sm:row-auto max-sm:text-[12px]"
      >
        Create Supervisor Account +
      </button>
    </form>
  );
};

export default CreateSV;
