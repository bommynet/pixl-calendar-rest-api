import Alarm from "./Alarm";
import { iCalPersonObject } from "./types";


export default class Appointment {

    public id: string;
    public begin: string;
    public end: string;
    public name: string;
    public description?: string;
    public location?: string;
    public visibility?: string;
    public status: string;
    public sequence: number;
    public category?: string;
    public orgnizer: iCalPersonObject;
    public attendees: iCalPersonObject[];
    public createdDate: string;
    public lastModifiedDate: string;

    public alarms: Alarm[];


    public constructor(id: string, props: { [field: string]: string }) {
        if (['begin', 'end', 'name', 'organizer_name', 'organizer_email'].some(key => typeof props[key] === 'undefined'))
            throw new TypeError('One or more fields are missing in "props".');

        const timestamp = new Date().toISOString();

        this.id = id;
        this.begin = props['begin'];
        this.end = props['end'];
        this.name = props['name'];
        this.description = props['description'];
        this.location = props['location'];
        this.visibility = props['visibility'] || 'PUBLIC';
        this.status = 'CONFIRMED';
        this.sequence = 0;
        this.category = props['category'];
        this.orgnizer = { name: props['organizer_name'], email: props['organizer_email'] };
        this.attendees = [];
        this.createdDate = timestamp,
        this.lastModifiedDate = timestamp,

        this.alarms = [];
    }


    public addAlarm(alarm: Alarm): void {
        this.alarms.push(alarm);
    }


    public toICSString(): string {
        const lines: string[] = [
            'BEGIN:VEVENT',
            'TRANSP:TRANSPARENT',
            'UID:' + this.id,
            'DTSTAMP:' + this.begin,
            'DTSTART;VALUE=DATE:' + this.begin,
            'DTEND;VALUE=DATE:' + this.end,
            'SUMMARY:' + this.name,
            'CLASS:' + this.visibility,
            'STATUS:' + this.status,
            'SEQUENCE:' + this.sequence,
            'CREATED:' + this.createdDate,
            'LAST-MODIFIED:' + this.lastModifiedDate,
            `ORGANIZER;CN=${this.orgnizer.name}:MAILTO:${this.orgnizer.email}`
        ];

        // optional Entries
        if (this.category)
            lines.push('CATEGORIES:' + this.category);
        if (this.description)
            lines.push('DESCRIPTION:' + this.description);
        if (this.location)
            lines.push('LOCATION:' + this.location);

        this.attendees.forEach(attendee => {
            lines.push(`ATTENDEE;CN=${attendee.name}:MAILTO:${attendee.email}`);
        });

        this.alarms.forEach(alarm => lines.push(alarm.toICSString()));

        lines.push('END:VEVENT');

        return lines.join('\r\n');
    }
}