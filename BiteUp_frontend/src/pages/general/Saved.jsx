import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ReelFeed from '../../components/ReelFeed'
import { getsavedFood,likes,saveFood } from '../../store/slices/foodSlice'

const Saved = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { savedFoods,loading,error } = useSelector((state) => state.food)

    useEffect(() => {
        dispatch(getsavedFood())
    }, [dispatch])

    const handleLike = (item) => dispatch(likes(item._id))
    const handleSave = (item) => dispatch(saveFood(item._id))

    const emptyMessage = loading ? 'Loading saved reels...' : error || 'No saved videos yet.'

    
    return (
        <main className="relative w-full h-[100dvh] bg-neutral-950 flex justify-center items-center overflow-hidden">
            <div className="relative w-full h-full sm:max-w-[440px] sm:h-[92vh] sm:rounded-3xl sm:border sm:border-neutral-800/80 sm:shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden bg-black flex flex-col">
                <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-4 sm:px-5 py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none select-none">
                    <div className="flex items-center gap-2.5 pointer-events-auto">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/25 ring-1 ring-white/20 transition-transform active:scale-95 cursor-pointer">
                            <span className="text-lg leading-none filter drop-shadow">🍴</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans drop-shadow-md leading-none">
                                Bite<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Up</span>
                            </span>
                            <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold mt-0.5">Saved Bites</span>
                        </div>
                    </div>
                    <div className="pointer-events-auto w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-rose-400 border border-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M5 3a2 2 0 0 0-2 2v16l9-4 9 4V5a2 2 0 0 0-2-2H5z" />
                        </svg>
                    </div>
                </header>
                <div className="relative w-full h-full flex-1">
                    <ReelFeed items={savedFoods} onLike={handleLike} onSave={handleSave} message={emptyMessage} />
                </div>
            </div>
        </main>
    )
}

export default Saved