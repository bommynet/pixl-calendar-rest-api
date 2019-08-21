import express from 'express';

import VCalendar from './iCal/VCalendar';
import Appointment from './iCal/Appointment';
import Anniversary from './iCal/Anniversary';

// prepare globals
const app = express();
const port = 22222;
const iCal = new VCalendar('Bommys Kalender', '-//bommynet/pixlcal//NONSGML v1.0-alpha//DE');


app.get('/api/calendar/sync', (req, res) => {
    console.log('Calendar-Sync by', req.ip);

    const iCalString = iCal.toICSString();

    res.set('Content-Type', 'text/calendar;charset=utf-8');
    res.set('Content-Disposition', 'attachment; filename="calendar.ics"');
    res.send(iCalString);
});


/**
 * Get all stored appointments.
 * response:
 *  - (200) a list of all appointments
 */
app.get('/api/calendar/appointment', (req, res) => {
    console.log('Appointment-ReadAll');
    res.status(200).send(iCal.appointments);
})

/**
 * Create a new appointment.
 * response:
 *  - (201) created appointment
 *  - (403) error message
 */
app.post('/api/calendar/appointment', (req, res) => {
    console.log('Appointment-Add');

    try {
        const appointment = iCal.createAppointment(req.query);
        res.status(201).send(appointment);
    } catch (reason) {
        res.status(403).send(reason.message);
    }
})

/**
 * Update an existing appointment.
 * response:
 *  - (200) updated appointment
 *  - (403) id is not valid
 *  - (404) appointment not found
 */
app.post('/api/calendar/appointment/:id', (req, res) => {
    const id = "" + req.params['id'];
    console.log(`Appointment-Update: ${id}`);

    let responseState = 403;
    let responseUpdatedObject: Appointment | undefined;

    if (typeof id === 'string' && id.length > 0) {
        responseUpdatedObject = iCal.updateAppointment(id, req.query);

        if (responseUpdatedObject)
            responseState = 200;
        else
            responseState = 404;
    }

    res.status(responseState).send(responseUpdatedObject);
})

/**
 * Delete an existing appointment.
 * response:
 *  - (200) deleted appointment
 *  - (403) id is not valid
 *  - (404) appointment not found
 */
app.delete('/api/calendar/appointment/:id', (req, res) => {
    const id: string = "" + req.params['id'];

    let responseState = 403;
    let responseDeletedObject: Appointment | undefined;

    if (typeof id === 'string' && id.length > 0) {
        responseDeletedObject = iCal.removeAppointment(id);

        if (responseDeletedObject)
            responseState = 200;
        else
            responseState = 404;
    }

    res.status(responseState).send(responseDeletedObject);
})


/**
 * Get all stored anniversaries.
 * response:
 *  - (200) a list of all anniversaries
 */
app.get('/api/calendar/anniversary', (req, res) => {
    console.log('Anniversary-Read by', req.ip);

    res.status(200).send(iCal.anniversaries);
})

/**
 * Create a new anniversary.
 * response:
 *  - (201) created anniversary
 *  - (403) error message
 */
app.post('/api/calendar/anniversary', (req, res) => {
    console.log('Anniversary-Add by', req.ip);

    try {
        const anniverary = iCal.createAnniversary(req.query);
        res.status(201).send(anniverary);
    } catch (reason) {
        res.status(403).send(reason.message);
    }
})

/**
 * Update an existing anniversary.
 * response:
 *  - (200) updated anniversary
 *  - (403) id is not valid
 *  - (404) anniversary not found
 */
app.post('/api/calendar/anniversary/:id', (req, res) => {
    const id = "" + req.params['id'];
    console.log(`Anniversary-Update: ${id}`);

    let responseState = 403;
    let responseUpdatedObject: Anniversary | undefined;

    if (typeof id === 'string' && id.length > 0) {
        responseUpdatedObject = iCal.updateAnniversary(id, req.query);

        if (responseUpdatedObject)
            responseState = 200;
        else
            responseState = 404;
    }

    res.status(responseState).send(responseUpdatedObject);
})

/**
 * Delete an existing anniversary.
 * response:
 *  - (200) deleted anniversary
 *  - (403) id is not valid
 *  - (404) anniversary not found
 */
app.delete('/api/calendar/anniversary/:id', (req, res) => {
    const id: string = "" + req.params['id'];

    let responseState = 403;
    let responseDeletedObject: Anniversary | undefined;

    if (typeof id === 'string' && id.length > 0) {
        responseDeletedObject = iCal.removeAnniversary(id);

        if (responseDeletedObject)
            responseState = 200;
        else
            responseState = 404;
    }

    res.status(responseState).send(responseDeletedObject);
})

app.listen(port, () => console.log(`Application started at ${port}`));