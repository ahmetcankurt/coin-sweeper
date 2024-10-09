import React, { useEffect, useRef } from 'react';

const Fireworks = ({ active }) => {
  console.log("Fireworks component rendered")
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks = [];

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 1.5 + 1; // Daha büyük parçacık boyutu
        this.speedX = (Math.random() * 3 - 1) * 0.5; // Yavaşlatılmış X hızı
        this.speedY = (Math.random() * 3 - 1) * 0.5; // Yavaşlatılmış Y hızı
        this.alpha = 1;
        this.decay = Math.random() * 0.005 + 0.005; // Daha uzun yok olma süresi
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    class Firework {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;

        for (let i = 0; i < 100; i++) {
          this.particles.push(new Particle(this.x, this.y, color));
        }
      }

      update() {
        this.particles.forEach((particle, index) => {
          particle.update();
          if (particle.alpha <= 0) {
            this.particles.splice(index, 1);
          }
        });
      }

      draw() {
        this.particles.forEach((particle) => particle.draw());
      }

      isAlive() {
        return this.particles.length > 0;
      }
    }

    const createFirework = () => {
      for (let i = 0; i < 12; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height / 2);
        fireworks.push(new Firework(x, y));
      }
    };

    const updateCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (!firework.isAlive()) {
          fireworks.splice(index, 1);
        }
      });
    };

    const loop = () => {
      if (document.hidden || !active) return; // Sayfa görünmüyorsa ya da aktif değilse animasyonu durdur
      updateCanvas();
      animationRef.current = requestAnimationFrame(loop);
    };

    const interval = setInterval(() => {
      if (!document.hidden && active) { // Sayfa gizli değilse ve aktifse havai fişek yarat
        createFirework();
      }
    }, 1000); // Her saniyede bir havai fişek oluştur

    loop(); // Animasyon döngüsünü başlat

    // Sayfa görünürlüğünü izlemek için event listener
    const handleVisibilityChange = () => {
      if (!document.hidden && active) {
        loop(); // Sayfa görünür olursa tekrar başlat
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [active]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />;
};

export default Fireworks;
    