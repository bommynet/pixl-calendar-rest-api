import AbstractCalendarEvent from "./AbstractEvent";

export default class Anniversary extends AbstractCalendarEvent {

    public date: string;

    public constructor(id: string, props: { [field: string]: string }) {
        super(id, props);

        if (typeof props['date'] === 'undefined')
            throw new TypeError('[Anniversary] One or more fields are missing in "props".');
            
        this.date = props['date'];
    }
}