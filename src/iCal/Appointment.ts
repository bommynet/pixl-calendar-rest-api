import AbstractCalendarEvent from "./AbstractEvent";

export default class Appointment extends AbstractCalendarEvent {

    public begin: string;
    public end: string;

    public constructor(id: string, props: { [field: string]: string }) {
        super(id, props);

        if (['begin', 'end'].some(key => typeof props[key] === 'undefined'))
            throw new TypeError('One or more fields are missing in "props".');

        this.begin = props['begin'];
        this.end = props['end'];
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