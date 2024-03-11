// In your frontend component where you want to handle the form submission
import React from 'react';
import AddGunForm from './AddGunForm';

const AddGunPage = () => {
  const handleAddGun = async (gunData) => {
    try {
      const response = await fetch('http://localhost:3001/api/guns/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gunData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add gun: ${response.status} ${response.statusText}`);
      }

      const newGun = await response.json();
      console.log('Gun added successfully:', newGun);
      // Additional logic if needed
    } catch (error) {
      console.error('Error adding gun:', error.message);
      // Handle errors as needed
    }
  };

  return (
    <div>
      <h1>Add Gun Page</h1>
      <AddGunForm onAddGun={handleAddGun} />
    </div>
  );
};

export default AddGunPage;
