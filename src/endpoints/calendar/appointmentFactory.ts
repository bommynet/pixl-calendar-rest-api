import baseFactory, { BaseEntry } from "../../factories/factory";

export interface AppointmentInput {
    attendees?: { name: string; email: string }[];
    category?: string;
    begin: string;
    end: string;
    description?: string;
    location?: string;
    name: string;
    organizer: { name: string; email: string };
    status?: string;
    visibility?: string;
}

export interface AppointmentEntry extends BaseEntry {
    attendees: { name: string; email: string }[];
    category?: string;
    begin: string;
    end: string;
    description?: string;
    location?: string;
    name: string;
    organizer: { name: string; email: string };
    status: string;
    visibility: string;
}

export default (endpoint: string) => (id: number, props: AppointmentInput): AppointmentEntry => ({
    ...baseFactory(endpoint, id),
    attendees: props["attendees"] || [],
    category: props["category"] || undefined,
    begin: props["date"],
    end: props["date"],
    description: props["description"] || undefined,
    location: props["location"] || undefined,
    name: props["name"],
    organizer: props["organizer"],
    status: props["status"] || "CONFIRMED",
    visibility: props["visibility"] || "PUBLIC",
});
