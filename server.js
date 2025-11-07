// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import aiRoutes from "./routes/aiRoutes.js";
import flightRoutes from './routes/flightRoutes.js';
import hotelRoutes from "./routes/hotelRoutes.js";
// import pexelsRoutes from "./routes/pexelsRoutes.js";
// import activityRoutes from './routes/activityRoutes.js';
import currencyRouter from "./routes/currency.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api/currency", currencyRouter);

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);

// Mount routes
app.use("/api/ai", aiRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/hotels', hotelRoutes);
// app.use('/api/activities', activityRoutes);
// app.use("/api/images", pexelsRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Test route to verify backend is working
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// Health check with detailed info
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'ExploreEase API is running!',
    port: PORT,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// FIXED: Simple 404 handler without complex path matching
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/test',
      'GET /api/flights/search',
      'GET /api/hotels/search',
      'GET /api/activities/search'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});



app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Test route: http://localhost:${PORT}/api/test`);
});