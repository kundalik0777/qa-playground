const fs = require("fs");
const path = require("path");

function loadDotEnv() {
  const envPath = path.join(__dirname, "..", ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, "utf8");
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadDotEnv();

const port = Number(process.env.PORT || 3000);

module.exports = {
  host: process.env.HOST || "127.0.0.1",
  port,
  publicDir: path.join(__dirname, "..", "public"),
  deepgramApiKey: process.env.DEEPGRAM_API_KEY,
  deepgramAgentUrl:
    process.env.DEEPGRAM_AGENT_URL || "wss://agent.deepgram.com/v1/agent/converse",
  allowedOrigins: new Set(
    String(
      process.env.ALLOWED_ORIGINS ||
        `http://127.0.0.1:${port},http://localhost:${port}`,
    )
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  ),
};
