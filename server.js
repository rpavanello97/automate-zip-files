const express = require('express');
const http = require('http');
const path = require("path");
const bodyParser = require('body-parser');
const { AutomateZip } = require('./automate-zip');

const app = express();
const server = http.createServer(app);
const convert = new AutomateZip;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));

/** Render index.html */
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//** Handle request  */
app.post('/index', function (req, res) {    
    const { directoryPath, resultPath, chunkSize } = req.body;
    convert.readFiles(directoryPath, Number(chunkSize), resultPath)
        .then(msg => {
            console.log(msg);
            res.send(msg);
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        });
});

server.listen(3000, () => {
    console.log("Server running http://localhost:3000");
});