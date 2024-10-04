import { memo } from "react";
import Matter from "matter-js";
import Fireworks from "./Fireworks"; // Havai fişek bileşenini içe aktar

function GameStatus({
  gameOver,
  gameStarted,
  score,
  setGameOver,
  setGameStarted,
  setBalls,
  setScore,
  world,
  GameObstacles,
}) {
  const restartGame = () => {
    setGameOver(false);
    setBalls([]); // Clear balls
    setScore(0); // Reset score
    Matter.Composite.clear(world); // Clear Matter.js world
    GameObstacles(); // Add obstacles again
  };

  const handleStartGame = () => {
    setGameStarted(true); // Mark game as started
    setGameOver(false); // Reset game over state
    setScore(0); // Reset score
  };

  return (
    <div>
      {!gameStarted ? (
        <div className="game-over visible" aria-live="polite">
          <div className="game-over-card">
            <h2>Topu Yakala!</h2>
            <button
              className="restart-button"
              onClick={handleStartGame}
              aria-label="Oyunu Başlat"
            >
              Oyunu Başlat
            </button>
          </div>
        </div>
      ) : gameOver ? (
        <div className="game-over visible" aria-live="polite">
          <Fireworks active={gameOver} />
          <div className="game-over-card">
            <h2>Oyun Bitti!</h2>
            <span className="score-card">Skor: {score}</span>
            <button
              style={{ zIndex: 1 }}
              className="restart-button"
              onClick={restartGame}
              aria-label="Yeniden Başlat"
            >
              Yeniden Başlat
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default memo(GameStatus);
