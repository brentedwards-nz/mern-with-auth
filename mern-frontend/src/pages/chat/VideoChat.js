import { Button, Grid, Typography, TextField } from "@mui/material"
import { useState, useEffect } from "react"
import Video from "../../components/Video"
import VideoChatUsers from "../..//components/VideoChatUsers";
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import useUserDetails from "../../hooks/useUserDetails";


const socket = io(process.env.REACT_APP_BACKEND_SOCKETIO_URL);

const VideoChat = () => {
  const [userDetails, setUserDetails] = useUserDetails();

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const [localSocketId, setLocalSocketId] = useState('');
  const [localName, setLocalName] = useState('Guest');

  const [remoteSocketId, setRemoteSocketId] = useState('');
  const [remoteName, setRemoteName] = useState('Guest');

  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);

  const [allUsers, setAllUsers] = useState([]);

  const [callState, setCallState] = useState('Idle')

  socket.on('socket.created', (socketId) => {
      setLocalSocketId(socketId);
    }
  );

  socket.on('current.users', (onlineUsers) => {
    const users = onlineUsers.filter(user => user.socketId !== localSocketId);

    // const demoUsers = [
    //   ...users,
    //   {socketId: 'abc', name: "Billy Bob"},
    //   {socketId: 'def', name: "Candy Cane"},
    //   {socketId: 'hij', name: "Derek Donut"},
    // ]

    setAllUsers(users);
    //setAllUsers(demoUsers);
  });

  useEffect(() => {
    if(localSocketId.length > 0) {
        socket.emit('register', { 
          socketID: localSocketId, 
          userName: localName 
        });
    };
  }, [localSocketId, localName])

  useEffect(() => {
    console.log(`Call State: ${callState}`);
  }, [callState])

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
      setCallState('Ringing')
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
    setLocalName(`${userDetails.firstName} ${userDetails.secondName}`);
  }, [userDetails]);

  const onMakeCall = (socketId) => {
    setRemoteSocketId(socketId);
  }

  useEffect(() => {
    if(callState === "Idle" && remoteSocketId.length > 0)
    {
       makeCall(); 
    }
  }, [remoteSocketId, callState]);

  const makeCall = () => {
    setCallState('Calling')

    const peer = new Peer({ 
      initiator: true,
      trickle: false,
      stream: localStream
    });

    peer.on('signal', (signalData) => {
      socket.emit('call.connect', { 
        remoteSocketId: remoteSocketId, 
        signalData: signalData, 
        originSocketId: localSocketId, 
        originName: localName 
      });
    });

    peer.on('stream', (remoteStream) => {
      setCallState('Connected')
      setRemoteStream(remoteStream)
      setCallAccepted(true);
    });

    socket.on('call.accepted', (signalData) => {
      peer.signal(signalData);
    });
  }

  const acceptCall = () => {
    setCallAccepted(true);

    var peer = new Peer({
      initiator: false,
      trickle: false,
      stream: localStream
    });

    peer.on('signal', (data) => {
      socket.emit('call.answer', { 
        signalData: data, 
        remoteSocketId: 
        call.originSocketId 
      });
    });

    peer.on('stream', (remoteStream) => {
      setCallState('Connected')
      setRemoteStream(remoteStream);
    });

    peer.signal(call.signalData);
  }

  const hangUp = () => {
    setRemoteStream(null)
    setRemoteSocketId('')
    setCallState('Idle')
  }

  const handleRemoteSocketIdChange = (event, child) => {
    setRemoteSocketId(event.target.value);
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography align="center" variant="h3" sx={{fontSize: "2em"}}>Chat</Typography>
      </Grid>
      <Grid item xs={12}>
        <VideoChatUsers users={allUsers} makeCall={onMakeCall}/>
      </Grid>
      <Grid item xs={12} sm={6} textAlign="center" sx={{paddingTop: "0px", margin: "0px"}}>
        <Video stream={localStream} />
        <Typography>{localName}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} textAlign="center" sx={{paddingTop: "0px", margin: "0px"}}>
        <Video stream={remoteStream} />
        {callState === "Connected" && <Typography>{remoteName}</Typography> }
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
        callState === "Ringing" &&
        <Grid item xs={12} textAlign="center">
          <Typography>Call from: {remoteName}:{remoteSocketId}</Typography>
          <Button onClick={acceptCall}>Accept</Button>
        </Grid>
      }

      {
        callState === "Connected" &&
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
      </Grid>
    </Grid>
  )
}
export default VideoChat