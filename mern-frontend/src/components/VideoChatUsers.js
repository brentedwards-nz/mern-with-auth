import { Button, Typography } from "@mui/material";

const VideoChatUsers = (props) => {

  const allUsers = props.users;
  const makeCall = props.makeCall
  const remoteSocketId = props.remoteSocketId
  const callState = props.callState
  const acceptCall = props.acceptCall
  const hangUp = props.hangUp
  const endCall = props.endCall

  return (
    <div>
      {/* <Typography>{remoteSocketId}</Typography>
      <Typography>{callState}</Typography> */}
      {
        allUsers.map((user, idx) =>
          <span key={idx}>
            <Typography>{user.name}</Typography>
            {callState === 'Idle' && <Button onClick={() => makeCall(user.socketId)}>Call</Button>}
            {callState === 'Calling' && user.socketId === remoteSocketId && <Typography>Calling...</Typography> && <Button onClick={() => hangUp()}>Cancel</Button>}
            {callState === 'Ringing' && user.socketId === remoteSocketId && <Typography>Ringing...</Typography> && <Button onClick={() => acceptCall()}>Answer</Button>}
            {callState === 'Connected' && user.socketId === remoteSocketId && <Typography>Connected</Typography> && <Button onClick={() => endCall()}>Hang Up</Button>}
          </span>
        )
      }
    </div>
  )
}
export default VideoChatUsers