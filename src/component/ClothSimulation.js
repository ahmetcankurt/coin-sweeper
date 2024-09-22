import React, { useRef, useEffect } from 'react';
import Matter from 'matter-js';

const ClothSimulation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = Matter.Engine.create();
    const world = engine.world;

    const render = Matter.Render.create({
      element: document.body,
      engine: engine,
      canvas: canvas,
      options: {
        width: 800,
        height: 600,
        wireframes: false
      }
    });

    Matter.Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    const createCloth = (xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) => {
      const Body = Matter.Body;
      const Bodies = Matter.Bodies;
      const Composites = Matter.Composites;
      const Common = Matter.Common;

      const group = Body.nextGroup(true);
      particleOptions = Common.extend({ 
        inertia: Infinity, 
        friction: 0.00001, 
        collisionFilter: { group: group }, 
        render: { visible: false } 
      }, particleOptions);
      constraintOptions = Common.extend({ 
        stiffness: 0.06, 
        render: { type: 'line', anchors: false } 
      }, constraintOptions);

      const cloth = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, (x, y) => {
        return Bodies.circle(x, y, particleRadius, particleOptions);
      });

      Composites.mesh(cloth, columns, rows, crossBrace, constraintOptions);
      cloth.label = 'Cloth Body';

      return cloth;
    };

    const cloth = createCloth(200, 200, 20, 12, 5, 5, false, 8);

    for (let i = 0; i < 20; i++) {
      cloth.bodies[i].isStatic = true;
    }

    Matter.Composite.add(world, [
      cloth,
      Matter.Bodies.circle(300, 500, 80, { isStatic: true, render: { fillStyle: '#060a19' }}),
      Matter.Bodies.rectangle(500, 480, 80, 80, { isStatic: true, render: { fillStyle: '#060a19' }}),
      Matter.Bodies.rectangle(400, 609, 800, 50, { isStatic: true })
    ]);

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.98,
        render: {
          visible: false
        }
      }
    });

    Matter.Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    Matter.Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 }
    });

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    };
  }, []);

  return <canvas ref={canvasRef} width="800" height="600" />;
};

export default ClothSimulation;
