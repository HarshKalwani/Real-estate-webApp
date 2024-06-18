import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, 
          updateUserFailure ,deleteUserSuccess , 
          deleteUserStart , deleteUserFailure ,
          signOutUserStart, signOutUserSuccess,
          signOutUserFailure} from '../redux/user/userSlice';

import {Link} from 'react-router-dom';

import { useDispatch } from 'react-redux';


const Profile = () => {

  //firebase storage 
  //allow read;
  //allow write:if
  //request.resource.size < 2 * 1024*1024 && 
  //request.resource.contentType.matches('image/.*')



  const fileRef = useRef(null)
  const { currentUser , loading , error } = useSelector(state => state.user)
  const [showPassword, setShowPassword] = useState(false)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess , setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  // console.log(formData)
  // console.log(filePerc)
  // console.log(file)

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred /
          snapshot.totalBytes) * 100;
        // console.log('upload is ' + progress + '%done')
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL })
          })
      }
    );


  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async() => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}` , {
        method:'DELETE',
      })
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async()=>{
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if(data.success===false){
        dispatch(signOutUserFailure(data.message))
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="file" ref={fileRef} hidden accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
        <img onClick={() => fileRef.current.click()} src={formData?.avatar || currentUser.avatar} alt="" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm text-center'>
          {fileUploadError ? (<span className='text-red-700 '>Error Image Upload (Image must be less than 2MB )</span>) :
            filePerc > 0 && filePerc < 100 ? (<span className='text-slate-700'>{`Uploading ${filePerc} %`}</span>) : filePerc === 100 ?
              (<span className='text-green-700'>Image Uploaded Successfully</span>
              ) : ("")
          }
        </p>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' defaultValue={currentUser.username} onChange={handleChange} />
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' defaultValue={currentUser.email} onChange={handleChange} />
        <div className='relative'>
          <input type={showPassword ? ("text") : ("password")} placeholder='password' className='border p-3 rounded-lg w-full' id='password' onChange={handleChange} />
          <span onClick={() => setShowPassword((prev) => !prev)} className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400'>
            {showPassword ? <AiOutlineEye fontSize={24} /> : <AiOutlineEyeInvisible fontSize={24} />}
          </span>
        </div>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80' disabled={loading}>
          {loading ? 'Loading' : 'Update'}
        </button>
        <Link to={"/create-listing"} className='bg-green-700 text-white p-3 text-center rounded-lg uppercase
          hover:opacity-95'>
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Accound </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out </span>
      </div>
      {/* <p className='text-red-700 mt-5'>{error ? error : ''}</p> */}
      <p className='text-green-700 mt-5'>{updateSuccess ? 'User is Updated Successfully! ' : ''}</p>
    </div>
  )
}

export default Profile