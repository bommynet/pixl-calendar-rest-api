import VEvent, { iCalEventProps, iCalEventAlarm } from './VEvent';


export function addICSLine(list, icsObject) {
    if (typeof icsObject.key !== 'string' || icsObject.key.length <= 0)
        return null;

    if (typeof icsObject.value !== 'string' || icsObject.value.length <= 0)
        return null;

    const parsedKey = icsObject.key.replace(/[\\,\n]/g, (match) => (match === '\n' ? '\\n' : ('\\' + match)));
    const parsedValue = icsObject.value.replace(/[\\,\n]/g, (match) => (match === '\n' ? '\\n' : ('\\' + match)));

    list.push(parsedKey + ':' + parsedValue);
}


export default class VCalendar {

    private _events: VEvent[];

    private _name: string;
    private _scale: string;
    private _version: string;
    private _method: string;
    private _prodid: string;


    public get name(): string {
        return this._name;
    }


    public constructor(calName: string, prodId: string, calScale?: string, version?: string, method?: string) {
        this._events = [];

        this._name = calName;
        this._prodid = prodId;
        this._scale = calScale || 'GREGORIAN';
        this._version = version || '2.0';
        this._method = method || 'PUBLISH';
    }


    public addEvent(event: iCalEventProps, alarms: iCalEventAlarm[] = []) {
        var addedEvent = new VEvent(event);

        alarms.forEach(alarm => addedEvent.addAlarm(alarm));

        this._events.push(addedEvent);
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

        this._events.forEach(event => lines.push(event.toICSStrings()));

        lines.push('END:VCALENDAR');

        console.log(lines.join('\n'));
        return lines.join('\r\n');
    }
}