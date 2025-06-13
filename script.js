// 配置 Firebase (Trystero 的后端之一)
const config = {
  appId: 'trystero-demo', // 你可以更改这个ID
  rootPath: 'trystero-demo'
};

// 选择 Firebase 作为连接方式
const app = Trystero({
  appId: config.appId,
  rootPath: config.rootPath,
  basePeerConfig: {}
});

// DOM 元素
const roomInput = document.getElementById('roomInput');
const joinBtn = document.getElementById('joinBtn');
const chatContainer = document.getElementById('chatContainer');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const peerCountDiv = document.getElementById('peerCount');

let currentRoom = null;
let peers = new Set();

// 加入房间
joinBtn.addEventListener('click', () => {
  const roomName = roomInput.value.trim();
  if (!roomName) return;
  
  if (currentRoom) {
    currentRoom.leave();
    peers.clear();
    messagesDiv.innerHTML = '';
    peerCountDiv.textContent = '房间人数: 0';
  }
  
  currentRoom = app.joinRoom(roomName);
  
  // 设置消息接收
  currentRoom.onPeerJoin(peerId => {
    peers.add(peerId);
    updatePeerCount();
    addMessage(`${peerId} 加入了房间`, 'system');
  });
  
  currentRoom.onPeerLeave(peerId => {
    peers.delete(peerId);
    updatePeerCount();
    addMessage(`${peerId} 离开了房间`, 'system');
  });
  
  currentRoom.onMessage('chat', (message, peerId) => {
    addMessage(message, peerId);
  });
  
  chatContainer.classList.remove('hidden');
  addMessage(`你加入了房间 "${roomName}"`, 'system');
});

// 发送消息
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

// 添加消息到聊天框
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

// 更新在线人数显示
function updatePeerCount() {
  peerCountDiv.textContent = `房间人数: ${peers.size + 1}`;
}
