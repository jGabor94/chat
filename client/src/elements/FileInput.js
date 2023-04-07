import { useState } from 'react';
import styles from '../styles/elements/FileInput.module.css';

const FileInput = (props) => {
    const {onChange, isValid, errorMsg} = props;
    const [fileName, setFileName] = useState(false)

    const handler = (e) => {
        onChange(e)
        setFileName(e.target.value)
    }

    return (
        <div className={styles.fileInputContainer}>
            <label htmlFor='file'>Kép feltöltése</label>
            <input {...props} onChange={handler} id="file" type="file" className={styles.fileInput} />
            {fileName && (
                <span className={`${styles.fileName} ${!isValid && styles.invalid}`}>{isValid ? fileName : errorMsg}</span>
            )}
        </div>
    )
}

export default FileInput