import { encryptDecrypt } from "./encryption";

let lastServer = null;
let socket = null;

export default function() {
  socket = new WebSocket("wss://a-s.urpl.us/")
  setInterval(()=>{
    try {
      const serverStr = window.gameManager.game[window.tr.ws].url.replace('wss://', '').slice(0, 2);;
      const serverStrTruncated = serverStr.replace('wss://', '').slice(0, 2);
      let server = null
      switch (serverStrTruncated) {
        case "eu": {
          server = "0"
          break;
        }
        case "us": {
          server = "1"
          break;
        }
        case "as": {
          server = "2"
          break;
        }
        case "sa": {
          server = "3"
          break;
        }
      };
      if (lastServer === server) {
        return
      } else {
        lastServer = server;
        socket.send(encryptDecrypt(server))
      }
    } catch  {}
  
  }, 1000)
}