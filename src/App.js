  import { useRef, useState, useEffect } from "react";
  import Matter from "matter-js";

  import GameAudio from "./components/GameAudio";
  import GameMuteButton from "./components/GameMuteButton";
  import GameStatus from "./components/GameStatus";
  import GameCanvas from "./components/GameCanvas";
  import GameObstacles from "./components/GameObstacles";
  import GameCursor from "./components/GameCursor";

  import MoveIcons from "./components/MoveIcons";

  function Game() {
    const boxSizeWidth = window.innerWidth < 800 ? 100 : 200;
    const boxSizeHeight = window.innerWidth < 800 ? 15 : 30;

    const [isMuted, setIsMuted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [balls, setBalls] = useState([]);
    const [score, setScore] = useState(0);
    const [fadeClass, setFadeClass] = useState("fade-in");

    const engine = useRef(Matter.Engine.create());
    const containerRef = useRef(null);
    const world = engine.current.world;
    const colliderRef = useRef();
    const sensorRef = useRef();
    const cursorRef = useRef(null);
    const audioRef = useRef(null);
    const gameMusicRef = useRef(null);
    const gameOverAudioRef = useRef(null);

    // Yalnızca collider renk değişimi tetiklemek için gerekli olan fonksiyonu optimize et
    const changeColliderColor = (color1, color2, duration) => {
      if (colliderRef.current) {
        colliderRef.current.render.fillStyle = color1;

        const timeoutId = setTimeout(() => {
          if (colliderRef.current) {
            colliderRef.current.render.fillStyle = color2;
          }
        }, duration);

        return () => clearTimeout(timeoutId); // Temizleme
      }
    };

    useEffect(() => {
      if (score > 3) {
        setFadeClass("fade-out");
      } else {
        setFadeClass("fade-in");
      }
    }, [score]);

    // Skor değiştiğinde renk değişimini tetikle
    useEffect(() => {
      if (score > 0) {
        changeColliderColor("#159b7c", "#fe5c24", 300); // Renk değişimi
      }
    }, [score]);

    // Tekrar eden kodları ve bağımlılıkları azaltarak render'ı optimize et
    const handleAddObstacles = () => {
      GameObstacles(
        containerRef,
        boxSizeWidth,
        boxSizeHeight,
        world,
        colliderRef,
        sensorRef
      );
    };

    return (
      <>
        <div className={fadeClass}>
          <MoveIcons />
        </div>

        <GameStatus
          gameOver={gameOver}
          gameStarted={gameStarted}
          score={score}
          setGameStarted={setGameStarted}
          setGameOver={setGameOver}
          setBalls={setBalls}
          setScore={setScore}
          world={world}
          GameObstacles={handleAddObstacles} // Düzgün bir fonksiyon referansı geç
          containerRef={containerRef}
          boxSizeWidth={boxSizeWidth}
          boxSizeHeight={boxSizeHeight}
          colliderRef={colliderRef}
          sensorRef={sensorRef}
          boxBottom={window.innerWidth < 800 ? 200 : 45}
        />

        <GameCanvas
          containerRef={containerRef}
          setScore={setScore}
          setGameOver={setGameOver}
          GameObstacles={handleAddObstacles}
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

        <GameAudio
          audioRef={audioRef}
          gameOverAudioRef={gameOverAudioRef}
          gameMusicRef={gameMusicRef}
          gameStarted={gameStarted}
          gameOver={gameOver}
          isMuted={isMuted}
        />

        <GameCursor cursorRef={cursorRef} gameOver={gameOver} />
      </>
    );
  }

  export default Game;