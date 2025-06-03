import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';


const ResultList = ({ LogedUser }) => {
    const navigate = useNavigate();
    const SvUser = LogedUser.user; // Logged-in user ID

    const [ResultList, setResultList] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Search term state

    // Filter and sort results based on search
    const filteredResultList = useMemo(() => {
        return Array.isArray(ResultList)
            ? ResultList.filter((rs) => {
                  const title = rs.scheduleName || "";
                  return title.toLowerCase().includes(searchTerm.toLowerCase());
              }).sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime)) // Latest first
            : [];
    }, [ResultList, searchTerm]);

    // Fetch results when component mounts
    useEffect(() => {
        const fetchResultList = async () => {
            try {
                const response = await fetch(`http://localhost:3000/ManageResult/${SvUser}`);
                const rsList = await response.json();
                setResultList(rsList);
            } catch (error) {
                console.error("Error fetching results:", error);
            }
        };
        fetchResultList();
    }, []);

    // Handle result deletion
    const HandleResultDelete = async (rsId) => {

        const confirmDelete = window.confirm("Are you sure you want to delete this schedule?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:3000/ManageResult/DeleteResult/${rsId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                setResultList((prev) => prev.filter((rs) => rs._id !== rsId)); // Update state after deletion
            } else {
                console.error('Failed to delete result');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };



    return (
        <div className="w-4/5 max-sm:mt-4 max-sm:w-full overflow-hidden max-lg:w-full">
            <h1 className="font-bold text-4xl mb-4 mt-8 mx-5">All Result List</h1>

            <div className="bg-white flex flex-col m-4 rounded-xl p-3 shadow-lg h-1/2">
                <div className="flex items-center justify-between py-2 mb-9 w-full">
                    <input
                        type="search"
                        placeholder="Search Result"
                        className="search_box w-3/5 h-[40px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <hr className="w-full bg-blue-500 mb-2" />

                <div className="w-full h-[90%] overflow-auto ">
                <table className="table-auto w-full border border-gray-300 rounded-md overflow-hidden ">
                    <thead className="bg-gray-200 text-left">
                        <tr className="text-sm font-semibold">
                        <th className="p-3 border-b">No.</th>
                        <th className="p-3 border-b">Schedule Name</th>
                        <th className="p-3 border-b">Date and Time</th>
                        <th className="p-3 border-b">Exam Name</th>
                        <th className="p-3 border-b text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800">
                        {filteredResultList.length > 0 ? (
                        filteredResultList.map((rs, index) => (
                            <tr
                            key={rs._id}
                            className="hover:bg-gray-100 transition duration-200 border-b cursor-pointer max-sm:text-[9px]"
                            onClick={() =>
                                navigate(`/sv-dashboard/Result-List/CandList`, {
                                state: { resultData: rs },
                                })
                            }
                            >
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3 font-medium">{rs.scheduleName}</td>
                            <td className="p-3">
                                {new Date(rs.scheduledTime).toLocaleString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                                })}
                            </td>
                            <td className="p-3">{rs.examTitle}</td>
                            <td
                                className="p-3 text-center"
                                title="Delete"
                                onClick={(e) => {
                                e.stopPropagation();
                                HandleResultDelete(rs._id);
                                }}
                            >
                                <Trash2 size={24} color="#ff0000" className="mx-auto hover:scale-110 transition" />
                            </td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan={5} className="text-center py-6 text-lg text-orange-600 font-semibold">
                            No Exam Found
                            </td>
                        </tr>
                        )}
                    </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
};

export default ResultList;
