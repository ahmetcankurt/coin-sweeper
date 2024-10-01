import { memo } from "react";

function GameControl({ gameStarted, handleStartGame }) {

  return (
    <>
      {!gameStarted && (
        <div className={"game-over  visible"}>
          <h2> Topu Yakala!</h2>
          <button className="restart-button" onClick={handleStartGame}>
            Oyunu Başlat
          </button>
        </div>
      )}
    </>
  );
}

export default memo(GameControl);
