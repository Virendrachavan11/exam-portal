import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const token = useSelector((state) => state.auth.token);
  const userType = useSelector((state) => state.auth.userType);

  if (!token) return <Navigate to="/login-user" />;
  if (!allowedRoles.includes(userType)) return <Navigate to="/unauthorized" />;

  return children;
};

export default RoleBasedRoute;
