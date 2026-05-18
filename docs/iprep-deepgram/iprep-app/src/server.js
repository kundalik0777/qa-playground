const http = require("http");
const path = require("path");
const express = require("express");
const { WebSocketServer, WebSocket } = require("ws");
const config = require("./config");

const app = express();
const server = http.createServer(app);

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  return config.allowedOrigins.has(origin);
}

function closeSocket(socket, code, reason) {
  if (
    socket.readyState === WebSocket.OPEN ||
    socket.readyState === WebSocket.CONNECTING
  ) {
    socket.close(code, reason);
  }
}

app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/config", (_req, res) => {
  res.json({
    hasApiKey: Boolean(config.deepgramApiKey),
    mode: "server-proxy",
  });
});

app.use(express.static(config.publicDir, { index: "index.html" }));

app.use((_req, res) => {
  res.sendFile(path.join(config.publicDir, "index.html"));
});

const wss = new WebSocketServer({
  server,
  path: "/ws",
  perMessageDeflate: false,
});

wss.on("connection", (clientSocket, req) => {
  const origin = req.headers.origin;

  if (!isAllowedOrigin(origin)) {
    closeSocket(clientSocket, 1008, "Origin not allowed");
    return;
  }

  if (!config.deepgramApiKey) {
    closeSocket(clientSocket, 1011, "Missing DEEPGRAM_API_KEY on the server");
    return;
  }

  const upstreamSocket = new WebSocket(config.deepgramAgentUrl, {
    headers: {
      Authorization: `Token ${config.deepgramApiKey}`,
    },
    perMessageDeflate: false,
  });

  const bufferedMessages = [];

  clientSocket.on("message", (data, isBinary) => {
    if (upstreamSocket.readyState === WebSocket.OPEN) {
      upstreamSocket.send(data, { binary: isBinary });
      return;
    }

    if (upstreamSocket.readyState === WebSocket.CONNECTING) {
      bufferedMessages.push({ data, isBinary });
      return;
    }

    closeSocket(
      clientSocket,
      1011,
      "Upstream Deepgram connection is unavailable",
    );
  });

  clientSocket.on("close", () => {
    closeSocket(upstreamSocket, 1000, "Client disconnected");
  });

  clientSocket.on("error", () => {
    closeSocket(upstreamSocket, 1011, "Client websocket error");
  });

  upstreamSocket.on("open", () => {
    for (const message of bufferedMessages) {
      upstreamSocket.send(message.data, { binary: message.isBinary });
    }
    bufferedMessages.length = 0;
  });

  upstreamSocket.on("message", (data, isBinary) => {
    if (clientSocket.readyState !== WebSocket.OPEN) {
      return;
    }

    clientSocket.send(data, { binary: isBinary });
  });

  upstreamSocket.on("close", (code, reasonBuffer) => {
    const reason = reasonBuffer.toString() || "Deepgram connection closed";
    closeSocket(clientSocket, code || 1000, reason);
  });

  upstreamSocket.on("error", (error) => {
    if (clientSocket.readyState === WebSocket.OPEN) {
      clientSocket.send(
        JSON.stringify({
          type: "Error",
          description: error.message || "Deepgram proxy connection failed.",
        }),
      );
    }

    closeSocket(clientSocket, 1011, "Deepgram proxy error");
  });
});

server.listen(config.port, config.host, () => {
  console.log(
    `Interview voice app running at http://${config.host}:${config.port}`,
  );
});
