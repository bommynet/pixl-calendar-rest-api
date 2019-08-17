import express from 'express';
import VCalendar from './iCal/VCalendar';

const app = express();
const port = 22222;
const iCal = new VCalendar('Bommys Kalender', null, null, null, 'Version 1.0-alpha');

app.get('/api/calendar/subscribe', (req, res) => {
    console.log('Kalender-Sync von', req.ip);

    const iCalString = iCal.toICSString();

    res.set('Content-Type', 'text/calendar;charset=utf-8');
    res.set('Content-Disposition', 'attachment; filename="calendar.ics"');
    res.send(iCalString);
});

app.listen(port, () => console.log(`Application started at ${port}`));