const WebSocket = require('ws');
const http = require('http');
const https = require('https');
const url = require('url');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const width = 800;
const height = 400;
const chartCanvas = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour: '#36393f',
});

const server = http.createServer();
const wss = new WebSocket.Server({ server });

function encryptDecrypt(input, key = String.prototype.charCodeAt.toString()) {
  const keyLength = key.length;
  let output = '';
  
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i) ^ key.charCodeAt(i % keyLength);
    output += String.fromCharCode(charCode);
  }
  
  return output;
}

const activeIPs = new Map();
const socketToIPMap = new Map();
const waitingConnections = new Map();

const REGIONS = {
  '0': 'Europe',
  '1': 'North America',
  '2': 'Asia',
  '3': 'South America'
};

const REGION_EMOJIS = {
  'Europe': '🇪🇺',
  'North America': '🇺🇸',
  'Asia': '🇦🇸',
  'South America': '🇧🇷',
  'Lobby': '🔄'
};

// Data structure to store historical connection data
const connectionHistory = {
  timestamps: [],
  total: [],
  lobby: [],
  '0': [], // Europe
  '1': [], // North America
  '2': [], // Asia
  '3': []  // South America
};

// Colors for the graph lines
const COLORS = {
  total: '#FFFFFF', // White
  lobby: '#808080', // Gray
  '0': '#4287f5', // Blue (Europe)
  '1': '#f54242', // Red (North America)
  '2': '#f5f542', // Yellow (Asia)
  '3': '#42f54e'  // Green (South America)
};

// Store the latest graph image URL
let latestGraphUrl = null;
let lastGraphGenerationTime = 0;

function activateNextWaitingConnection(ip, clientObj) {
  if (!waitingConnections.has(ip) || waitingConnections.get(ip).length === 0) {
    activeIPs.delete(ip);
    return;
  }
  
  const nextSocket = waitingConnections.get(ip).shift();
  
  if (nextSocket.readyState === WebSocket.OPEN) {
    clientObj.activeSocket = nextSocket;
    console.log(`Activating queued connection from ${ip}`);
  } else {
    activateNextWaitingConnection(ip, clientObj);
  }
}

wss.on('connection', (ws, req) => {
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).split(',')[0].trim();
  socketToIPMap.set(ws, ip);
  
  const clientObj = activeIPs.get(ip);
  
  if (clientObj && clientObj.activeSocket && clientObj.activeSocket.readyState === WebSocket.OPEN) {
    if (!waitingConnections.has(ip)) {
      waitingConnections.set(ip, []);
    }
    waitingConnections.get(ip).push(ws);
    
    console.log(`Additional connection from ${ip} queued for later (${waitingConnections.get(ip).length} in queue)`);
  } else {
    activeIPs.set(ip, { 
      ip, 
      server: null, 
      activeSocket: ws 
    });
    
    console.log(`New connection from ${ip}`);
  }
  
  ws.on('message', (message) => {
    try {
      const clientObj = activeIPs.get(ip);
      if (clientObj && clientObj.activeSocket === ws) {
        const decryptedMessage = encryptDecrypt(message.toString());
        if (REGIONS[decryptedMessage]) {
          clientObj.server = decryptedMessage;
        }
      }
    } catch (error) {}
  });
  
  ws.on('close', () => {
    const ip = socketToIPMap.get(ws);
    socketToIPMap.delete(ws);
    
    const clientObj = activeIPs.get(ip);
    if (clientObj && clientObj.activeSocket === ws) {
      console.log(`Active connection from ${ip} closed`);
      
      if (waitingConnections.has(ip) && waitingConnections.get(ip).length > 0) {
        const nextSocket = waitingConnections.get(ip).shift();
        
        if (nextSocket.readyState === WebSocket.OPEN) {
          clientObj.activeSocket = nextSocket;
          console.log(`Activating queued connection from ${ip}`);
        } else {
          activateNextWaitingConnection(ip, clientObj);
        }
      } else {
        activeIPs.delete(ip);
      }
    } else if (waitingConnections.has(ip)) {
      const waitingList = waitingConnections.get(ip);
      const index = waitingList.indexOf(ws);
      if (index > -1) {
        waitingList.splice(index, 1);
        console.log(`Queued connection from ${ip} closed (${waitingList.length} remaining in queue)`);
      }
    }
  });
});

