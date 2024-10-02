import React, { useEffect, memo } from "react";

function GameCursor({ cursorRef, gameOver }) {
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (cursorRef.current && !gameOver) {
        cursorRef.current.style.left = `${event.pageX}px`;
        cursorRef.current.style.top = `${event.pageY}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cursorRef, gameOver]);

  return <>{!gameOver && <div className="custom-cursor" ref={cursorRef} />}</>;
}

export default memo(GameCursor);
