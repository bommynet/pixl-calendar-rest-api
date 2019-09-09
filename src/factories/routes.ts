/**
 * @param app
 *      Express instance
 * @param storage
 *      Storage handler
 * @param category
 * @param endpoint
 * @param factory
 *      Object factory to validate entries for `/api/<category>/<endpoint>`
 */
export default async (app, storage, category, endpoint, factory): Promise<void> => {
    const apiEndpoint = `/api/${category}/${endpoint}`;
    const toLongId = (id: number) => `${endpoint}-${id}`;

    let nextEntryId: number;

    try {
        const config = await storage.loadConfig();
        nextEntryId = config.nextEntryId;
    } catch (error) {
        nextEntryId = 0;
    }

    /**
     * Get all stored entries.
     * response:
     *  - (200) a list of all entries
     *  - (500) error loading entries
     */
    app.get(apiEndpoint, (req, res) => {
        console.log("read all:", endpoint);

        storage
            .loadAll()
            .then((entries) => res.status(200).send(entries))
            .catch((error) => res.status(500).send(error));
    });

    /**
     * Get one stored entry.
     * response:
     *  - (200) the entry
     *  - (500) error loading entry
     */
    app.get(`${apiEndpoint}/:id`, (req, res) => {
        const longId = toLongId(req.params["id"]);

        console.log("read one:", endpoint, longId);

        storage
            .read(longId)
            .then((entry) => res.status(200).send(entry))
            .catch((error) => res.status(500).send(error));
    });

    /**
     * Create a new entry.
     * response:
     *  - (202) created entry
     *  - (403) error message
     */
    app.post(apiEndpoint, async (req, res) => {
        console.log("create:", endpoint);

        let entry;

        try {
            entry = factory(nextEntryId, req.body);
            nextEntryId++;
            await storage.updateConfig({ nextEntryId });
        } catch (reason) {
            res.status(403).send(reason.message);
            return;
        }

        try {
            await storage.store(entry);
            res.status(202).send(entry);
        } catch (reason) {
            res.status(403).send(reason.message);
        }
    });

    /**
     * Update an existing entry.
     * response:
     *  - (202) updated entry
     *  - (403) id is not valid
     *  - (404) entry not found
     */
    app.post(`${apiEndpoint}/:id`, async (req, res) => {
        const longId = toLongId(req.params["id"]);

        console.log("update:", endpoint, longId);

        const newData = req.body;

        let responseState = 403;
        let responseData: any;

        try {
            const loadedData = await storage.read(longId);

            const updatedData = {
                ...loadedData,
                ...newData,
            };

            await storage.store(updatedData);
            responseState = 202;
            responseData = updatedData;
        } catch (reason) {
            responseState = 404;
            responseData = reason.message;
        }

        res.status(responseState).send(responseData);
    });

    /**
     * Delete an existing entry.
     * response:
     *  - (202) deleted entry
     *  - (403) id is not valid
     *  - (404) entry not found
     */
    app.delete(`${apiEndpoint}/:id`, async (req, res) => {
        const longId = toLongId(req.params["id"]);

        console.log("update:", endpoint, longId);

        let responseState = 403;
        let responseData: any;

        try {
            const anniversary = await storage.delete(longId);
            responseState = 202;
            responseData = anniversary;
        } catch (error) {
            responseState = 404;
            responseData = error;
        }

        res.status(responseState).send(responseData);
    });
};
