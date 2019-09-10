export interface BaseEntry {
    id: number;
    longId: string;
    sequence: number;
    createdDate: string;
    lastModifiedDate: string;
}

export default (endpoint: string, id: number) => ({
    id: id,
    longId: `${endpoint}-${id}`,
    sequence: 0,
    createdDate: new Date().toISOString(),
    lastModifiedDate: new Date().toISOString(),
});
