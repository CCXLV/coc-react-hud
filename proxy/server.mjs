import express from 'express';
import axios from 'axios';
import cors from 'cors';

import { Server } from 'socket.io';
import http from 'http';

import utils from '../src/config.json' assert { type: 'json' };

const app = express();
const port = 3149;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
    path: '/'
});


const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
  
app.use(cors(corsOptions));
app.use(express.json());

const clashOfClansApiUrl = 'https://api.clashofclans.com/v1';

app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.get('/clashofclans', async (req, res) => {
    try {
        const { url } = req.query;
        if (typeof url !== 'string') {
            throw new Error('Invalid URL parameter');
        }

        const response = await axios.get(`${clashOfClansApiUrl}${url}`, {
            headers: {
                Authorization: `Bearer ${utils.API_KEY}`,
            },
        });

        res.json(response.data);
    } catch (error) { 
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

io.on('connection', (socket) => {
    console.log('A client connected');
    
    socket.on('data-update', async (route) => {
        try {
            const response = await axios.get(`${clashOfClansApiUrl}/${route}`, {
                headers: {
                    Authorization: `Bearer ${utils.API_KEY}`,
                },
            });

            socket.emit('data-update', response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });
});


server.listen(3001);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
