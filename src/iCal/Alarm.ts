
class Alarm {
    public id: string;
    public trigger: string;
    public description: string;
    public action: string;


    constructor(id: string, trigger: string, description: string, action?: string) {
        this.id = id;
        this.trigger = trigger;
        this.description = description;
        this.action = action || 'DISPLAY';
    }


    public toICSString(): string {
        const lines: string[] = [
            'BEGIN:VALARM',
            'X-WR-ALARMUID:' + this.id,
            'UID:' + this.id,
            'TRIGGER:' + this.trigger,
            'DESCRIPTION:' + this.description,
            'ACTION:' + this.action,
            'END:VALARM',
        ];

        return lines.join('\r\n');
    }
}

export default Alarm;