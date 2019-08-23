import AbstractCalendarEvent from "./AbstractEvent";

class Alarm {
    public id: string;
    public parent: string;
    public trigger: string;
    public description: string;
    public action: string;


    constructor(parent: AbstractCalendarEvent, id: string, trigger: string, description: string, action?: string) {
        this.id = id;
        this.parent = parent.id;
        this.trigger = trigger;
        this.description = description;
        this.action = action || 'DISPLAY';
    }
}

export default Alarm;