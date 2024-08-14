import React, { useState } from 'react';

import { Link, useNavigate } from "react-router-dom";


const Login = ({ isLoggedin, setLoggedin, isDarkMode, setMode }) => {

  const [existing, setExisting] = useState(false);
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    const loginUrl = 'https://hiring.reachinbox.xyz/api/v1/auth/google-login';
    const redirectUrl = encodeURIComponent(process.env.REACT_APP_URL+'/onebox/');
    window.location.href = `${loginUrl}?redirect_to=${redirectUrl}`;
  };

  return (
    <div className='h-full w-full bg-black overflow-hidden'>

      <div className='flex justify-center align-center text-white'>
        <div className='py-[2rem]'>
          <span className='text-[1.3rem] font-bold'> <span className='bg-white'><i class="fa-solid fa-m text-black p-2"></i></span> REACHINBOX</span>
        </div>
      </div>

      <div className='w-full h-[80%] flex justify-center items-center p-4'>
        <div className='w-full max-w-[30rem] h-auto p-6 sm:p-[1.5rem] rounded-xl border border-[#343A40]'>
          {existing ? (
            <>
              <div className='text-white text-center text-[1.1rem] sm:text-[1.3rem]'>Sign in to your account</div>
              <div className='text-center mt-6 sm:mt-[1.5rem] h-[2.8rem]'>
                <button className="text-white w-full py-3 sm:py-[0.6rem] px-4 sm:px-[7rem] border border-[#343A40] rounded-md flex justify-center items-center" onClick={() => signInWithGoogle()}>
                  <i className="fa-brands fa-google text-white text-[1.2rem] mr-[0.5rem]"></i>Continue with Google
                </button>
              </div>
              <div className='text-center text-[#6e7883] mt-6 sm:mt-[2rem]'>Don't have an account?
                <div onClick={() => setExisting(false)} className='cursor-pointer text-[#a9b0b7] mt-4 sm:mt-[1rem] hover:text-white underline'>
                  Create one
                </div>
              </div>
            </>
          ) : (
            <>
              <div className='text-white text-center text-[1.1rem] sm:text-[1.3rem]'>Create a new account</div>
              <div className='text-center mt-6 sm:mt-[1.5rem] h-[2.8rem]'>
                <button className="text-white w-full py-3 sm:py-[0.6rem] px-4 sm:px-[7rem] border border-[#343A40] rounded-md flex justify-center items-center" onClick={() => signInWithGoogle()}>
                  <i className="fa-brands fa-google text-white text-[1.2rem] mr-[0.5rem]"></i>Signup with Google
                </button>
              </div>
              <div className='text-center text-[#6e7883] mt-6 sm:mt-[2rem]'>Already have an account?
                <div onClick={() => setExisting(true)} className='cursor-pointer text-[#a9b0b7] mt-4 sm:mt-[1rem] hover:text-white underline'>
                  Sign in
                </div>
              </div>
            </>
          )}
        </div> 
      </div>
      <div className='text-white bg-[#25262B] h-[8%] pt-[0.6rem] overflow-hidden text-center'>© 2023 ReachinBox. All rights reserved</div>

    </div>

  );
};

export default Login;
