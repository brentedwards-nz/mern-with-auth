import { Button, Grid, Typography, TextField } from "@mui/material"
import { useState, useEffect } from "react"
import Video from "../../components/Video"
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const socket = io('http://localhost:5500');

const VideoChat = () => {
  const [events, setEvents] = useState([])
  const logEvent = (eventMsg) => {
    console.log(eventMsg);
    const localEvents = events;
    localEvents.push(eventMsg);
    setEvents(localEvents);
  };

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const [localSocketId, setLocalSocketId] = useState('');
  const [localName, setLocalName] = useState('Guest');

  const [remoteSocketId, setRemoteSocketId] = useState('');
  const [remoteName, setRemoteName] = useState('Guest');

  const [call, setCall] = useState({});
  const [callWasAccepted, setCallWasAccepted] = useState(false);

  socket.on('socket.created', (socketId) => {
      logEvent(`Created local socket id: ${socketId}`)
      setLocalSocketId(socketId);
    }
  );

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setLocalStream(currentStream)
      });

    socket.on('call.incoming', ({ 
			signalData,
      originSocketId, 
			originName
    }) => {
      logEvent(`received call.incoming from: ${originSocketId}`)
      setRemoteSocketId(originSocketId)
      setCall({ 
        isReceivingCall: true,
        originSocketId,
        originName,
        signalData,
      });
    });
  }, [])

  const makeCall = () => {
    logEvent(`Making call: ${remoteSocketId}`)

    const peer = new Peer({ 
      initiator: true,
      trickle: false,
      stream: localStream
    });

    peer.on('signal', (signalData) => {
      logEvent(`makeCall: received peer.signal`)


      socket.emit('call.connect', { 
        remoteSocketId: remoteSocketId, 
        signalData: signalData, 
        originSocketId: localSocketId, 
        originName: localName 
      });
      //setRemoteStream(localStream)
    });

    peer.on('stream', (remoteStream) => {
      logEvent(`makeCall: received peer.stream`)
      setRemoteStream(remoteStream)
      console.table(remoteStream)
      //userVideo.current.srcObject = currentStream;
    });

    socket.on('call.accepted', (signalData) => {
      logEvent(`received call.accepted`)
      //setCallAccepted(true);
      peer.signal(signalData);
    });

    //connectionRef.current = peer;

  }

  const acceptCall = () => {
    logEvent('Accept call..')
    logEvent(`Origin Socket Id: ${call.originSocketId}`)

    setCallWasAccepted(true);

    var peer = new Peer({
      initiator: false,
      trickle: false,
      stream: localStream
    });
    logEvent('Peer created...')

    peer.on('error', err => logEvent(`error: ${err}`))

    peer.on('signal', (data) => {
      logEvent(`acceptCall: signal received`);
      logEvent(`acceptCall: from ${call.originSocketId}`);
      socket.emit('call.answer', { 
        signalData: data, 
        remoteSocketId: 
        call.originSocketId 
      });
    });

    // peer.on('signal', (signalData) => {
    //   logEvent(`acceptCall: from ${call.originSocketId}`);
    //   socket.emit('call.answer', { 
    //     signalData: signalData, 
    //     remoteSocketId: call.originSocketId 
    //   });
    // });

    peer.on('stream', (remoteStream) => {
      logEvent('acceptCall: received peer.stream');
      console.table(remoteStream)
      setRemoteStream(remoteStream);
      //userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signalData);

    //connectionRef.current = peer;
  }

  const hangUp = () => {
    logEvent(`Hang up`)
    setRemoteStream(null)
  }

  const handleRemoteSocketIdChange = (event, child) => {
    setRemoteSocketId(event.target.value);
  };

  const formatEvents = () => {
    return <>{events.map((event, idx) => <Typography key={idx}>{event}</Typography>)}</>
  }

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography align="center" variant="h3" sx={{fontSize: "2em"}}>Chat</Typography>
      </Grid>
      <Grid item xs={6} textAlign="center" sx={{backgroundColor: "pink", paddingTop: "0px", margin: "0px"}}>
        <Video stream={localStream} />
        <Typography>Local Socket Id: {localSocketId}</Typography>
      </Grid>
      <Grid item xs={6} textAlign="center" sx={{backgroundColor: "violet", paddingTop: "0px", margin: "0px"}}>
        <Video stream={remoteStream} />
        <Typography>Remote Socket Id: {remoteSocketId}</Typography>
      </Grid>
      <Grid item xs={12} textAlign="center">
        <Button onClick={makeCall}>Call</Button>
        <TextField
          id="remoteSocketId"
          label="Remote Socket Id"
          onChange={handleRemoteSocketIdChange}
        />
      </Grid>

      {
        call.isReceivingCall &&
        <Grid item xs={12} textAlign="center">
          <Typography>Call from: {remoteName}:{remoteSocketId}</Typography>
          <Button onClick={acceptCall}>Accept</Button>
          <Button onClick={hangUp}>Hang Up</Button>
        </Grid>
      }

      <Grid item xs={12} textAlign="center">
        <Typography visibility={"hidden"}>Local Socket Id: {localSocketId}</Typography>
        {false && formatEvents()}
      </Grid>
    </Grid>
  )
}
export default VideoChat