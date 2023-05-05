import Grid from "@mui/material/Grid"
import { Fragment, useEffect, useState } from 'react';
import useLoginServices from "../../customHooks/useLoginServices";
import ChatListItem from './Components/ChatListItem';
import Skeleton from '@mui/material/Skeleton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import GroupsIcon from '@mui/icons-material/Groups';
import ChatIcon from '@mui/icons-material/Chat';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import Box from "@mui/system/Box";
import { Badge } from "@mui/material";


const GridItemSwitchChat = styled(Grid)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: theme.spacing(2),
    '&:hover': {
        backgroundColor: theme.palette.grey[200]
    },
    '& .MuiSvgIcon-root': {
        width: '30px',
        height: '30px'
    }
}))

const ChatSelector = ({chatInstance}) => {

    const [listType, setListType] = useState("private")
    const { loginState } = useLoginServices()

    const handleChangeList = (type) => {
        setListType(type)
    }

    return (
        <Fragment>
        <Grid container>
            <GridItemSwitchChat item xs={6} onClick={() => handleChangeList("private")}>
            <Badge badgeContent={chatInstance.alertMap.private.number} color="error">
                <ChatIcon />
            </Badge>
            </GridItemSwitchChat>
            <GridItemSwitchChat item xs={6} onClick={() => handleChangeList("group")}>
            <Badge badgeContent={chatInstance.alertMap.group.number} color="error">
                <GroupsIcon />
                </Badge>
            </GridItemSwitchChat>
        </Grid>
            <Box sx={{
                overflowY: "auto",
                overflowX: "hidden", 
                height: "100%",
                flexGrow: 1
                }}>
                <List component="nav">
                {chatInstance.rooms ? chatInstance.rooms.map((room, index) => 
                    (listType === room.type) && (
                        <ChatListItem key={index} loginState={loginState} room={room} chatInstance={chatInstance} key={index}/>
                    )                            
                    ) : Array.from({ length: 10 }, (_, index) => (
                    <ListItemButton key={index}>
                        <ListItemAvatar>
                            <Skeleton variant="circular" width={40} height={40} />
                        </ListItemAvatar>
                        <ListItemText primary={<Skeleton variant="text" sx={{ fontSize: '1rem' }} />} secondary={<Skeleton variant="text" sx={{ fontSize: '1rem' }} />} />
                    </ListItemButton>
                     ))}
                </List>
                <audio id="chatAlert">
                    <source src="./chatAlert.mp3" type="audio/mpeg" />
                </audio>
            </Box>
        </Fragment>
    )
}

export default ChatSelector