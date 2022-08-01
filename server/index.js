import express from "express";
import morgan from "morgan";
import { Server as ServerSocket } from "socket.io";
import http from "http";
import cors from "cors";
import { PORT } from "./config.js";
const app = express();
app.set("port", process.env.PORT || PORT);
app.use(morgan("dev"));
app.use(cors());
const server = http.createServer(app);

const io = new ServerSocket(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("user connected " + socket.id);

  socket.emit("userid", socket.id);

  socket.on("message", (message) => {
    const sendMessage = { userId: socket.id, message: message };
    socket.broadcast.emit("message", sendMessage);
  });
});

app.get("/", (_, res) => {
  res.send("welcome");
});

server.listen(app.get("port"), (_) => {
  console.log(`server running on port ${app.get("port")}`);
});
