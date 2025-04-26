import { encryptDecrypt } from "./encryption";
import { gameManager } from "../utils/injector.js";
import { tr } from '../utils/obfuscatedNameTranslator.js';
let lastServer = null;
let socket = null;

function connect() {
  socket = new WebSocket("wss://a-s.urpl.us/");

  socket.onclose = () => {
    setTimeout(connect, 1000);
  };

  socket.onerror = () => {
    socket.close();
  };
}

export default function () {
  connect();

  setInterval(() => {
    try {
      const serverStr = gameManager.game[tr.ws].url.replace('wss://', '').slice(0, 2);
      const serverStrTruncated = serverStr.replace('wss://', '').slice(0, 2);
      let server = null;

      switch (serverStrTruncated) {
        case "eu": server = "0"; break;
        case "us": server = "1"; break;
        case "as": server = "2"; break;
        case "sa": server = "3"; break;
      }

      if (lastServer !== server) {
        lastServer = server;
        socket.readyState === 1 && socket.send(encryptDecrypt(server));
      }
    } catch (e) {
      if (DEV) {
        console.log(e)
      }
    }
  }, 1000);
}
