const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let questions = []; // Array untuk menyimpan semua pertanyaan

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Middleware untuk basic authentication
const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
        res.status(401).send('Authorization required');
        return;
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Ganti 'admin' dan 'password' dengan username dan password yang lo mau
    if (username === 'admin' && password === 'password') {
        next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
        res.status(401).send('Invalid credentials');
    }
};

// Endpoint untuk menyajikan halaman admin dengan autentikasi
app.get('/admin', auth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Endpoint API untuk mendapatkan semua pertanyaan
app.get('/questions', auth, (req, res) => {
    res.json(questions);
});

io.on('connection', (socket) => {
    console.log('New user connected');

    // Terima pertanyaan dari klien
    socket.on('newQuestion', (question) => {
        questions.push(question);
        console.log('Question received:', question);
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
