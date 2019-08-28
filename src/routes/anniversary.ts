import Anniversary from "../calendar/entities/Anniversary";

export default (app, storage, nextId = 0) => {
    let nextAnniversaryId = nextId;

    /**
     * Get all stored anniversaries.
     * response:
     *  - (200) a list of all anniversaries
     *  - (500) error loading anniversaries
     */
    app.get("/api/calendar/anniversary", (req, res) => {
        console.log("Anniversary-ReadAll");

        storage
            .loadAllAnniversaries()
            .then((anniversaries) => res.status(200).send(anniversaries))
            .catch((error) => res.status(500).send(error));
    });

    /**
     * Create a new anniversary.
     * response:
     *  - (202) created anniversary
     *  - (403) error message
     */
    app.post("/api/calendar/anniversary", (req, res) => {
        console.log("Anniversary-Add");

        const currentId = nextAnniversaryId;
        nextAnniversaryId += 1;

        const anniversary = new Anniversary(currentId, req.query);

        try {
            storage.store(anniversary);
            storage.updateConfig({ anniversaryId: nextAnniversaryId });
            res.status(202).send(anniversary);
        } catch (reason) {
            res.status(403).send(reason.message);
        }
    });

    /**
     * Update an existing anniversary.
     * response:
     *  - (202) updated anniversary
     *  - (403) id is not valid
     *  - (404) anniversary not found
     */
    app.post("/api/calendar/anniversary/:id", async (req, res) => {
        const id = req.params["id"];
        console.log(`Anniversary-Update: ${id}`, { params: req.params, query: req.query, body: req.body });

        const newData = req.body;

        let responseState = 403;
        let responseData: any;

        if (typeof id === "string" && id.length > 0) {
            const anniversaryId = "anniversary-" + id;

            try {
                const loadedData = await storage.read(anniversaryId);

                const updatedData = {
                    ...loadedData,
                    ...newData,
                };

                storage.store(updatedData);
                responseState = 202;
                responseData = updatedData;
            } catch (error) {
                responseState = 404;
                responseData;
            }
        }

        res.status(responseState).send(responseData);
    });

    /**
     * Delete an existing anniversary.
     * response:
     *  - (202) deleted anniversary
     *  - (403) id is not valid
     *  - (404) anniversary not found
     */
    app.delete("/api/calendar/anniversary/:id", async (req, res) => {
        const id: string = "" + req.params["id"];

        let responseState = 403;
        let responseData: any;

        if (typeof id === "string" && id.length > 0) {
            const anniversaryId = "anniversary-" + id;

            try {
                const anniversary = await storage.read(anniversaryId);
                storage.delete(anniversary);

                responseState = 202;
                responseData = anniversary;
            } catch (error) {
                responseState = 404;
                responseData = error;
            }
        }

        res.status(responseState).send(responseData);
    });
};
