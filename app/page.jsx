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
    <div className='md:w-[800px] p-4 mx-auto'>
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
        <h1 className='text-[40px] font-bold text-center text-white pt-10'>My Love Tamanna</h1>
        <p className='text-center text-lg'>Hey Baby, its our 3rd year celebrating this day of love together. I love you so much
          <br /><br />
          I love you more than yesterday and less than tomorrow ❤️
          <br /><br />
          You bring so much love and happiness into my life Tamanna. I always wanted this type of love, this expressive, this gentle, this passionate type of love, this safe secure type of love. The type of love that makes you feel like you are at home, the type of love worth living and fighting for.
          <br /><br />
          Tamanna, youre my world. and I am soo grateful to have you by my side every single day. Whenever Im not with you I miss you, I want to hold you, hug you and never let you go. Your presence brings me calm and I feel the most loved human on this earth. 
          <br /><br />
          I love your smile, I love your laughs on my jokes, I love your clumsyness, I love your eyes, your lips, your voice, your touch, your smell, your heart, your soul. I will forever protect this beautiful soul of yours.
          <br /><br />
          I know I lack sometimes, I make some mistakes, do some actions, say some words that hurt you. Sometimes I feel not enough to love you the way you deserve. But Tamanna, you keep loving me the same, and only more than before. You are soo patient with me... Just know baby that I want to be my best version for you, to give you the love you deserve, the love you crave for. I promise to celebrate you every single day, to make you feel appreciated, seen and loved. 
          <br /><br />
          I wanna spend my whole life with you, by your side, caring for you, supporting you at every step in your life, and making a safe home for our love. I love you soo soo sooooo much Tamanna 💗
        </p>
      </section>

      <section>
        <Game />
      </section>
      <section>
        <h1 className='text-[40px] font-bold text-center text-white pt-10'>Our Gallery</h1>
        <img src="/scroll.png" alt="" />
        <h1 className='text-[40px] font-bold text-center text-white pt-10'>I LOVE YOU</h1>
      </section>
    </div>
  )
}

export default page