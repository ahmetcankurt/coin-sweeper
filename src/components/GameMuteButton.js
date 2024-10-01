import React, { memo } from "react";

function GameMuteButton({ isMuted, toggleMute }) {
  
  return (
    <>
      <button className="mute-button" onClick={toggleMute}>
        {isMuted ? "🔇" : "🔊"}
      </button>
    </>
  );
}

export default memo(GameMuteButton);
