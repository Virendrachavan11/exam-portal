import React, { useMemo,useState} from "react";
import { useSelector, shallowEqual } from "react-redux";
import UpdateSVuser from './UpdateSVuser'
import PasswordResetComp from './PasswordResetComp'


const profileMmtBase = ({LogedUser}) => {


  return (

    <div className='w-4/5 h-[100vh] grid grid-cols-8 grid-rows-8 p-2 gap-3 overflow-y-auto overflow-x-hidden
    max-lg:h-[200vh] max-lg:w-full max-sm:px-4 max-lg:mt-12'>

        <h1 className='font-bold text-4xl col-start-1 col-end-9 row-start-1 row-end-2 self-center'>Profile Management</h1>
      
        <UpdateSVuser SvUser={LogedUser}/>

        <div className="col-start-5 col-end-9 row-start-2 row-end-5  bg-white shadow-md rounded-md
        max-lg:col-start-1 max-lg:col-end-9 max-lg:row-start-5 max-lg:row-end-7 ">

        </div>
      
        <div className="col-start-5 col-end-9 row-start-5 row-end-9
        max-lg:col-start-1 max-lg:col-end-9 max-lg:row-start-7 max-lg:row-end-9">
          <PasswordResetComp email={LogedUser.user.replace(/['"]+/g, "") }/>
        </div>

    </div>

  )
}

export default profileMmtBase
