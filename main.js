import { joinRoom } from './trystero-torrent.min.js';
//const config = {appId: 'learn-2d'}
//const room = joinRoom(config, 'web-discover')

const logEl = document.getElementById('log');
const selfIdEl = document.getElementById('selfId');
const statusEl = document.getElementById('status');
const peerCountEl = document.getElementById('peerCount');
const peerListEl = document.getElementById('peerList');

function log(msg) {
  console.log(msg);
  logEl.textContent += `[${new Date().toLocaleTimeString()}] ${msg}\n`;
  logEl.scrollTop = logEl.scrollHeight;
}

const config = {
  appId: 'learn-2d',
  trackers: [
    'wss://tracker.openwebtorrent.com',
    'wss://tracker.btorrent.xyz',
    'wss://tracker.fastcast.nz',
  ]
};

const room = joinRoom(config, 'trystero-diagnostic-room');

const peers = new Set();

room.onPeerJoin(peerId => {
  log(`✅ Peer joined: ${peerId}`);
  peers.add(peerId);
  updateUI();
});

room.onPeerLeave(peerId => {
  log(`❌ Peer left: ${peerId}`);
  peers.delete(peerId);
  updateUI();
});

const [sendPing, onPing] = room.makeAction('ping');

onPing((msg, peerId) => {
  log(`📥 Received ping from ${peerId}`);
});

setInterval(() => {
  sendPing('ping');
  log(`📤 Sent ping`);
}, 5000);

function updateUI() {
  selfIdEl.textContent = room._selfId || 'Unknown';
  peerCountEl.textContent = peers.size;
  statusEl.textContent = peers.size > 0 ? 'Connected to peer(s)' : 'No peers connected';

  peerListEl.innerHTML = '';
  peers.forEach(peerId => {
    const li = document.createElement('li');
    li.textContent = peerId;
    peerListEl.appendChild(li);
  });
}

