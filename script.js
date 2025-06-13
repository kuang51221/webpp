// 配置 Trystero 使用 Torrent 傳輸方式
const config = {
  appId: 'webpp', // 你可以更改這個ID
  rootPath: 'webpp'
};

// 創建 WebTorrent 實例
const client = new WebTorrent();

// 使用 Torrent 作為連接方式
const app = Trystero({
  appId: config.appId,
  rootPath: config.rootPath,
  basePeerConfig: {},
  adapter: 'torrent',
  client
});

// DOM 元素
const roomInput = document.getElementById('roomInput');
const joinBtn = document.getElementById('joinBtn');
const chatContainer = document.getElementById('chatContainer');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const peerCountDiv = document.getElementById('peerCount');
const torrentStatusDiv = document.getElementById('torrentStatus');
const torrentStatusText = document.getElementById('torrentStatusText');

let currentRoom = null;
let peers = new Set();

// 更新 Torrent 狀態顯示
function updateTorrentStatus() {
  torrentStatusDiv.classList.remove('hidden');
  
  client.on('error', err => {
    torrentStatusText.textContent = `錯誤: ${err.message}`;
    torrentStatusText.style.color = 'red';
  });
  
  client.on('warning', err => {
    torrentStatusText.textContent = `警告: ${err.message}`;
    torrentStatusText.style.color = 'orange';
  });
  
  setInterval(() => {
    const stats = `種子: ${client.torrents.length} | 節點: ${client.numPeers}`;
    torrentStatusText.textContent = stats;
    torrentStatusText.style.color = '#666';
  }, 1000);
}

// 加入房間
joinBtn.addEventListener('click', () => {
  const roomName = roomInput.value.trim();
  if (!roomName) return;
  
  if (currentRoom) {
    currentRoom.leave();
    peers.clear();
    messagesDiv.innerHTML = '';
    peerCountDiv.textContent = '房間人數: 0';
  }
  
  currentRoom = app.joinRoom(roomName);
  updateTorrentStatus();
  
  // 設置訊息接收
  currentRoom.onPeerJoin(peerId => {
    peers.add(peerId);
    updatePeerCount();
    addMessage(`${peerId} 加入了房間`, 'system');
  });
  
  currentRoom.onPeerLeave(peerId => {
    peers.delete(peerId);
    updatePeerCount();
    addMessage(`${peerId} 離開了房間`, 'system');
  });
  
  currentRoom.onMessage('chat', (message, peerId) => {
    addMessage(message, peerId);
  });
  
  chatContainer.classList.remove('hidden');
  addMessage(`你加入了房間 "${roomName}"`, 'system');
});

// 傳送訊息
function sendMessage() {
  const message = messageInput.value.trim();
  if (!message || !currentRoom) return;
  
  currentRoom.send('chat', message);
  addMessage(message, 'self');
  messageInput.value = '';
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});

// 添加訊息到聊天框
function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  
  if (sender === 'self') {
    messageDiv.classList.add('self');
    messageDiv.textContent = `你: ${text}`;
  } else if (sender === 'system') {
    messageDiv.style.textAlign = 'center';
    messageDiv.style.color = '#666';
    messageDiv.textContent = text;
  } else {
    messageDiv.textContent = `${sender}: ${text}`;
  }
  
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// 更新線上人數顯示
function updatePeerCount() {
  peerCountDiv.textContent = `房間人數: ${peers.size + 1}`;
}
// 新增狀態邏輯
const status = document.getElementById('connectionStatus')
let peerCount = 0

function updateStatus() {
  status.textContent = peerCount > 0 ? '✅ Connected' : '❌ Disconnected'
}
//加入 setupRoom() 中的事件處理器
onPeerJoin(peerId => {
  peerCount++
  logMessage(`Peer ${peerId.slice(0, 4)} joined the room`, 'System')
  updateStatus()
})

onPeerLeave(peerId => {
  peerCount = Math.max(0, peerCount - 1)
  logMessage(`Peer ${peerId.slice(0, 4)} left the room`, 'System')
  updateStatus()
})


