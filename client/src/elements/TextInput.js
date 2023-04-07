import { useState } from 'react';
import styles from '../styles/elements/TextInput.module.css';

function TextInput (props) {

    const { label, name, iconURL, value, isValid, serverValid, invalidMessage, focused, iconHandler } = props;
    const [isFocused, setIsFocused] = useState(value ? true : false)

    const handleFocusIn = () => {
       setIsFocused(true)
    }

    const handleFocusOut = (e) => {
        !e.target.value && setIsFocused(false)
    }

    return (
        <div className={styles.container}>
            
            <label htmlFor={name} className={`${styles.label} ${(isFocused || focused) && `${styles.labelFocused} ${(isValid === false || serverValid === false) && styles.invalidLabelFocused}`}`} >{label}</label>
            <div className={styles.inputContainer}>
            {iconURL && (<img src={iconURL} {...iconHandler} />)}
                <input {...props} className={`${styles.input} ${(isValid === false || serverValid === false) && styles.invalid} ${iconURL && styles.withIcon}`} onFocus={handleFocusIn} onBlur={handleFocusOut}  />
            </div>
            {!isValid && (
                <div className={styles.invalidMessage}>{invalidMessage}</div>
            )}
            
            </div>
    )
}


export default TextInput