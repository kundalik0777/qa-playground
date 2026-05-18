const startButton = document.querySelector("#startButton");
const stopButton = document.querySelector("#stopButton");
const roleInput = document.querySelector("#roleInput");
const companyInput = document.querySelector("#companyInput");
const focusInput = document.querySelector("#focusInput");
const transcriptNode = document.querySelector("#transcript");
const connectionStatus = document.querySelector("#connectionStatus");
const micStatus = document.querySelector("#micStatus");
const agentStatus = document.querySelector("#agentStatus");

const SAMPLE_RATE = 24000;
const LOCAL_WS_URL = `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws`;

let ws = null;
let audioContext = null;
let mediaStream = null;
let sourceNode = null;
let processorNode = null;
let playbackTime = 0;
let activeSources = new Set();
let manualStop = false;

function setStatus(node, value) {
  node.textContent = value;
}

function addEntry(kind, label, text) {
  const entry = document.createElement("article");
  entry.className = `entry ${kind}`;

  const title = document.createElement("span");
  title.className = "entry-label";
  title.textContent = label;

  const body = document.createElement("div");
  body.textContent = text;

  entry.append(title, body);
  transcriptNode.append(entry);
  transcriptNode.scrollTop = transcriptNode.scrollHeight;
}

function clearPlayback() {
  for (const source of activeSources) {
    try {
      source.stop();
    } catch {
      // Ignore stopped source nodes.
    }
  }
  activeSources.clear();

  if (audioContext) {
    playbackTime = audioContext.currentTime;
  } else {
    playbackTime = 0;
  }
}

function downsampleBuffer(input, inputSampleRate, outputSampleRate) {
  if (outputSampleRate === inputSampleRate) {
    return input;
  }

  const ratio = inputSampleRate / outputSampleRate;
  const outputLength = Math.round(input.length / ratio);
  const output = new Float32Array(outputLength);
  let offsetResult = 0;
  let offsetBuffer = 0;

  while (offsetResult < output.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
    let sum = 0;
    let count = 0;

    for (let i = offsetBuffer; i < nextOffsetBuffer && i < input.length; i += 1) {
      sum += input[i];
      count += 1;
    }

    output[offsetResult] = sum / count;
    offsetResult += 1;
    offsetBuffer = nextOffsetBuffer;
  }

  return output;
}

function floatTo16BitPCM(float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);

  for (let i = 0; i < float32Array.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }

  return buffer;
}

function int16ToFloat32(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  const samples = new Float32Array(arrayBuffer.byteLength / 2);

  for (let i = 0; i < samples.length; i += 1) {
    samples[i] = view.getInt16(i * 2, true) / 0x8000;
  }

  return samples;
}

function playPcmChunk(arrayBuffer) {
  if (!audioContext) {
    return;
  }

  const pcm = int16ToFloat32(arrayBuffer);
  const audioBuffer = audioContext.createBuffer(1, pcm.length, SAMPLE_RATE);
  audioBuffer.copyToChannel(pcm, 0);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);

  const now = audioContext.currentTime;
  if (playbackTime < now) {
    playbackTime = now;
  }

  source.start(playbackTime);
  playbackTime += audioBuffer.duration;
  activeSources.add(source);
  source.onended = () => {
    activeSources.delete(source);
  };
}

function buildSettings() {
  const role = roleInput.value.trim() || "Software Engineer";
  const company = companyInput.value.trim() || "General product company";
  const focus = focusInput.value.trim();

  return {
    type: "Settings",
    audio: {
      input: {
        encoding: "linear16",
        sample_rate: SAMPLE_RATE,
      },
      output: {
        encoding: "linear16",
        sample_rate: SAMPLE_RATE,
        container: "none",
      },
    },
    agent: {
      language: "en",
      greeting: `Hi, I am your interviewer for a ${role} role. Introduce yourself briefly and we will begin.`,
      listen: {
        provider: {
          type: "deepgram",
          model: "flux-general-en",
        },
      },
      think: {
        provider: {
          type: "open_ai",
          model: "gpt-4o-mini",
          temperature: 0.4,
        },
        prompt: [
          "You are a professional interviewer helping the user practice for interviews.",
          `Target role: ${role}.`,
          `Interview style: ${company}.`,
          focus,
          "Keep spoken responses concise, natural, and interview-like.",
          "Ask exactly one question at a time unless giving quick feedback on the user's previous answer.",
          "If the user interrupts, stop your current response and address the interruption naturally.",
        ].join(" "),
      },
      speak: {
        provider: {
          type: "deepgram",
          model: "aura-2-asteria-en",
        },
      },
    },
  };
}

