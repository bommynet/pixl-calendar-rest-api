import AbstractCalendarEvent from "./AbstractEvent";

export default class Appointment extends AbstractCalendarEvent {
    public begin: string;
    public end: string;
    public longId: string;

    public constructor(id: number, props: { [field: string]: string }) {
        super("" + id, props);

        if (["begin", "end"].some((key) => typeof props[key] === "undefined"))
            throw new TypeError('[Appointment] One or more fields are missing in "props".');

        this.begin = props["begin"];
        this.end = props["end"];
        this.longId = "appointment-" + id;
    }
}
