import React, { memo } from "react";
import Matter from "matter-js";

function GameOver( { gameOver, score, setGameOver, setBalls, setScore, world, addObstacles }) {
  
  const restartGame = () => {
    setGameOver(false);
    setBalls([]);
    setScore(0);
    Matter.Composite.clear(world);
    addObstacles();
  };
  

  return (
    <div className={`game-over ${gameOver ? "visible" : ""}`}>
      <h2>Oyun Bitti!</h2>
      <span>Skor: {score}</span>
      <button className="restart-button" onClick={restartGame}>
        Yeniden Başlat
      </button>
    </div>
  );
}

export default memo(GameOver);