// Function to collect and save connection data
function saveConnectionSnapshot() {
  const serverCounts = {
    '0': 0, // Europe
    '1': 0, // North America
    '2': 0, // Asia
    '3': 0, // South America
    lobby: 0,
    total: activeIPs.size
  };
  
  for (const client of activeIPs.values()) {
    if (!client.server) {
      serverCounts.lobby++;
    } else {
      serverCounts[client.server]++;
    }
  }
  
  const now = new Date();
  connectionHistory.timestamps.push(now);
  connectionHistory.total.push(serverCounts.total);
  connectionHistory.lobby.push(serverCounts.lobby);
  connectionHistory['0'].push(serverCounts['0']);
  connectionHistory['1'].push(serverCounts['1']);
  connectionHistory['2'].push(serverCounts['2']);
  connectionHistory['3'].push(serverCounts['3']);
  
  // Keep only the last 10 minutes of data (600 seconds / snapshot interval)
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
  while (connectionHistory.timestamps.length > 0 && connectionHistory.timestamps[0] < tenMinutesAgo) {
    connectionHistory.timestamps.shift();
    connectionHistory.total.shift();
    connectionHistory.lobby.shift();
    connectionHistory['0'].shift();
    connectionHistory['1'].shift();
    connectionHistory['2'].shift();
    connectionHistory['3'].shift();
  }
  
  return serverCounts;
}

