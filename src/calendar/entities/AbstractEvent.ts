import Alarm from "./Alarm";
import { iCalPersonObject } from "../../types";


class AbstractCalendarEvent {
    public id: string;
    public name: string;
    public description?: string;
    public location?: string;
    public visibility?: string;
    public status: string;
    public sequence: number;
    public category?: string;
    public organizer: iCalPersonObject;
    public attendees: iCalPersonObject[];
    public createdDate: string;
    public lastModifiedDate: string;

    public alarms: Alarm[];

    constructor(id: string, props: { [field: string]: string }) {
        const missingFields = ['name', 'organizer_name', 'organizer_email'].filter(key => typeof props[key] === 'undefined');

        if (missingFields.length > 0)
            throw new TypeError(`[AbstractEvent] One or more fields are missing in "props": ${missingFields.join(',')}`);

        const timestamp = new Date().toISOString();

        this.id = id;
        this.name = props['name'];
        this.description = props['description'];
        this.location = props['location'];
        this.visibility = props['visibility'] || 'PUBLIC';
        this.status = 'CONFIRMED';
        this.sequence = 0;
        this.category = props['category'];
        this.organizer = { name: props['organizer_name'], email: props['organizer_email'] };
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