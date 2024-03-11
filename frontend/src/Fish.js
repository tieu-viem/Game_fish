import React, { useState, useEffect } from 'react';

const Fish = ({ type, position, onClick }) => {
  const fishWidth = type === 'small' ? 50 : 100;
  const fishHeight = type === 'small' ? 30 : 60;

  const [fishPosition, setFishPosition] = useState(position);

  useEffect(() => {
    const fishSpeed = 2;
  
    const intervalId = setInterval(() => {
      setFishPosition((prevPosition) => {
        // Check if the fish type is 'medium' (ca2.png)
        if (type === 'medium') {
          const maxY = window.innerHeight - fishHeight;
          const newY = prevPosition.y - fishSpeed;
  
          const updatedY = newY < 0 ? maxY : newY;
  
          return {
            x: prevPosition.x,
            y: updatedY,
          };
        } else {
          // For other fish types, move horizontally (similar to the previous logic)
          const maxX = window.innerWidth - fishWidth;
          const newX = prevPosition.x + fishSpeed;
  
          const updatedX = newX > maxX ? 0 : newX;
  
          return {
            x: updatedX,
            y: prevPosition.y,
          };
        }
      });
    }, 50);
  
    return () => clearInterval(intervalId);
  }, [fishWidth, fishHeight, type]);
  

  const getFishImage = () => {
    switch (type) {
      case 'small':
        return 'url(/images/ca1.png)';
      case 'medium':
        return 'url(/images/ca2.png)';
      case 'big':
        return 'url(/images/ca3.png)';
      default:
        return 'url(/images/ca1.png)';
    }
  };

  return (
    <div
      className={`fish ${type}`}
      style={{
        position: 'absolute',
        left: fishPosition.x,
        top: fishPosition.y,
        width: fishWidth,
        height: fishHeight,
        backgroundImage: getFishImage(),
        backgroundSize: 'cover',
        borderRadius: '50%',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {/* Bullet when shooting (pressing spacebar) */}
      <div
        style={{
          position: 'absolute',
          width: '10px',
          height: '5px',
          background: 'url(/images/tiadan.png)',
          backgroundSize: 'cover',
          left: fishWidth / 2,
          top: -5,
          visibility: 'hidden',
        }}
      ></div>
    </div>
  );
};

export default Fish;
