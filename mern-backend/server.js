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
const chatroomRoutes = require("./src/routes/chatroomRoutes");

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
app.use("/api/chatroom", chatroomRoutes)
const server = http.createServer(app);

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

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

io.on("connection", (socket) => {
	const updateUsers = async () => {
		const sockets = await io.fetchSockets();
		let users = [];
		for (const s of sockets) {
			users.push({ socketId: s.id, name: s.nickname })
		}
		io.sockets.emit("current.users", users);
	}

	console.log(`Created new user [${socket.id}]: New user`)
	updateUsers();
	socket.emit("socket.created", socket.id);

	socket.on("register", ({ userName }) => {
		socket.nickname = userName;
		updateUsers();
	});

	socket.on("call.hangup", ({ socketId }) => {
		console.log(`call.hangup: ${socketId}`)
		io.to(socketId).emit("call.hangup");
	});

	socket.on('disconnect', function () {
		updateUsers();
		socket.broadcast.emit("callEnded")
	});

	socket.on("call.connect", ({
		remoteSocketId,
		signalData,
		originSocketId,
		originName,
	}) => {
		io.to(remoteSocketId).emit("call.incoming", {
			signalData,
			originSocketId,
			originName,
		});
	});

	socket.on("call.answer", ({ signalData, remoteSocketId }) => {
		io.to(remoteSocketId).emit("call.accepted", signalData)
	});
});