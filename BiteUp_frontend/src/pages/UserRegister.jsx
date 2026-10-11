import React, { useEffect, useState } from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {registerRequest,verifyAndComplete,resendOtp,loginRequest,clearMessages} from '../store/slices/authSlice'
import { useNavigate,Link } from 'react-router-dom'

const UserRegister = () => {
  const [step, setStep] = useState(1)
  const [formError, setFormError] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmpassword] = useState('')
  const [otp, setOtp] = useState('')

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {loading,error,info,registrationId} = useSelector((state)=>state.auth)

  useEffect(()=>{
    dispatch(clearMessages())
  },[dispatch])

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError('')
    dispatch(clearMessages())

    if (username.trim().length < 3 || username.trim().length > 20) {
      setFormError('Username must be 3 to 20 characters')
      return
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmpassword) {
      setFormError('Passwords do not match')
      return
    }
    try{
      await dispatch(registerRequest({role: 'user',username: username.trim(),email: email.trim(),password}))
      .unwrap()
      setStep(2)
    }catch(error){

    }
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    try{
      await dispatch(verifyAndComplete({role : 'user',registrationId,otp})).unwrap()
      navigate('/user/login')
    }catch(error){}
  }

  const handleResend = () => {
    dispatch(resendOtp({role: 'user',registrationId}))
  }



  if (step === 2) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100 dark:from-stone-950 dark:via-neutral-900 dark:to-stone-900 px-4 py-8 sm:px-6">
        <div className="w-full max-w-md rounded-2xl bg-white/80 dark:bg-stone-900/80 backdrop-blur shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-6 sm:p-8">
          <p className="mb-4 text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">BiteUp</p>

          <span className="inline-block mb-3 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300 px-3 py-1 text-xs font-medium">Verification</span>

          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">Check your email</h1>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">{`Enter the code we sent to ${email}`}</p>

          <form onSubmit={(e)=>{handleVerify(e)}} className="mt-6 space-y-5">

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300" htmlFor="otp">Verification code</label>
              <input value={otp} onChange={(e)=>setOtp(e.target.value.replace(/\D/g, ''))} className="mt-1 block w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" id="otp" name="otp" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="123456" />
            </div>

            {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
            {info && <p className="text-sm text-orange-600 dark:text-orange-400">{info}</p>}

            <button className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:from-orange-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900 transition disabled:opacity-60" type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Verify and create account'}</button>

            <button onClick={()=>{handleResend()}} className="w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent px-4 py-2.5 text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60 transition" type="button" disabled={loading}>Send a new code</button>

          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100 dark:from-stone-950 dark:via-neutral-900 dark:to-stone-900 px-4 py-8 sm:px-6">
      <div className="w-full max-w-md rounded-2xl bg-white/80 dark:bg-stone-900/80 backdrop-blur shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-6 sm:p-8">
        <p className="mb-4 text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">BiteUp</p>

        <span className="inline-block mb-3 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300 px-3 py-1 text-xs font-medium">User</span>

        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">Create your account</h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Join BiteUp and discover great food</p>

        <form onSubmit={(e)=>{handleRegister(e)}} className="mt-6 space-y-5">

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300" htmlFor="username">Username</label>
            <input value={username} onChange={(e)=>{ setUsername(e.target.value)}} className="mt-1 block w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" id="username" name="username" type="text" placeholder="Enter your username" autoComplete="username" />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300" htmlFor="email">Email</label>
            <input value={email} onChange={(e)=>{ setEmail(e.target.value) }} className="mt-1 block w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" id="email" name="email" type="email" placeholder="Enter your email" autoComplete="email" />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300" htmlFor="password">Password</label>
            <input value={password} onChange={(e)=>{ setPassword(e.target.value) }} className="mt-1 block w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" id="password" name="password" type="password" placeholder="At least 6 characters" autoComplete="new-password" />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300" htmlFor="confirm">Confirm password</label>
            <input value={confirmpassword} onChange={(e)=>{setConfirmpassword(e.target.value)}} className="mt-1 block w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" id="confirm" name="confirm" type="password" placeholder="Type it again" autoComplete="new-password" />
          </div>

          {(formError || error) && <p className="text-sm text-rose-600 dark:text-rose-400">{formError || error}</p>}

          <button className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:from-orange-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900 transition disabled:opacity-60" type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Send verification code'}</button>

        </form>

        <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-400">Already have an account?{" "}
          <a className="font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-400" href="/user/login">Sign in</a>
        </p>

        <p className="mt-4 text-center text-sm text-stone-600 dark:text-stone-400">Register as a{" "}
          <a className="font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-400" href="/user/register">normal user</a>
          {" "}or a{" "}
          <a className="font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-400" href="/foodpartner/register">food partner</a>
        </p>
      </div>
    </div>
  )
}

export default UserRegister
