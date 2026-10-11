import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const BottomNav = () => {
    const { account, role } = useSelector((state) => state.auth)
    const isFoodPartner = role === 'foodPartner'
    const partnerId = account?._id || account?.id

    return (
        <nav role="navigation" aria-label="Bottom Navigation" className="fixed bottom-0 inset-x-0 z-40 flex justify-center pointer-events-none p-3">
            <div className="pointer-events-auto w-full max-w-[390px] h-14 rounded-2xl bg-neutral-900/90 backdrop-blur-xl border border-neutral-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center justify-around px-3">
                
                <NavLink to="/" end className={({ isActive }) => `flex flex-col items-center justify-center gap-1 transition-colors ${isActive ? 'text-orange-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'}`}>
                    <svg className="w-5 h-5 stroke-[2.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
                    </svg>
                    <span className="text-[10px] tracking-wide leading-none">Home</span>
                </NavLink>

                {isFoodPartner && (
                    <NavLink to="/createFood" className="flex flex-col items-center justify-center -mt-5 group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 ring-2 ring-neutral-950 transition-transform active:scale-95 group-hover:scale-105">
                            <svg className="w-6 h-6 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                    </NavLink>
                )}

                <NavLink to="/saved" className={({ isActive }) => `flex flex-col items-center justify-center gap-1 transition-colors ${isActive ? 'text-orange-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'}`}>
                    <svg className="w-5 h-5 stroke-[2.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                    </svg>
                    <span className="text-[10px] tracking-wide leading-none">Saved</span>
                </NavLink>

                {isFoodPartner && partnerId && (
                    <NavLink to={`/foodPartner/${partnerId}`} className={({ isActive }) => `flex flex-col items-center justify-center gap-1 transition-colors ${isActive ? 'text-orange-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'}`}>
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center text-[10px] font-bold text-white uppercase ring-1 ring-white/20">
                            {account.username?.charAt(0) || 'P'}
                        </div>
                        <span className="text-[10px] tracking-wide leading-none">Profile</span>
                    </NavLink>
                )}
            </div>
        </nav>
    )
}

export default BottomNav