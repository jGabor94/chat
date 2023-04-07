import TextInput from './TextInput';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/TextField.module.css';

const SearchField = () => {

    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate()

    const handleSearch = (e) => {
        if (e.key && e.key === 'Enter') { 
            searchValue && navigate(`/search/${searchValue}`)
            setSearchValue("")
            return
        }
        
        if(!e.key){
            searchValue && navigate(`/search/${searchValue}`)
            setSearchValue("")
        }
        
        
    }


    return (
        <div className={styles.container}>
        <TextInput value={searchValue} onKeyDown={handleSearch} onChange={(e) => setSearchValue(e.target.value)} name="search" type="text" iconURL={`/icons/searchIcon.png`} iconHandler={{onClick: handleSearch}}/>
        </div>
    )
}

export default SearchField