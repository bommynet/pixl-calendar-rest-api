import Appointment, { AppointmentProbs } from './Appointment';
import Anniversary, { AnniversaryProbs } from './Anniversary';
import Alarm from './Alarm';


export default class VCalendar {

    private _appointments: Appointment[];
    private _anniversaries: Anniversary[];

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

        this._name = calName;
        this._prodid = prodId;
        this._scale = calScale || 'GREGORIAN';
        this._version = version || '2.0';
        this._method = method || 'PUBLISH';
    }


    public addAppointment(event: AppointmentProbs, alarms: Alarm[] = []) {
        var addedEvent = new Appointment(event);
        alarms.forEach(alarm => addedEvent.addAlarm(alarm));

        this._appointments.push(addedEvent);
        return addedEvent;
    }

    public addAnniversary(event: AnniversaryProbs, alarms: Alarm[] = []) {
        var addedEvent = new Anniversary(event);
        alarms.forEach(alarm => addedEvent.addAlarm(alarm));

        this._anniversaries.push(addedEvent);
        return addedEvent;
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