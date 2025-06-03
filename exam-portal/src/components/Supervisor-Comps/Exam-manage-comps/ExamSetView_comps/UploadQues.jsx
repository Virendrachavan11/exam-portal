import React,{ useEffect} from 'react'
import { useForm } from 'react-hook-form';
import {FileSpreadsheet,Upload} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';


const UploadQues = ({id,handleQueAdded}) => {

    const { register, handleSubmit,reset,formState: { errors } } = useForm();


    const onSubmit = async (data) => {
      const file = data.file[0];
    
      if (!file || !file.name.endsWith('.xlsx')) {
        toast.error("Please upload a valid .xlsx file");
        return;
      }
    
      const formData = new FormData();
      formData.append("file", file);
    
      const uploadPromise = fetch(`http://localhost:3000/Manage-exam/${id}/upload-csvQ`, {
        method: 'POST',
        body: formData,
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Upload failed");
        return data;
      });
    
      toast.promise(uploadPromise, {
        loading: 'Uploading questions...',
        success: (data) => {
          if (handleQueAdded) handleQueAdded(data.addedQuestions);
          return (
            <span>
              <b>Uploaded!</b> {data.addedQuestions?.length || 0} questions added.
            </span>
          );
        },
        error: (err) => <b>{err.message || 'Upload failed'}</b>,
      });
    
      try {
        await uploadPromise;
        reset();
      } catch (error) {
        console.error('Upload failed:', error);
      }
    };


    const handleDownload = () => {
      const QuestionSample = "QuestionSample.xlsx"
      const fileUrl = `/${QuestionSample}`; 
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = QuestionSample;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    useEffect(() => {
      if (errors.file) {
        toast.error(errors.file.message);
      }
    }, [errors.file]);
    


  return (
   
<div className='bg-white rounded-xl shadow-md row-start-6 row-end-9 col-start-1 col-end-6 p-2
                max-lg:row-start-5 max-lg:row-end-7 max-lg:col-end-9'>

    <div className='h-1/5 w-full font-semibold text-xl  mb-2  '>
          Upload Questions
    </div>

    <div className='h-3/4 w-full flex items-center justify-between'>

      <form onSubmit={handleSubmit(onSubmit)}
        className='bg-[#F5F5F5] h-full w-1/2 p-1 mr-1 rounded-xl items-center justify-between flex flex-col max-lg:text-sm border border-gray-300'>
        
          <div className='w-full h-[65%] flex items-center justify-evenly'>
              <FileSpreadsheet size={50} color='#0a9400'/>
              <p className='font-normal'>Add File in .xlsx for Questions</p>
          </div>

          <div className='w-full h-[35%] flex items-center justify-between'>

            <input
              type="file"
              accept=".xlsx, .xls" 
              {...register('file', { required: 'Please select a file' })}
              className='w-[85%] h-full border-2 flex flex-col bg-white rounded-xl mr-1'
            />
            

            <button type="submit" className='bg-blue-500 text-white flex items-center justify-center h-full aspect-square rounded-full'><Upload/></button>
          
          </div>

      </form>

      <div className='bg-[#F5F5F5] h-full w-1/2 ml-1 p-2 rounded-xl border border-gray-300 flex flex-col items-center justify-center text-center '>

      <h2 className="text-xl font-semibold mb-2 text-gray-800 max-[560px]:text-sm">Download Sample File</h2>

      <p className="text-sm text-gray-600 mb-4 max-[560px]:text-[8px]">
      Download sample file for add questions in this exam
      </p>

      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 max-[560px]:text-[10px]"
      >
        Download Sample
      </button>

      </div>


    </div>

</div>

  )
}

export default UploadQues
