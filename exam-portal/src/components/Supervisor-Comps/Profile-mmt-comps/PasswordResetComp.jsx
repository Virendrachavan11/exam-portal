import React from 'react';
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const PasswordResetComp = ({ email }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleGenerateOTP = async () => {
    const data = { emailID : email };

    const otpPromise = fetch("http://localhost:3000/user/forgotPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(async (response) => {
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to send OTP");
      }
      return response.json();
    });

    toast.promise(otpPromise, {
      loading: "Sending OTP...",
      success: "OTP has been sent to your email",
      error: (err) => err.message || "An error occurred while sending OTP",
    });
  };

  const handleNewPass = async (Fdata) => {
    const { otp, newPassword } = Fdata;

    const data = {
      emailId : email,
      otp,
      newPassword
    };

    try {
      const response = await fetch("http://localhost:3000/user/reset-password", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Password updated successfully');
        reset();
      } else {
        toast.error('Failed to update password');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while updating password');
    }
  };

  return (
    <div className='flex flex-col w-full h-full justify-between bg-white shadow-md rounded-md p-3'>
      <h1 className="text-xl font-semibold mb-1">Forgot Password</h1>

      <button className="bg-red-500 text-white rounded mb-7 w-1/3 h-1/6 my-7" onClick={handleGenerateOTP}>
        Get OTP
      </button>

      <form onSubmit={handleSubmit(handleNewPass)} className="flex flex-col w-full h-5/6 justify-between">
        <input
          placeholder="Enter OTP"
          className="border p-2 w-full my-1"
          {...register("otp", { required: "OTP is required" })}
        />
        {errors.otp && <span className="text-red-500">{errors.otp.message}</span>}

        <input
          type="password"
          placeholder="New Password"
          className="border p-2 w-full"
          {...register("newPassword", { required: "New password is required" })}
        />
        {errors.newPassword && <span className="text-red-500">{errors.newPassword.message}</span>}

        <button type="submit" className="update_btn text-white px-4 py-2 rounded w-1/3 self-end my-1 max-sm:text-[9px]">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default PasswordResetComp;
