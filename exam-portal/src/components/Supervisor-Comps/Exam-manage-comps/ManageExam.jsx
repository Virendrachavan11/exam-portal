import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FolderCog, Trash2, FilePlus2,X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import CreateExam from "./CreateExam";
import CreateQue from "./CreateQue";
import { useNavigate } from 'react-router-dom';

const ManageExam = ({ LogedUser }) => {
  const SvUser = LogedUser.user; // User ID
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const navigate = useNavigate();

  // Function to fetch exams
  const fetchExams = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/Manage-exam/${SvUser}`);
      if (!response.ok) throw new Error("Failed to fetch exams");
      const examData = await response.json();
      setExams(examData);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  }, [SvUser]);

  // Fetch exams only once when the component mounts or SvUser changes
  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  // Handle Exam Deletion
  const handleExamDelete = async (examId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this exam?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/Manage-exam/delete-exam/${examId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setExams((prevExams) => prevExams.filter((exam) => exam._id !== examId));
        toast.success("Exam deleted successfully");
      } else {
        toast.error("Failed to delete exam");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error deleting exam");
    }
  };

  // Filter exams based on search input
  const filteredExams = exams.filter((exam) =>
    exam.examTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExamAdded = (newExm) => {
    setExams(prevExams => [...prevExams, newExm]);
  };
  

  return (
    <div className="w-4/5 max-lg:mt-8 max-lg:w-full">
      <h1 className="font-bold text-4xl mb-4 mt-10 mx-5">Manage Exam</h1>

      {/* Create Exam Component */}
      <CreateExam SvUser={SvUser} onExamCreated={fetchExams} handleExamAdded={handleExamAdded}/>

      {/* Exam List Container */}
      <div className="bg-white flex flex-col m-4 rounded-xl p-3 shadow-lg max-h-[60vh]">

        <div className="flex items-center justify-between py-2 mb-3 w-full">
          <h3 className="text-lg font-medium">All Exams</h3>
          <input
            type="search"
            placeholder="Search Exam"
            className="search_box w-3/5 h-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full h-[90%] overflow-y-auto overflow-x-hidden">
        <table className="border-collapse w-full h-full">
      <tbody>
        {filteredExams.length > 0 ? (
          filteredExams.map((exam, index) => (
            <tr
              key={exam._id}
              className="table_row cursor-pointer"
              onClick={() => navigate(`/sv-dashboard/manage-exam/${exam._id}`)}
            >
              <td className="w-[10%] text-left p-2 rounded-l-md">{index + 1}</td>
              <td className="text-left p-2">{exam.examTitle}</td>
              <td className="text-left p-2">{exam.examType}</td>
              <td
                className="text-left p-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedExam(exam);
                }}
              >
                <FilePlus2 size={30} color="#0a9400" />
              </td>
              <td
                className="w-[10%] text-center p-2 rounded-r-md cursor-pointer"
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleExamDelete(exam._id);
                }}
              >
                <Trash2 size={30} color="#ff0000" />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="text-2xl text-center w-full text-chileanFire-500">
              No Exam Found
            </td>
          </tr>
        )}
      </tbody>
    </table>
        </div>
      </div>

      {/* Modal for Creating Questions */}
      {selectedExam && (
        <>
          <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
          <div className="fixed top-0 left-0 z-20 w-full h-full flex flex-col items-center justify-center">
            <div className="w-4/6 h-3/6 rounded-lg shadow-lg max-lg:w-11/12 max-md:h-5/6">
              <div className="w-full flex justify-between items-center p-2  font-bold text-2xl text-white">
                <h2>{selectedExam.examTitle}</h2>
                <X color="#ffffff" className="font-normal cursor-pointer" onClick={() => setSelectedExam(null)} />
      
              </div>
              <CreateQue examId={selectedExam._id} examName={selectedExam.examTitle} onQuestionAdded={fetchExams} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageExam;
