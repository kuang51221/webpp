const config = {appId: 'webpp_p2p_3p'}
const room = joinRoom(config, 'testroom')

room.onPeerJoin(peerId => console.log(`${peerId} joined`))
room.onPeerLeave(peerId => console.log(`${peerId} left`))
room.onPeerStream(
  (stream, peerId) => (peerElements[peerId].video.srcObject = stream)
)
room.addStream(
  await navigator.mediaDevices.getUserMedia({audio: true, video: true})
)
