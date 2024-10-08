import { memo, useEffect } from "react";
import CoinSound from "../assets/sounds/coin.mp3";
import GameOverSound from "../assets/sounds/game-over.mp3";
import GameMusic from "../assets/sounds/game-music.mp3";

function GameAudio({ gameStarted, gameOver, isMuted, audioRef, gameMusicRef, gameOverAudioRef }) {
  
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
    if (gameMusicRef.current) {
      gameMusicRef.current.muted = isMuted;
    }
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
    if (gameOverAudioRef.current) {
      gameOverAudioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Document visibility API to handle tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopGameMusic();
      } else if (gameStarted && !gameOver) {
        playGameMusic();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [gameStarted, gameOver]);

  return (
    <div>
      <audio ref={audioRef} src={CoinSound} />
      <audio ref={gameMusicRef} src={GameMusic} />
      <audio ref={gameOverAudioRef} src={GameOverSound} />
    </div>
  );
}

export default memo(GameAudio);