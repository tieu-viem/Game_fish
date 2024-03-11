// AddGunForm.js
import React, { useState } from 'react';

const AddGunForm = ({ onAddGun }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  const handleAddGun = () => {
    // Call the onAddGun function to send a request to the server
    onAddGun({ name, price, image });
    // Reset input fields after successfully adding a gun
    setName('');
    setPrice('');
    setImage('');
  };

  return (
    <div>
      <h2>Add Gun</h2>
      <label><p>Name:</p></label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <label><p>Price:</p></label>
      <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
      <label><p>Image (URL)</p>:</label>
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
      <button onClick={handleAddGun}>Add Gun</button>
    </div>
  );
};

export default AddGunForm;
