import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from "body-parser";
import fs from 'fs';
import { get } from 'http';

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');

function getImg(item) {
    const img = fs.readFileSync(`./storage/img/${item}.jpg`, "base64");
    let obj = {};
    obj["title"] = item;
    obj["img"] = `data:image/jpeg;base64,${img}`;
    return obj;
}
function getCSS() {
    const css = fs.readFileSync(`./storage/style.css`, "utf8");
    return css;
}

function standard(indicator) {
    if (indicator === "all") {
        const imgNames = ["BlackMan", "TheRing", "TheVisionQuest", "WomanFace"];
        const imgs = [];

        for (let i = 0; i < 4; i++) {
            imgs.push(getImg(imgNames[i]));
        }

        const css = getCSS();

        return { imgs: imgs, css: css };
        
    } else {

        const css = getCSS();
        return { css: css };

    }

    
}

//
// routes
//
app.get("/", (req, res) => {
    const { imgs, css } = standard("all");

    res.render("pages/index", { imgs: imgs, css: css });
});

app.get("/about", (req, res) => {
    const { css } = standard();

    res.render("pages/about", { css: css });
});

app.get("/stories", (req, res) => {
    const { css } = standard();

    res.render("pages/stories", { css: css });
});


app.all('*', (req, res) => {
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});