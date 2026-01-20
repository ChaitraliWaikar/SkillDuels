// server.js - Enhanced with Matchmaking Queue
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
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Store active battles and waiting users
const activeBattles = new Map(); // battleId -> { player1, player2, scores }
const waitingQueue = new Map(); // categoryId -> [users]
const userSockets = new Map(); // userId -> socketId

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User comes online
  socket.on('userOnline', ({ userId, userData }) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} is online`);
  });

  // Join matchmaking queue
  socket.on('findMatch', ({ userId, userData, categoryId }) => {
    console.log(`User ${userId} looking for match in category ${categoryId}`);
    
    // Check if there's someone waiting in this category
    if (!waitingQueue.has(categoryId)) {
      waitingQueue.set(categoryId, []);
    }
    
    const queue = waitingQueue.get(categoryId);
    
    if (queue.length > 0) {
      // Match found! Remove waiting player
      const opponent = queue.shift();
      const battleId = `battle_${Date.now()}`;
      
      // Create battle room
      activeBattles.set(battleId, {
        player1: { userId, ...userData, score: 0, socketId: socket.id },
        player2: { userId: opponent.userId, ...opponent.userData, score: 0, socketId: opponent.socketId },
        categoryId,
        started: false
      });
      
      // Notify both players
      socket.emit('matchFound', {
        battleId,
        opponent: opponent.userData,
        isPlayer1: true
      });
      
      io.to(opponent.socketId).emit('matchFound', {
        battleId,
        opponent: userData,
        isPlayer1: false
      });
      
      console.log(`Match created: ${battleId}`);
    } else {
      // Add to waiting queue
      queue.push({ userId, userData, socketId: socket.id });
      socket.emit('waitingForOpponent');
      console.log(`User ${userId} added to queue for category ${categoryId}`);
    }
  });

  // Cancel matchmaking
  socket.on('cancelMatchmaking', ({ userId, categoryId }) => {
    if (waitingQueue.has(categoryId)) {
      const queue = waitingQueue.get(categoryId);
      const index = queue.findIndex(u => u.userId === userId);
      if (index !== -1) {
        queue.splice(index, 1);
        console.log(`User ${userId} left queue`);
      }
    }
  });

  // Join battle room
  socket.on('joinBattle', ({ battleId, userId }) => {
    socket.join(battleId);
    console.log(`User ${userId} joined battle: ${battleId}`);
    
    const battle = activeBattles.get(battleId);
    if (battle && !battle.started) {
      battle.started = true;
      // Notify both players to start
      io.to(battleId).emit('battleStart');
    }
  });

  // Answer submitted
  socket.on('answerSubmitted', (data) => {
    const { battleId, userId, score, questionIndex, isCorrect } = data;
    
    const battle = activeBattles.get(battleId);
    if (battle) {
      // Update score
      if (battle.player1.userId === userId) {
        battle.player1.score = score;
      } else if (battle.player2.userId === userId) {
        battle.player2.score = score;
      }
      
      // Broadcast to opponent
      socket.to(battleId).emit('opponentAnswered', {
        userId,
        score,
        questionIndex,
        isCorrect
      });
    }
  });

  // Battle completed
  socket.on('battleComplete', ({ battleId, userId, finalScore }) => {
    const battle = activeBattles.get(battleId);
    if (battle) {
      // Update final score
      if (battle.player1.userId === userId) {
        battle.player1.finalScore = finalScore;
      } else if (battle.player2.userId === userId) {
        battle.player2.finalScore = finalScore;
      }
      
      // Check if both players finished
      if (battle.player1.finalScore !== undefined && battle.player2.finalScore !== undefined) {
        // Determine winner
        const winner = battle.player1.finalScore > battle.player2.finalScore 
          ? battle.player1 
          : battle.player2.finalScore > battle.player1.finalScore
            ? battle.player2
            : null; // Draw
        
        // Notify both players
        io.to(battleId).emit('battleResults', {
          player1Score: battle.player1.finalScore,
          player2Score: battle.player2.finalScore,
          winner: winner?.userId || null
        });
        
        // Clean up
        activeBattles.delete(battleId);
      }
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove from user sockets
    for (let [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        break;
      }
    }
    
    // Remove from waiting queues
    for (let [categoryId, queue] of waitingQueue.entries()) {
      const index = queue.findIndex(u => u.socketId === socket.id);
      if (index !== -1) {
        queue.splice(index, 1);
      }
    }
    
    // Handle active battles
    for (let [battleId, battle] of activeBattles.entries()) {
      if (battle.player1.socketId === socket.id || battle.player2.socketId === socket.id) {
        // Notify opponent
        socket.to(battleId).emit('opponentDisconnected');
        activeBattles.delete(battleId);
      }
    }
  });
});

// REST API endpoints (optional)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    activeBattles: activeBattles.size,
    waitingUsers: Array.from(waitingQueue.values()).reduce((sum, queue) => sum + queue.length, 0)
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔌 Socket.IO ready for connections`);
});