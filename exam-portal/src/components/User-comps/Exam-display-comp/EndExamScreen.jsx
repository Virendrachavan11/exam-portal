import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetExamInfo } from "../../../features/ExamMmtSlice";

const EndExamScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    dispatch(resetExamInfo());

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    setTimeout(() => {
      navigate("/exam");
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Your Exam has Ended!</h2>
        <p className="text-gray-600 mt-2">Redirecting to the Exam Page in <span className="font-bold text-blue-500">{countdown}</span> seconds...</p>
      </div>
    </div>
  );
};

export default EndExamScreen;
