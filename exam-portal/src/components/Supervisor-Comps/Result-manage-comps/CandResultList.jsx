import React, { useEffect, useState ,useMemo} from 'react';
import { Link,useLocation } from 'react-router-dom';
import { CalendarCheck,BookOpen,CalendarClock,CirclePercent,Download,Users } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';

const CandResultList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const resultData = location.state?.resultData || {}; // Default empty object to prevent errors

    const [CandResult, setCandResult] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCandidates = useMemo(() => {
        return CandResult
            .filter((cand) =>
                cand.nameofCand.toLowerCase().includes(searchTerm.toLowerCase()) // Adjust based on the property name
            )
            .sort((a, b) => b.marks - a.marks); // Sort by marks in descending order
    }, [CandResult, searchTerm]);


    useEffect(() => {
        if (resultData?.CandData) {
            setCandResult(resultData.CandData);
        }
    }, [resultData]);

    console.log("Received resultData:", resultData);

    const downloadExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Candidates');

        worksheet.columns = [
            { header: 'No.', key: 'no', width: 10 },
            { header: 'Candidate Name', key: 'name', width: 25 },
            { header: 'Email ID', key: 'email', width: 30 },
            { header: 'Roll No.', key: 'rollNo', width: 15 },
            { header: 'Marks', key: 'marks', width: 10 }
        ];

        filteredCandidates.forEach((cand, index) => {
            worksheet.addRow({
                no: index + 1,
                name: cand.nameofCand,
                email: cand.emailID,
                rollNo: cand.rollNo,
                marks: cand.marks
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'Candidates_List.xlsx');
    };



    return (
        <div className='w-4/5 h-[100vh] grid grid-cols-8 grid-rows-8 p-2 gap-3 overflow-y-auto overflow-x-hidden max-lg:h-[200vh] max-lg:w-full max-sm:px-4'>
            
            <div className='text-2xl row-start-1 row-end-2 col-start-1 col-end-9 flex items-center justify-start max-lg:text-lg max-md:text-sm max-lg:pt-2 max-md:items-end pb-3 '>
                <Link to="/sv-dashboard/Result-List">All Result List &gt; </Link> 
                {resultData?.scheduleName || "No Data"} {/* Prevents errors if `scheduleName` is undefined */}
            </div>

            <div className='row-start-2 row-end-4 col-start-1 col-end-9 bg-orange-100 border-[1px] border-orange-500 rounded-md 
            shadow-md grid grid-cols-2 grid-rows-3 p-4 max-lg:grid-rows-5'>

                <div className='row-start-1 row-end-2 col-start-1 col-end-3 flex items-center text-2xl'>
                    <CalendarCheck color='#f97316'/>
                    <h1 className='mx-2'>Schedule of <span className='font-semibold'>{resultData?.scheduleName || "No Data"}</span></h1>
                </div>

                {/* <div className='row-start-2 row-end-3 col-start-1 col-end-2 flex items-center text-xl'>

                
                <h1 className='mx-2'> {resultData?.examTitle || "No Data"} </h1>

                </div> */}

                <div className="w-full mt-3 max-md:text-[12px] max-lg:col-start-1 max-lg:col-end-3 
                                max-lg:row-start-2 max-lg:row-end-4">
                    <table className="w-full">
                    <tbody>
                        <tr>
                        <td className="w-[10%] align-top"><BookOpen color="#f97316" /></td>
                        <td className=" font-semibold">Exam Name :</td>
                        <td className="text-left ">{resultData?.examTitle || "No Data"}</td>
                        </tr>
                        <tr>
                        <td className="align-top"><CalendarClock color="#f97316" /></td>
                        <td className="font-semibold">Date And Time :</td>
                        <td className="text-left">
                            {new Date(resultData?.scheduledTime).toLocaleString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                            })}
                        </td>
                        </tr>
                    </tbody>
                    </table>
                </div>

                {/* Right Section */}
                <div className="w-full  mt-3 max-md:text-[12px] max-lg:col-start-1 max-lg:col-end-3 
                                max-lg:row-start-4 max-lg:row-end-6">
                    <table className="w-full">
                    <tbody>
                        <tr>
                        <td className="w-[10%] align-top"><CirclePercent color="#f97316" /></td>
                        <td className=" font-semibold">Total Marks :</td>
                        <td className="text-right max-lg:text-left">{resultData?.totalMarks || "No Data"}</td>
                        </tr>
                        <tr>
                        <td className="align-top"><Users color="#f97316" /></td>
                        <td className="font-semibold">No. of Students :</td>
                        <td className="text-right max-lg:text-left">{resultData?.CandData?.length || "No Data"}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>  

            
            <div className='bg-white flex flex-col p-4 rounded-xl shadow-lg row-start-4 row-end-9 col-start-1 col-end-9'>
                <div className='flex items-center justify-between py-2 mb-4'>
                    <input
                        type='search'
                        placeholder='Search Candidate'
                        className='w-3/5 h-[40px] p-2 border border-gray-300 rounded'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className='update_btn p-1 flex' onClick={downloadExcel}><Download /><span className='ml-1'>Download</span></button>
                </div>
                
                <div className='overflow-auto max-h-[55vh] border border-gray-200 rounded-md'>
                    <table className='w-full border-collapse'>
                        <thead className='bg-gray-200 sticky top-0 shadow-sm'>
                            <tr>
                                <th className='p-3 text-left'>No.</th>
                                <th className='p-3 text-left'>Candidate Name</th>
                                <th className='p-3 text-left'>Email ID</th>
                                <th className='p-3 text-left'>Roll No.</th>
                                <th className='p-3 text-left'>Marks</th>
                            </tr>

                        </thead>
                        <tbody>
                            {filteredCandidates.length > 0 ? (
                                filteredCandidates.map((cand, index) => (
                 
                                    <tr
                                    key={cand._id}
                                    className="hover:bg-gray-100 transition duration-200 border-b cursor-pointer"
                                    onClick={() =>
                                        navigate(`/sv-dashboard/Result-List/CandList/qna`, {
                                        state: { cand: cand},
                                        })
                                    }
                                    >
                                        <td className='p-3'>{index + 1}</td>
                                        <td className='p-3'>{cand.nameofCand}</td>
                                        <td className='p-3'>{cand.emailID}</td>
                                        <td className='p-3'>{cand.rollNo}</td>
                                        <td className='p-3 font-semibold'>{cand.marks}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan='5' className='p-4 text-center text-red-500'>No Candidates Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>          
        </div>
    );
};

export default CandResultList;
