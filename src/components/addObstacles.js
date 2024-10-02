import Matter from "matter-js";

const addObstacles = (containerRef, boxSizeWidth, boxSizeHeight, world, colliderRef, sensorRef) => {
  const containerWidth = containerRef.current.clientWidth;
  const containerHeight = containerRef.current.clientHeight;
  const obstacleSize = containerWidth < 600 ? 6 : 5;
  const obstacleRows = containerWidth < 600 ? 9 : 12;
  const obstacleCols = containerWidth < 600 ? 10 : 20;
  const spacingMultiplier = 0.8;
  const obstacleSpacingX = containerWidth / obstacleCols;
  const obstacleSpacingY = (containerHeight / (obstacleRows + 2)) * spacingMultiplier;

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

  const colliderWidth = boxSizeWidth;
  const colliderHeight = boxSizeHeight;
  const radius = 2; 
  const collider = Matter.Bodies.fromVertices(
    containerWidth / 2,
    containerHeight - colliderHeight / 2,
    [
      { x: -colliderWidth / 2 + radius, y: -colliderHeight / 2 },
      { x: colliderWidth / 2 - radius, y: -colliderHeight / 2 },
      { x: colliderWidth / 2, y: -colliderHeight / 2 + radius },
      { x: colliderWidth / 2, y: colliderHeight / 2 - radius },
      { x: colliderWidth / 2 - radius, y: colliderHeight / 2 },
      { x: -colliderWidth / 2 + radius, y: colliderHeight / 2 },
      { x: -colliderWidth / 2, y: -colliderHeight / 2 + radius },
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

export default addObstacles;