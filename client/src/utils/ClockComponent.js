import React, { useEffect, useState, useRef } from "react";

const ClockComponent = () => {
  const [showTime, setShowTime] = useState(getShowTime);
  const animationFrameRef = useRef();

  useEffect(() => {
    const updateShowTime = () => {
      const newTime = getShowTime();
      if (newTime !== showTime) {
        setShowTime(newTime);
      }
      animationFrameRef.current = requestAnimationFrame(updateShowTime);
    };

    animationFrameRef.current = requestAnimationFrame(updateShowTime);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [showTime]);

  function getShowTime() {
    const today = new Date();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();
    return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
  }

  function formatNumber(num) {
    return num < 10 ? "0" + num : num.toString();
  }

  return <p>&nbsp;{showTime}</p>
};

export default ClockComponent;
