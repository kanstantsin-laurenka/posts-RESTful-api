const { Server } = require("socket.io");
let io;

module.exports = {
  initSocket: httpServer => {
    io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:3000", // Set origin to a specific origin. For example if you set it to "http://example.com" only requests from "http://example.com" will be allowed.
      }
    });
    return io;
  },
  getIO: () => {
    if (!io) throw new Error('Socket.io not initialized');
    return io;
  }
}
