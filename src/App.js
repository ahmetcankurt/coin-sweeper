import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

import GameAudio from "./components/GameAudio";
import GameControl from "./components/GameControl";
import GameCursor from "./components/GameCursor";
import GameMuteButton from "./components/GameMuteButton";
import GameOver from "./components/GameOver";
import GameCanvas from "./components/GameCanvas";
import "./style.css";

function Game() {
  const [isMuted, setIsMuted] = useState(false);

  const boxSizeWidth = window.innerWidth < 800 ? 150 : 200;
  const boxSizeHeight = window.innerWidth < 800 ? 20 : 30;

  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // Oyunun başlaması durumu
  const [balls, setBalls] = useState([]);
  const [score, setScore] = useState(0);
  const engine = useRef(Matter.Engine.create());
  const obstacles = useRef([]);
  const containerRef = useRef(null);
  const world = engine.current.world;
  const colliderRef = useRef();
  const sensorRef = useRef();
  const cursorRef = useRef(null);
  const audioRef = useRef(null);
  const gameMusicRef = useRef(null); // Oyun müziği referansı
  const gameOverAudioRef = useRef(null); // game-over.mp3 için referans

  const playGameOverSound = () => {
    if (gameOverAudioRef.current) {
      gameOverAudioRef.current.play().catch((error) => {
        console.error("Error playing game over sound:", error);
      });
    }
  };

  const playGameMusic = () => {
    if (gameMusicRef.current) {
      gameMusicRef.current.loop = true; // Döngüde çalsın
      gameMusicRef.current.play().catch((error) => {
        console.error("Error playing game music:", error);
      });
    }
  };

  const stopGameMusic = () => {
    if (gameMusicRef.current) {
      gameMusicRef.current.pause();
      gameMusicRef.current.currentTime = 0; // Baştan başlatmak için
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }

    if (gameMusicRef.current) {
      gameMusicRef.current.load();
    }
  }, []);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      playGameMusic(); // Oyun başladığında müziği çal
    } else {
      stopGameMusic(); // Oyun bitince müziği durdur
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    // Oyun bittiğinde game-over.mp3 çal
    if (gameOver) {
      playGameOverSound();
    }
  }, [gameOver]);

  const playSound = () => {
    if (audioRef.current) {
      // Mevcut sesi durdur ve başa sar
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      // Sesi yeniden başlat
      audioRef.current.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, []);

  const setContainerHeight = () => {
    if (containerRef.current) {
      containerRef.current.style.height = `${window.innerHeight}px`;
    }
  };

  useEffect(() => {
    setContainerHeight();
    window.addEventListener("resize", setContainerHeight);
    return () => {
      window.removeEventListener("resize", setContainerHeight);
    };
  }, []);

  const addObstacles = () => {
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const obstacleSize = containerWidth < 600 ? 6 : 5;
    const obstacleRows = containerWidth < 600 ? 9 : 12;
    const obstacleCols = containerWidth < 600 ? 10 : 20;
    const spacingMultiplier = 0.8;
    const obstacleSpacingX = containerWidth / obstacleCols;
    const obstacleSpacingY =
      (containerHeight / (obstacleRows + 2)) * spacingMultiplier;

    const newObstacles = [];
    for (let row = 0; row < obstacleRows; row++) {
      for (let col = 0; col < obstacleCols; col++) {
        const xOffset = row % 2 === 0 ? obstacleSpacingX / 2 : 0;
        const x = col * obstacleSpacingX + xOffset;
        const y = row * obstacleSpacingY + 100;
        const obstacle = Matter.Bodies.circle(x, y, obstacleSize, {
          isStatic: true,
          render: { fillStyle: "#2e4855" },
        });
        newObstacles.push(obstacle);
      }
    }

    const frameThickness = 20;
    const frameObstacles = [
      Matter.Bodies.rectangle(
        frameThickness / 2,
        containerHeight / 2,
        frameThickness,
        containerHeight,
        { isStatic: true }
      ),
      Matter.Bodies.rectangle(
        containerWidth - frameThickness / 2,
        containerHeight / 2,
        frameThickness,
        containerHeight,
        { isStatic: true }
      ),
    ];

    obstacles.current = [...newObstacles, ...frameObstacles];

    const colliderWidth = boxSizeWidth;
    const colliderHeight = boxSizeHeight;
    const radius = 2; // Köşe yarıçapı
    const collider = Matter.Bodies.fromVertices(
      containerWidth / 2,
      containerHeight - colliderHeight / 2,
      [
        { x: -colliderWidth / 2 + radius, y: -colliderHeight / 2 }, // Sol üst köşe
        { x: colliderWidth / 2 - radius, y: -colliderHeight / 2 }, // Sağ üst köşe
        { x: colliderWidth / 2, y: -colliderHeight / 2 + radius }, // Sağ üst yarı
        { x: colliderWidth / 2, y: colliderHeight / 2 - radius }, // Sağ alt yarı
        { x: colliderWidth / 2 - radius, y: colliderHeight / 2 }, // Sağ alt köşe
        { x: -colliderWidth / 2 + radius, y: colliderHeight / 2 }, // Sol alt köşe
        { x: -colliderWidth / 2, y: colliderHeight / 2 - radius }, // Sol alt yarı
        { x: -colliderWidth / 2, y: -colliderHeight / 2 + radius }, // Sol üst yarı
      ],
      {
        isStatic: true,
        render: { fillStyle: "#fe5c24" },
      }
    );

    colliderRef.current = collider;
    Matter.Composite.add(world, [...newObstacles, ...frameObstacles, collider]);

    const sensor = Matter.Bodies.rectangle(
      containerWidth / 2,
      containerHeight,
      containerWidth,
      3,
      {
        isStatic: true,
        isSensor: true,
        render: { fillStyle: "red" },
      }
    );
    sensorRef.current = sensor;
    Matter.Composite.add(world, sensor);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };

  const restartGame = () => {
    setGameOver(false);
    setBalls([]);
    setScore(0);
    Matter.Composite.clear(world);
    addObstacles();
  };

  const toggleMute = () => {
    setIsMuted((prevMuted) => {
      const newMutedState = !prevMuted;
      if (gameMusicRef.current) {
        gameMusicRef.current.muted = newMutedState;
      }
      if (audioRef.current) {
        audioRef.current.muted = newMutedState;
      }
      if (gameOverAudioRef.current) {
        gameOverAudioRef.current.muted = newMutedState;
      }
      return newMutedState;
    });
  };

  return (
    <>
      <GameControl
        gameStarted={gameStarted}
        setGameStarted={setGameStarted}
        handleStartGame={handleStartGame}
      />

      <GameCanvas
        containerRef={containerRef}
        setScore={setScore}
        setGameOver={setGameOver}
        playSound={playSound}
        addObstacles={addObstacles}
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
      />

      <div className="score">
        <span>Skor: {score}</span>
        <GameMuteButton isMuted={isMuted} toggleMute={toggleMute} />
      </div>

      <GameOver gameOver={gameOver} score={score} restartGame={restartGame} />

      <GameCursor gameOver={gameOver} cursorRef={cursorRef} />

      <GameAudio
        audioRef={audioRef}
        gameOverAudioRef={gameOverAudioRef}
        gameMusicRef={gameMusicRef}
      />
    </>
  );
}

export default Game;
