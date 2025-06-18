import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

// Store content for each room
const roomContents = new Map();

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("join", (code) => {
    socket.join(code);
    if (roomContents.has(code)) {
      socket.emit("code", roomContents.get(code));
    }
  });
  socket.on("code", (code, content) => {
    roomContents.set(code, content);
    socket.to(code).emit("code", content);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
