const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const dotenv = require('dotenv');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend access
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running');
});
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// WebSocket connection
io.on('connection', (socket) => {
    console.log('New WebSocket connection');
  
    // Join a project room
    socket.on('joinProject', (projectId) => {
      socket.join(projectId);
      console.log(`User joined project: ${projectId}`);
    });
  
    // Broadcast task updates to project room
    socket.on('taskUpdated', (task) => {
      io.to(task.project).emit('taskUpdated', task);
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
   
        socket.on('newTask', (newTask) => {
          // Broadcast the new task to other clients
          socket.broadcast.emit('newTask', newTask);
        });
    

      
  });
  

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
