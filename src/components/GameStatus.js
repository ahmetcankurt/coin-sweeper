import React, { memo } from "react";
import Matter from "matter-js";

function GameStatus({
  gameOver,
  gameStarted,
  score,
  setGameOver,
  setGameStarted,
  setBalls,
  setScore,
  world,
  addObstacles,
}) {
  const restartGame = () => {
    setGameOver(false);
    setBalls([]); // Clear balls
    setScore(0);  // Reset score
    Matter.Composite.clear(world); // Clear Matter.js world
    addObstacles(); // Add obstacles again
  };

  const handleStartGame = () => {
    setGameStarted(true); // Mark game as started
    setGameOver(false);   // Reset game over state
    setScore(0);          // Reset score
  };

  return (
    <div>
      {!gameStarted ? (
        <div className="game-over visible" aria-live="polite">
          <h2>Topu Yakala!</h2>
          <button 
            className="restart-button" 
            onClick={handleStartGame}
            aria-label="Oyunu Başlat"
          >
            Oyunu Başlat
          </button>
        </div>
      ) : gameOver ? (
        <div className="game-over visible" aria-live="polite">
          <h2>Oyun Bitti!</h2>
          <span>Skor: {score}</span>
          <button 
            className="restart-button" 
            onClick={restartGame}
            aria-label="Yeniden Başlat"
          >
            Yeniden Başlat
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default memo(GameStatus);
