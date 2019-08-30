import express from "express";
import bodyParser from "body-parser";

import Storage from "./storage/NodePersist";

import appointments from "./routes/appointment";

// import Calendar from "./calendar/Calendar";
// import { calendarToICal } from "./calendar/parser/entityToICal";
import anniversaries from "./routes/anniversary";

// prepare globals
const app = express();
const port = 22222;
// const iCal = new Calendar("Bommys Kalender", "-//bommynet/pixlcal//NONSGML v1.0-alpha//DE");
const storage = new Storage();

/// FIXME: iCal export is not working arm
// app.get("/api/calendar/sync", (req, res) => {
//     console.log("Calendar-Sync by", req.ip);

//     const iCalString = calendarToICal(iCal);

//     res.set("Content-Type", "text/calendar;charset=utf-8");
//     res.set("Content-Disposition", 'attachment; filename="calendar.ics"');
//     res.send(iCalString);
// });

// setup express
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Request-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    next();
});

// setup storage
storage
    .init()
    .then((config) => {
        console.log("Storage ready");
        return config;
    })
    .then((config) => {
        appointments(app, storage, config.appointmentId);
        anniversaries(app, storage, config.anniversaryId);
        console.log("Routes ready");
    })
    .then(() => {
        app.listen(port, () => console.log(`Application started at ${port}`));
    })
    .catch(console.error);
