import { addICSLine } from "./VCalendar";

export interface iCalPersonObject {
    name: string;
    email: string;
}

export interface iCalEventProps {
    id: string;
    startDate: Date;
    endDate: Date;
    isAllDay: boolean;
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

export interface iCalEventAlarm {
    id: string;
    trigger: string;
    description: string;
    action?: string;
}


function _formatDate(date, isAllDay) {
    const noMsDate = new Date(date.getTime());
    noMsDate.setMilliseconds(0);

    const noMsDateISOString = noMsDate.toISOString();
    const icsDateString = noMsDateISOString.replace(/-/g, '').replace(/:/g, '').replace(/\.000/g, '');

    return isAllDay ? icsDateString.substring(0, icsDateString.indexOf('T')) : icsDateString;
}


export default class VEvent {

    private _props: iCalEventProps;

    private _alarms: iCalEventAlarm[];


    public constructor(props: iCalEventProps) {
        this._props = props;
        this._alarms = [];
    }


    public addAlarm(alarm:iCalEventAlarm):void {
        this._alarms.push(alarm);
    }

    
    public toICSStrings(): string {
        const isAllDay = this._props.isAllDay;

        const lines: string[] = [
            'TRANSP:TRANSPARENT',
            'UID:' + this._props.id,
            'DTSTAMP:' + _formatDate(this._props.startDate, false),
            'DTSTART' + (isAllDay ? ';VALUE=DATE' : '') + ':' + _formatDate(this._props.startDate, isAllDay),
            'DTEND' + (isAllDay ? ';VALUE=DATE' : '') + ':' + _formatDate(this._props.endDate, isAllDay),
            'SUMMARY:' + this._props.name,
            'CLASS:' + (this._props.visibility || 'PUBLIC'),
            'STATUS:CONFIRMED',
            'SEQUENCE:0',
            'CREATED:' + _formatDate(this._props.createdDate, false),
            'LAST-MODIFIED:' + _formatDate(this._props.lastModifiedDate, false),
            `ORGANIZER;CN=${this._props.orgnizer.name}:MAILTO:${this._props.orgnizer.email}`
        ];

        // optional Entries
        if (this._props.category)
            lines.push('CATEGORIES:' + this._props.category);
        if (this._props.description)
            lines.push('DESCRIPTION:' + this._props.description);
        if (this._props.location)
            lines.push('LOCATION:' + this._props.location);

        this._props.attendees.forEach(attendee => {
            lines.push(`ATTENDEE;CN=${attendee.name}:MAILTO:${attendee.email}`);
        });

        this._alarms.forEach(alarm => {
            lines.push('BEGIN:VALARM');
            lines.push('X-WR-ALARMUID:' + alarm.id);
            lines.push('UID:' + alarm.id);
            lines.push('TRIGGER:' + alarm.trigger);
            lines.push('DESCRIPTION:' + alarm.description);
            lines.push('ACTION:' + (alarm.action || 'DISPLAY'));
            lines.push('END:VALARM');
        })

        lines.unshift('BEGIN:VEVENT');
        lines.push('END:VEVENT');

        return lines.join('\r\n');
    }
}