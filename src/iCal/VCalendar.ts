import Appointment from './entities/Appointment';
import Anniversary from './entities/Anniversary';
import Alarm from './entities/Alarm';

import Storage from '../storage/NodePersist';


export default class VCalendar {

    private _storage: Storage;

    private _appointments: Appointment[];
    private _anniversaries: Anniversary[];
    private _nextAppointmentId: number;
    private _nextAnniversaryId: number;

    public name: string;
    public scale: string;
    public version: string;
    public method: string;
    public prodid: string;


    public get appointments(): Appointment[] {
        return this._appointments;
    }
    public get anniversaries(): Anniversary[] {
        return this._anniversaries;
    }


    public constructor(calName: string, prodId: string, calScale?: string, version?: string, method?: string) {
        this._storage = new Storage();

        this._appointments = [];
        this._anniversaries = [];

        this._nextAppointmentId = 0;
        this._nextAnniversaryId = 0;

        this.name = calName;
        this.prodid = prodId;
        this.scale = calScale || 'GREGORIAN';
        this.version = version || '2.0';
        this.method = method || 'PUBLISH';


        // setup storage
        this._storage.init()
            .then((config) => {
                this._nextAppointmentId = config.appointmentId;
                this._nextAnniversaryId = config.anniversaryId;
                console.log('Storage ready');
            })
            .then(() => {
                console.log('Storage: load all anniversaries');
                return this._storage.loadAllAnniversaries();
            })
            .then((anniversaries) => {
                this._anniversaries = anniversaries;
                console.log(`  - ${anniversaries.length} loaded.`);
                console.log('Storage: load all appointments');
                return this._storage.loadAllAppointments();
            })
            .then((appointments) => {
                this._appointments = appointments;
                console.log(`  - ${appointments.length} loaded.`);
            })
            .catch(console.error);
    }


    public createAppointment(props: { [field: string]: string }, alarms: Alarm[] = []) {
        const newId = this._nextAppointmentId.toString();

        const addedEvent = new Appointment(`appointment-${newId}`, props);
        alarms.forEach(alarm => addedEvent.addAlarm(alarm));

        this._appointments.push(addedEvent);
        this._nextAppointmentId += 1;

        // setup storage
        this._storage.store(addedEvent);
        this._storage.updateConfig(this._nextAnniversaryId, this._nextAppointmentId);

        return addedEvent;
    }

    public updateAppointment(id: string, data: any) {
        const appointment = this._appointments.find(entry => entry.id === `appointment-${id}`);
        let somethingUpdated = false;

        if (appointment) {
            /// TODO: validate data input
            if (data['begin']) {
                appointment.begin = data['begin'];
                somethingUpdated = true;
            } if (data['end']) {
                appointment.end = data['end'];
                somethingUpdated = true;
            } if (data['name']) {
                appointment.name = data['name'];
                somethingUpdated = true;
            } if (data['description']) {
                appointment.description = data['description'];
                somethingUpdated = true;
            } if (data['organizer_name'] && data['organizer_email']) {
                appointment.organizer = { name: data['organizer_name'], email: data['organizer_email'] };
                somethingUpdated = true;
            }

            if (somethingUpdated)
                appointment.lastModifiedDate = new Date().toISOString();
        }

        return somethingUpdated ? appointment : undefined;
    }

    public removeAppointment(id: string) {
        const appointmentToDelete = this._appointments.find(entry => entry.id === `appointment-${id}`);

        if (appointmentToDelete) {
            this._appointments = this._appointments.filter(entry => entry.id !== appointmentToDelete.id);
        }

        return appointmentToDelete;
    }


    public createAnniversary(event: { [field: string]: string }, alarms: Alarm[] = []) {
        const newId = this._nextAnniversaryId.toString();

        const addedEvent = new Anniversary(`anniversary-${newId}`, event);
        alarms.forEach(alarm => addedEvent.addAlarm(alarm));

        this._anniversaries.push(addedEvent);
        this._nextAnniversaryId += 1;

        // setup storage
        this._storage.store(addedEvent);
        this._storage.updateConfig(this._nextAnniversaryId, this._nextAppointmentId);

        return addedEvent;
    }

    public updateAnniversary(id: string, data: any) {
        const anniversary = this._anniversaries.find(entry => entry.id === `anniversary-${id}`);
        let somethingUpdated = false;

        if (anniversary) {
            /// TODO: validate data input
            if (data['date']) {
                anniversary.date = data['date'];
                somethingUpdated = true;
            } if (data['name']) {
                anniversary.name = data['name'];
                somethingUpdated = true;
            } if (data['description']) {
                anniversary.description = data['description'];
                somethingUpdated = true;
            } if (data['organizer_name'] && data['organizer_email']) {
                anniversary.organizer = { name: data['organizer_name'], email: data['organizer_email'] };
                somethingUpdated = true;
            }

            if (somethingUpdated)
                anniversary.lastModifiedDate = new Date().toISOString();
        }

        return somethingUpdated ? anniversary : undefined;
    }

    public removeAnniversary(id: string) {
        const anniversaryToDelete = this._anniversaries.find(entry => entry.id === `anniversary-${id}`);

        if (anniversaryToDelete) {
            this._anniversaries = this._anniversaries.filter(entry => entry.id !== anniversaryToDelete.id);
        }

        return anniversaryToDelete;
    }
}