import { useState } from 'react';
import styles from '../styles/elements/TextArea.module.css';

const TextArea = (props) => {
    const { label, name, iconURL, value, isValid, serverValid, invalidMessage, focused } = props
    const [isFocused, setIsFocused] = useState(value ? true : false)
    
    const handleFocusIn = () => {
       setIsFocused(true)
    }

    const handleFocusOut = (e) => {
        !e.target.value && setIsFocused(false)
    }


    return (
        <div className={styles.container}>
            {iconURL && (<img src={iconURL} />)}
            <label htmlFor={name} className={`${styles.label} ${(isFocused || focused) && `${styles.labelFocused} ${(isValid === false || serverValid === false) && styles.invalidLabelFocused}`}`} >{label}</label>
            <textarea {...props} className={`${styles.input} ${(isValid === false || serverValid === false) && styles.invalid}`} onFocus={handleFocusIn} onBlur={handleFocusOut}></textarea>
            {!isValid && (
                <div className={styles.invalidMessage}>{invalidMessage}</div>
            )}
            
        </div>
    )
}

export default TextArea