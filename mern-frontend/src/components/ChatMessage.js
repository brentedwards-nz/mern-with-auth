import { Avatar, Typography } from "@mui/material"
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

function ChatMessage({ avatar, firstName, secondName, timeStamp, message, isMe, avatarColor }) {

  const initials = `${firstName.charAt(0).toUpperCase()}${secondName.charAt(0).toUpperCase()}`;
  const fullName = `${firstName} ${secondName}`;

  const dateFormat = Intl.DateTimeFormat('default', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  const chatMessageContainerStyle = {
    display: "flex",
    justifyContent: isMe ? "flex-end" : "flex-start",
    marginBottom: "10px",
  };

  const avatarStyle = {
    bgcolor: avatarColor,
    display: isMe ? "none" : "inherit",
    marginRight: isMe ? "inherit" : "5px"
  };

  return (
    <div style={chatMessageContainerStyle}>
      <Avatar sx={avatarStyle}>{initials}</Avatar>
      <div style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "80%",
        backgroundColor: isMe ? "#CFE0DD" : "lightgrey",
        borderRadius: "5px",
        padding: "5px",
      }}>
        <div style={{ display: "flex", justifyContent1: isMe ? "flex-end" : "flex-start", }}>
          {!isMe && <Typography sx={{ fontSize: 10, fontStyle: 'bold', paddingRight: "20px" }}>{fullName}</Typography>}
          <Typography sx={{ fontSize: 10, fontStyle: 'italic' }}>{dateFormat.format(Date.parse(timeStamp))}</Typography>
        </div>
        <div style={{ opacity: "1.0", textAligna: isMe ? "right" : "left" }}>
          <Typography>{message}</Typography>
        </div>
      </div>
    </div >
  );

  return (
    <>
      <Card sx={{ marginBottom: "5px", maxWidth: "75vw" }}>
        <CardHeader
          sx={{ textAlign: isMe ? "right" : "left" }}
          avatar={
            <Avatar sx={{ bgcolor: avatarColor, display: isMe ? "none" : "inherit" }}>
              {initials}
            </Avatar>
          }
          title={fullName}
          //subheader={dateFormat.format(Date.parse(timeStamp))}
          subheader={message}
        />
        <CardContent sx={{ textAlign: isMe ? "right" : "left", fontStyle: 'italic', fontSize: "20px" }}>
          <Typography variant="body" color="text.secondary">
            {message}
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}
export default ChatMessage;
