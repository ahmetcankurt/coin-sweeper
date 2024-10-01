import React, { memo } from "react";

function GameOver( { gameOver, score, restartGame }) {
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
