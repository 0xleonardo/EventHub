import express from 'express';
import fetch from 'node-fetch';
import multer from 'multer';
import FormData from 'form-data';

const app = express();
const port = 4000;
const upload = multer();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.post('/upload', upload.single('source'), (req, res) => {
    const url = 'https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5&action=upload&format=json';

    const formData = new FormData();
    formData.append('source', req.file.buffer, {filename: req.file.originalname});

    fetch(url, {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
