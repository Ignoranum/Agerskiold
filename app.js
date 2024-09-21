import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const PORT = 3000;
let app = express();

app.use(morgan('dev'));
app.use(cors());
app.use("/", express.static('./public'));

app.all('*', (req, res) => {
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});