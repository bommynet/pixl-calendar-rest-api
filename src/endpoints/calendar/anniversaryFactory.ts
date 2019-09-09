import baseFactory from "../../factories/factory";

export interface AnniversaryEntries {
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

export default (endpoint: string) => (id: number, props: AnniversaryEntries) => ({
    ...baseFactory(endpoint, id),
    attendees: props["attendees"] || [],
    category: props["category"] || null,
    date: props["date"],
    description: props["description"] || null,
    location: props["location"] || null,
    name: props["name"],
    organizer: props["organizer"],
    status: props["status"] || "CONFIRMED",
    visibility: props["visibility"] || "PUBLIC",
});
