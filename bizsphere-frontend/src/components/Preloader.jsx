import React, { useEffect, useState } from "react";
import "./Preloader.css";

const Preloader = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide preloader after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Allow fade out transition
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`preloader-container ${!isVisible ? "fade-out" : ""}`}>
      <div className="agentic-ball">
        <div className="ball-glow"></div>
        <div className="ball-core"></div>
        <div className="ball-ring ring-1"></div>
        <div className="ball-ring ring-2"></div>
        <div className="ball-ring ring-3"></div>
      </div>
      <div className="loading-text">BIZSPHERE</div>
    </div>
  );
};

export default Preloader;
