import React from 'react'
import { Link, useNavigate } from "react-router-dom";

import { useState, useEffect } from 'react';
import SideMenu from './SideMenu';
import Thread from './Thread';


const Onebox = ({ isLoggedin, setLoggedin, isDarkMode, setMode }) => {

  const [sideMenu, setSideMenu] = useState(window.innerWidth >= 639);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 639);
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Id, setId] = useState(null);
  const [thread, setThread] = useState([]);
  const [fetchingThread, setFetchingThread] = useState(false);
  const [userInfo,setUserInfo]=useState({});
  const [openEditor, setOpenEditor] = useState(false);
 

  const clearLocalStorageExcept = (exceptKey) => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key !== exceptKey) {
        localStorage.removeItem(key);
      }
    });
  };

  const handleClickSmallWidth = (type) => {
    if (window.innerWidth < 639) {
      setSideMenu(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 639);
    };
    window.addEventListener("resize", handleResize);
    return () => {
    window.removeEventListener("resize", handleResize);
    };
  }, []);


  useEffect(() => {
    const fetchThread = async () => {
      if (Id != null) {
        setFetchingThread(true);
        try {
          const token = localStorage.getItem('authToken');
          const res = await fetch("https://hiring.reachinbox.xyz/api/v1/onebox/messages/" + Id, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          const a = await res.json();
          setThread(a.data);
        } catch (error) {
          console.error('Error fetching thread:', error);
        } finally {
          setFetchingThread(false);
        }
      }
    };

    fetchThread();
  }, [Id]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');
        if (token) {
          localStorage.setItem('authToken', token);
        }
        const t=localStorage.getItem('authToken');
        const res = await fetch(' https://hiring.reachinbox.xyz/api/v1/onebox/reset', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${t}`,
            'Content-Type': 'application/json'
          }
        });
        const response = await fetch('https://hiring.reachinbox.xyz/api/v1/onebox/list', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${t}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const d = await response.json();
        setMails(d.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    clearLocalStorageExcept('authToken');
    fetchData();
  }, []);

  return (<>
    <div className="relative h-screen w-screen">

      <div
        className={` transition-all duration-200 ease-in-out fixed top-0 left-0 h-full w-[4rem] border-r-[2px] ${isDarkMode ? 'bg-[#101113] text-white border-[#343A40]' : 'bg-[#FAFAFA] text-black  border-[#D8D8D8]'} z-10 flex flex-col justify-between`}
      >
        <div className={` cursor-pointer text-[1.4rem] text-center mt-[1.5rem]`}>
          <div ><i className={` fa fa-m py-[0.4rem] px-[0.6rem] ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}></i></div>
        </div>
        <div className={`text-[1.4rem] text-center flex flex-col justify-center flex-grow ${isDarkMode ? 'text-white' : 'text-black'}`}>
          <div><i className=" cursor-pointer fa-solid fa-house py-[1.2rem]"></i></div>
          <div><i className=" cursor-pointer fa-solid fa-magnifying-glass py-[1.2rem]"></i></div>
          <div><i className=" cursor-pointer fa-solid fa-envelope py-[1.2rem]"></i></div>
          <div><i className=" cursor-pointer fa-solid fa-paper-plane py-[1.2rem]"></i></div>
          <div><i className=" cursor-pointer fa-solid fa-table-list py-[1.2rem]"></i></div>
          <div><i className=" cursor-pointer fa-solid fa-inbox py-[1.2rem]"></i></div>
          <div><i className=" cursor-pointer fa-solid fa-chart-simple py-[1.2rem]"></i></div>
        </div>

        <div className={` cursor-pointer text-[2rem] text-center mb-[1.5rem] ${isDarkMode ? 'text-white' : 'text-black'}`}>
          <div><i className="fa-solid fa-circle-user"></i></div>
        </div>
      </div>



      <div className={`fixed transition-all duration-200 ease-in-out top-0 left-[4rem] h-16 w-full border-b-[2px] ${isDarkMode ? 'bg-[#1F1F1F] text-white border-[#343A40]' : 'bg-[#FFFFFF] text-black  border-[#D8D8D8]'}  z-20 flex items-center justify-between px-4`}>
        <div className="flex-shrink-0">
          Onebox
        </div>
        <div className="flex-grow text-center">
          
        </div>
        <div className="flex-shrink-0 text-right mr-[5rem]">
         
          <button  onClick={()=>setMode(!isDarkMode)} className="bg-gray-800 text-white p-2 rounded">
            Toggle Dark Mode
          </button>
        </div>
      </div>

      <div className="pl-[4rem] pt-16 h-screen w-screen ">
        <div className='flex h-full  w-full p-[0px]'>

          <SideMenu setUserInfo={setUserInfo} setOpenEditor={setOpenEditor} setId={setId} sideMenu={sideMenu} setSideMenu={setSideMenu} handleClickSmallWidth={handleClickSmallWidth} mails={mails} setMails={setMails} loading={loading} setLoading={setLoading} isDarkMode={isDarkMode}></SideMenu>

          <div
            className={`flex-1 w-full overflow-y-auto h-full flex flex-col items-start justify-start  bg-gray-100 ${isSmallScreen && sideMenu ? "hidden" : "flex"
              }`}
          >

            {Id == null ? (<div className={` ${isDarkMode ? 'bg-black text-white ' : 'bg-[#FFFFFF] text-black'} w-full h-full flex flex-col items-center justify-center`}><div>Choose a thread from the left sidebar</div>
              <div>You can also choose to reset the data by refreshing/reloading this page</div></div>) : (<>
              {fetchingThread ? (<div className={` ${isDarkMode ? 'bg-black text-white ' : 'bg-[#FFFFFF] text-black'} w-full h-full flex flex-col items-center justify-center`}><i class="fa-solid fa-spinner fa-spin text-[2rem]"></i></div>) : (<>
                <Thread setUserInfo={setUserInfo} userInfo={userInfo} thread={thread} openEditor={openEditor} setOpenEditor={setOpenEditor} setMails={setMails} Id={Id} setId={setId} mails={mails} isDarkMode={isDarkMode}></Thread>
              </>)}
            </>)}

          </div>
        </div>
      </div>
    </div>


  </>
  )
}

export default Onebox;
