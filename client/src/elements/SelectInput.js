import { useState } from 'react';
import styles from '../styles/elements/SelectInput.module.css';

const SelectInput = (props) => {
    const {name, label, value} = props
    const [isFocused, setIsFocused] = useState(value ? true : false)
    
    const handleFocusIn = () => {
       setIsFocused(true)
    }

    const handleFocusOut = (e) => {
        !e.target.value && setIsFocused(false)
    }

    return (
        <div className={styles.container}>
                <label className={`${styles.label} ${isFocused && styles.labelFocused}`} htmlFor={name}>{label}</label>
                <select {...props} className={styles.select} onFocus={handleFocusIn} onBlur={handleFocusOut}>
                    <option value=""></option>
                    <option value="Előétel">Előétel</option>
                    <option value="Főétel">Főétel</option>
                    <option value="Desszert">Desszert</option>
                </select>
        </div>
    )
}

export default SelectInput