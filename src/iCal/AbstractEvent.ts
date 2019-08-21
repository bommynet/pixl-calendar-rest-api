import Alarm from "./Alarm";
import { iCalPersonObject } from "./types";


class AbstractCalendarEvent {
    public id: string;
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

    constructor(id: string, props: { [field: string]: string }) {
        if (['name', 'organizer_name', 'organizer_email'].some(key => typeof props[key] === 'undefined'))
            throw new TypeError('One or more fields are missing in "props".');

        const timestamp = new Date().toISOString();

        this.id = id;
        this.name = props['name'];
        this.description = props['description'];
        this.location = props['location'];
        this.visibility = props['visibility'] || 'PUBLIC';
        this.status = 'CONFIRMED';
        this.sequence = 0;
        this.category = props['category'];
        this.orgnizer = { name: props['organizer_name'], email: props['organizer_email'] };
        this.attendees = [];
        this.createdDate = timestamp;
        this.lastModifiedDate = timestamp;

        this.alarms = [];
    }

    public addAlarm(alarm: Alarm): void {
        this.alarms.push(alarm);
    }
}

export default AbstractCalendarEvent;