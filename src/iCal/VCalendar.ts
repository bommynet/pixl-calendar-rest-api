import VEvent from './VEvent';


function addICSLine(list, icsObject) {
    if (typeof icsObject.key !== 'string' || icsObject.key.length <= 0)
        return null;

    if (typeof icsObject.value !== 'string' || icsObject.value.length <= 0)
        return null;

    const parsedKey = icsObject.key.replace(/[\\;,\n]/g, (match) => (match === '\n' ? '\\n' : ('\\' + match)));
    const parsedValue = icsObject.value.replace(/[\\;,\n]/g, (match) => (match === '\n' ? '\\n' : ('\\' + match)));

    list.push(parsedKey + ':' + parsedValue);
}


export default class VCalendar {

    private _headers: { key: string; value: string }[];
    private _events;
    private _footer;

    public get name(): string {
        const entry = this._headers.find(entry => entry.key === 'X-WR-CALNAME');
        return (entry && entry.value) || 'unknown';
    }

    constructor(calName, calScale, version, method, prodId) {
        this._headers = [
            { key: 'BEGIN', value: 'VCALENDAR' },
            { key: 'CALSCALE', value: calScale || 'GREGORIAN' },
            { key: 'VERSION', value: version || '2.0' },
            { key: 'X-WR-CALNAME', value: calName },
            { key: 'METHOD', value: method || 'PUBLISH' },
            { key: 'PRODID', value: prodId }
        ];

        this._events = [];

        this._footer = [
            { key: 'END', value: 'VCALENDAR' }
        ];
    }

    addEvent(id, startDate, endDate, isAllDay, name, description, location, visibility, category, orgnizer, attendees, createdDate, lastModifiedDate) {
        var event = new VEvent(id, startDate, endDate, isAllDay, name, description, location, visibility, category, orgnizer, attendees, createdDate, lastModifiedDate);
        this._events.push(event);
        return event;
    }

    toICSString() {
        var lines = [];

        this._headers.forEach(header => addICSLine(lines, header));

        this._events.forEach(event => {
            event._headers.forEach(header => addICSLine(lines, header));
            event._props.forEach(prop => addICSLine(lines, prop));
            event._alarms.forEach(alarm => addICSLine(lines, alarm));
            event._footer.forEach(footer => addICSLine(lines, footer));
        });

        this._footer.forEach(footer => addICSLine(lines, footer));

        return lines.join('\r\n');
    }
}