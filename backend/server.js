const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your Vite frontend URL
    methods: ["GET", "POST"]
  }
});

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Joining a battle room
  socket.on('joinBattle', ({ battleId }) => {
    socket.join(battleId);
    console.log(`User joined battle: ${battleId}`);
  });

  // Handle answers and broadcast scores
  socket.on('answerSubmitted', (data) => {
    const { battleId, userId, score, questionIndex } = data;
    // Broadcast to the other person in the room
    socket.to(battleId).emit('opponentAnswered', {
      userId,
      score,
      questionIndex
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));