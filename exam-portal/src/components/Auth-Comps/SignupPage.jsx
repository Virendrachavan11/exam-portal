// pages/SignupPage.js
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    

    try {
      const response = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      navigate("/login-user");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input type="email" {...register("EmailId", { required: true })} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register("Password", { required: true })} />
      </div>
      <div>
        <label>User Type</label>
        <select {...register("userType", { required: true })}>
          <option value="Admin">Admin</option>
          <option value="Supervisor">Supervisor</option>
        </select>
      </div>
      <div>
        <label>Name</label>
        <input type="text" {...register("nameofsv", { required: true })} />
      </div>
      <div>
        <label>org</label>
        <input type="text" {...register("orgName", { required: true })} />
      </div>

      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupPage;
