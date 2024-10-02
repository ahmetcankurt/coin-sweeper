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
    setBalls([]);
    setScore(0);
    Matter.Composite.clear(world);
    addObstacles();
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div>
      {!gameStarted ? (
        <div className={"game-over visible"}>
          <h2>Topu Yakala!</h2>
          <button className="restart-button" onClick={handleStartGame}>
            Oyunu Başlat
          </button>
        </div>
      ) : gameOver ? (
        <div className={`game-over visible`}>
          <h2>Oyun Bitti!</h2>
          <span>Skor: {score}</span>
          <button className="restart-button" onClick={restartGame}>
            Yeniden Başlat
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default memo(GameStatus);