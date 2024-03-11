import React, { useState, useEffect } from 'react';

const Gun = ({ position, onShoot, isGunPurchased }) => {
  const [isShooting, setIsShooting] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === ' ') {
        if (onShoot && typeof onShoot === 'function') {
          onShoot();
          setIsShooting(true);

          setTimeout(() => {
            setIsShooting(false);
          }, 500);
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [onShoot]);

  return (
    <div style={{ position: 'relative', width: '50px', height: '50px' }}>
      <img
        src={isGunPurchased ? "./images/gun2.png" : "./images/sung.png"}
        alt="Gun"
        style={{
          position: 'absolute',
          width: '50px',
          height: '50px',
          top: position.y,
          left: position.x,
          cursor: 'pointer',
        }}
      />
      {/* Bullet when shooting (pressing spacebar) */}
      {isShooting && (
        <div
          style={{
            position: 'absolute',
            width: '10px',
            height: '5px',
            background: 'url(/images/tiadan.png)',
            backgroundSize: 'cover',
            left: position.x + 25,
            top: position.y - 5,
          }}
        ></div>
      )}
    </div>
  );
};

export default Gun;
