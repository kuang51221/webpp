import { joinRoom } from './trystero-torrent.min.js';
const config = {appId: 'learn-2d'}
const room = joinRoom(config, 'web-discover')

const chatDiv = document.getElementById('chat');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');

const connStatus = document.getElementById('connStatus');
const peerCount = document.getElementById('peerCount');

let peers = new Set();

const [sendMsg, onMsg] = room.makeAction('chat-message');

// 顯示接收到的訊息
onMsg((msg, peerId) => {
  const p = document.createElement('p');
  p.textContent = `👤 ${peerId.slice(0, 6)}: ${msg}`;
  chatDiv.appendChild(p);
});

// 傳送訊息
sendBtn.addEventListener('click', () => {
  const msg = msgInput.value.trim();
  if (msg) {
    sendMsg(msg);
    const p = document.createElement('p');
    p.textContent = `🧑‍💻 You: ${msg}`;
    chatDiv.appendChild(p);
    msgInput.value = '';
  }
});

// 監聽 Peer 加入
room.onPeerJoin(peerId => {
  peers.add(peerId);
  updateStatus();
  const p = document.createElement('p');
  p.textContent = `✅ ${peerId.slice(0, 6)} joined.`;
  chatDiv.appendChild(p);
});

// 監聽 Peer 離開
room.onPeerLeave(peerId => {
  peers.delete(peerId);
  updateStatus();
  const p = document.createElement('p');
  p.textContent = `❌ ${peerId.slice(0, 6)} left.`;
  chatDiv.appendChild(p);
});

// 更新 UI 狀態
function updateStatus() {
  peerCount.textContent = peers.size;
  connStatus.textContent = peers.size > 0 ? 'Connected' : 'Waiting...';
}
