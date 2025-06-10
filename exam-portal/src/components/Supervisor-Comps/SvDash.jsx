import React,{useRef} from "react";
import { SVNavbarData } from "../UI-Data/SvNavData";
import { NavLink } from "react-router-dom";
import logo from "../../assets/pi_logo.png";
import { X, Menu,Info,UserRound,Mail,Building2,UserCog,LogOut,Settings } from "lucide-react";
import { useSelector,useDispatch } from "react-redux";
import { logout } from "../../features/authSlice";

const SvDash = ({LogedUser}) => {


  const dispatch = useDispatch();
  
  
    const divRef1 = useRef(null);
    const divRef2 = useRef(null);
  
    const handleUserPop = () => {
      // Toggle visibility for divRef1
      if (divRef1.current) {
        if (divRef1.current.classList.contains('hidden')) {
          divRef1.current.classList.remove('hidden');
          divRef1.current.classList.add( 'lg:flex');
        } else {
          divRef1.current.classList.add('hidden');
          divRef1.current.classList.remove('lg:flex');
        }
      }
  
      // Toggle visibility for divRef2
      if (divRef2.current) {
        if (divRef2.current.classList.contains('hidden')) {
          divRef2.current.classList.remove('hidden');
          divRef2.current.classList.add('lg:flex');
        } else {
          divRef2.current.classList.add('hidden');
          divRef2.current.classList.remove('lg:flex');
        }
      }
    };;


  const hideSidebar = () => {

    if (window.innerWidth < 1024) { 

      const adminSide = document.getElementById("Adminside");
      const hamIcon = document.getElementById("hamIcon");
      const sideBack = document.getElementById("sideBack");
      adminSide.style.display = "none";
      hamIcon.style.display = "flex";
      sideBack.style.zIndex = 0;
      sideBack.style.height = "10vh";
    }
  };

  const showSidebar = () => {
    
    const adminSide = document.getElementById("Adminside");
    const hamIcon = document.getElementById("hamIcon");
    const sideBack = document.getElementById("sideBack");
    adminSide.style.display = "block";
    adminSide.style.position = "fixed";
    // hamIcon.style.display = "none";
    sideBack.style.zIndex = 40;
    sideBack.style.height = "100vh";
  };

 

  return (
    <div id="sideBack" className="w-1/5 h-[100vh] max-lg:w-full max-lg:h-[10vh] max-lg:fixed ">
      {/* Hamburger icon for small screens */}
      <div
        id="hamIcon"
        className="hidden max-lg:block p-5 items-center justify-start bg-white shadow-md "
        onClick={showSidebar}
      >
        <Menu />
      </div>

      {/* Sidebar */}
      <div id="Adminside" className="max-lg:hidden bg-orange-500 w-full h-full p-3 flex flex-col justify-between
        max-lg:w-1/2 max-lg:h-[100vh] top-0 max-sm:w-4/5 ">

        <X onClick={hideSidebar} className="hidden max-lg:block" />

        {/* Logo and Title */}
        <div className="flex justify-evenly items-center max-sm:h-1/6">
          <img src={logo} alt="Pi" className="bg-white w-2/6 rounded-full  max-sm:w-1/5 " />
          <h1 className="font-bold text-lg max-md:text-base w-3/6">Exam Supervisor Admin</h1>
        </div>

        {/* Navigation Links */}
        <div className="h-3/5 my-7 flex flex-col text-lg font-medium">
          <div></div>
          {SVNavbarData.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.path}
              className={({ isActive }) =>
                isActive ? "bg-orange-600 rounded-xl p-2 text-white" : "p-2"
              }
              onClick={hideSidebar}
            >
              {link.title}
            </NavLink>
          ))}
        </div>

        <div className="h-[10vh] p-2 rounded-md bg-white shadow-md flex items-center gap-3">
          {/* Profile Image */}
          <img 
            src={`http://localhost:3000/${LogedUser.photo}`} 
            alt="User" 
            className="h-12 w-12 rounded-md object-cover bg-orange-300" 
          />

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold truncate">{LogedUser.nameofsv}</h1>
            <p className="text-sm text-gray-600 truncate">{LogedUser.user}</p>
          </div>

          {/* Settings Icon */}
          <Settings 
            onClick={handleUserPop} 
            className="cursor-pointer transition-transform duration-300 ease-in-out hover:rotate-180"
          />
        </div>
      </div>



  <div ref={divRef2}  className='fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10 hidden'> </div>

  <div ref={divRef1} className='fixed top-0 left-0 z-20 w-full h-full flex-col items-center justify-center hidden'>

  <div className='w-3/6 h-3/6 bg-white rounded-md max-xl:w-4/5 max-xl:h-4/6  max-lg:w-full z-50'>

    <div className='w-full h-1/6 flex justify-between p-2 font-bold text-2xl max-lg:text-lg'>
      <div className="flex items-center justify-center">
      {/* <Info color="#ffa500" size={30}  /> */}
      <h1 className="ml-1">Supervisor Information</h1>
      </div>
      <X onClick={handleUserPop} />
    </div>
    <div className="h-5/6 w-full flex p-3">
   
        <img src={`http://localhost:3000/${LogedUser.photo}`} alt="" className="object-cover h-full aspect-square mr-3 rounded-md"/>
        <table className="h-full w-2/3 max-lg:text-xs">
          <tbody>
            <tr>
            <td className="w-[10%]"><UserRound color="#ffa500" /></td>
            <td className="font-semibold w-[45%]">Name</td>
            <td className=" w-[45%]">{LogedUser.nameofsv}</td>
          </tr>

          <tr>
            <td className="w-[10%]"><Mail color="#ffa500" /></td>
            <td className="font-semibold  w-[45%]">Email</td>
            <td className=" w-[45%]">{LogedUser.user?.replace(/['"]+/g, "") }</td>
          </tr>

          <tr>
            <td className="w-[10%]"><Building2 color="#ffa500" /></td>
            <td className="font-semibold  w-[45%]">Company / School</td>
            <td className=" w-[45%]">{LogedUser.orgName}</td>
          </tr>

          <tr>
            <td className="w-[10%]"><UserCog color="#ffa500" /></td>
            <td className="font-semibold w-[45%]">Account Type</td>
            <td className=" w-[45%]">{LogedUser.userType}</td>
          </tr>

          <tr>
            <td className="w-[10%]"></td>
            <td className=" w-[45%] p-1">
              <a href="profile-manage">
              <button className="update_btn w-full h-full flex items-center justify-center ">
              <Settings color="#ffffff"
                className="cursor-pointer transition-transform duration-300 ease-in-out hover:rotate-180 mr-1"/>
                Edit Info
              </button>
              </a>
            </td>
            <td className=" w-[45%] p-1">
              <button onClick={() => dispatch(logout())} className="submit_btn w-full h-full flex items-center justify-center">
                <LogOut color="#ffffff" 
                className="cursor-pointer transition-transform duration-300 ease-in-out hover:rotate-180 mr-1" />
                Logout
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>


    </div>
  );
};

export default SvDash;
