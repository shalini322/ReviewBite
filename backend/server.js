const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const restaurantRoutes = require("./routes/restaurantRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3000;

/* Middleware */
// Increased limits are essential for Cloudinary Base64 strings
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173", 
    "https://review-bit-frontend.vercel.app", 
    "https://reviewbite-frontend.vercel.app"  
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
};

// 2. USE the options second
app.use(cors(corsOptions));
// Handle preflight requests (Important for Vercel -> Render)
app.use(cors(corsOptions));

/* Routes */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "ReviewBite API is live and running! 🚀",
    status: "Healthy",
    time: new Date().toISOString() // Useful for checking if the server is "awake"
  });
});

app.use("/api", restaurantRoutes);
app.use("/api", reviewRoutes);
app.use("/api", leaderboardRoutes);
app.use("/api/auth", authRoutes);

/* Connect DB & Start Server */
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`)
  });
});