// Function to generate graph and upload to Discord
// Function to generate graph and upload to Discord
async function generateAndUploadGraph() {
  // Create more readable timestamps by showing fewer labels (every 5th point)
  const timestamps = connectionHistory.timestamps;
  const labels = timestamps.map((t, i) => i % 5 === 0 ? t.toLocaleTimeString() : '');
  
  // Round all data values to integers
  const datasets = [
    { label: 'Total', data: connectionHistory.total.map(Math.round), borderColor: '#FFFFFF' },
    { label: 'Lobby', data: connectionHistory.lobby.map(Math.round), borderColor: '#808080' },
    { label: 'Europe', data: connectionHistory['0'].map(Math.round), borderColor: '#4287f5' },
    { label: 'North America', data: connectionHistory['1'].map(Math.round), borderColor: '#f54242' },
    { label: 'Asia', data: connectionHistory['2'].map(Math.round), borderColor: '#f5f542' },
    { label: 'South America', data: connectionHistory['3'].map(Math.round), borderColor: '#42f54e' }
  ].map(ds => ({ 
    ...ds, 
    fill: false, 
    tension: 0.3,     // Smoother lines
    borderWidth: 3,
    pointRadius: 0,   // Hide individual points
    pointHitRadius: 10 // Keep points detectable for hover
  }));
  
  const config = {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: false,
      scales: {
        x: { 
          grid: { color: '#444444', display: false },  // Simpler grid
          ticks: { color: '#FFFFFF', maxRotation: 0 }  // Horizontal labels
        },
        y: { 
          beginAtZero: true, 
          grid: { color: '#444444' }, 
          ticks: { 
            color: '#FFFFFF',
            precision: 0,     // No decimals
            maxTicksLimit: 6  // Fewer y-axis lines
          }
        }
      },
      plugins: {
        legend: { 
          labels: { color: '#FFFFFF', boxWidth: 15 },
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${Math.round(context.raw)}`;  // Round values in tooltips
            }
          }
        }
      }
    }
  };
  
  const imageBuffer = await chartCanvas.renderToBuffer(config);
  
  return new Promise((resolve, reject) => {
    // First upload the image to Discord's CDN using the webhook
    const boundary = `------WebKitFormBoundary${Math.random().toString().substr(2)}`;
    
    const webhookUrlParsed = url.parse(DISCORD_WEBHOOK_URL);
    const webhookPathParts = webhookUrlParsed.pathname.split('/');
    const webhookId = webhookPathParts[3];
    const webhookToken = webhookPathParts[4];
    
    // Set up multipart form data
    const requestBody = [];
    
    // Add the image file part
    requestBody.push(
      `--${boundary}`,
      'Content-Disposition: form-data; name="file"; filename="graph.png"',
      'Content-Type: image/png',
      '',
      ''
    );
    
    // Create binary body by combining text parts and image buffer
    const textPart = requestBody.join('\r\n');
    const endPart = `\r\n--${boundary}--`;
    
    const body = Buffer.concat([
      Buffer.from(textPart, 'utf8'),
      imageBuffer,
      Buffer.from(endPart, 'utf8')
    ]);
    
    const options = {
      hostname: 'discord.com',
      path: `/api/webhooks/1363635357685518527/a-pAAzBlGgi0XVXwtyCsAXlLA6g2U19Q6JBzewoLWd39oUvZd-WXhxYpzvvoPYJqxlyc`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            // Extract the URL of the uploaded attachment
            if (response.attachments && response.attachments.length > 0) {
              latestGraphUrl = response.attachments[0].url;
              // Delete this temporary message
              resolve(latestGraphUrl);
            } else {
              reject(new Error('No attachment URL found in response'));
            }
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        } else {
          reject(new Error(`Failed to upload image: ${res.statusCode} ${data}`));
        }
      });
    });
    
    req.on('error', error => reject(error));
    req.write(body);
    req.end();
  });
}

function updateDiscordMessage(webhookUrl, messageId, imageUrl = null) {
  const serverCounts = {
    '0': 0, // Europe
    '1': 0, // North America
    '2': 0, // Asia
    '3': 0, // South America
    Lobby: 0,
    total: activeIPs.size
  };
  
  for (const client of activeIPs.values()) {
    if (!client.server) {
      serverCounts.Lobby++;
    } else {
      serverCounts[client.server]++;
    }
  }
  
  // First field shows Total and Lobby together
  const fields = [
    {
      name: "📊 Overview",
      value: `**Total: ${serverCounts.total} | Lobby: ${serverCounts.Lobby}**`,
      inline: false
    }
  ];
  
  // Add region fields in two rows (2 per row)
  const regionEntries = Object.entries(REGIONS);
  for (let i = 0; i < regionEntries.length; i += 2) {
    for (let j = i; j < Math.min(i + 2, regionEntries.length); j++) {
      const [code, region] = regionEntries[j];
      const emoji = REGION_EMOJIS[region];
      fields.push({
        name: `${emoji} ${region}`,
        value: `**${serverCounts[code]}**`,
        inline: true
      });
    }
  }
  
  const payload = {
    embeds: [{
      title: "Analytics",
      description: "> Real-time Surplus usage analytics",
      color: 3066993, 
      fields,
      timestamp: new Date().toISOString(),
      footer: {
        text: "Last Updated"
      }
    }]
  };
  
  // Add image URL to the embed if available
  if (imageUrl) {
    payload.embeds[0].image = { url: imageUrl };
  }
  
  // Send the update to Discord
  const webhookUrlParsed = url.parse(webhookUrl);
  const webhookPathParts = webhookUrlParsed.pathname.split('/');
  const webhookId = webhookPathParts[3];
  const webhookToken = webhookPathParts[4];
  
  const editPath = `/api/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`;
  
  const options = {
    hostname: 'discord.com',
    path: editPath,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode !== 200) {
        console.error('Error updating message:', res.statusCode, data);
      } else {
      }
    });
  });
  
  req.on('error', error => console.error('Error updating Discord message:', error));
  req.write(JSON.stringify(payload));
  req.end();
}

// Log connected IPs periodically
setInterval(() => {
  const connectedIPs = Array.from(activeIPs.keys());
  console.log(`Connected IPs (${connectedIPs.length}): ${connectedIPs.join(', ')}`);
  
  let totalWaiting = 0;
  for (const [ip, connections] of waitingConnections.entries()) {
    if (connections.length > 0) {
      console.log(`- ${ip}: ${connections.length} waiting`);
      totalWaiting += connections.length;
    }
  }
  
  if (totalWaiting > 0) {
    console.log(`Total waiting connections: ${totalWaiting}`);
  }
}, 5000);

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1363628120820809919/0DkB2H-ISEDo8g0dCJLR8iFIwQx5eUAHaVqczxpM_5e1EH7rHK5UJ4ygqsxbL5LkxAJs';
const MESSAGE_ID = '1363637200071430144';

// Save connection data periodically
setInterval(async () => {
  saveConnectionSnapshot();
}, 10000);

// Update Discord with chart periodically
setInterval(async () => {
  const now = Date.now();
  const includeGraph = now - lastGraphGenerationTime >= 60000; // Generate a new graph every minute
  
  try {
    if (includeGraph) {
      // Generate and upload a new graph
      const imageUrl = await generateAndUploadGraph();
      lastGraphGenerationTime = now;
      updateDiscordMessage(DISCORD_WEBHOOK_URL, MESSAGE_ID, imageUrl);
    } else {
      // Just update the message with current stats, use existing image URL if available
      updateDiscordMessage(DISCORD_WEBHOOK_URL, MESSAGE_ID, latestGraphUrl);
    }
  } catch (error) {
    console.error('Error updating Discord:', error);
    // Still try to update the message without the graph
    updateDiscordMessage(DISCORD_WEBHOOK_URL, MESSAGE_ID);
  }
}, 1500);

const PORT = process.env.PORT || 80;
server.listen(PORT, () => console.log(`WebSocket server started on port ${PORT}`));