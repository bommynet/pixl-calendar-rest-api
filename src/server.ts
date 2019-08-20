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
        orgnizer: { name: req.query['organizer_name'], email: req.query['organizer_email'] },
        attendees: [],
        createdDate: new Date(),
        lastModifiedDate: new Date(),
    });

    globalCalendarEntryUid++;
    res.status(200).send(event);
})

app.post('/api/calendar/appointment/:id', (req, res) => {
    const id = "" + req.params['id'];
    const appointment = iCal.appointments.find(entry => entry.id === id);
    console.log(`Appointment-Update(${id}): ${appointment && 'exists'}`);

    if (appointment) {
        if (req.query['begin']) appointment.begin = new Date(req.query['begin']);
        if (req.query['end']) appointment.end = new Date(req.query['end']);
        if (req.query['name']) appointment.name = req.query['name'];
        if (req.query['description']) appointment.description = req.query['description'];
        if (req.query['organizer_name'] && req.query['organizer_email']) appointment.orgnizer = { name: req.query['organizer_name'], email: req.query['organizer_email'] };
        appointment.lastModifiedDate = new Date();
    }

    res.status(appointment ? 200 : 404).send(appointment);
})

app.delete('/api/calendar/appointment/:id', (req, res) => {
    const id = "" + req.params['id'];
    const appointment = iCal.appointments.find(entry => entry.id === id);
    console.log(`Appointment-Delete(${id}): ${appointment && 'exists'}`);

    let deletedAppointment = false;
    if (appointment) {
        deletedAppointment = iCal.removeAppointment(appointment);
    }

    res.status(deletedAppointment ? 200 : 404).send(appointment);
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