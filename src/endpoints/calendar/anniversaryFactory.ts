import baseFactory, { BaseEntry } from "../../factories/factory";

export interface AnniversaryInput {
    attendees?: { name: string; email: string }[];
    category?: string;
    date: string;
    description?: string;
    location?: string;
    name: string;
    organizer: { name: string; email: string };
    status?: string;
    visibility?: string;
}

export interface AnniversaryEntry extends BaseEntry {
    attendees: { name: string; email: string }[];
    category?: string;
    date: string;
    description?: string;
    location?: string;
    name: string;
    organizer: { name: string; email: string };
    status?: string;
    visibility?: string;
}

export default (endpoint: string) => (id: number, props: AnniversaryInput): AnniversaryEntry => ({
    ...baseFactory(endpoint, id),
    attendees: props["attendees"] || [],
    category: props["category"] || undefined,
    date: props["date"],
    description: props["description"] || undefined,
    location: props["location"] || undefined,
    name: props["name"],
    organizer: props["organizer"],
    status: props["status"] || "CONFIRMED",
    visibility: props["visibility"] || "PUBLIC",
});
