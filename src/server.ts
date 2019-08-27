import express from "express";
import cors from "cors";

import Storage from "./storage/NodePersist";

import Calendar from "./calendar/Calendar";
import Appointment from "./calendar/entities/Appointment";
import Anniversary from "./calendar/entities/Anniversary";
import { calendarToICal } from "./calendar/parser/entityToICal";

// prepare globals
const app = express();
const port = 22222;
const iCal = new Calendar(
  "Bommys Kalender",
  "-//bommynet/pixlcal//NONSGML v1.0-alpha//DE"
);
const storage = new Storage();

app.get("/api/calendar/sync", (req, res) => {
  console.log("Calendar-Sync by", req.ip);

  const iCalString = calendarToICal(iCal);

  res.set("Content-Type", "text/calendar;charset=utf-8");
  res.set("Content-Disposition", 'attachment; filename="calendar.ics"');
  res.send(iCalString);
});

/**
 * Get all stored appointments.
 * response:
 *  - (200) a list of all appointments
 */
app.get("/api/calendar/appointment", cors(), (req, res) => {
  console.log("Appointment-ReadAll");
  res.status(200).send(iCal.appointments);
});

/**
 * Create a new appointment.
 * response:
 *  - (201) created appointment
 *  - (403) error message
 */
app.post("/api/calendar/appointment", cors(), (req, res) => {
  console.log("Appointment-Add");

  try {
    const appointment = iCal.createAppointment(req.query);
    storage.store(appointment);
    storage.updateConfig(
      iCal.nextAlarmId,
      iCal.nextAnniversaryId,
      iCal.nextAppointmentId
    );
    res.status(201).send(appointment);
  } catch (reason) {
    res.status(403).send(reason.message);
  }
});

/**
 * Update an existing appointment.
 * response:
 *  - (200) updated appointment
 *  - (403) id is not valid
 *  - (404) appointment not found
 */
app.post("/api/calendar/appointment/:id", cors(), async (req, res) => {
  const id = "" + req.params["id"];
  console.log(`Appointment-Update: ${id}`, { req });

  let responseState = 403;
  let responseUpdatedObject: Appointment | undefined;

  if (typeof id === "string" && id.length > 0) {
    try {
      responseUpdatedObject = await iCal.updateAppointment(id, req.query);

      if (responseUpdatedObject) {
        storage.store(responseUpdatedObject);
        responseState = 200;
      } else {
        responseState = 404;
      }
    } catch (error) {
      responseState = 500;
    }
  }

  res.status(responseState).send(responseUpdatedObject);
});

/**
 * Delete an existing appointment.
 * response:
 *  - (200) deleted appointment
 *  - (403) id is not valid
 *  - (404) appointment not found
 */
app.delete("/api/calendar/appointment/:id", cors(), (req, res) => {
  const id: string = "" + req.params["id"];

  let responseState = 403;
  let responseDeletedObject: Appointment | undefined;

  if (typeof id === "string" && id.length > 0) {
    responseDeletedObject = iCal.removeAppointment(id);

    if (responseDeletedObject) {
      storage.store(responseDeletedObject);
      responseState = 200;
    } else responseState = 404;
  }

  res.status(responseState).send(responseDeletedObject);
});

/**
 * Get all stored anniversaries.
 * response:
 *  - (200) a list of all anniversaries
 */
app.get("/api/calendar/anniversary", cors(), (req, res) => {
  console.log("Anniversary-Read by", req.ip);

  res.status(200).send(iCal.anniversaries);
});

/**
 * Create a new anniversary.
 * response:
 *  - (201) created anniversary
 *  - (403) error message
 */
app.post("/api/calendar/anniversary", cors(), (req, res) => {
  console.log("Anniversary-Add by", req.ip);

  try {
    const anniverary = iCal.createAnniversary(req.query);

    storage.store(anniverary);
    storage.updateConfig(
      iCal.nextAlarmId,
      iCal.nextAnniversaryId,
      iCal.nextAppointmentId
    );

    res.status(201).send(anniverary);
  } catch (reason) {
    res.status(403).send(reason.message);
  }
});

/**
 * Update an existing anniversary.
 * response:
 *  - (200) updated anniversary
 *  - (403) id is not valid
 *  - (404) anniversary not found
 */
app.post("/api/calendar/anniversary/:id", cors(), async (req, res) => {
  const id = "" + req.params["id"];
  console.log(`Anniversary-Update: ${id}`);

  let responseState = 403;
  let responseUpdatedObject: Anniversary | undefined;

  if (typeof id === "string" && id.length > 0) {
    try {
      responseUpdatedObject = await iCal.updateAnniversary(id, req.query);

      if (responseUpdatedObject) {
        storage.store(responseUpdatedObject);
        responseState = 200;
      } else responseState = 404;
    } catch (error) {
      responseState = 500;
    }
  }

  res.status(responseState).send(responseUpdatedObject);
});

/**
 * Delete an existing anniversary.
 * response:
 *  - (200) deleted anniversary
 *  - (403) id is not valid
 *  - (404) anniversary not found
 */
app.delete("/api/calendar/anniversary/:id", cors(), (req, res) => {
  const id: string = "" + req.params["id"];

  let responseState = 403;
  let responseDeletedObject: Anniversary | undefined;

  if (typeof id === "string" && id.length > 0) {
    responseDeletedObject = iCal.removeAnniversary(id);

    if (responseDeletedObject) {
      storage.delete(responseDeletedObject);
      responseState = 200;
    } else responseState = 404;
  }

  res.status(responseState).send(responseDeletedObject);
});

// setup storage
storage
  .init()
  .then(config => {
    iCal.nextAppointmentId = config.appointmentId;
    iCal.nextAnniversaryId = config.anniversaryId;
    console.log("Storage ready");
  })
  .then(() => {
    console.log("Storage: load all anniversaries");
    return storage.loadAllAnniversaries();
  })
  .then(anniversaries => {
    iCal.anniversaries = anniversaries;
    console.log(`  - ${anniversaries.length} loaded.`);
    console.log("Storage: load all appointments");
    return storage.loadAllAppointments();
  })
  .then(appointments => {
    iCal.appointments = appointments;
    console.log(`  - ${appointments.length} loaded.`);
    console.log("Storage: load all alarms");
    return storage.loadAllAlarms();
  })
  .then(alarms => {
    iCal.alarms = alarms;
    console.log(`  - ${alarms.length} loaded.`);
  })
  .then(() => {
    app.listen(port, () => console.log(`Application started at ${port}`));
  })
  .catch(console.error);
