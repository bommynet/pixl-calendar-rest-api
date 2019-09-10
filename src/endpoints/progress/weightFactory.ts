import baseFactory, { BaseEntry } from "../../factories/factory";

export interface WeightInput {
    /** date of this entry */
    date?: string;

    /** something to know about this entry */
    note?: string;

    /** this entry belongs to this person */
    person: string;

    /** weight in gramms (e.g. 90kg -> 90000) */
    weight: number;
}

export interface WeightEntry extends BaseEntry {
    /** date of this entry */
    date: string;

    /** something to know about this entry */
    note?: string;

    /** this entry belongs to this person */
    person: string;

    /** weight in gramms (e.g. 90kg -> 90000) */
    weight: number;
}

export default (endpoint: string) => (id: number, props: WeightInput) => ({
    ...baseFactory(endpoint, id),
    date: props["date"] || new Date().toISOString(),
    note: props["note"] || undefined,
    person: props["person"],
    weight: props["weight"],
});
