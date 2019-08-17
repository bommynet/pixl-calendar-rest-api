import express from 'express';
import VCalendar from './iCal/VCalendar';
import VEvent from './iCal/VEvent';

const app = express();
const port = 22222;
const iCal = new VCalendar('Bommys Kalender', null, null, null, 'Version 1.0-alpha');

let globalCalendarEntryUid = 1;

app.get('/api/calendar/subscribe', (req, res) => {
    console.log('Kalender-Sync von', req.ip);

    const iCalString = iCal.toICSString();

    res.set('Content-Type', 'text/calendar;charset=utf-8');
    res.set('Content-Disposition', 'attachment; filename="calendar.ics"');
    res.send(iCalString);
});

app.post('/api/calendar/add', (req, res) => {
    console.log('Kalender-Add von', req.ip);

    const uid = globalCalendarEntryUid;
    const begin = new Date(Number.parseInt(req.query['begin']));
    const end = new Date(Number.parseInt(req.query['begin']));

    const event = iCal.addEvent(
        uid,
        begin, end, false,
        req.query['name'], req.query['description'], null, null, null,
        { name: 'Thomas', email: 'ja' },
        [],
        new Date(), new Date()
    );

    globalCalendarEntryUid++;
    res.status(200).send(event);
})

app.listen(port, () => console.log(`Application started at ${port}`));