import React, { useEffect, useState } from 'react'
import{useDispatch,useSelector} from 'react-redux'
import {clearMessages, loginRequest} from '../store/slices/authSlice'
import {useNavigate,Link} from 'react-router-dom'

const UserLogin = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const{loading,error} = useSelector((state)=>state.auth)

    useEffect(()=>{
      dispatch(clearMessages())
    },[dispatch])

    const handleLogin = async (e) => {
      e.preventDefault();
      dispatch(clearMessages());
      try{
        await dispatch(loginRequest({role:'user',email:email.trim(),password})).unwrap()
        navigate("/")
      }catch(error){}
    }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100 dark:from-stone-950 dark:via-neutral-900 dark:to-stone-900 px-4 py-8 sm:px-6">
      <div className="w-full max-w-md rounded-2xl bg-white/80 dark:bg-stone-900/80 backdrop-blur shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-6 sm:p-8">
        <p className="mb-4 text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">BiteUp</p>

        <span className="inline-block mb-3 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300 px-3 py-1 text-xs font-medium">User</span>

        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">Welcome back</h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Sign in to continue to BiteUp</p>

        <form onSubmit={(e)=>{handleLogin(e)}} className="mt-6 space-y-5">

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300" htmlFor="email">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 block w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" id="email" name="email" type="email" placeholder="Enter your email" autoComplete="email" />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300" htmlFor="password">Password</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1 block w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" id="password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" />
          </div>

          <button className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:from-orange-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900 transition" type="submit">Sign in</button>

        </form>

        <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-400">New here?{" "}
          <a className="font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-400" href="/user/register">Create an account</a>
        </p>

        <p className="mt-4 text-center text-sm text-stone-600 dark:text-stone-400">Sign In as a{" "}
          <a className="font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-400" href="/user/login">normal user</a>
          {" "}or a{" "}
          <a className="font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-400" href="/foodpartner/login">food partner</a>
        </p>
      </div>
    </div>
  )
}

export default UserLogin
