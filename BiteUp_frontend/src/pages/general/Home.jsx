import React, { useEffect, useState } from 'react'
import ReelFeed from '../../components/ReelFeed'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFood, likes, saveFood } from '../../store/slices/foodSlice'
import { logoutRequest, logoutAllRequest } from '../../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const { fooditems, loading, error } = useSelector((state) => state.food)
  const { account, role } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchFood())
  }, [dispatch])

  const handleLike = (item) => dispatch(likes(item._id))
  const handleSave = (item) => dispatch(saveFood(item._id))

  const handleLogout = async () => {
    await dispatch(logoutRequest()).unwrap()
    navigate(role === 'foodPartner' ? '/foodpartner/login' : '/user/login')
  }

  const handleLogoutAll = async () => {
    await dispatch(logoutAllRequest()).unwrap()
    navigate(role === 'foodPartner' ? '/foodpartner/login' : '/user/login')
  }

  const message = loading ? 'loading reels....' : error || 'No delicious reels available yet.'

  return (
    <main className="relative w-full h-[100dvh] bg-neutral-950 flex justify-center items-center overflow-hidden">
      <div className="relative w-full h-full sm:max-w-[440px] sm:h-[92vh] sm:rounded-3xl sm:border sm:border-neutral-800/80 sm:shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden bg-black flex flex-col">
        
        <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-4 sm:px-5 py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none select-none">
          <div className="flex items-center gap-2.5 pointer-events-auto">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/25 ring-1 ring-white/20">
              <span className="text-lg leading-none filter drop-shadow">🍴</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans drop-shadow-md leading-none">
                Bite<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Up</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold mt-0.5">
                {role === 'foodPartner' ? 'Partner Portal' : 'Food Reels'}
              </span>
            </div>
          </div>

          <div className="relative pointer-events-auto">
            <button type="button" onClick={() => setShowMenu(!showMenu)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-xs border border-white/10 transition-colors uppercase">{account?.username ? account.username.charAt(0) : '👤'}</button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-neutral-900/95 border border-neutral-800 shadow-2xl backdrop-blur-xl p-2 flex flex-col gap-1 z-50">
                <div className="px-3 py-2 border-b border-neutral-800/80">
                  <p className="text-xs font-bold text-white truncate">{account?.username || 'User'}</p>
                  <p className="text-[10px] text-neutral-400 truncate">{account?.email}</p>
                </div>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-white/5 rounded-xl transition">Sign out</button>
                  <button onClick={handleLogoutAll} className="w-full text-left px-3 py-2 text-xs font-semibold text-neutral-400 hover:bg-white/5 rounded-xl transition">Sign out all devices</button>
              </div>
            )}
          </div>
        </header>

        <div className="relative w-full h-full flex-1">
          <ReelFeed items={fooditems} onLike={handleLike} onSave={handleSave} message={message} />
        </div>
      </div>
    </main>
  )
}

export default Home