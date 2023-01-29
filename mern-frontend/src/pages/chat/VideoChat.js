import { Button, Grid, Typography, TextField } from "@mui/material"
import { useState, useEffect } from "react"
import Video from "../../components/Video"
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import useUserDetails from "../../hooks/useUserDetails";

const socket = io(process.env.REACT_APP_BACKEND_SOCKETIO_URL);

const VideoChat = () => {
  const [userDetails, setUserDetails] = useUserDetails();

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
  const [callAccepted, setCallAccepted] = useState(false);

  const [allUsers, setAllUsers] = useState([]);

  socket.on('socket.created', (socketId) => {
      logEvent(`Created local socket id: ${socketId}`)
      setLocalSocketId(socketId);
    }
  );

  socket.on('current.users', (onlineUsers) => {
    const users = onlineUsers.filter(user => user.socketId !== localSocketId);
    setAllUsers(users);
  });

  useEffect(() => {
    if(localSocketId.length > 0) {

        console.log(`emit register: ${localSocketId}`)
        socket.emit('register', { 
          socketID: localSocketId, 
          userName: localName 
        });
    };
  }, [localSocketId, localName])

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

  useEffect(() => {
    console.table(userDetails)
    setLocalName(userDetails.firstName);
  }, [userDetails]);

  const onMakeCall = (socketId) => {
    console.log(`onMakeCall: ${socketId}`)
    setRemoteSocketId(socketId);
    
  }

  useEffect(() => {
    makeCall();
  }, [remoteSocketId]);

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
    });

    peer.on('stream', (remoteStream) => {
      logEvent(`makeCall: received peer.stream`)
      setRemoteStream(remoteStream)
      setCallAccepted(true);
    });

    socket.on('call.accepted', (signalData) => {
      logEvent(`received call.accepted`)
      peer.signal(signalData);
    });
  }

  const acceptCall = () => {
    logEvent('Accept call..')
    logEvent(`Origin Socket Id: ${call.originSocketId}`)

    setCallAccepted(true);

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

    peer.on('stream', (remoteStream) => {
      logEvent('acceptCall: received peer.stream');
      console.table(remoteStream)
      setRemoteStream(remoteStream);
    });

    peer.signal(call.signalData);
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
      {
        allUsers && 
        <Grid item xs={4}>
          <Typography>Who's online:</Typography>
          <>{allUsers.map((user, idx) => <Grid key={idx} item xs={12}><Button onClick={() => onMakeCall(user.socketId)}>{user.name}</Button></Grid> )}</>
        </Grid>
      }
      <Grid item xs={4} textAlign="center" sx={{paddingTop: "0px", margin: "0px"}}>
        <Video stream={localStream} />
        {false && <Typography>Local Socket Id: {localSocketId}</Typography>}
      </Grid>
      <Grid item xs={4} textAlign="center" sx={{paddingTop: "0px", margin: "0px"}}>
        <Video stream={remoteStream} />
        {false && <Typography>Remote Socket Id: {remoteSocketId}</Typography>}
      </Grid>
      {
       false && <Grid item xs={12} textAlign="center">
        <Button onClick={makeCall}>Call</Button>
        <TextField
          id="remoteSocketId"
          label="Remote Socket Id"
          onChange={handleRemoteSocketIdChange}
        />
      </Grid>
      }
      {
        call.isReceivingCall && !callAccepted &&
        <Grid item xs={12} textAlign="center">
          <Typography>Call from: {remoteName}:{remoteSocketId}</Typography>
          <Button onClick={acceptCall}>Accept</Button>
        </Grid>
      }

      {
        callAccepted &&
        <Grid item xs={12} textAlign="center">
          <Button onClick={hangUp}>Hang Up</Button>
        </Grid>
      }

      {
        false && allUsers && 
        <Grid item xs={12} textAlign="center">
          <Typography>All Users:</Typography>
          <>{allUsers.map((user, idx) => <Typography key={idx}>Socket Id: {user.socketId}, Name: {user.name}</Typography>)}</>
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