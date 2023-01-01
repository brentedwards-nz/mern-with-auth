import {
  Button,
  IconButton,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Checkbox,
  Avatar
} from "@mui/material"

import AddIcon from '@mui/icons-material/Add';

import { useState } from "react"
import { useQuery } from 'react-query';

import ChatConversations from "../../components/ChatConversations"
import ChatConversation from "../../components/ChatConversation"
import { axiosClient } from "../../services/api"

function Chat() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [open, setOpen] = useState(false);

  const getUsers = async () => {
    const response = await axiosClient.get("auth/users");
    console.table(response?.data);
    return response?.data;
  };

  const { userData, userStatus } = useQuery({
    queryKey: ["user"],
    queryFn: getUsers
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenAddConversationDialog = () => {
    setOpen(true);
  };

  const [checked, setChecked] = useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Select users:"}
        </DialogTitle>
        <DialogContent>
          <Box>
            <Typography>User Status: {userStatus}</Typography>
            {userStatus !== "loading" && userStatus !== "error" && userData &&
              <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {userData.map((user, index) => {
                  const labelId = `checkbox-list-secondary-label-${index}`;
                  return (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <Checkbox
                          edge="end"
                          onChange={handleToggle(index)}
                          checked={checked.indexOf(index) !== -1}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      }
                      disablePadding
                    >
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar />
                        </ListItemAvatar>
                        <ListItemText id={labelId} primary={`${user.firstName}`} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            }
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} autoFocus>OK</Button>
        </DialogActions>
      </Dialog>

      <Grid container
        paddingTop="20px"
        paddingRight="20px"
        paddingLeft="20px"
        marginLeft="auto"
        marginRight="auto"
        maxWidth="1200px"
      >
        <Grid item xs={4}>
          <Grid container>
            <Grid item sx={{ paddingTop: "3px" }}>
              <Typography textAlign={"center"} variant="h5">Chats</Typography>
            </Grid>
            <Grid item sx={{}}>
              <IconButton onClick={handleOpenAddConversationDialog}><AddIcon /></IconButton>
            </Grid>
          </Grid>
          <ChatConversations setCurrentRoom={setCurrentRoom} />
        </Grid>
        <Grid item xs={8}>
          <Grid container sx={{ paddingTop: "3px" }}>
            <Typography textAlign={"center"} variant="h5">Messages</Typography>
          </Grid>
          <ChatConversation roomId={currentRoom} />
        </Grid>
      </Grid>
    </>
  )
}
export default Chat