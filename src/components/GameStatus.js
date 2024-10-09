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
  // GameObstacles,
  containerRef,
  boxSizeWidth,
  boxSizeHeight,
  colliderRef,
  sensorRef,
  boxBottom,
}) {
  console.log("GameStatus component rendered");
  const restartGame = () => {
    setGameOver(false);
    setBalls([]); // Topları temizle
    setScore(0); // Skoru sıfırla
    Matter.Composite.clear(world); // Matter.js dünyasını temizle
    // GameObstacles(containerRef, boxSizeWidth, boxSizeHeight, world, colliderRef, sensorRef); // Engelleri tekrar ekle
  
    // Collider'ın başlangıç konumunu güncelle
    if (colliderRef.current) {
      Matter.Body.setPosition(colliderRef.current, {
        x: containerRef.current.clientWidth / 2,
        y: containerRef.current.clientHeight - boxBottom, // Collider'ın yerini ayarlar
      });
    }
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
