import React, { useEffect, memo, useState } from "react";

function GameCursor({ cursorRef, gameOver }) {
  console.log("GameCursor component rendered");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Ekran genişliğine göre mobil olup olmadığını kontrol et
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 800); // 800px altı genişlik mobil olarak kabul ediliyor
    };

    // Başlangıçta kontrol et
    checkIsMobile();

    // Pencere yeniden boyutlandırıldığında mobil olup olmadığını tekrar kontrol et
    window.addEventListener("resize", checkIsMobile);

    const handleMouseMove = (event) => {
      if (cursorRef.current && !gameOver && !isMobile) {
        cursorRef.current.style.left = `${event.pageX}px`;
        cursorRef.current.style.top = `${event.pageY}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkIsMobile);
    };
  }, [cursorRef, gameOver, isMobile]);

  return (
    <>
      {!gameOver && !isMobile && (
        <div className="custom-cursor" ref={cursorRef} />
      )}
    </>
  );
}

export default memo(GameCursor);
