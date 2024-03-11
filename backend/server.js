const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
// Kết nối đến MongoDB (chỉnh sửa URL kết nối của bạn)
mongoose.connect('mongodb://localhost:27017/game', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const db = mongoose.connection;

// Kiểm tra kết nối
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
// Enable CORS for all routes
app.use(cors());  
// Import other routes
const buyGunRoute = require('../backend/routes/api/buyGun');
const gunsRoute = require('../backend/routes/api/guns');

// Use routes
app.use('/api/buy-gun', buyGunRoute);
app.use('/api/guns', gunsRoute);

io.on('connection', function (socket) {
  console.log('A user connected');

  // Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});

// Define other middleware and route handlers as needed

// Start the server
const port = 3001 ;
http.listen(port, () => console.log(`Listening on port ${port}`));
