import styles from '../styles/elements/alert.module.css';

const Alert = ({errors}) => {
    
    return errors.length > 0 && (
        <div className={styles.alert}>
            <ul>
            {errors.map((error, index) => (
                <li key={index}>{error.msg}</li>
            ))}   
            </ul>
        </div>
        )
    
}

export default Alert