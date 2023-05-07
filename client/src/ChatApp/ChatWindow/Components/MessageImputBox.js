import Box from "@mui/system/Box"
import { useEffect, useState  } from 'react';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import { styled } from '@mui/material/styles';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
//import emojis from "../../../elements/emojis.js";
import emojis from 'emojibase-data/hu/data.json';
import compactEmojis from 'emojibase-data/hu/compact.json';
import groupsSubgroups from 'emojibase-data/hu/messages.json';
import emojisVersion from 'emojibase-data/meta/unicode.json'
import EMOTICON_REGEX from 'emojibase-regex/emoticon';



const CustomSendIcon = styled(SendIcon)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main, 
    color: "#fff", 
    padding: '5px', 
    borderRadius: '5px', 
    height: '40px', 
    width: '40px',
}))

const MessageImputBox = ({chatInstance}) => {

    const [message, setMessage] = useState("")
    const [anchorEl, setAnchorEl] = useState(false)
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleChange = (e) => {
        setMessage(e.target.value.replace(EMOTICON_REGEX, (match) => {
            console.log(match)
            let replaced = match
            emojis.forEach((emoji) => {
                if(match && emoji.emoticon === match){
                    console.log(emoji)
                    replaced = emoji.emoji
                }
            })
            return replaced 
        }))
    }

    const handleSend = (e) => {
        e.preventDefault()
        if(message){
            chatInstance.sendMessage(message)
            setMessage("")
        } 
    }

    const insertEmoji = (e) => {
        handleCloseEmojiWindow()
        setMessage((state) => {
            return state + e.target.textContent
        })
   
    }

    const handleOpenEmojiWindow = (e) => {
        anchorEl ? setAnchorEl(null) : setAnchorEl(e.currentTarget)
    }

    const handleCloseEmojiWindow = () => {
        setAnchorEl(null)
    }

    return (
        <Box component="form" onSubmit={handleSend} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: "10px", paddingRight: '25px'}}  noValidate >
            <IconButton aria-describedby={id}>
                <InsertEmoticonIcon onClick={handleOpenEmojiWindow}/>
            </IconButton>
            <TextField fullWidth value={message} onChange={handleChange} id="messageInput" variant="outlined" height='30px' color='primary' />
            <IconButton type="submit">
                <CustomSendIcon />
            </IconButton>
            <Popover sx={{transform: 'translate(0px, -50px)'}}
            id={id}
  open={open}
  anchorEl={anchorEl}
  onClose={handleCloseEmojiWindow}
  anchorOrigin={{
    vertical: 'top',
  }}
  transformOrigin={{
    vertical: 'bottom',
  }}
>

  <Stack direction="row" flexWrap="wrap" sx={{maxWidth: "300px", maxHeight: "300px"}}>
    {emojis.map((emoji) => 
        emoji.group === 0  && (
            <Tooltip title={emoji.label}>
            <Typography fontSize={25} value={emoji} onClick={insertEmoji} sx={{cursor: "pointer"}}>{emoji.emoji}</Typography>
            </Tooltip>
        
    ))}r
  </Stack>
</Popover>
        </Box>
    )
}

export default MessageImputBox