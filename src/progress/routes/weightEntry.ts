import WeightEntry from "../entities/WeightEntry";

export default (app, storage, nextId = 0) => {
    let nextWeightId = nextId;

    /**
     * Get all stored weight entries.
     * response:
     *  - (200) a list of all weight entries
     *  - (500) error loading weight entries
     */
    app.get("/api/progress/weight", (req, res) => {
        console.log("Weight-ReadAll");

        storage
            .loadAllWeights()
            .then((entries) => res.status(200).send(entries))
            .catch((error) => res.status(500).send(error));
    });

    /**
     * Create a new weight entry.
     * response:
     *  - (202) created entry
     *  - (403) error message
     */
    app.post("/api/progress/weight", (req, res) => {
        console.log("Weight-Add");

        const currentId = nextWeightId;
        nextWeightId += 1;

        const entry = new WeightEntry(currentId, req.body);

        try {
            storage.store(entry);
            storage.updateConfig({ entryId: nextWeightId });
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
    app.post("/api/progress/weight/:id", async (req, res) => {
        const longId = "weight-"+req.params["id"];
        console.log(`Weight-Update: ${longId}`, { params: req.params, query: req.query, body: req.body });

        const newData = req.body;

        let responseState = 403;
        let responseData: any;

        try {
            // const loadedData = await storage.read(appointmentId);
            // const updatedData = {
            //     ...loadedData,
            //     ...newData,
            //     sequence: Number.parseInt(loadedData["sequence"]) + 1,
            // };
            // storage.store(updatedData);
            // responseState = 202;
            // responseData = updatedData;
        } catch (error) {
            responseState = 404;
            responseData;
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
    app.delete("/api/progress/weight/:id", async (req, res) => {
        const longId: string = "weight-" + req.params["id"];

        let responseState = 403;
        let responseData: any;

        try {
            // const appointment = await storage.read(appointmentId);
            // storage.delete(appointment);
            // responseState = 202;
            // responseData = appointment;
        } catch (error) {
            responseState = 404;
            responseData = error;
        }

        res.status(responseState).send(responseData);
    });
};