function setupWebSocket() {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(LOCAL_WS_URL);
    socket.binaryType = "arraybuffer";

    socket.onopen = () => {
      socket.send(JSON.stringify(buildSettings()));
      setStatus(connectionStatus, "Connected");
      setStatus(agentStatus, "Configuring");
    };

    socket.onmessage = (event) => {
      if (typeof event.data !== "string") {
        playPcmChunk(event.data);
        return;
      }

      const message = JSON.parse(event.data);
      const type = message.type || "Unknown";

      if (type === "Welcome") {
        addEntry("system", "System", "Deepgram connection opened.");
        return;
      }

      if (type === "SettingsApplied") {
        setStatus(agentStatus, "Ready");
        addEntry("system", "System", "Interview coach is ready.");
        resolve(socket);
        return;
      }

      if (type === "ConversationText") {
        const role = message.role === "assistant" ? "agent" : "user";
        const label = message.role === "assistant" ? "Interviewer" : "You";
        addEntry(role, label, message.content);
        return;
      }

      if (type === "UserStartedSpeaking") {
        setStatus(micStatus, "Speaking");
        setStatus(agentStatus, "Listening");
        clearPlayback();
        return;
      }

      if (type === "AgentStartedSpeaking") {
        setStatus(agentStatus, "Speaking");
        return;
      }

      if (type === "AgentAudioDone") {
        setStatus(agentStatus, "Waiting");
        return;
      }

      if (type === "AgentThinking") {
        setStatus(agentStatus, "Thinking");
        return;
      }

      if (type === "Error") {
        reject(new Error(message.description || "Deepgram voice agent error."));
        return;
      }

      if (type === "Warning") {
        addEntry("system", "Warning", message.description || "Deepgram warning");
      }
    };

    socket.onerror = () => {
      reject(new Error("WebSocket connection failed."));
    };

    socket.onclose = () => {
      if (!manualStop) {
        addEntry("system", "System", "Connection closed.");
      }
      setStatus(connectionStatus, "Closed");
      setStatus(micStatus, "Stopped");
      setStatus(agentStatus, "Stopped");
      startButton.disabled = false;
      stopButton.disabled = true;
    };
  });
}

async function startMicrophone(socket) {
  mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });

  audioContext = new AudioContext();
  await audioContext.resume();

  const inputSampleRate = audioContext.sampleRate;
  sourceNode = audioContext.createMediaStreamSource(mediaStream);
  processorNode = audioContext.createScriptProcessor(4096, 1, 1);
  playbackTime = audioContext.currentTime;

  processorNode.onaudioprocess = (event) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const input = event.inputBuffer.getChannelData(0);
    const downsampled = downsampleBuffer(input, inputSampleRate, SAMPLE_RATE);
    const pcm = floatTo16BitPCM(downsampled);
    socket.send(pcm);
    setStatus(micStatus, "Streaming");
  };

  sourceNode.connect(processorNode);
  processorNode.connect(audioContext.destination);
}

async function stopSession() {
  manualStop = true;

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
  ws = null;

  clearPlayback();

  if (processorNode) {
    processorNode.disconnect();
    processorNode.onaudioprocess = null;
    processorNode = null;
  }

  if (sourceNode) {
    sourceNode.disconnect();
    sourceNode = null;
  }

  if (mediaStream) {
    for (const track of mediaStream.getTracks()) {
      track.stop();
    }
    mediaStream = null;
  }

  if (audioContext) {
    await audioContext.close();
    audioContext = null;
  }

  setStatus(connectionStatus, "Idle");
  setStatus(micStatus, "Waiting");
  setStatus(agentStatus, "Not started");
  startButton.disabled = false;
  stopButton.disabled = true;
  manualStop = false;
}

startButton.addEventListener("click", async () => {
  startButton.disabled = true;
  stopButton.disabled = false;
  transcriptNode.innerHTML = "";
  addEntry("system", "System", "Requesting mic access and starting session...");

  try {
    const configResponse = await fetch("/config");
    const config = await configResponse.json();

    if (!config.hasApiKey) {
      throw new Error("Set DEEPGRAM_API_KEY on the server first.");
    }

    ws = await setupWebSocket();
    await startMicrophone(ws);
  } catch (error) {
    addEntry("system", "System", error instanceof Error ? error.message : String(error));
    await stopSession();
  }
});

stopButton.addEventListener("click", async () => {
  addEntry("system", "System", "Stopping session...");
  await stopSession();
});
