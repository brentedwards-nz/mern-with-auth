import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';

import { useQuery } from 'react-query';
import { axiosClient } from "../services/api";

export default function ChatConversations({ setCurrentRoom }) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const getConversations = async () => {
    const response = await axiosClient.get("chatroom");
    return response?.data;
  };

  const { data, status } = useQuery({
    queryKey: ["chat"],
    queryFn: getConversations
  });

  useEffect(() => {
    if (status !== "loading" && status !== "error" && data) {
      setCurrentRoom(data[0]._id);
      setSelectedIndex(0);
    }
    else {
      setCurrentRoom(null);
      setSelectedIndex(-1);
    }

  }, [status, data])

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {status === "error" && <div>Error</div>}
      {status === "loading" && <div>Loading</div>}
      {status !== "loading" && status !== "error" &&
        <List>
          {data?.map((room, index) => {
            return <ListItemButton
              key={index}
              selected={selectedIndex === index}
              onClick={(event) => {
                handleListItemClick(event, index)
                setCurrentRoom(room._id)
              }}
            >
              <ListItemIcon>
                {selectedIndex === index ? <MarkChatReadIcon sx={{ color: "primary" }} /> : <ChatBubbleIcon />}
              </ListItemIcon>
              <ListItemText primary={room.roomTitle} />
            </ListItemButton>
          })}
        </List>
      }
    </Box >
  );
}