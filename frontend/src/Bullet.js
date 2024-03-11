import React, { useEffect, useState } from 'react';

const Bullet = ({ position }) => {
  const [bulletPosition, setBulletPosition] = useState(position);

  useEffect(() => {
    const bulletSpeed = 5;

    const intervalId = setInterval(() => {
      setBulletPosition((prevPosition) => ({
        x: prevPosition.x,
        y: prevPosition.y - bulletSpeed,
      }));
    }, 50);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        width: '18px',
        height: '10px',
        background: `url(/images/tiadan.png) no-repeat center center`,
        backgroundSize: 'contain',
        left: bulletPosition.x,
        top: bulletPosition.y,
      }}
    ></div>
  );
};

export default Bullet;
