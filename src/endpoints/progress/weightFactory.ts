import baseFactory from "../../factories/factory";

export interface WeightEntries {
    /** date of this entry */
    date?: string;

    /** something to know about this entry */
    note?: string;

    /** this entry belongs to this person */
    person: string;

    /** weight in gramms (e.g. 90kg -> 90000) */
    weight: number;
}

export default (endpoint: string) => (id: number, props: WeightEntries) => ({
    ...baseFactory(endpoint, id),
    date: props["date"] || new Date().toISOString(),
    note: props["note"] || null,
    person: props["person"],
    weight: props["weight"],
});
