import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";


const SignUp = () => {

  const [showPassword , setShowPassword] = useState(false)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className='flex flex-col gap-4 '>
      
        <input type="text" placeholder='username' className='border p-3 rounded-lg 'id='username'/>
        
        <input type="text" placeholder='email' className='border p-3 rounded-lg 'id='email'/>
        <div className='relative'>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder='password' 
            className='border p-3 rounded-lg w-full pr-10' 
            id='password' 
          />
          <span 
            onClick={() => setShowPassword(prev => !prev)} 
            className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400'
          >
            {showPassword ? <AiOutlineEye fontSize={24} /> : <AiOutlineEyeInvisible fontSize={24} />}
          </span>
        </div>
        <button className='bg-slate-700 text-white rounded-lg uppercase p-3 hover:opacity-95 disabled:opacity-80'>Sign Up</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}><span className='text-blue-700'>Sign in </span></Link>
      </div>
    </div>
  )
}

export default SignUp