"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const GAME_WIDTH = 380;
const GAME_HEIGHT = 520;
const PLAYER_WIDTH = 56;
const PLAYER_HEIGHT = 64;
const HEART_SIZE = 40;
const PLAYER_BOTTOM_PADDING = 24;
const FALL_SPEED = 2.4;
const MOVE_SPEED = 6;
const TOTAL_HEARTS = 10;

const PLAYER_TOP = GAME_HEIGHT - PLAYER_BOTTOM_PADDING - PLAYER_HEIGHT;

function overlaps(aLeft, aRight, bLeft, bRight) {
    return aLeft < bRight && aRight > bLeft;
}

export default function CatchTheHeartsPage() {
    const [screen, setScreen] = useState("start"); // start | playing | gameover
    const [score, setScore] = useState(0);
    const [heartIndex, setHeartIndex] = useState(0);
    const [heart, setHeart] = useState(null); // { x, y } or null
    const [playerX, setPlayerX] = useState((GAME_WIDTH - PLAYER_WIDTH) / 2);

    const keysRef = useRef({ left: false, right: false });
    const gameAreaRef = useRef(null);
    const touchStartX = useRef(null);
    const playerXRef = useRef((GAME_WIDTH - PLAYER_WIDTH) / 2);
    const catchLineCheckedRef = useRef(false);

    const spawnHeart = useCallback(() => {
        const padding = HEART_SIZE;
        const minX = padding;
        const maxX = GAME_WIDTH - HEART_SIZE - padding;
        const x = minX + Math.random() * (maxX - minX);
        catchLineCheckedRef.current = false;
        setHeart({ x, y: 0 });
    }, []);

    const startGame = useCallback(() => {
        setScreen("playing");
        setScore(0);
        setHeartIndex(0);
        setPlayerX((GAME_WIDTH - PLAYER_WIDTH) / 2);
        playerXRef.current = (GAME_WIDTH - PLAYER_WIDTH) / 2;
        setHeart(null);
        setTimeout(() => spawnHeart(), 100);
    }, [spawnHeart]);

    const resetToStart = useCallback(() => {
        setScreen("start");
        setScore(0);
        setHeartIndex(0);
        setHeart(null);
        setPlayerX((GAME_WIDTH - PLAYER_WIDTH) / 2);
        playerXRef.current = (GAME_WIDTH - PLAYER_WIDTH) / 2;
    }, []);

    // Keyboard
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") {
                keysRef.current.left = true;
                e.preventDefault();
            }
            if (e.key === "ArrowRight") {
                keysRef.current.right = true;
                e.preventDefault();
            }
        };
        const handleKeyUp = (e) => {
            if (e.key === "ArrowLeft") keysRef.current.left = false;
            if (e.key === "ArrowRight") keysRef.current.right = false;
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    // Game loop
    useEffect(() => {
        if (screen !== "playing") return;

        const loop = () => {
            setPlayerX((prev) => {
                let next = prev;
                if (keysRef.current.left) next = Math.max(0, prev - MOVE_SPEED);
                if (keysRef.current.right) next = Math.min(GAME_WIDTH - PLAYER_WIDTH, prev + MOVE_SPEED);
                playerXRef.current = next;
                return next;
            });

            setHeart((h) => {
                if (!h) return null;
                const newY = h.y + FALL_SPEED;
                const heartLeft = h.x;
                const heartRight = h.x + HEART_SIZE;
                const heartBottom = newY + HEART_SIZE;
                const px = playerXRef.current;
                const playerLeft = px;
                const playerRight = px + PLAYER_WIDTH;

                if (!catchLineCheckedRef.current && heartBottom >= PLAYER_TOP) {
                    catchLineCheckedRef.current = true;
                    if (overlaps(heartLeft, heartRight, playerLeft, playerRight)) {
                        setScore((s) => s + 1);
                        setHeartIndex((i) => {
                            const next = i + 1;
                            if (next >= TOTAL_HEARTS) {
                                setScreen("gameover");
                                return next;
                            }
                            setTimeout(() => spawnHeart(), 200);
                            return next;
                        });
                        return null;
                    }
                }

                if (newY > GAME_HEIGHT) {
                    setHeartIndex((i) => {
                        const next = i + 1;
                        if (next >= TOTAL_HEARTS) {
                            setScreen("gameover");
                            return next;
                        }
                        setTimeout(() => spawnHeart(), 200);
                        return next;
                    });
                    return null;
                }

                return { ...h, y: newY };
            });
        };

        const id = setInterval(loop, 1000 / 60);
        return () => clearInterval(id);
    }, [screen, spawnHeart]);

    const handleTouchStart = (e) => {
        if (screen !== "playing") return;
        const gameRect = gameAreaRef.current?.getBoundingClientRect();
        if (!gameRect) return;
        const clientX = e.touches[0].clientX;
        touchStartX.current = clientX - gameRect.left - playerXRef.current;
    };

    const handleTouchMove = (e) => {
        if (screen !== "playing" || touchStartX.current == null) return;
        const gameRect = gameAreaRef.current?.getBoundingClientRect();
        if (!gameRect) return;
        const clientX = e.touches[0].clientX;
        const relativeX = clientX - gameRect.left;
        let newX = relativeX - touchStartX.current;
        newX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_WIDTH, newX));
        setPlayerX(newX);
        playerXRef.current = newX;
    };

    const handleTouchEnd = () => {
        touchStartX.current = null;
    };

    return (
        <div className="h-[80vh] md:min-h-screen flex flex-col items-center justify-center p-4">
            {screen === "start" && (
                <div className="flex flex-col items-center gap-8 animate-in fade-in duration-300">
                    <h1 className="text-5xl md:text-5xl font-bold text-white text-center drop-shadow-sm">
                        Catch The Hearts
                    </h1>
                    <p className="text-rose-600/90 text-center max-w-sm">
                        Move left and right to catch hearts. Use arrow keys (← →) or drag on mobile.
                    </p>
                    <button
                        onClick={startGame}
                        className="px-10 py-4 rounded-2xl bg-rose-500 text-white font-semibold text-lg shadow-lg hover:bg-rose-600 active:scale-95 transition-all"
                    >
                        Start
                    </button>
                </div>
            )}

            {screen === "playing" && (
                <div
                    ref={gameAreaRef}
                    className="relative rounded-2xl overflow-hidden shadow-xl bg-white border border-rose-200/60 select-none"
                    style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                >
                    <Image
                        src="/catch-the-hearts/tanishq.png"
                        alt="Tanishq"
                        width={PLAYER_WIDTH - 10}
                        height={PLAYER_HEIGHT}
                        className="object-contain absolute top-0 left-1/2 -translate-x-1/2"
                        unoptimized
                    />

                    {heart && (
                        <div
                            className="absolute z-10 pointer-events-none"
                            style={{
                                left: heart.x,
                                top: heart.y,
                                width: HEART_SIZE,
                                height: HEART_SIZE,
                            }}
                        >
                            <Image
                                src="/catch-the-hearts/heart.png"
                                alt="Heart"
                                width={HEART_SIZE}
                                height={HEART_SIZE}
                                className="object-contain w-full h-full"
                                unoptimized
                            />
                        </div>
                    )}

                    <div
                        className="absolute bottom-0 z-20 touch-none"
                        style={{
                            left: playerX,
                            bottom: PLAYER_BOTTOM_PADDING,
                            width: PLAYER_WIDTH,
                            height: PLAYER_HEIGHT,
                        }}
                    >
                        <Image
                            src="/catch-the-hearts/player.png"
                            alt="Player"
                            width={PLAYER_WIDTH}
                            height={PLAYER_HEIGHT}
                            className="object-contain w-full h-full drop-shadow-md"
                            unoptimized
                            draggable={false}
                        />
                    </div>
                </div>
            )}

            {screen === "gameover" && (
                <div className="flex flex-col items-center gap-8 animate-in fade-in duration-300">
                    <h2 className="text-3xl md:text-4xl font-bold text-rose-700">Game Over</h2>
                    <p className="text-xl text-rose-600">
                        Final score: <strong>{score}</strong> / {TOTAL_HEARTS}
                    </p>
                    <button
                        onClick={resetToStart}
                        className="px-10 py-4 rounded-2xl bg-rose-500 text-white font-semibold text-lg shadow-lg hover:bg-rose-600 active:scale-95 transition-all"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}
