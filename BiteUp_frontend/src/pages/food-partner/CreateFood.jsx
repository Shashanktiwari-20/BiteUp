import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createFood,clearError } from '../../store/slices/foodSlice'

const MAX_SIZE = 15 * 1024 * 1024

const CreateFood = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading,error } = useSelector((state) => state.food)
    const { account, role } = useSelector((state) => state.auth);

    useEffect(() => {
      if (!account || role !== 'foodPartner') {
        navigate('/foodpartner/login');
      }
    }, [account, role, navigate]);

    const [foodName, setFoodName] = useState('')
    const [foodDesc, setFoodDesc] = useState('')
    const [videoFile, setVideoFile] = useState(null)
    const [formError, setFormError] = useState('')

    useEffect(() => {
        dispatch(clearError())
    }, [dispatch])

    const handleFile = (e) => {
        const file = e.target.files[0]
        setFormError('')
        if (!file) {
            setVideoFile(null)
            return
        }
        if (!file.type.startsWith('video/')) {
            setFormError('Please choose a video file')
            setVideoFile(null)
            return
        }
        if (file.size > MAX_SIZE) {
            setFormError('Video must be 15MB or smaller')
            setVideoFile(null)
            return
        }
        setVideoFile(file)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')
        dispatch(clearError())

        if (!videoFile) {
            setFormError('Please choose a video')
            return
        }
        if (!foodName.trim() || !foodDesc.trim()) {
            setFormError('Name and description are required')
            return
        }

        try {
            const food = await dispatch(createFood({ video: videoFile, name: foodName.trim(), description: foodDesc.trim() })).unwrap()
            navigate('/foodPartner/' + food.foodPartner)
        } catch (error) {}
    }

    return (
        <main className="relative w-full min-h-[100dvh] bg-neutral-950 flex justify-center items-center p-0 sm:p-4 overflow-x-hidden">
            <div className="relative w-full h-[100dvh] sm:h-auto sm:max-w-[440px] sm:rounded-3xl sm:border sm:border-neutral-800/80 sm:shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-neutral-900 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-4 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800/80">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-md shadow-orange-500/20 ring-1 ring-white/20">
                            <span className="text-base leading-none">🍴</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tight text-white font-sans leading-none">
                                Bite<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Up</span>
                            </span>
                            <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-semibold mt-0.5">Partner Portal</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-5 flex flex-col gap-5">
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">Create Food Reel</h1>
                        <p className="text-xs text-neutral-400 mt-1">Upload a bite-sized video clip, name your dish, and write a tasty description.</p>
                    </div>

                    <form onSubmit={(e)=>{handleSubmit(e)}} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Food Video</span>
                            <label htmlFor="foodVideo" className="w-full h-44 rounded-2xl border-2 border-dashed border-neutral-700 hover:border-orange-500/60 focus-within:border-orange-500 bg-neutral-950/60 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors p-4 text-center">
                                <input onChange={handleFile} id="foodVideo" name="videos" type="file" accept="video/*" className="sr-only" />
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5l4.5-3v9l-4.5-3M5 6.75h8.25A1.75 1.75 0 0 1 15 8.5v7a1.75 1.75 0 0 1-1.75 1.75H5A1.75 1.75 0 0 1 3.25 15.5v-7A1.75 1.75 0 0 1 5 6.75z" />
                                    </svg>
                                </div>
                                <div className="text-xs font-medium text-white">Tap to choose a video</div>
                                <div className="text-[10px] text-neutral-400 truncate max-w-full">{videoFile ? videoFile.name : 'MP4, WebM up to 100MB'}</div>
                            </label>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="foodName" className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Name</label>
                            <input value={foodName} onChange={(e)=>{setFoodName(e.target.value)}} id="foodName" type="text" placeholder="e.g., Crispy Szechuan Dumplings" className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-orange-500 transition-colors" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="foodDesc" className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Description</label>
                            <textarea value={foodDesc} onChange={(e)=>{setFoodDesc(e.target.value)}} id="foodDesc" rows={3} placeholder="Tell foodies what makes this dish special, spice level, ingredients..." className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none" />
                        </div>

                        {(formError || error) && <p className="text-xs text-rose-400">{formError || error}</p>}

                        <div className="pt-2 mt-auto">
                            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white text-sm font-semibold shadow-lg shadow-orange-500/20 active:scale-[0.99] transition-all disabled:opacity-60">{loading ? 'Uploading...' : 'Publish Food Reel'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default CreateFood