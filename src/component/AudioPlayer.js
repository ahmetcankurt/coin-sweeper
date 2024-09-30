import { useRef, useEffect } from "react";

import CoinSound from "../coin.mp3";
import GameOverSound from "../game-over.mp3"; 
import GameMusic from "../game-music-loop.mp3"; 

function AudioPlayer({ gameStarted, gameOver  , playSound, audioRef }) {
  const gameMusicRef = useRef(null); 
  const gameOverAudioRef = useRef(null); 

  const playGameOverSound = () => {
    if (gameOverAudioRef.current) {
      gameOverAudioRef.current.play().catch((error) => {
        console.error("Error playing game over sound:", error);
      });
    }
  };

  const playGameMusic = () => {
    if (gameMusicRef.current) {
      gameMusicRef.current.loop = true; 
      gameMusicRef.current.play().catch((error) => {
        console.error("Error playing game music:", error);
      });
    }
  };

  const stopGameMusic = () => {
    if (gameMusicRef.current) {
      gameMusicRef.current.pause();
      gameMusicRef.current.currentTime = 0; 
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }

    if (gameMusicRef.current) {
      gameMusicRef.current.load();
    }
  }, []);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      playGameMusic(); 
    } else {
      stopGameMusic(); 
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (gameOver) {
      playGameOverSound();
    }
  }, [gameOver]);

 

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, []);

  // Fonksiyonları dışarı aktar
  return {
    playGameOverSound,
    playGameMusic,
    stopGameMusic,
    playSound,
    audioRef,
    gameOverAudioRef,
    gameMusicRef,
    render: () => (
      <>
        <audio ref={audioRef} src={CoinSound} />
        <audio ref={gameOverAudioRef} src={GameOverSound} />
        <audio ref={gameMusicRef} src={GameMusic} />
      </>
    )
  };
}

export default AudioPlayer;
