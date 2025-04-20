const WebSocket = require('ws');
const http = require('http');
const https = require('https');
const url = require('url');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const charCodeAt = String.prototype.charCodeAt;
const fromCharCode = String.fromCharCode;

function encryptDecrypt(input, key=charCodeAt.toString()) {
  const keyLength = key.length;
  let output = '';
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i) ^ key.charCodeAt(i % keyLength);
    output += String.fromCharCode(charCode);
  }
  return output;
}

// Store client info by IP - will only have one entry per IP
const activeIPs = new Map();

// Store websocket objects with their IP for lookup
const socketToIPMap = new Map();

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  
  // Associate this socket with its IP for later lookups
  socketToIPMap.set(ws, ip);
  
  // Create or update the client object for this IP
  let clientObj = activeIPs.get(ip) || { ip: ip, server: null };
  activeIPs.set(ip, clientObj);
  
  ws.on('message', (message) => {
    try {
      const decryptedMessage = encryptDecrypt(message.toString());
      
      // Update the server info for this IP
      const clientObj = activeIPs.get(ip);
      if (clientObj) {
        if (decryptedMessage === '0') {
          clientObj.server = 'eu';
        } else if (decryptedMessage === '1') {
          clientObj.server = 'na';
        } else if (decryptedMessage === '2') {
          clientObj.server = 'as';
        } else if (decryptedMessage === '3') {
          clientObj.server = 'sa';
        }
      }
    } catch (error) {
      // Silently ignore errors
    }
  });
  
  ws.on('close', () => {
    // Get the IP for this socket
    const ip = socketToIPMap.get(ws);
    
    // Remove this socket from our socket tracking
    socketToIPMap.delete(ws);
    
    // Check if there are any remaining connections from this IP
    let hasRemainingConnections = false;
    for (const [socket, socketIp] of socketToIPMap.entries()) {
      if (socketIp === ip && socket.readyState === WebSocket.OPEN) {
        hasRemainingConnections = true;
        break;
      }
    }
    
    // Only remove the IP from active IPs if there are no remaining connections
    if (!hasRemainingConnections) {
      activeIPs.delete(ip);
    }
  });
});

function updateDiscordMessage(webhookUrl, messageId) {
  const serverCounts = {
    eu: 0,
    na: 0,
    as: 0,
    sa: 0,
    unknown: 0,
    total: activeIPs.size
  };
  
  for (const client of activeIPs.values()) {
    if (!client.server) {
      serverCounts.unknown++;
    } else {
      serverCounts[client.server]++;
    }
  }
  
  const timestamp = new Date().toISOString();
  
  const payload = {
    embeds: [{
      title: "Server Status Update",
      color: 3447003,
      fields: [
        {
          name: "Total Connected",
          value: activeIPs.size.toString(),
          inline: true
        },
        {
          name: "EU",
          value: serverCounts.eu.toString(),
          inline: true
        },
        {
          name: "NA",
          value: serverCounts.na.toString(),
          inline: true
        },
        {
          name: "AS",
          value: serverCounts.as.toString(),
          inline: true
        },
        {
          name: "SA",
          value: serverCounts.sa.toString(),
          inline: true
        },
        {
          name: "Unknown",
          value: serverCounts.unknown.toString(),
          inline: true
        }
      ],
      timestamp: timestamp,
      footer: {
        text: "WebSocket Server"
      }
    }]
  };
  
  // Extract the parts from the webhook URL
  const webhookUrlParsed = url.parse(webhookUrl);
  const webhookPathParts = webhookUrlParsed.pathname.split('/');
  const webhookId = webhookPathParts[3];
  const webhookToken = webhookPathParts[4];
  
  // Create the path for editing a message
  const editPath = `/api/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`;
  
  const options = {
    hostname: 'discord.com',
    path: editPath,
    method: 'PATCH', // Use PATCH to update an existing message
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      if (res.statusCode !== 200) {
        console.error('Error updating message:', res.statusCode, data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('Error updating Discord message:', error);
  });
  
  req.write(JSON.stringify(payload));
  req.end();
}

// Discord webhook URL and message ID to update
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1363620850695278783/b5KZqiLQivTDoHQ-xFXDVpkE5AmOvN7J5SmqMV6FjPcqn6FXKJV02Eiv3gfXSDwQ28gx';
const MESSAGE_ID = '1363621009541959872';

// Update the message every 4 seconds
setInterval(() => {
  updateDiscordMessage(DISCORD_WEBHOOK_URL, MESSAGE_ID);
}, 1500);

const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`WebSocket server started on port ${PORT}`);
});