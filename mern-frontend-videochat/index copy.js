//const SimplePeer = require("simple-peer");

const localVideo = document.querySelector("#local-video-src");
const remoteVideo = document.querySelector("#remote-video-src");

const socketId = document.querySelector("#socket-id");

const callButton = document.querySelector("#call-button");
const remoteNumber = document.querySelector("#remote-number");

const answerButton = document.querySelector("#answer-button");
answerButton.style.display = "none";
const hangupButton = document.querySelector("#hangup-button");
hangupButton.style.display = "none";

let localStream = null;
let localSocketId = null;
let localName = "Local User";

let remoteStream = null;
let remoteSocketId = null;
let remoteName = "Remote User";
let remoteSignalData = null;

var socket = io('http://localhost:5500');

socket.on('socket.created', (socketId) => {
  console.log(`Created local socket id: ${socketId}`);
  document.getElementById('socket-id').textContent = `Socket Id: ${socketId}`;
  localSocketId = socketId;
});


navigator.mediaDevices.getUserMedia({ video: true, audio: true })
.then((currentStream) => {
  console.log('Got user media...');
  localVideo.srcObject = currentStream;
  localStream = currentStream;
});

socket.on('call.incoming', ({ signalData, originSocketId, originName}) => {
  console.log(`received call.incoming from: ${originSocketId}`)
  remoteSocketId = originSocketId;
  remoteSignalData = signalData;

  callButton.style.display = "none";
  remoteNumber.style.display = "none";
  answerButton.style.display = "block";
});

callButton.onclick = (event) => {
  remoteSocketId = remoteNumber.value;
  console.log(`Calling ${remoteSocketId}...`)

  callButton.style.display = "none";
  remoteNumber.style.display = "none";
  hangupButton.style.display = "block";

  const peer = new SimplePeer({ 
      initiator: true,
      trickle: false,
      localStream: localStream
    });

    peer.on('signal', (signalData) => {
      console.log(`Calling: received peer.signal`)
      console.log(`remoteSocketId: ${remoteSocketId}`)
      console.log(`localSocketId: ${localSocketId}`)
      socket.emit('call.connect', { 
        remoteSocketId: remoteSocketId, 
        signalData: signalData, 
        originSocketId: localSocketId, 
        originName: localName 
      });
      //setRemoteStream(localStream)
    });

    peer.on('stream', (remoteStream) => {
      console.log(`Calling: received peer.stream`)
      remoteVideo.srcObject = remoteStream;
    });

    socket.on('call.accepted', (signalData) => {
      console.log(`Calling received call.accepted`)
      peer.signal(signalData);
    });
};

answerButton.onclick = (event) => {
  console.log("Answering...")

  var peer = new SimplePeer({
    initiator: false,
    trickle: false,
    stream: localStream
  });

  peer.on('signal', (data) => {
    console.log(`Answering: signal received`);
    socket.emit('call.answer', { 
      signalData: data, 
      remoteSocketId: remoteSocketId
    });
  });

  peer.on('stream', (remoteStream) => {
    console.log(`Answering: received peer.stream`);
    remoteVideo.srcObject = remoteStream;
  });

  peer.signal(remoteSignalData);
};

hangupButton.onclick = (event) => {
  console.log("Hung up...")
  callButton.style.display = "block";
  remoteNumber.style.display = "block";
  hangupButton.style.display = "none";
};