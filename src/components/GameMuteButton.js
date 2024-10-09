import React, { memo } from "react";

function GameMuteButton({
  isMuted,
  setIsMuted,
  audioRef,
  gameMusicRef,
  gameOverAudioRef,
}) {
  console.log("GameMuteButton component rendered");
  const toggleMute = () => {
    setIsMuted((prevMuted) => {
      const newMutedState = !prevMuted;
      if (gameMusicRef.current) {
        gameMusicRef.current.muted = newMutedState;
      }
      if (audioRef.current) {
        audioRef.current.muted = newMutedState;
      }
      if (gameOverAudioRef.current) {
        gameOverAudioRef.current.muted = newMutedState;
      }
      return newMutedState;
    });
  };

  return (
    <>
      <button className="mute-button" onClick={toggleMute}>
        {isMuted ? "🔇" : "🔊"}
      </button>
    </>
  );
}

export default memo(GameMuteButton);
