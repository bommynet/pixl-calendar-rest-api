import baseFactory from "../../factories/factory";

export interface AppointmentEntries {
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

export default (endpoint: string) => (id: number, props: AppointmentEntries) => ({
    ...baseFactory(endpoint, id),
    attendees: props["attendees"] || [],
    category: props["category"] || null,
    begin: props["date"],
    end: props["date"],
    description: props["description"] || null,
    location: props["location"] || null,
    name: props["name"],
    organizer: props["organizer"],
    status: props["status"] || "CONFIRMED",
    visibility: props["visibility"] || "PUBLIC",
});
