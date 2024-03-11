// routes/api/buyGun.js
const express = require('express');
const router = express.Router();
const Gun = require('../../models/gun');

router.post('/:gunId', async (req, res) => {
  try {
    const gunId = req.params.gunId;

    // Fetch the gun from the database using the provided gunId
    const gunToBuy = await Gun.findById(gunId);

    if (!gunToBuy) {
      // If the gun with the provided ID is not found, send an error response
      return res.status(404).json({ message: 'Gun not found' });
    }

    // Implement your logic for handling the purchase
    // For example, deduct points from the user's score
    const userScore = req.user.score; // Assuming you have a user object with a score property

    // Check if the user has enough points to buy the gun
    if (userScore >= gunToBuy.price) {
      // Update the user's score (subtract the gun's price)
      const updatedUserScore = userScore - gunToBuy.price;

      // Your logic for updating the user's score in the database
      // Assuming you have a User model
      req.user.score = updatedUserScore;
      await req.user.save();

      // Send a success response
      return res.json({ message: 'Gun bought successfully', userScore: updatedUserScore });
    } else {
      // If the user doesn't have enough points, send an error response
      return res.status(403).json({ message: 'Not enough points to buy the gun' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
