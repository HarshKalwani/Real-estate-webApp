import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
const OAuth = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const handleGoogleClick = async ()=>{
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app)

            const result =  await signInWithPopup(auth , provider)
            console.log(result);
            const res = await fetch('/api/auth/google', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    name:result.user.displayName , 
                    email:result.user.email , 
                    photo:result.user.photoURL})
            })
            const data = await res.json()
            console.log(data)
            dispatch(signInSuccess(data));
            toast.success('Signed in success')
            navigate('/');

        } catch (error) {
            console.log("could not sign in with google" , error)
            toast.error('Something went wrong');
        }
    }
  return (
    <button type="button" onClick={handleGoogleClick} className="bg-red-700 p-3 rounded-lg text-white uppercase hover:opacity-95">Continue with Google </button>
  )
}

export default OAuth