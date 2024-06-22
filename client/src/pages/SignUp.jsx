import { useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import OAuth from '../components/OAuth';
import toast from 'react-hot-toast';


const SignUp = () => {

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData(
      {
        ...formData,
        [e.target.id]: e.target.value,
      }
    );
  }
  // console.log(formData)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await fetch('/api/auth/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }, body:JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        setLoading(false)
        setError(data.message)
        toast.error('Something went Wrong')
        return;
      }
      setLoading(false)
      setError(null)
      toast.success('Account created Successfully')
      navigate('/sign-in ')
      // console.log(data)
    } catch (error) {
      setLoading(false)
      setError(error.message)
      toast.error('Something went Wrong')
    }

  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className='flex flex-col gap-4 ' onSubmit={handleSubmit}>

        <input type="text" placeholder='username' className='border p-3 rounded-lg ' id='username' onChange={handleChange} />

        <input type="text" placeholder='email' className='border p-3 rounded-lg ' id='email' onChange={handleChange} />
        <div className='relative'>
          <input
            type={showPassword ? "text" : "password"}
            placeholder='password'
            className='border p-3 rounded-lg w-full pr-10'
            id='password'
            onChange={handleChange}
          />
          <span
            onClick={() => setShowPassword(prev => !prev)}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400'
          >
            {showPassword ? <AiOutlineEye fontSize={24} /> : <AiOutlineEyeInvisible fontSize={24} />}
          </span>
        </div>
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg uppercase p-3 hover:opacity-95 disabled:opacity-80'>{loading ? ('Loading') : ('Sign Up')}</button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}><span className='text-blue-700'>Sign in </span></Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  )
}

export default SignUp