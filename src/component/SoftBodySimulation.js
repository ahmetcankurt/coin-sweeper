import React, { useRef, useEffect } from 'react';
import Matter from 'matter-js';

const SoftBodySimulation = () => {
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
        showAngleIndicator: false,
        wireframes: false
      }
    });

    Matter.Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    const createSoftBody = (xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) => {
      const Common = Matter.Common;
      const Composites = Matter.Composites;
      const Bodies = Matter.Bodies;

      particleOptions = Common.extend({ 
        inertia: Infinity, 
        friction: 0.05,
        frictionStatic: 0.1,
        render: { visible: true }
      }, particleOptions);

      constraintOptions = Common.extend({ 
        stiffness: 0.2, 
        render: { type: 'line', anchors: false } 
      }, constraintOptions);

      const softBody = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, (x, y) => {
        return Bodies.circle(x, y, particleRadius, particleOptions);
      });

      Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);
      softBody.label = 'Soft Body';

      return softBody;
    };

    Matter.Composite.add(world, [
      createSoftBody(250, 100, 5, 5, 0, 0, true, 18),
      createSoftBody(400, 300, 8, 3, 0, 0, true, 15),
      createSoftBody(250, 400, 4, 4, 0, 0, true, 15),
      Matter.Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Matter.Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Matter.Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
    ]);

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.9,
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

export default SoftBodySimulation;
