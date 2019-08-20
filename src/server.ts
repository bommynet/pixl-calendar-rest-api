import express from 'express';
import VCalendar from './iCal/VCalendar';
import Appointment from './iCal/Appointment';

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
    console.log('Appointment-ReadAll');
    res.status(200).send(iCal.appointments);
})

app.post('/api/calendar/appointment', (req, res) => {
    console.log('Appointment-Add');

    try {
        const event = iCal.createAppointment(req.query);
        res.status(201).send(event);
    }catch(reason){
        res.status(403).send(reason.message);
    }
})

app.post('/api/calendar/appointment/:id', (req, res) => {
    const id = "" + req.params['id'];
    console.log(`Appointment-Update: ${id}`);

    let responseState = 404;
    let responseUpdatedObject: Appointment | undefined;

    if (typeof id === 'string' && id.length > 0) {
        responseUpdatedObject = iCal.updateAppointment(id, req.query);

        if (responseUpdatedObject)
            responseState = 200;
    }

    res.status(responseState).send(responseUpdatedObject);
})

app.delete('/api/calendar/appointment/:id', (req, res) => {
    const id: string = "" + req.params['id'];

    let responseState = 404;
    let responseDeletedObject: Appointment | undefined;

    if (typeof id === 'string' && id.length > 0) {
        responseDeletedObject = iCal.removeAppointment(id);

        if (responseDeletedObject)
            responseState = 200;
    }

    res.status(responseState).send(responseDeletedObject);
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