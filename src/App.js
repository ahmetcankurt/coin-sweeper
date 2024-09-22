import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import "./style.css";

const boxSizewWidth = 200;

function Game() {
  const [boxX, setBoxX] = useState(window.innerWidth / 2 - 50);
  const [gameOver, setGameOver] = useState(false);
  const [boxColor, setBoxColor] = useState("#000");
  const [ballInterval, setBallInterval] = useState(2000); // Başlangıç aralığı
  const [balls, setBalls] = useState([]);
  const [score, setScore] = useState(0);
  const engine = useRef(Matter.Engine.create());
  const runner = useRef(Matter.Runner.create());
  const boxRef = useRef(null);
  const obstacles = useRef([]);
  const requestRef = useRef();
  const containerRef = useRef(null);
  const world = engine.current.world;

  const [highScore, setHighScore] = useState(() => {
    // localStorage'dan yüksek skoru oku
    const savedHighScore = localStorage.getItem("highScore");
    return savedHighScore ? parseInt(savedHighScore, 10) : 0;
  });

  const addObstacles = () => {
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const obstacleSize = containerWidth < 600 ? 6 : 9;
    const obstacleRows = containerWidth < 600 ? 5 : 6;
    const obstacleCols = containerWidth < 600 ? 6 : 18;
    const obstacleSpacingX = containerWidth / obstacleCols;
    const obstacleSpacingY = containerHeight / (obstacleRows + 2);

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
    Matter.Composite.add(world, [...newObstacles, ...frameObstacles]);
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
        background: "#f0f0f0",
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

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner.current);
      Matter.World.clear(world);
    };
  }, [world]); // Add 'world' to dependency array

  useEffect(() => {
    if (gameOver) return;

    const intervalId = setInterval(() => {
      if (obstacles.current.length === 0) return;

      const containerWidth = containerRef.current.clientWidth;
      const ballSize = window.innerWidth < 600 ? 10 : 15;
      const margin = containerWidth * 0.03;
      const ballXMin = margin;
      const ballXMax = containerWidth - margin - ballSize * 2;

      const newBall = Matter.Bodies.circle(
        Math.random() * (ballXMax - ballXMin) + ballXMin,
        0,
        ballSize,
        {
          restitution: 0.8,
          render: { fillStyle: "#ffc32d" },
          frictionAir: 0.02,
        }
      );

      Matter.Composite.add(engine.current.world, newBall);
      setBalls((prevBalls) => [...prevBalls, newBall]);

      // Aralığı 25 ms kısalt
      setBallInterval((prevInterval) => Math.max(100, prevInterval - 40));
    }, ballInterval);

    return () => clearInterval(intervalId); // Mevcut intervali temizle
  }, [gameOver, ballInterval]); // ballInterval'i bağımlılık olarak ekleyin

  useEffect(() => {
    const updateBalls = () => {
      if (gameOver) return;

      const updatedBalls = balls.filter((ball) => {
        const ballBottom = ball.position.y + ball.circleRadius;
        const containerHeight = containerRef.current.clientHeight;

        const boxElement = boxRef.current;
        if (!boxElement) return true; // Kutu yoksa balonu koru
        const boxWidth = boxElement.clientWidth;
        const boxHeight = boxElement.clientHeight;

        const ballRect = {
          left: ball.position.x - ball.circleRadius,
          right: ball.position.x + ball.circleRadius,
          top: ball.position.y - ball.circleRadius,
          bottom: ball.position.y + ball.circleRadius,
        };
        const boxRect = {
          left: boxX,
          right: boxX + boxWidth,
          top: containerHeight - boxHeight - 5,
          bottom: containerHeight,
        };

        const isCollision =
          ballRect.bottom >= boxRect.top &&
          ballRect.top <= boxRect.bottom &&
          ballRect.right >= boxRect.left &&
          ballRect.left <= boxRect.right;

        if (isCollision) {
          setScore((prevScore) => prevScore + 1);
          setBoxColor("#f00");
          setTimeout(() => setBoxColor("#000"), 200);
          Matter.World.remove(world, ball);
          return false;
        }

        if (ballBottom >= containerHeight) {
          setGameOver(true);
          Matter.World.remove(world, ball);
          return false;
        }

        return true;
      });

      setBalls(updatedBalls);
      requestRef.current = requestAnimationFrame(updateBalls);
    };

    requestRef.current = requestAnimationFrame(updateBalls);
    return () => cancelAnimationFrame(requestRef.current);
  }, [boxX, gameOver, balls, world]); // Add 'world' to dependency array

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (gameOver) return;

      const containerWidth = containerRef.current.clientWidth;
      const boxWidth = boxRef.current
        ? boxRef.current.clientWidth
        : boxSizewWidth;
      const margin = 20;
      const maxX = containerWidth - boxWidth - margin;
      const newBoxX =
        e.clientX -
        containerRef.current.getBoundingClientRect().left -
        boxWidth / 2;

      setBoxX(Math.max(margin, Math.min(maxX, newBoxX)));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [gameOver]);

  const resetGame = () => {
    setBoxX(window.innerWidth / 2 - 50);
    setGameOver(false);
    setBoxColor("#000");
    setBalls([]);
    setScore(0);
    obstacles.current = [];
    Matter.World.clear(world); // Dünya temizleniyor
    Matter.Composite.add(world, obstacles.current); // Yeniden engeller ekleniyor
    addObstacles(); // Yeni engeller ekle
  };

  useEffect(() => {
    if (gameOver) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("highScore", score); // Yeni en yüksek skoru kaydet
      }
    }
  }, [gameOver, score, highScore]);

  return (
    <div className="container" ref={containerRef}>
      <canvas
        width={containerRef.current ? containerRef.current.clientWidth : 0}
        height={containerRef.current ? containerRef.current.clientHeight : 0}
      />
      <div className="score">
        <span>Skor: {score}</span>
      </div>
      <span className="max-score">Best Skor : {highScore}</span>
      <div
        className="box"
        ref={boxRef}
        style={{ left: boxX, backgroundColor: boxColor, width: boxSizewWidth }}
      />
      <div className={`game-over ${gameOver ? "visible" : ""}`}>
        <h2>Oyun Bitti</h2>
        <span className="modal-score">Skorunuz: {score}</span>
        <div>
          <button onClick={resetGame} className="restart-button">
            Tekrar Başlat
          </button>
        </div>
      </div>
    </div>
  );
}

export default Game;
