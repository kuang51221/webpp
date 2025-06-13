import { joinRoom } from './trystero-torrent.min.js';
//const config = {appId: 'learn-2d'}
//const room = joinRoom(config, 'web-discover')



const logDiv = document.getElementById('log');
const statusCode = document.getElementById('status');
const peerIdCode = document.getElementById('peerId');
const peerCountCode = document.getElementById('peerCount');

function log(msg) {
  console.log(msg);
  logDiv.textContent += `[${new Date().toLocaleTimeString()}] ${msg}\n`;
}

const config = {
  appId: 'learn-2d',
  trackers: [
    'wss://tracker.openwebtorrent.com',
    'wss://tracker.btorrent.xyz',
    'wss://tracker.fastcast.nz'
  ]
};

const room = joinRoom(config, 'trystero-diagnostic-room');
const peers = new Set();

room.onPeerJoin(peerId => {
  log(`✅ Peer joined: ${peerId}`);
  peers.add(peerId);
  updateStatus();
});

room.onPeerLeave(peerId => {
  log(`❌ Peer left: ${peerId}`);
  peers.delete(peerId);
  updateStatus();
});

const [sendPing, onPing] = room.makeAction('ping');

onPing((msg, peerId) => {
  log(`📥 Received ping from ${peerId}`);
});

setInterval(() => {
  sendPing('ping');
  log(`📤 Sent ping`);
}, 5000);

// 顯示自身 Peer ID
setTimeout(() => {
  peerIdCode.textContent = room._selfId || 'Unknown';
}, 1000);

// 建立 WebRTC 連線以測試 ICE candidate 產生
const rtcTest = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

rtcTest.createDataChannel('test');
rtcTest.createOffer().then(offer => rtcTest.setLocalDescription(offer)).catch(console.error);

rtcTest.onicecandidate = event => {
  if (event.candidate) {
    log(`🧊 ICE candidate created: ${event.candidate.candidate}`);
    statusCode.textContent = 'WebRTC available';
  } else {
    log(`✅ ICE candidate gathering finished`);
  }
};

// 更新 UI 狀態
function updateStatus() {
  peerCountCode.textContent = peers.size;
  statusCode.textContent = peers.size > 0 ? 'Connected to peer(s)' : 'No peer connected';
}

