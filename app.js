import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from "body-parser";

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
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

app.all('*', (req, res) => {
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});