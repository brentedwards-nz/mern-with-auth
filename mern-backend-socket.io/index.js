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

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
	console.log(`io.connection: ${socket.id}`);
	socket.emit("socket.created", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("call.connect", ({ 
		remoteSocketId,
		signalData,
		originSocketId,
		originName,
	}) => {
		console.log(`call.connect origin: ${originSocketId}`);
		console.log(`call.connect remote: ${remoteSocketId}`);
		io.to(remoteSocketId).emit("call.incoming", { 
			signalData, 
			originSocketId, 
			originName, 
		});
	});

	socket.on("call.answer", ({signalData, remoteSocketId}) => {
		console.log(`*** call.answer: ${remoteSocketId}`);
		io.to(remoteSocketId).emit("call.accepted", signalData)
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
