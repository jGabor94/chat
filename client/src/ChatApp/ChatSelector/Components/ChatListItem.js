import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import { sliceLastMessage } from '../../../helpers';

const OnlineBadge = styled(Badge)(({theme}) => ({
    '& .MuiBadge-badge': {
        top: 35,
        right: 5,
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        background: "#00ba16"
    }
}))

const CustomListItemText = styled(ListItemText, {
    shouldForwardProp: (prop) => prop !== 'unVisited'
})(({ theme, unVisited }) => ({
    '& .MuiTypography-root': {
        fontWeight: unVisited && 700
    }
}))

const ChatListItem = ({loginState, room, chatInstance}) => {


    return (
        <ListItemButton onClick={() => chatInstance.handleRoomChange(room._id)} sx={{cursor: "pointer"}} selected={(chatInstance.chat._id === room._id) ? true : false} >
            <ListItemAvatar>
                <OnlineBadge variant="dot" invisible={!((room.type === "private") && [...chatInstance.online].includes(room.partner._id))}>
                    <Avatar alt={room.name.charAt(0)} src={`/images/${room.imageid}`} ></Avatar>
                </OnlineBadge>
            </ListItemAvatar>
            <CustomListItemText unVisited={!room.visitors.includes(loginState.id) ? true : false} 
            primary={room.name} 
            secondary={room.lastMessage?.message ? sliceLastMessage(room.lastMessage.message) : "Még nincs üzenet"} />
        </ListItemButton>
    )
}

export default ChatListItem