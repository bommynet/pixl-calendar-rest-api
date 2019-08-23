import Alarm from "../entities/Alarm";
import Anniversary from "../entities/Anniversary";
import Appointment from "../entities/Appointment";
import Calendar from "../Calendar";

export function calendarToICal(calendar: Calendar): string {
    var lines: string[] = [
        'BEGIN:VCALENDAR',
        'CALSCALE:' + calendar.scale,
        'VERSION:' + calendar.version,
        'X-WR-CALNAME:' + calendar.name,
        'METHOD:' + calendar.method,
        'PRODID:' + calendar.prodid,

        ...calendar.anniversaries.map(anniversaryToICal),
        ...calendar.appointments.map(appointmentToICal),

        'END:VCALENDAR'
    ];

    console.log(lines.join('\n'));
    return lines.join('\r\n');
}

export function alarmToICal(alarm: Alarm): string {
    const lines: string[] = [
        'BEGIN:VALARM',
        'X-WR-ALARMUID:' + alarm.id,
        'UID:' + alarm.id,
        'TRIGGER:' + alarm.trigger,
        'DESCRIPTION:' + alarm.description,
        'ACTION:' + alarm.action,
        'END:VALARM',
    ];

    return lines.join('\r\n');
}

export function anniversaryToICal(anniversary: Anniversary): string {
    const shrunkdate = anniversary.date.substring(0, anniversary.date.indexOf('T'));

    const lines: string[] = [
        'BEGIN:VEVENT',
        'TRANSP:TRANSPARENT',
        'UID:' + anniversary.id,
        'DTSTAMP:' + anniversary.date,
        'DTSTART;VALUE=DATE:' + shrunkdate,
        'DTEND;VALUE=DATE:' + shrunkdate,
        'SUMMARY:' + anniversary.name,
        'CLASS:' + anniversary.visibility,
        'STATUS:' + anniversary.status,
        'SEQUENCE:' + anniversary.sequence,
        'CREATED:' + anniversary.createdDate,
        'LAST-MODIFIED:' + anniversary.lastModifiedDate,
        `ORGANIZER;CN=${anniversary.organizer.name}:MAILTO:${anniversary.organizer.email}`
    ];

    // optional Entries
    if (anniversary.category)
        lines.push('CATEGORIES:' + anniversary.category);
    if (anniversary.description)
        lines.push('DESCRIPTION:' + anniversary.description);
    if (anniversary.location)
        lines.push('LOCATION:' + anniversary.location);

    anniversary.attendees.forEach(attendee => {
        lines.push(`ATTENDEE;CN=${attendee.name}:MAILTO:${attendee.email}`);
    });

    lines.push('END:VEVENT');

    return lines.join('\r\n');
}

export function appointmentToICal(appointment: Appointment): string {
    const lines: string[] = [
        'BEGIN:VEVENT',
        'TRANSP:TRANSPARENT',
        'UID:' + appointment.id,
        'DTSTAMP:' + appointment.begin,
        'DTSTART;VALUE=DATE:' + appointment.begin,
        'DTEND;VALUE=DATE:' + appointment.end,
        'SUMMARY:' + appointment.name,
        'CLASS:' + appointment.visibility,
        'STATUS:' + appointment.status,
        'SEQUENCE:' + appointment.sequence,
        'CREATED:' + appointment.createdDate,
        'LAST-MODIFIED:' + appointment.lastModifiedDate,
        `ORGANIZER;CN=${appointment.organizer.name}:MAILTO:${appointment.organizer.email}`
    ];

    // optional Entries
    if (appointment.category)
        lines.push('CATEGORIES:' + appointment.category);
    if (appointment.description)
        lines.push('DESCRIPTION:' + appointment.description);
    if (appointment.location)
        lines.push('LOCATION:' + appointment.location);

    appointment.attendees.forEach(attendee => {
        lines.push(`ATTENDEE;CN=${attendee.name}:MAILTO:${attendee.email}`);
    });

    lines.push('END:VEVENT');

    return lines.join('\r\n');
}