import { useState, useEffect } from "react";

const useResponsiveSize = () => {
  const baseWidth = 1920; // 15.6 inç bilgisayar için önerilen genişlik
  const baseHeight = 1080; // 15.6 inç bilgisayar için önerilen yükseklik

  const [size, setSize] = useState({
    boxWidth: 170,
    boxHeight: 20,
    obstacleSize: 5,
    obstacleRows: 11,
    obstacleCols: 30,
  });

  useEffect(() => {
    const updateSize = () => {
      const widthRatio = window.innerWidth / baseWidth;
      const heightRatio = window.innerHeight / baseHeight;

      setSize({
        boxWidth: Math.round(170 * widthRatio), // Genişliği oranla ayarla
        boxHeight: Math.round(20 * heightRatio), // Yüksekliği oranla ayarla
        obstacleSize: Math.round(5 * Math.min(widthRatio, heightRatio)), // Engellerin boyutu
        obstacleRows: Math.round(11 * heightRatio), // Engellerin satır sayısı
        obstacleCols: Math.round(30 * widthRatio), // Engellerin sütun sayısı
      });
    };

    updateSize(); // İlk boyut güncellemesi
    window.addEventListener("resize", updateSize); // Boyut değişimlerini dinle

    return () => {
      window.removeEventListener("resize", updateSize); // Temizleme
    };
  }, []);

  return size;
};

export default useResponsiveSize;