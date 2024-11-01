import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from './db.js';
import tcpServer from './tcpServer.js';
import twilio from "twilio";
import bodyParser from "body-parser";

// Twilio responses til webhook for opkald og beskeder
/* const VoiceResponse = require("twilio").twiml.VoiceResponse; */
const MessagingResponse = twilio.twiml.MessagingResponse;

app.use(bodyParser.urlencoded({ extended: false }));
// ovenstående for at kunne parse body fra Twilio

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;
let app = express();

const TCP_PORT = 8080;

app.use(morgan('dev'));
app.use(cors());
app.use("/", express.static('./public'));
app.use(express.json());

// Twilio webhook for beskeder
app.post("/sms", twilio.webhook({ validate: false }), (req, res) => {
    const twiml = new MessagingResponse();
  
    console.log(req.body);
    console.log("From: ", req.body.From);
    console.log("Country: ", req.body.FromCountry);
    console.log("Message: ", req.body.Body);
  
    if (req.body.Body.toLowerCase() === "hej") {
      twiml.message("Hej og goddag");
    } else if (req.body.Body.toLowerCase() === "farvel") {
      twiml.message("Farvel og god dag");
    } else {
      twiml.message(`Det her er en SMS webhook. Vil du have en ven svar "hej" tilbage og "farvel" når I har snakket.`);
    }
  
    res.type("text/xml").send(twiml.toString());
});

// ping pong
app.get("/ping", (req, res) => {
    if (req.method === 'GET' && req.url === '/ping') {
        const startTime = Date.now();

        // Simulate some work (you can replace this with your actual server logic)
        setTimeout(() => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        console.log(`Ping response time: ${responseTime}ms`);
        res.end(`Ping response time: ${responseTime}ms`);
        }, 234); // Simulated work takes 234 milliseconds
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

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
tcpServer.listen(TCP_PORT, () => {
    console.log(`Server is listening on port ${TCP_PORT}`);
});