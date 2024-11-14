import React, {useState} from 'react';
import {observer} from "mobx-react";

interface ImageUploaderProps {
    image: string;
    onUpload: (url: string) => void;
}

const ImageUploader = observer(({image, onUpload}: ImageUploaderProps) => {
    const [imageErrorMessage, setImageErrorMessage] = useState<string | undefined>();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const files = event.target.files;
        if (!files || files.length === 0) {
            return;
        }

        const selectedFile = files[0];

        const formData = new FormData();
        formData.append('source', selectedFile);

        try {
            if (selectedFile.type !== 'image/jpg' && selectedFile.type !== 'image/png' && selectedFile.type !== 'image/jpeg') {
                throw new Error('Image has wrong format');
            } else {
                fetch('http://localhost:4000/upload', {
                    method: 'POST',
                    body: formData,
                })
                    .then((res) => res.json())
                    .then((data) => {
                        onUpload(data.image.display_url);
                        setImageErrorMessage('');
                    })
                    .catch((err) => setImageErrorMessage(err.message));
            }
        } catch (err: any) {
            setImageErrorMessage(err.message);
        }
    };

    return (
        <div style={{display: "flex", flexDirection: "column", maxWidth: "500px"}}>
            {image && <img src={image} alt="preview" style={{maxWidth: '100px'}}/>}
            <input type="file" onChange={handleFileChange}/>
            {imageErrorMessage && <p style={{color: 'red'}}>{imageErrorMessage}</p>}
        </div>
    );
});

export default ImageUploader;
