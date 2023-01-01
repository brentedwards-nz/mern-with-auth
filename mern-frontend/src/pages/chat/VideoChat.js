import { Button, Grid, Typography, TextField } from "@mui/material"
import { useState, useEffect } from "react"
import Video from "../../components/Video"
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const socket = io('http://localhost:5500');

const VideoChat = () => {
  const [message, setMessage] = useState('Empty')

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const [localSocketId, setLocalSocketId] = useState('');
  const [localName, setLocalName] = useState('Guest');

  const [remoteSocketId, setRemoteSocketId] = useState('');
  const [remoteName, setRemoteName] = useState('Guest');

  const [call, setCall] = useState({});

  socket.on('socketId', (socketId) => {
    setLocalSocketId(socketId);
  })

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {

        setLocalStream(currentStream)
        // setVideoStream(currentStream);
        // myVideo.current.srcObject = currentStream;
      });

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, [])

  const makeCall = () => {
    console.log("*** makeCall")
    setMessage("*** Make Call")
    const peer = new Peer({ initiator: true, trickle: false, localStream });

    peer.on('signal', (data) => {
      console.log('on signal')
      socket.emit('callUser', { userToCall: remoteSocketId, signalData: data, from: localSocketId, name: localName });

      //setRemoteStream(localStream)
    });

    peer.on('stream', (remoteStream) => {
      console.log('on stream')
      setRemoteStream(remoteStream)
      //userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      console.log('on callAccepted')
      //setCallAccepted(true);
      peer.signal(signal);
    });

    //connectionRef.current = peer;

  }
  const hangUp = () => {
    console.log('hangUp')
    setRemoteStream(null)
  }

  const handleRemoteSocketIdChange = (event, child) => {
    console.log("*** handleRemoteSocketIdChange: " + event.target.value);
    setRemoteSocketId(event.target.value);
    setMessage(`*** handleRemoteSocketIdChange: ${event.target.value}`)
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography align="center" variant="h3">Chat</Typography>
      </Grid>
      <Grid item xs={6} textAlign="center">
        <Video stream={localStream} />
      </Grid>
      <Grid item xs={6} textAlign="center">
        <Video stream={remoteStream} />
      </Grid>
      <Grid item xs={12} textAlign="center">
        <Typography>{localSocketId}</Typography>
        <Button onClick={makeCall}>Call</Button>
        <Button onClick={hangUp}>Hang Up</Button>
        <TextField
          id="remoteSocketId"
          label="Remote Socket Id"
          onChange={handleRemoteSocketIdChange}
        />
      </Grid>
      <Grid item xs={12} textAlign="center">
        <Typography>{message}</Typography>
      </Grid>
    </Grid>
  )
}
export default VideoChat