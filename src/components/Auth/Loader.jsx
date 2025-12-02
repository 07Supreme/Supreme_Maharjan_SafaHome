import React from "react";

const Loader = ({ size = 48 }) => {
  const style = {
    width: size,
    height: size,
    borderRadius: "50%",
    border: `${Math.max(3, Math.round(size/8))}px solid rgba(85,107,47,0.15)`,
    borderTop: `${Math.max(3, Math.round(size/8))}px solid #556B2F`,
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  };

  return (
    <>
      <div style={style} />
      <style>{`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
    </>
  );
};

export default Loader;
