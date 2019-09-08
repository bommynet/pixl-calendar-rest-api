import express from "express";
import bodyParser from "body-parser";

import setupCalendar from "./calendar";

// prepare globals
const app = express();
const port = 22222;

// setup express
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Request-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    next();
});

// setup storage
Promise.all([setupCalendar(app)])
    .then(() => {
        // start http server on given port
        app.listen(port, () => console.log(`Application started at ${port}`));
    })
    .catch(console.error);
