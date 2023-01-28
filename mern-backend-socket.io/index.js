const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

app.use(cors());

const PORT = process.env.PORT || 5500;

let onlineUsers = new Map();

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
	socket.emit("socket.created", socket.id);

	socket.on("register", ({socketID, userName}) => {
		console.log(`Register: ${socketID}`)
		onlineUsers.set(socketID, userName);
		console.table(onlineUsers);
	});

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
		onlineUsers.delete(socket.id);
		console.table(onlineUsers);
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

	socket.on("call.answer", ({signalData, remoteSocketId}) => {
		io.to(remoteSocketId).emit("call.accepted", signalData)
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
