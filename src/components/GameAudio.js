import { memo, useEffect, useRef } from "react";
import CoinSound from "../coin.mp3";
import GameOverSound from "../game-over.mp3";
import GameMusic from "../game-music-loop.mp3";

function GameAudio({ audioRef, gameOverAudioRef, gameMusicRef }) {


  return (
    <div>
      <audio ref={audioRef} src={CoinSound} />
      <audio ref={gameOverAudioRef} src={GameOverSound} />
      <audio ref={gameMusicRef} src={GameMusic} />
    </div>
  );
}

export default memo(GameAudio);
