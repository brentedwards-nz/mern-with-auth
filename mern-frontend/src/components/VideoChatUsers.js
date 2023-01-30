import { Button } from "@mui/material";

const VideoChatUsers = (props) => {

  const allUsers = props.users;
  const onMakeCall = props.makeCall

  return (
    <div>
    {
    allUsers.map((user, idx) => 
      <span key={idx}>
        <Button onClick={() => onMakeCall(user.socketId)}>{user.name}</Button>
      </span> 
    )
    }
    </div>
  )
}
export default VideoChatUsers