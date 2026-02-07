"use client"

import React, { useEffect, useRef, useState } from "react";
import { LuCirclePause } from "react-icons/lu";
import { LuCirclePlay } from "react-icons/lu";
import { LuSkipBack } from "react-icons/lu";
import { LuSkipForward } from "react-icons/lu";

// NOTE: Update this list so that `src` matches
// the actual filenames you place in `public/songs`.
const tracks = [
  {
    title: "My girl my girl",
    src: "/songs/My girl My Girl.mp3",
    thumbnail: "https://gifdb.com/images/high/dudu-kiss-bubu-cheek-x3y1h47jz8612z6m.webp", // or any image in /public
  },
  {
    title: "Our Song",
    src: "/songs/Our song.mp3",
    thumbnail: "https://gifdb.com/images/high/bubu-sleeping-dudu-carry-3lfzh0p305j5i1l2.webp",
  },
  {
    title: "You're in All My Wishes",
    src: "/songs/Youre in all my wishes.mp3",
    thumbnail: "https://media.tenor.com/tW4jk2HaN3YAAAAi/bubu-dudu.gif",
  },
  {
    title: "Perfect",
    src: "/songs/Perfect.mp3",
    thumbnail: "https://media.tenor.com/pdv5YIMB-hkAAAAi/cute.gif",
  },
  {
    title: "You're Mine",
    src: "/songs/Put Your Hand in Mine.mp3",
    thumbnail: "https://media.tenor.com/dHSIL5HUotgAAAAi/hold-dudu-shake-hand.gif",
  },
];

const Player = () => {
  const audioRef = useRef(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    // Pause when track changes, then optionally auto-play
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.load();
    setCurrentTime(0);
    if (isPlaying) {
      audioRef.current
        .play()
        .catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime || 0);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const value = Number(e.target.value);
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) =>
      prev === 0 ? tracks.length - 1 : prev - 1
    );
  };

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || Number.isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 rounded-2xl bg-white/30  backdrop-blur-md shadow-lg w-[330px] p-4 text-white">
      {/* Thumbnail */}
      <div className="w-full aspect-square flex-shrink-0 overflow-hidden rounded-md bg-[#c4d8f6]">
        {currentTrack?.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentTrack.thumbnail}
            alt={currentTrack.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
            No Image
          </div>
        )}
      </div>

      {/* Title */}
      <div className="">
        <div className="truncate text-lg font-semibold">
          {currentTrack?.title || "Unknown Track"}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex-1 flex items-center gap-2 w-full">
        <span className="text-[14px] text-neutral-300 text-right">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 accent-pink-500"
        />
        <span className="text-[14px] text-neutral-300">
          {formatTime(duration)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center mx-auto gap-5">
        <button
          onClick={handlePrev}
          className=""
          aria-label="Previous song"
        >
          <LuSkipBack size={30} />
        </button>
        <button
          onClick={togglePlayPause}
          className=""
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <LuCirclePause size={40} /> : <LuCirclePlay size={40} />}
        </button>
        <button
          onClick={handleNext}
          className=""
          aria-label="Next song"
        >
          <LuSkipForward size={30} />
        </button>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      >
        <source src={currentTrack?.src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Player;