import React, { useRef, useEffect } from 'react';
import CoinSound from './coin.mp3';

function SoundButton() {
  const audioRef = useRef(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      // Ses tamamen yüklendiğinde çalmaya hazır olduğundan emin olun
      audioRef.current.load();
    }
  }, []);

  return (
    <div>
      <button onClick={playSound}>Play Sound</button>
      <audio ref={audioRef}>
        <source src={CoinSound} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default SoundButton;
