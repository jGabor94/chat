import { useEffect, useState } from 'react';
import useLoginServices from '../../customHooks/useLoginServices';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import useFetchAuth from '../../customHooks/useFetchAuth';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonIcon from '@mui/icons-material/Person';
import ForumIcon from '@mui/icons-material/Forum';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchModal from './Components/SearchModal';
import RoomsModal from './Components/RoomsModal';
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';

const ChatMenuCardContainer = styled(Box)(({ theme }) => ({
    background: "linear-gradient(225deg, rgba(25,118,210,1) 15%, rgba(255,30,186,1) 85%)",
    paddingTop: "20px",
    width: "100%",
    height: "100%",
    flexGrow: 1,
    overflowY: "auto",
    overflowX: "hidden", 
}))

const ChatMenuCardHeader = styled(Box)(({ theme }) => ({
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    gap: "10px",
    '& .MuiTypography-root': {
        color: "white"
    }
}))

const SearchFieldPaper = styled(Paper)(({ theme }) => ({
    padding: '2px 4px', 
    display: 'flex', 
    alignItems: 'center', 
    width: "100%"
}))

const ChatMenuCardItem = styled(ListItemButton)(({ theme }) => ({
    '& .MuiListItemIcon-root': {
        '& .MuiSvgIcon-root': {
            paddingRight: "10px",
            color: "white"
        }
    },
    '& .MuiListItemText-root': {
        color: "white"
    }
}))


const ChatMenu = ({ chatInstance }) => {
 
    const { logout, loginState } = useLoginServices()
    const [activeSearchModal, setActiveSearchModal] = useState(false)
    const [activeRoomsModal, setActiveRoomsModal] = useState(false)
    const [profileData, setProfileData] = useState(false)

    const [searchValue, setSearchValue] = useState("")
    const [findedValue, setFindedValue] = useState([])
    const fetchAuth = useFetchAuth()
    const navigate = useNavigate()

    const handleSearch = (e) => {
        if(searchValue && ((e.key && e.key === 'Enter') || (!e.key))){
            setSearchValue("")
            fetchAuth.get(`/user/${searchValue}`).then(({ data }) => {
                setFindedValue(data)
                setActiveSearchModal(true)
            })
        }
    }

    const handleChange = (e) => {
        setSearchValue(e.target.value)
    }
    
    useEffect(() => {
        fetchAuth.get('/user/profile').then((res) => setProfileData(res.data))
    }, [])

    return (
        <ChatMenuCardContainer>
            <ChatMenuCardHeader>
                <Avatar sx={{width: "70px", height: "70px"}} src={`/images/${profileData.imageid}`} />
                <Typography sx={{fontWeight: 600}}>Bejelentkezve mint: {loginState.username}</Typography>
            </ChatMenuCardHeader>
            <List sx={{width: '100%'}} >
                <ListItem>
                    <SearchFieldPaper >
                        <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Felhasználó keresése" onChange={handleChange} onKeyDown={handleSearch} value={searchValue} />
                        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch}>
                            <SearchIcon />
                        </IconButton>
                    </SearchFieldPaper>
                </ListItem>
                <ChatMenuCardItem onClick={() => navigate("/")}>
                    <ListItemIcon>
                        <HomeIcon />
                        <ListItemText primary="Főoldal" />
                    </ListItemIcon>
                </ChatMenuCardItem>
                <ChatMenuCardItem onClick={() => navigate("/profile")}>
                    <ListItemIcon>
                        <PersonIcon />
                        <ListItemText primary="Profil" />
                    </ListItemIcon>
                </ChatMenuCardItem>
                <ChatMenuCardItem onClick={() => setActiveRoomsModal(true)}>
                    <ListItemIcon>
                        <ForumIcon />
                        <ListItemText primary="Szobák böngészése" />
                    </ListItemIcon>
                </ChatMenuCardItem>
                <ChatMenuCardItem onClick={logout}>
                    <ListItemIcon>
                        <LogoutIcon />
                        <ListItemText primary="Kijelentkezés" />
                    </ListItemIcon>
                </ChatMenuCardItem>
            </List>
            <SearchModal activeSearchModal={activeSearchModal} setActiveSearchModal={setActiveSearchModal} newPrivateChat={chatInstance.newPrivateChat} findedValue={findedValue} />
            <RoomsModal activeRoomsModal={activeRoomsModal} setActiveRoomsModal={setActiveRoomsModal} handleRoomChange={chatInstance.handleRoomChange} rooms={chatInstance.allRooms} />
        </ChatMenuCardContainer>
    )
}

export default ChatMenu