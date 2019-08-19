import Alarm from "./Alarm";
import { iCalPersonObject } from "./types";

export interface AppointmentProbs {
    id: string;
    begin: Date;
    end: Date;
    name: string;
    description?: string;
    location?: string;
    visibility?: string;
    category?: string;
    orgnizer: iCalPersonObject;
    attendees: iCalPersonObject[];
    createdDate: Date;
    lastModifiedDate: Date;
}


export default class Appointment {

    public id: string;
    public begin: Date;
    public end: Date;
    public name: string;
    public description?: string;
    public location?: string;
    public visibility?: string;
    public status: string;
    public sequence: number;
    public category?: string;
    public orgnizer: iCalPersonObject;
    public attendees: iCalPersonObject[];
    public createdDate: Date;
    public lastModifiedDate: Date;

    public alarms: Alarm[];


    public constructor(props: AppointmentProbs) {
        this.id = props.id;
        this.begin = props.begin;
        this.end = props.end;
        this.name = props.name;
        this.description = props.description;
        this.location = props.location;
        this.visibility = props.visibility || 'PUBLIC';
        this.status = 'CONFIRMED';
        this.sequence = 0;
        this.category = props.category;
        this.orgnizer = props.orgnizer;
        this.attendees = props.attendees;
        this.createdDate = props.createdDate;
        this.lastModifiedDate = props.lastModifiedDate;

        // there is no use for milliseconds in iCal
        this.begin.setMilliseconds(0);
        this.end.setMilliseconds(0);
        this.createdDate.setMilliseconds(0);
        this.lastModifiedDate.setMilliseconds(0);

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
            'DTSTAMP:' + this.begin.toISOString(),
            'DTSTART;VALUE=DATE:' + this.begin.toISOString(),
            'DTEND;VALUE=DATE:' + this.end.toISOString(),
            'SUMMARY:' + this.name,
            'CLASS:' + this.visibility,
            'STATUS:' + this.status,
            'SEQUENCE:' + this.sequence,
            'CREATED:' + this.createdDate.toISOString(),
            'LAST-MODIFIED:' + this.lastModifiedDate.toISOString(),
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