import React from 'react'
import { Link } from 'react-router-dom'

const ReelFeed = ({ items, onLike, onSave, message}) => {
    return (
        <div role="list" className="relative w-full h-full overflow-y-scroll snap-y snap-mandatory bg-black [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {items.length === 0 && (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-neutral-500">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-3 text-neutral-400">
                        <span className="text-2xl">🍽️</span>
                    </div>
                    <p className="text-sm font-medium text-neutral-400">{message}</p>
                </div>
            )}

            {items.map((item) => (
                <section key={item._id} role="listitem" className="relative w-full h-full snap-start snap-always overflow-hidden bg-black flex items-center justify-center">
                    <video className="w-full h-full object-cover" src={item.video || item.videoUrl} muted playsInline autoPlay loop preload="metadata" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />

                    <div className="absolute right-3 bottom-40 z-20 flex flex-col items-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                            <button type="button" aria-label="Like" onClick={onLike ? () => onLike(item) : undefined} className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform">
                                <svg className={`w-6 h-6 stroke-[2] text-rose-500 ${item.isLiked ? 'fill-rose-500' : 'fill-rose-500/20'}`} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                                </svg>
                            </button>
                            <span className="text-[11px] font-bold text-white drop-shadow-md">{item.likeCount ?? 0}</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <button type="button" aria-label="Bookmark" onClick={onSave ? () => onSave(item) : undefined} className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform">
                                <svg className={`w-5 h-5 stroke-[2] text-amber-400 ${item.isSaved ? 'fill-amber-400' : 'fill-amber-400/20'}`} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                                </svg>
                            </button>
                            <span className="text-[11px] font-bold text-white drop-shadow-md">{item.savesCount ?? 0}</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <button type="button" aria-label="Comments" className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform">
                                <svg className="w-5 h-5 stroke-[2] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                                </svg>
                            </button>
                            <span className="text-[11px] font-bold text-white drop-shadow-md">{item.commentsCount ?? 0}</span>
                        </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-24 z-10 px-4 pr-16 flex flex-col gap-2">
                        {item.foodPartner && (
                            <Link to={"/foodPartner/" + item.foodPartner} aria-label="Visit store" className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-rose-600 text-white text-[11px] font-semibold tracking-wide shadow-md active:scale-95 transition-transform">
                                <span>🍴 Visit Store</span>
                            </Link>
                        )}
                        <p title={item.description} className="text-sm font-medium text-white/95 line-clamp-2 drop-shadow-md">{item.description}</p>
                    </div>
                </section>
            ))}
        </div>
    )
}

export default ReelFeed