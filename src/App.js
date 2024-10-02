import { useRef, useState } from "react";
import Matter from "matter-js";

import GameAudio from "./components/GameAudio";
import GameControl from "./components/GameControl";
import GameMuteButton from "./components/GameMuteButton";
import GameOver from "./components/GameOver";
import GameCanvas from "./components/GameCanvas";
import addObstacles from "./components/addObstacles";
import "./assets/css/style.css";

function Game() {
  const boxSizeWidth = window.innerWidth < 800 ? 150 : 200;
  const boxSizeHeight = window.innerWidth < 800 ? 20 : 30;

  const [isMuted, setIsMuted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // Oyunun başlaması durumu
  const [balls, setBalls] = useState([]);
  const [score, setScore] = useState(0);

  const engine = useRef(Matter.Engine.create());
  const containerRef = useRef(null);
  const world = engine.current.world;
  const colliderRef = useRef();
  const sensorRef = useRef();
  const cursorRef = useRef(null);
  const audioRef = useRef(null);
  const gameMusicRef = useRef(null); // Oyun müziği referansı
  const gameOverAudioRef = useRef(null); // game-over.mp3 için referans

  return (
    <>
      <GameControl
        gameStarted={gameStarted}
        setGameStarted={setGameStarted}
        setGameOver={setGameOver}
        setScore={setScore}
      />

      <GameCanvas
        containerRef={containerRef}
        setScore={setScore}
        setGameOver={setGameOver}
        addObstacles={() =>
          addObstacles(
            containerRef,
            boxSizeWidth,
            boxSizeHeight,
            world,
            colliderRef,
            sensorRef
          )
        }
        world={world}
        engine={engine}
        colliderRef={colliderRef}
        sensorRef={sensorRef}
        balls={balls}
        setBalls={setBalls}
        gameOver={gameOver}
        gameStarted={gameStarted}
        boxSizeWidth={boxSizeWidth}
        cursorRef={cursorRef}
        audioRef={audioRef}
      />

      <div className="score">
        <span>Skor: {score}</span>
        <GameMuteButton
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          audioRef={audioRef}
          gameMusicRef={gameMusicRef}
          gameOverAudioRef={gameOverAudioRef}
        />
      </div>

      <GameOver
        gameOver={gameOver}
        score={score}
        setGameOver={setGameOver}
        setBalls={setBalls}
        setScore={setScore}
        world={world}
        addObstacles={() =>
          addObstacles(
            containerRef,
            boxSizeWidth,
            boxSizeHeight,
            world,
            colliderRef,
            sensorRef
          )
        }
      />

      <GameAudio
        audioRef={audioRef}
        gameOverAudioRef={gameOverAudioRef}
        gameMusicRef={gameMusicRef}
        gameStarted={gameStarted}
        gameOver={gameOver}
        isMuted={isMuted}
      />
    </>
  );
}

export default Game;