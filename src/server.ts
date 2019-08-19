import express from 'express';
import VCalendar from './iCal/VCalendar';

const app = express();
const port = 22222;
const iCal = new VCalendar('Bommys Kalender', '-//bommynet/pixlcal//NONSGML v1.0-alpha//DE');

let globalCalendarEntryUid = 1;

app.get('/api/calendar/sync', (req, res) => {
    console.log('Calendar-Sync by', req.ip);

    const iCalString = iCal.toICSString();

    res.set('Content-Type', 'text/calendar;charset=utf-8');
    res.set('Content-Disposition', 'attachment; filename="calendar.ics"');
    res.send(iCalString);
});


app.get('/api/calendar/appointment', (req, res) => {
    console.log('Appointment-Read by', req.ip);
    
    res.status(200).send(iCal.appointments);
})

app.post('/api/calendar/appointment', (req, res) => {
    console.log('Appointment-Add by', req.ip);
    
    const uid = globalCalendarEntryUid;
    const begin = new Date(req.query['begin']);
    const end = new Date(req.query['end']);
    
    const event = iCal.addAppointment({
        id: uid.toString(),
        begin: begin,
        end: end,
        name: req.query['name'],
        description: req.query['description'],
        orgnizer: { name: 'Thomas', email: 'mail@bommy.net' },
        attendees: [],
        createdDate: new Date(),
        lastModifiedDate: new Date(),
    });
    
    globalCalendarEntryUid++;
    res.status(200).send(event);
})


app.get('/api/calendar/anniversary', (req, res) => {
    console.log('Anniversary-Read by', req.ip);
    
    res.status(200).send(iCal.anniversaries);
})

app.post('/api/calendar/anniversary', (req, res) => {
    console.log('Anniversary-Add by', req.ip);
    
    const uid = globalCalendarEntryUid;
    const begin = new Date(req.query['begin']);
    
    const event = iCal.addAnniversary({
        id: uid.toString(),
        date: begin,
        name: req.query['name'],
        description: req.query['description'],
        orgnizer: { name: req.query['organizer_name'], email: req.query['organizer_email'] },
        attendees: [],
        createdDate: new Date(),
        lastModifiedDate: new Date(),
    });
    
    globalCalendarEntryUid++;
    res.status(200).send(event);
})

app.listen(port, () => console.log(`Application started at ${port}`));