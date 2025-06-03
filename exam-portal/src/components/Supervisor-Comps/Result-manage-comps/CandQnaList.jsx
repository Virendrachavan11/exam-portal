import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Download, Search } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';

const CandQnaList = () => {
    const location = useLocation();
    const cand = location.state?.cand || {};
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    const filteredQuestions = useMemo(() => {
        return cand.submittedQuestions?.filter((q) =>
            q.question.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];
    }, [cand, searchTerm]);

    const downloadExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('QnA');

        worksheet.columns = [
            { header: 'No.', key: 'no', width: 6 },
            { header: 'Question', key: 'question', width: 50 },
            { header: 'Given Answer', key: 'givenAns', width: 25 },
            { header: 'Correct Answer', key: 'correctAns', width: 25 },
        ];

        filteredQuestions.forEach((q, index) => {
            worksheet.addRow({
                no: index + 1,
                question: q.question,
                givenAns: q.options[`option${q.givenAns}`] || "N/A",
                correctAns: q.options[`option${q.correctAns}`] || "N/A",
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `${cand.nameofCand}_QnA.xlsx`);
    };

    return (
        <div className='w-4/5 mx-auto p-4 space-y-4 max-lg:w-full max-lg:mt-16'>
            <div className='w-full flex justify-between'>
            

            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-xl font-semibold text-orange-600 hover:underline mb-4"
                >
                ← Back
                </button>

                <h2 className='text-2xl font-semibold max-[450px]:text-sm'>
                    QnA of <span className="text-orange-600">{cand.nameofCand || "Candidate"}</span>
                </h2>
            </div>


            <div className='flex justify-between items-center'>
                <input
                    type="search"
                    className='border p-2 w-2/3 rounded'
                    placeholder='Search Questions...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={downloadExcel} className='update_btn flex items-center px-3 py-2 rounded bg-orange-500 text-white'>
                    <Download size={18} className="mr-1" /> Download
                </button>
            </div>

            <div className='overflow-auto max-h-[65vh] border border-gray-300 rounded-md'>
                <table className='w-full border-collapse'>
                    <thead className='bg-gray-200 sticky top-0'>
                        <tr>
                            <th className='p-3 text-left'>No.</th>
                            <th className='p-3 text-left'>Question</th>
                            <th className='p-3 text-left'>Given Answer</th>
                            <th className='p-3 text-left'>Correct Answer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredQuestions.length > 0 ? (
                            filteredQuestions.map((q, index) => (
                        <tr key={q._id} className='border-b hover:bg-gray-100'>
                            <td className='p-3'>{index + 1}</td>
                            <td className='p-3'>{q.question}</td>
                            <td
                                className={`p-3 ${
                                    q.givenAns === q.correctAns ? 'text-blue-600' : 'text-red-600 font-bold'
                                }`}
                            >
                                {q.options[`option${q.givenAns}`] || 'N/A'}
                            </td>
                            <td className='p-3 text-green-600'>{q.options[`option${q.correctAns}`] || 'N/A'}</td>
                        </tr>
                                                    ))
                        ) : (
                            <tr>
                                <td colSpan="4" className='p-4 text-center text-red-500'>No Questions Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CandQnaList;
