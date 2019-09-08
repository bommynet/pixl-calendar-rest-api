export interface WeightEntryProps {
    /** weight in gramms (e.g. 90kg -> 90000) */
    weight: number;

    /** date of this entry (will default to now/new Date()) */
    date?: string;

    /** this entry belongs to this person */
    person: string;

    /** something to know about this entry (will default to an empty string) */
    note?: string;
}

export default class WeightEntry {
    /** unique entry id */
    public id: number;

    /** unique entry id with additional information */
    public longId: string;

    /** weight in gramms (e.g. 90kg -> 90000) */
    public weight: number;

    /** date of this entry */
    public date: string;

    /** this entry belongs to this person */
    public person: string;

    /** something to know about this entry */
    public note: string;

    constructor(id: number, props: WeightEntryProps) {
        if (typeof id === "undefined") throw new TypeError("id has to be defined");

        if (typeof props.weight !== "number" || props.weight < 0)
            throw new TypeError("weight has to be defined as positive integer");

        if (typeof props.person !== "string" || props.person.length <= 0)
            throw new TypeError("person has to be defined as non-empty string");

        if (typeof id === "undefined") throw new TypeError("id has to be defined");

        this.id = id;
        this.longId = "weight-" + id;
        this.weight = props.weight;
        this.date = props.date || new Date().toISOString();
        this.person = props.person;
        this.note = props.note || "";
    }
}
