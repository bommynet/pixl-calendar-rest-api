import AbstractCalendarEvent from "./AbstractEvent";

export default class Anniversary extends AbstractCalendarEvent {

    public date: string;

    public constructor(id: string, props: { [field: string]: string }) {
        super(id, props);

        if (typeof props['date'] === 'undefined')
            throw new TypeError('One or more fields are missing in "props".');
            
        this.date = props['date'];
    }

    public toICSString(): string {
        const shrunkdate = this.date.substring(0, this.date.indexOf('T'));

        const lines: string[] = [
            'BEGIN:VEVENT',
            'TRANSP:TRANSPARENT',
            'UID:' + this.id,
            'DTSTAMP:' + this.date,
            'DTSTART;VALUE=DATE:' + shrunkdate,
            'DTEND;VALUE=DATE:' + shrunkdate,
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