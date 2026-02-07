'use client'
import React from 'react'
import { emojiBlast, emojiBlasts } from "emoji-blast";
import Game from './components/Game';

const page = () => {
  
  const proposeBtnClick = () => {
    const { cancel } = emojiBlasts({
      interval: 100,
      emojis: ["💖", "💕", "💗", "💐", "💋", "🌹", "🌹", "😘", "💍", "🧿"],
    });
    setTimeout(cancel, 3000);
  };

  const star = (yPos) => {
    emojiBlast({
      emojiCount: 1,
      emojis: ["⭐️"],
      physics: {
        fontSize: { max: 32, min: 20 },
        gravity: 0.05,
        initialVelocities: {
          x: 45,
          y: -10
        }
      },
      position: {
        x: 0,
        y: yPos
      }
    });
  };
  const sparkles = (yPos, size) => {
    emojiBlast({
      emojiCount: 1,
      emojis: ["✨"],
      physics: {
        fontSize: size,
        gravity: 0.05,
        initialVelocities: {
          rotation: 0,
          x: 45,
          y: -10
        }
      },
      position: {
        x: 0,
        y: yPos
      }
    });
  };
  const shootingStar = () => {
    const randYPos = Math.random() * innerHeight + 100;
    let emojiSize = 18;
    star(randYPos);
    const intervalId2 = setInterval(() => {
      sparkles(randYPos, emojiSize);
      emojiSize -= 3;
    }, 60);
    setTimeout(() => {
      clearInterval(intervalId2);
    }, 400);
  };



  return (
    <div className='md:w-[800px] p-4 mx-auto pb-[1000px]'>
      <h2 className='text-xl text-center mt-8'>Hey Tamanna,</h2>
      <h1 className='text-[50px] font-bold text-center text-white pb-10'>Will you be my Valentine?</h1>
      <img src="/propose.jpeg" alt="" className='w-[460px] mx-auto rounded-lg' />
      <div className='w-fit my-7 flex gap-4 mx-auto'>
        <button onClick={proposeBtnClick} className='bg-green-400 font-bold text-xl rounded-md py-4 px-10 hover:cursor-pointer'>Yes</button>
        <button onClick={proposeBtnClick} className='bg-green-400 font-bold text-xl rounded-md py-4 px-10 hover:cursor-pointer'>Yes</button>
      </div>
      <p className='w-fit mx-auto'>there is no "no"... Darling</p>

      <section className='flex flex-col items-center mt-16 '>
        <img src="/makewish.png" alt="" className='w-[460px] mx-auto rounded-lg' />
        <button onClick={shootingStar} className='bg-red-500 font-bold text-xl rounded-md py-4 px-10 hover:cursor-pointer mt-10'>Make a Wish 💫</button>
      </section>

      <section>
        <Game />
      </section>
    </div>
  )
}

export default page