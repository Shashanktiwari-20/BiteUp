import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchFoodPartner, clearProfile } from '../../store/slices/foodPartnerSlice'
import {logoutAllRequest,logoutRequest} from '../../store/slices/authSlice'

const Profile = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { profile, loading, error} = useSelector((state) => state.foodPartner)

    const { account, role } = useSelector((state) => state.auth);
    const isOwnProfile = account && account.id === id && role === 'foodPartner';

    const handleLogout = async () => {
      await dispatch(logoutRequest()).unwrap();
      navigate('/foodpartner/login');
    };

    const handleLogoutAll = async () => {
      await dispatch(logoutAllRequest()).unwrap();
      navigate('/foodpartner/login');
    };

    useEffect(() => {
        dispatch(fetchFoodPartner(id))
        return () => {
            dispatch(clearProfile())
        }
    }, [dispatch, id])


    const foodItems = profile?.foodItems || []
    const joined = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '-'

    return (
        <main className="relative w-full h-[100dvh] bg-neutral-950 flex justify-center items-center overflow-hidden">
            <div className="relative w-full h-full sm:max-w-[440px] sm:h-[92vh] sm:rounded-3xl sm:border sm:border-neutral-800/80 sm:shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-y-auto bg-black flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-4 bg-black/85 backdrop-blur-md border-b border-neutral-800/80">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-md shadow-orange-500/20 ring-1 ring-white/20">
                            <span className="text-base leading-none">🍴</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tight text-white font-sans leading-none">
                                Bite<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Up</span>
                            </span>
                            <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-semibold mt-0.5">Partner Profile</span>
                        </div>
                    </div>
                    <button type="button" aria-label="Go back" onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/90 border border-white/10 transition-colors">
                        <svg className="w-4 h-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </header>

                {loading && <p className="p-6 text-center text-sm text-neutral-400">Loading profile...</p>}
                {!loading && error && <p className="p-6 text-center text-sm text-rose-400">{error}</p>}

                {profile && (
                    <>
                        <section className="px-5 pt-5 pb-4 flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 flex items-center justify-center text-3xl font-black text-white ring-2 ring-orange-500/40 shadow-lg shadow-black">
                                    {profile.username?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <h1 className="text-lg font-bold text-white truncate">{profile.username}</h1>
                                    <p className="text-xs text-neutral-400 truncate mt-0.5">{profile.email}</p>
                                    <div className="mt-2.5 flex items-center gap-2">
                                        <button type="button" className="px-3 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-rose-600 text-white text-xs font-semibold shadow-sm active:scale-95 transition-transform">Follow</button>
                                        <button type="button" className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700/60 active:scale-95 transition-colors">Menu</button>
                                    </div>
                                    {isOwnProfile && (
                                      <div className="flex items-center gap-2 mt-2">
                                        <button onClick={handleLogout} className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-rose-400 text-xs font-semibold border border-neutral-700">Sign out</button>
                                        <button onClick={handleLogoutAll} className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-xs font-semibold border border-neutral-700">Sign out all devices</button>
                                      </div>
                                    )}
                                </div>
                            </div>

                            <div role="list" aria-label="Stats" className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                                <div role="listitem" className="flex flex-col items-center justify-center p-1.5 text-center">
                                    <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">Total Meals</span>
                                    <span className="text-base font-black text-white mt-0.5">{foodItems.length}</span>
                                </div>
                                <div role="listitem" className="flex flex-col items-center justify-center p-1.5 text-center border-l border-neutral-800">
                                    <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">Joined</span>
                                    <span className="text-base font-black text-white mt-0.5">{joined}</span>
                                </div>
                            </div>
                        </section>

                        <div className="w-full h-px bg-neutral-800/80" />

                        {foodItems.length === 0 ? (
                            <p className="p-6 text-center text-sm text-neutral-400">No reels posted yet.</p>
                        ) : (
                            <section aria-label="Videos" className="p-3 grid grid-cols-3 gap-1.5 flex-1">
                                {foodItems.map((v) => (
                                    <div key={v._id} className="relative aspect-[9/16] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800/60">
                                        <video className="w-full h-full object-cover" src={v.video} muted playsInline preload="metadata" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-1.5">
                                            <span className="text-[10px] text-white/90 font-medium truncate">{v.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}

export default Profile