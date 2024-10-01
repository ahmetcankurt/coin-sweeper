import React, { memo } from "react";

function GameCursor ({ cursorRef, gameOver }) {
  return <>{!gameOver && <div className="custom-cursor" ref={cursorRef} />}</>;
}

export default memo(GameCursor);
