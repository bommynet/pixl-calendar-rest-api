import Appointment from './Appointment';
import Anniversary from './Anniversary';
import Alarm from './Alarm';


export default class VCalendar {

    private _appointments: Appointment[];
    private _anniversaries: Anniversary[];
    private _nextAppointmentId: number;
    private _nextAnniversaryId: number;

    private _name: string;
    private _scale: string;
    private _version: string;
    private _method: string;
    private _prodid: string;


    public get name(): string {
        return this._name;
    }
    public get appointments(): Appointment[] {
        return this._appointments;
    }
    public get anniversaries(): Anniversary[] {
        return this._anniversaries;
    }


    public constructor(calName: string, prodId: string, calScale?: string, version?: string, method?: string) {
        this._appointments = [];
        this._anniversaries = [];

        this._nextAppointmentId = 0;
        this._nextAnniversaryId = 0;

        this._name = calName;
        this._prodid = prodId;
        this._scale = calScale || 'GREGORIAN';
        this._version = version || '2.0';
        this._method = method || 'PUBLISH';
    }


    public createAppointment(event: { [field: string]: string }, alarms: Alarm[] = []) {
        const newId = this._nextAppointmentId.toString();

        const addedEvent = new Appointment(newId, event);
        alarms.forEach(alarm => addedEvent.addAlarm(alarm));

        this._appointments.push(addedEvent);
        this._nextAppointmentId += 1;
        return addedEvent;
    }

    public updateAppointment(id: string, data: any) {
        const appointment = this._appointments.find(entry => entry.id === id);
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
                appointment.orgnizer = { name: data['organizer_name'], email: data['organizer_email'] };
                somethingUpdated = true;
            }

            if (somethingUpdated)
                appointment.lastModifiedDate = new Date().toISOString();
        }

        return somethingUpdated ? appointment : undefined;
    }

    public removeAppointment(id: string) {
        const appointmentToDelete = this._appointments.find(entry => entry.id === id);

        if (appointmentToDelete) {
            this._appointments = this._appointments.filter(entry => entry.id !== appointmentToDelete.id);
        }

        return appointmentToDelete;
    }


    public addAnniversary(event: { [field: string]: string }, alarms: Alarm[] = []) {
        const newId = this._nextAppointmentId.toString();

        const addedEvent = new Anniversary(newId, event);
        alarms.forEach(alarm => addedEvent.addAlarm(alarm));

        this._anniversaries.push(addedEvent);
        this._nextAnniversaryId += 1;
        return addedEvent;
    }

    public updateAnniversary(id: string, data: any) {
        const anniversary = this._anniversaries.find(entry => entry.id === id);
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
                anniversary.orgnizer = { name: data['organizer_name'], email: data['organizer_email'] };
                somethingUpdated = true;
            }

            if (somethingUpdated)
                anniversary.lastModifiedDate = new Date().toISOString();
        }

        return somethingUpdated ? anniversary : undefined;
    }

    public removeAnniversary(id: string) {
        const anniversaryToDelete = this._anniversaries.find(entry => entry.id === id);

        if (anniversaryToDelete) {
            this._anniversaries = this._anniversaries.filter(entry => entry.id !== anniversaryToDelete.id);
        }

        return anniversaryToDelete;
    }


    public toICSString() {
        var lines: string[] = [
            'BEGIN:VCALENDAR',
            'CALSCALE:' + this._scale,
            'VERSION:' + this._version,
            'X-WR-CALNAME:' + this._name,
            'METHOD:' + this._method,
            'PRODID:' + this._prodid,
        ];

        this._anniversaries.forEach(event => lines.push(event.toICSString()));
        this._appointments.forEach(event => lines.push(event.toICSString()));

        lines.push('END:VCALENDAR');

        console.log(lines.join('\n'));
        return lines.join('\r\n');
    }
}