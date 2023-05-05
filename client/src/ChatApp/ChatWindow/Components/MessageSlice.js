import Box from "@mui/system/Box"
import { styled } from '@mui/material/styles';
import useLoginServices from "../../../customHooks/useLoginServices";
import { useEffect } from "react";
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';

const MessageBubble = styled(ListItem, {
    shouldForwardProp: (prop) => prop !== 'own' && prop !== 'position'
})(({ theme, own, position }) => ({
    padding: "0px",
    display: 'flex',
    justifyContent: own && 'flex-end',
    marginBottom: '1px',
    '& .MuiListItemAvatar-root': {
        visibility: (own || (position !== "last")) && 'hidden',
        marginRight: '-10px'
    },
    '& .MuiBox-root': {
        backgroundColor: own ? theme.palette.grey[300] : theme.palette.info.light,
        color: !own && theme.palette.grey[200],
        fontFamily: theme.typography.fontFamily,
        padding: "10px",
        borderRadius: "1em",
        borderTopLeftRadius: (((position === "first") || (position === "mid")) && !own) && "0.1em",
        borderBottomLeftRadius: (((position === "last") || (position === "mid")) && !own) && "0.1em",
        borderBottomRightRadius: (((position === "last") || (position === "mid")) && own) && "0.1em",
        borderTopRightRadius: (((position === "first") || (position === "mid")) && own) && "0.1em",
        maxWidth: "70%",
        align: 'right',
        height: "auto",
        overfloX: "hidden",
        wordWrap: "break-word",
    }
}))


const Info = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'type'
})(({ theme, type }) => ({
    alignSelf: "center",
    marginTop: type === 2 && "30px",
    ...(type === 1) ? theme.typography.body2 : theme.typography.subtitle2
}))





const MessageSlice = ({slice}) => {

    const { loginState } = useLoginServices()
    
    return slice.map(({user, message, type}, index) => 
        (type === 0) ? (
            <MessageBubble 
            key={index}
            own={(loginState.username === user.username) ? true : false}
            position={((slice.length === 1) && "last") || ((index === 0) && "first") || ((index === slice.length-1) && "last") || "mid"}>
                <ListItemAvatar>
                    <Avatar alt={user.username.charAt(0)} src={`/images/${user.imageid}`} />
                </ListItemAvatar>
                <Box>{message}</Box>
            </MessageBubble> 
        ) : (
            <Info key={index} type={type}>{message}</Info>
        )
    )
        
    
}

export default MessageSlice