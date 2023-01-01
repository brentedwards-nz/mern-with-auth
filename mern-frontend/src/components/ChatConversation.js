import { useRef } from "react";
import { Grid, Box, TextField, Button } from "@mui/material"
import ChatMessage from "./ChatMessage";
import { useQuery, useMutation } from 'react-query';

import { axiosClient } from "../services/api";

const ChatConversation = ({ roomId }) => {
  const getConversations = async () => {
    if (!roomId) {
      return {};
    }

    const response = await axiosClient.get(`chatroom/${roomId}`);
    return response?.data;
  };

  const { data, status } = useQuery({
    queryKey: ["message", roomId],
    queryFn: getConversations,
    enabled: roomId !== null
  });

  const messageRef = useRef();
  const { isLoading, isError, error, mutate } = useMutation({
    mutationFn: createMessage,
    onSuccess: (data, variables) => {
      console.log(data);
      console.log(variables);
      messageRef.current.value = null;
    }
  });

  async function createMessage(body) {
    const response = await axiosClient.post(`chatroom/${roomId}/message`, body)
  }
  const handlePostMessage = () => {
    const newMessage = messageRef.current.value;
    if (newMessage.length <= 0) {
      return;
    }

    const body = {
      message: newMessage
    }
    mutate(body)
  }
  const avatarColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

  return (
    <>
      <Box sx={{ height: "65vh", overflowY: "scroll" }}>
        <Grid item xs={12}>
          {status === "error" && <div>Error</div>}
          {status === "loading" && <div>Loading</div>}
          {status !== "loading" && status !== "error" && data && data?.messages.map((message, index) => {
            return <ChatMessage
              key={index}
              avatar={null}
              firstName={message.userId.firstName}
              secondName={message.userId.secondName}
              message={message.message}
              isMe={message.userId.isMe}
              avatarColor={avatarColor}
              timeStamp={message.time}
            />
          })}
        </Grid>
      </Box>
      <Box sx={{ height: "80px" }}>
        <Grid container>
          <Grid item xs={11}>
            <TextField inputRef={messageRef} multiline rows={1} sx={{ width: "100%" }}></TextField>
          </Grid>
          <Grid item xs={1} sx={{ paddingTop: "9px" }}>
            <Button onClick={handlePostMessage}>Post</Button>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
export default ChatConversation