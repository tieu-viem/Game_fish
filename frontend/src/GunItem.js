import React from 'react';

const GunItem = ({ gun, onBuyGun }) => {
  const handleBuyGun = () => {
    // Gọi hàm onBuyGun khi người dùng nhấn nút "Mua"
    onBuyGun(gun.id);
  };

  return (
    <li>
      {gun.name} - Giá: {gun.price} điểm
      <button onClick={handleBuyGun}>Mua</button>
    </li>
  );
};

export default GunItem;
