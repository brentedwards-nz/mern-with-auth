const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Routes
const authRoutes = require("./src/routes/authRoutes");
const testRoutes = require("./src/routes/testRoutes");
const dataRoutes = require("./src/routes/dataRoutes");
const spotifyRoutes = require("./src/routes/spotifyRoutes");

// Server
const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "https://mern-with-auth-frontend.onrender.com"],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS']
}));

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/spotify", spotifyRoutes)
const server = http.createServer(app);

// Mongoose
const PORT = process.env.PORT || process.env.API_PORT;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Mongoose API server is listening on localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("database connection failed. Server not started");
    console.error(err);
  });
