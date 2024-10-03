import { memo, useEffect, useState, useRef } from "react";
import Matter from "matter-js";

function GameCanvas({
  containerRef,
  setScore,
  setGameOver,
  GameObstacles,
  world,
  engine,
  colliderRef,
  sensorRef,
  balls,
  setBalls,
  gameOver,
  gameStarted,
  boxSizeWidth,
  audioRef,
}) {
  const [boxX, setBoxX] = useState(window.innerWidth / 2 - 50);
  const boxBottom = window.innerWidth < 800 ? 70 : 45;
  const requestRef = useRef();
  const runner = useRef(Matter.Runner.create({ delta: 1000 / 60 })); // 60 FPS
  const [fps, setFps] = useState(0);
  const lastFrameTime = useRef(0); // Değişiklik burada
  const frameCount = useRef(0);

  const createBall = () => {
    const containerWidth = containerRef.current.clientWidth;
    const ballSize = window.innerWidth < 600 ? 10 : 15;
    const margin = containerWidth * 0.03;
    const ballXMin = margin;
    const ballXMax = containerWidth - margin - ballSize * 2;

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

  const handleCollision = (event) => {
    event.pairs.forEach(({ bodyA, bodyB }) => {
      if (
        (bodyA === colliderRef.current && bodyB.circleRadius) ||
        (bodyB === colliderRef.current && bodyA.circleRadius)
      ) {
        setScore((prevScore) => prevScore + 1);
        playSound();
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
  };

  const handleMouseMove = (e) => {
    if (gameOver) return;

    const containerWidth = containerRef.current.clientWidth;
    const margin = 20;
    const maxX = containerWidth - boxSizeWidth - margin;

    const newBoxX =
      e.clientX - containerRef.current.getBoundingClientRect().left - boxSizeWidth / 2;

    setBoxX(Math.max(margin, Math.min(maxX, newBoxX)));
  };

  const updatePosition = () => {
    if (colliderRef.current) {
      Matter.Body.setPosition(colliderRef.current, {
        x: boxX + boxSizeWidth / 2,
        y: containerRef.current.clientHeight - boxBottom,
      });
    }
  };

  const updateBalls = () => {
    if (gameOver) return;

    setBalls((prevBalls) => {
      return prevBalls.filter((ball) => {
        const ballBottom = ball.position.y + ball.circleRadius;
        const containerHeight = containerRef.current.clientHeight;
        return ballBottom < containerHeight;
      });
    });

    requestRef.current = requestAnimationFrame(updateBalls);
  };

  // FPS hesaplama fonksiyonu
  const calculateFPS = (timestamp) => {
    if (lastFrameTime.current) {
      const deltaTime = timestamp - lastFrameTime.current;
      frameCount.current++;
      if (deltaTime >= 1000) {
        setFps(frameCount.current);
        frameCount.current = 0;
        lastFrameTime.current = timestamp; // Son frame zamanını güncelle
      }
    } else {
      lastFrameTime.current = timestamp; // İlk frame için başlangıç zamanını ayarla
    }
    requestRef.current = requestAnimationFrame(calculateFPS);
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
    GameObstacles();

    Matter.Events.on(engine.current, "collisionStart", handleCollision);

    requestRef.current = requestAnimationFrame(calculateFPS); // FPS hesaplamayı başlat

    return () => {
      cancelAnimationFrame(requestRef.current); // FPS hesaplamayı durdur
      Matter.Render.stop(render);
      Matter.Runner.stop(runner.current);
      Matter.World.clear(world);
      Matter.Events.off(engine.current, "collisionStart", handleCollision);
    };
  }, [world]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateBalls);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameOver, balls]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gameOver]);

  useEffect(() => {
    updatePosition();
  }, [boxX]);

  useEffect(() => {
    if (gameOver) {
      balls.forEach((ball) => Matter.Body.setStatic(ball, true));
      return;
    }

    let intervalId = null;
    if (gameStarted) {
      intervalId = setInterval(() => {
        if (document.hidden) return;
        const newBall = createBall();
        Matter.Composite.add(engine.current.world, newBall);
        setBalls((prevBalls) => [...prevBalls, newBall]);
      }, 1500);
    }

    return () => clearInterval(intervalId);
  }, [gameOver, gameStarted]);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    }
  };

  return (
    <div className="container_" ref={containerRef}>
      <canvas
        width={containerRef.current ? containerRef.current.clientWidth : 0}
        height={containerRef.current ? containerRef.current.clientHeight : 0}
      />
      <div style={{ position: "absolute", top: 10, left: 30, color: "black", fontSize: "20px" }}>
        fps: {fps}
      </div>
    </div>
  );
}

export default memo(GameCanvas);
