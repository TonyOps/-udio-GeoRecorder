const express = require("express");
const geolib = require("geolib");
const { MongoClient, Binary } = require("mongodb");
const record = require("node-record-lpcm16");
const fs = require("fs");

const app = express();
const port = 3000;

const mongoURI = "mongodb://localhost:12345git init/seu_banco_de_dados";

const localInteresse = { latitude: SUA_LATITUDE, longitude: SUA_LONGITUDE };

const distanciaLimite = 1000;

const audioOptions = {
  sampleRate: 16000,
  channels: 1,
  verbose: false,
};

let isRecording = false;
let audioStream;

function iniciarGravacao() {
  if (!isRecording) {
    console.log("Iniciando gravação...");
    audioStream = record.record(audioOptions);
    isRecording = true;
  }
}

function pararGravacao() {
  if (isRecording) {
    console.log("Parando gravação...");
    record.stop();
    isRecording = false;
  }
}

function verificarDistancia(coordenadas) {
  const distancia = geolib.getDistance(localInteresse, coordenadas);

  if (distancia <= distanciaLimite) {
    iniciarGravacao();
  } else {
    pararGravacao();
  }
}

function obterCoordenadas() {
  const latitude = SUA_LATITUDE + (Math.random() - 0.5) * 0.01;
  const longitude = SUA_LONGITUDE + (Math.random() - 0.5) * 0.01;
  return { latitude, longitude };
}

app.get("/start-recording", (req, res) => {
  const coordenadas = obterCoordenadas();
  verificarDistancia(coordenadas);

  if (!isRecording) {
    console.log("Iniciando gravação...");
    res.send("Gravação iniciada.");
  } else {
    res.send("A gravação já está em andamento.");
  }
});

app.get("/stop-recording", (req, res) => {
  pararGravacao();
  res.send("Gravação parada.");
});

setInterval(() => {
  const coordenadas = obterCoordenadas();
  console.log("Coordenadas atuais:", coordenadas);
  verificarDistancia(coordenadas);
}, 1000);

async function enviarAudioParaMongoDB(audioStream) {
  try {
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db();

    const audioData = await readStream(audioStream);
    await db.collection("audio_data").insertOne({ audio: audioData });

    console.log("Áudio enviado para o MongoDB com sucesso.");

    await client.close();
  } catch (error) {
    console.error("Erro ao enviar áudio para o MongoDB:", error);
  }
}

function readStream(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => {
      chunks.push(chunk);
    });
    stream.on("end", () => {
      const audioData = Buffer.concat(chunks);
      resolve(new Binary(audioData));
    });
    stream.on("error", (error) => {
      reject(error);
    });
  });
}

app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
