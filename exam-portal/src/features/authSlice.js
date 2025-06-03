// store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("user")?.replace(/['"]+/g, "") || null,
    token: localStorage.getItem("token") || null,
    userType: localStorage.getItem("userType") || null,
    nameofsv: localStorage.getItem("nameofsv") || null,
    orgName:localStorage.getItem("orgName") || null,
    photo:localStorage.getItem("photo") || null,

  },
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.userType = action.payload.userType;
      state.nameofsv = action.payload.nameofsv;
      state.orgName = action.payload.orgName;
      state.photo = action.payload.photo;
      

       
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userType", action.payload.userType);
      localStorage.setItem("nameofsv", action.payload.nameofsv);
      localStorage.setItem("orgName", action.payload.orgName);
      localStorage.setItem("photo", action.payload.photo);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.userType = null;
      state.nameofsv = null;
      state.orgName = null;
      state.photo = null;


      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      localStorage.removeItem("nameofsv");
      localStorage.removeItem("orgName");
      localStorage.removeItem("photo");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
