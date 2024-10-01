import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import "./style.css";

import CoinSound from "./coin.mp3";
import GameOverSound from "./game-over.mp3"; // game-over.mp3 dosyasını ekliyoruz
import GameMusic from "./game-music-loop.mp3"; // Oyun müziğini ekleyin

function Game() {
  const [boxX, setBoxX] = useState(window.innerWidth / 2 - 50);
  const [isMuted, setIsMuted] = useState(false);

  const boxSizeWidth = window.innerWidth < 800 ? 150 : 200;
  const boxSizeHeight = window.innerWidth < 800 ? 20 : 30;
  const boxBottom = window.innerWidth < 800 ? 70 : 45;

  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // Oyunun başlaması durumu
  const [ballInterval, setBallInterval] = useState(1500);
  const [balls, setBalls] = useState([]);
  const [score, setScore] = useState(0);
  const engine = useRef(Matter.Engine.create());
  const runner = useRef(Matter.Runner.create());
  const obstacles = useRef([]);
  const requestRef = useRef();
  const containerRef = useRef(null);
  const world = engine.current.world;
  const colliderRef = useRef();
  const sensorRef = useRef();
  const cursorRef = useRef(null);

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

  useEffect(() => {
    const canvas = containerRef.current.querySelector("canvas");
    if (!canvas) return;

    const render = Matter.Render.create({
      canvas: canvas,
      engine: engine.current,
      options: {
        width: canvas.clientWidth,
        height: canvas.clientHeight,
        wireframes: false,
        background: "#e2e2e2",
      },
    });

    Matter.Render.run(render);
    Matter.Runner.run(runner.current, engine.current);

    const boundaries = [
      Matter.Bodies.rectangle(
        canvas.clientWidth / 2,
        -25,
        canvas.clientWidth,
        50,
        { isStatic: true }
      ),
      Matter.Bodies.rectangle(
        canvas.clientWidth / 2,
        canvas.clientHeight + 25,
        canvas.clientWidth,
        50,
        { isStatic: true }
      ),
    ];

    Matter.Composite.add(world, boundaries);
    addObstacles();

    Matter.Events.on(engine.current, "collisionStart", (event) => {
      const pairs = event.pairs;
      pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        if (
          (bodyA === colliderRef.current && bodyB.circleRadius) ||
          (bodyB === colliderRef.current && bodyA.circleRadius)
        ) {
          setScore((prevScore) => prevScore + 1);
          playSound(); // Her skor artışında sesi baştan çal
          const ballToRemove = bodyA.circleRadius ? bodyA : bodyB;
          Matter.Composite.remove(world, ballToRemove);
        }

        if (
          (bodyA === sensorRef.current && bodyB.circleRadius) ||
          (bodyB === sensorRef.current && bodyA.circleRadius)
        ) {
          setGameOver(true);
        }
      });
    });

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner.current);
      Matter.World.clear(world);
    };
  }, [world]);

  useEffect(() => {
    if (gameOver || !gameStarted) return; // Oyuna başlamadıysa top yaratma işlemi başlamasın

    let ballCount = 0; // Top sayacını başlat

    const intervalId = setInterval(() => {
      const containerWidth = containerRef.current.clientWidth;
      const ballSize = window.innerWidth < 600 ? 10 : 15;
      const margin = containerWidth * 0.03;
      const ballXMin = margin;
      const ballXMax = containerWidth - margin - ballSize * 2;

      const createBall = () => {
        return Matter.Bodies.circle(
          Math.random() * (ballXMax - ballXMin) + ballXMin,
          0,
          ballSize,
          {
            restitution: 0.85,
            render: { fillStyle: "#ff8d00" },
            frictionAir: 0.03,
          }
        );
      };

      if (ballCount >= 30) {
        // 12. toptan sonra ikili top yarat
        const ball1 = createBall();
        const ball2 = createBall();
        Matter.Composite.add(engine.current.world, [ball1, ball2]);
        setBalls((prevBalls) => [...prevBalls, ball1, ball2]);
      } else {
        // Tekli top yarat
        const newBall = createBall();
        Matter.Composite.add(engine.current.world, newBall);
        setBalls((prevBalls) => [...prevBalls, newBall]);
      }

      ballCount++; // Top sayısını artır
      setBallInterval((prevInterval) => Math.max(100, prevInterval));
    }, ballInterval);

    return () => clearInterval(intervalId);
  }, [gameOver, gameStarted, ballInterval]);

  useEffect(() => {
    const updateBalls = () => {
      if (gameOver) return;

      const updatedBalls = balls.filter((ball) => {
        const ballBottom = ball.position.y + ball.circleRadius;
        const containerHeight = containerRef.current.clientHeight;

        if (ballBottom >= containerHeight) {
          return false;
        }

        return true;
      });

      setBalls(updatedBalls);
      requestRef.current = requestAnimationFrame(updateBalls);
    };

    requestRef.current = requestAnimationFrame(updateBalls);
    return () => cancelAnimationFrame(requestRef.current);
  }, [boxX, gameOver, balls, world]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (gameOver || !gameStarted) return; // Oyun başlamadıysa hareket etmeye izin verme

      const containerWidth = containerRef.current.clientWidth;
      const margin = 20;
      const maxX = containerWidth - boxSizeWidth - margin;

      // Mouse hareketi için X koordinatını hesaplama
      const newBoxX =
        e.clientX -
        containerRef.current.getBoundingClientRect().left -
        boxSizeWidth / 2;

      setBoxX(Math.max(margin, Math.min(maxX, newBoxX)));

      if (colliderRef.current) {
        Matter.Body.setPosition(colliderRef.current, {
          x: boxX + boxSizeWidth / 2,
          y: containerRef.current.clientHeight - boxBottom,
        });
      }

      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleTouchMove = (e) => {
      if (gameOver || !gameStarted) return;

      // Mobil cihazlarda ilk parmağın konumunu alıyoruz
      const touch = e.touches[0];
      const containerWidth = containerRef.current.clientWidth;
      const margin = 20;
      const maxX = containerWidth - boxSizeWidth - margin;

      const newBoxX =
        touch.clientX -
        containerRef.current.getBoundingClientRect().left -
        boxSizeWidth / 2;

      setBoxX(Math.max(margin, Math.min(maxX, newBoxX)));

      if (colliderRef.current) {
        Matter.Body.setPosition(colliderRef.current, {
          x: boxX + boxSizeWidth / 2,
          y: containerRef.current.clientHeight - boxBottom,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove); // Mobil dokunma hareketini ekleyin
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove); // Mobil dokunma hareketini kaldırın
    };
  }, [boxX, gameOver, gameStarted]);

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
      {!gameStarted && (
        <div className={"game-over  visible"}>
          <h2> Topu Yakala!</h2>
          <button className="restart-button" onClick={handleStartGame}>
            Oyunu Başlat
          </button>
        </div>
      )}

      <div className="game-container">
        <div className="container_" ref={containerRef}>
          <canvas
            width={containerRef.current ? containerRef.current.clientWidth : 0}
            height={
              containerRef.current ? containerRef.current.clientHeight : 0
            }
          />
          <div className="score">
            <span>Skor: {score}</span>
            <button className="mute-button" onClick={toggleMute}>
              {isMuted ? "🔇" : "🔊"}
            </button>
          </div>
          <div className={`game-over ${gameOver ? "visible" : ""}`}>
            <h2>Oyun Bitti!</h2>
            <span>Skor: {score}</span>
            <button className="restart-button" onClick={restartGame}>
              Yeniden Başlat
            </button>
          </div>
        </div>

        {!gameOver && <div className="custom-cursor" ref={cursorRef} />}

        <audio ref={audioRef} src={CoinSound} />
        <audio ref={gameOverAudioRef} src={GameOverSound} />
        <audio ref={gameMusicRef} src={GameMusic} />
      </div>
    </>
  );
}

export default Game;
