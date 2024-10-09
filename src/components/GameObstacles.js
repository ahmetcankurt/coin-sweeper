 
 import Matter from "matter-js";

 const GameObstacles = (
  containerRef,
  boxSizeWidth,
  boxSizeHeight,
  world,
  colliderRef,
  sensorRef
) => {
  const containerWidth = containerRef.current.clientWidth;
  const containerHeight = containerRef.current.clientHeight;
  const obstacleSize = containerWidth < 600 ? 2.5 : 5;
  const obstacleRows = containerWidth < 600 ? 17 : 11;
  const obstacleCols = containerWidth < 600 ? 14 : 30;

  // Engeller arası mesafe ayarlamaları
  const obstacleSpacing = containerWidth / (obstacleCols); // Satırdaki her iki yuvarlak arası
  const rowHeight = obstacleSpacing * Math.sqrt(3) / 2; // Altıgenin yüksekliği

  const newObstacles = [];
  for (let row = 0; row < obstacleRows; row++) {
    const y = row * rowHeight + 100; // Satır arası mesafe

    for (let col = 0; col < obstacleCols; col++) {
      // x konumunu ayarlıyoruz
      const x = col * obstacleSpacing + (row % 2 === 0 ? obstacleSpacing / 2 : 0); // Çift satırlarda kaydırma
      
      const obstacle = Matter.Bodies.circle(x, y, obstacleSize, {
        isStatic: true,
        render: { fillStyle: "#122a41" },
      });
      newObstacles.push(obstacle);
    }
  }

  const frameThickness = 10;
  const frameObstacles = [
    Matter.Bodies.rectangle(
      frameThickness / 2,
      containerHeight / 2,
      frameThickness,
      containerHeight,
      { isStatic: true , render: { fillStyle: "#fe5c24" }},
      
    ),
    Matter.Bodies.rectangle(
      containerWidth - frameThickness / 2,
      containerHeight / 2,
      frameThickness,
      containerHeight,
      { isStatic: true , render: { fillStyle: "#fe5c24" }},
    ),
  ];

  // Collider dikdörtgeni
  const createCollider = () => {
    const collider = Matter.Bodies.rectangle(
      containerWidth / 2, // X konumu
      containerHeight - boxSizeHeight / 2, // Y konumu
      boxSizeWidth, // Genişlik
      boxSizeHeight, // Yükseklik
      {
        isStatic: true,
        render: {
          fillStyle: "#fe5c24", // Başlangıçta turuncu renk
          strokeStyle: "#000000", // Siyah dış hat
          lineWidth: 2, // Dış hat kalınlığı
        },
      }
    );

    colliderRef.current = collider;
    return collider;
  };

  // Mevcut collider varsa sil
  if (colliderRef.current) {
    Matter.Composite.remove(world, colliderRef.current);
  }

  const collider = createCollider();

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

export default GameObstacles;
