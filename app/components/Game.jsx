import React from 'react'

const Game = () => {
    return (
        <div className='flex flex-col items-center mt-10'>
            <h1 className='text-[40px] font-bold text-center text-white pt-10'>
                Chalo ek game khelte hai
            </h1 >
            <img src="/catch-the-hearts/poster.png" alt="" className='h-[380px] shadow-lg' />
            <a href="/catch-the-hearts">
                <button className='bg-pink-500 p-3 px-5 rounded-md mt-4'>Start Game</button>
            </a>
        </div>
    )
}

export default Game