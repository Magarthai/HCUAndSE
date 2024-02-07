// ResponsiveComponent.js
import React, { useEffect } from "react";

const ResponsiveComponent = ({ setZoomLevel }) => {
  useEffect(() => {
    const responsivescreen = () => {
      const innerWidth = window.innerWidth;
      const baseWidth = 1920;
      const newZoomLevel = (innerWidth / baseWidth) * 100 / 100;
      setZoomLevel(newZoomLevel);
    };

    responsivescreen();
    window.addEventListener("resize", responsivescreen);

    return () => {
      window.removeEventListener("resize", responsivescreen);
    };
  }, [setZoomLevel]);

  return null;
};

export default ResponsiveComponent;
