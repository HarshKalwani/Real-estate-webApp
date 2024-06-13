import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";

const Profile = () => {
  const {currentUser} = useSelector(state => state.user)
  const [showPassword , setShowPassword] = useState(false)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img src={currentUser.avatar} alt="" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' />
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' />
        <div className='relative'>
        <input type={showPassword ? ("text") : ("password")} placeholder='password' className='border p-3 rounded-lg w-full' id='password' /> 
        <span onClick={() => setShowPassword((prev) => !prev)} className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400'>{showPassword ? <AiOutlineEye fontSize={24} /> : <AiOutlineEyeInvisible fontSize={24} />}</span>
        </div>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Accound </span>
        <span className='text-red-700 cursor-pointer'>Sign out </span>
      </div>
    </div>
  )
}

export default Profile