import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import { setupWebSocket } from './setupWebSocket.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = setupWebSocket(server); 


app.use(cors());
app.use(express.json());


// Test API Route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes(io));


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
