export interface iCalAttendee {
    name: string;
    email: string;
}



function _formatDate(date, isAllDay) {
    const noMsDate = new Date(date.getTime());
    noMsDate.setMilliseconds(0);

    const noMsDateISOString = noMsDate.toISOString();
    const icsDateString = noMsDateISOString.replace(/-/g, '').replace(/:/g, '').replace(/\.000/g, '');

    return isAllDay ? icsDateString.substring(0, icsDateString.indexOf('T')) : icsDateString;
}

export default class VEvent {

    private _headers: { key: string; value: string }[];
    private _props: { key: string; value: string }[];
    private _alarms: { key: string; value: string }[][];
    private _footer: { key: string; value: string }[];

    constructor(id, startDate, endDate, isAllDay, name, description, location, visibility, category, orgnizer, attendees: iCalAttendee[], createdDate, lastModifiedDate) {
        this._headers = [
            { key: 'BEGIN', value: 'VEVENT' }
        ];
        this._props = [
            { key: 'TRANSP', value: 'TRANSPARENT' },
            { key: 'UID', value: id },
            { key: 'DTSTAMP', value: _formatDate(startDate, false) },
            { key: 'DTSTART' + (isAllDay ? ';VALUE=DATE' : ''), value: _formatDate(startDate, isAllDay) },
            { key: 'DTEND' + (isAllDay ? ';VALUE=DATE' : ''), value: _formatDate(endDate, isAllDay) },
            { key: 'SUMMARY', value: name },
            { key: 'DESCRIPTION', value: description },
            { key: 'LOCATION', value: location },
            { key: 'CLASS', value: visibility || 'PUBLIC' },
            { key: 'CATEGORIES', value: category },
            { key: 'STATUS', value: 'CONFIRMED' },
            { key: 'SEQUENCE', value: 0 },
            { key: 'CREATED', value: _formatDate(createdDate, false) },
            { key: 'LAST-MODIFIED', value: _formatDate(lastModifiedDate, false) },
            { key: 'ORGANIZER;CN=' + orgnizer.name, value: orgnizer.email }
        ];

        attendees.forEach(attendee => {
            this._props.push({ key: 'ATTENDEE;CN=' + attendee.name, value: attendee.email });
        });

        this._alarms = [];
        this._footer = [
            { key: 'END', value: 'VEVENT' }
        ];
    }

    addAlarm(id, trigger, description, action) {
        var alarm = [
            { key: 'BEGIN', value: 'VALARM' },
            { key: 'X-WR-ALARMUID', value: id },
            { key: 'UID', value: id },
            { key: 'TRIGGER', value: trigger },
            { key: 'DESCRIPTION', value: description },
            { key: 'ACTION', value: action || 'DISPLAY' },
            { key: 'END', value: 'VALARM' }
        ];
        this._alarms.push(alarm);
    }
}