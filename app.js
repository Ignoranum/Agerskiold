import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from './db.js';
import httpServer from './httpServer.js';
import tcpServer from './tcpServer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;
let app = express();

const HTTP_PORT = 8000;
const TCP_PORT = 8080;

app.use(morgan('dev'));
app.use(cors());
app.use("/", express.static('./public'));
app.use(express.json());

// routes
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/about", (req, res) => {
    res.sendFile(__dirname + "/public/about.html");
});

// user manipulation
app.get("/api/getUsers", (req, res) => {
    if (!req.query.username) {
        res.status(400).json({ error: "Invalid request" });
        return;
    }
    
    db.all(`SELECT * FROM users;`, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post("/api/addUser", (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({ error: "Invalid request" });
        return;
    }
    let { username, password } = req.body;
    
    db.all(`INSERT INTO users (username, password)
            VALUES(?, ?);`, [username, password], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.all('*', (req, res) => {
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
httpServer.listen(HTTP_PORT, () => {
    console.log(`Server is running on port ${HTTP_PORT}`);
});
tcpServer.listen(TCP_PORT, () => {
    console.log(`Server is listening on port ${TCP_PORT}`);
});