import Appointment from "../calendar/entities/Appointment";

export default (app, storage, nextId = 0) => {
    let nextAppointmentId = nextId;

    /**
     * Get all stored appointments.
     * response:
     *  - (200) a list of all appointments
     *  - (500) error loading appointments
     */
    app.get("/api/calendar/appointment", (req, res) => {
        console.log("Appointment-ReadAll");

        storage
            .loadAllAppointments()
            .then((appointments) => res.status(200).send(appointments))
            .catch((error) => res.status(500).send(error));
    });

    /**
     * Create a new appointment.
     * response:
     *  - (202) created appointment
     *  - (403) error message
     */
    app.post("/api/calendar/appointment", (req, res) => {
        console.log("Appointment-Add");

        const currentId = nextAppointmentId;
        nextAppointmentId += 1;

        const appointment = new Appointment(currentId, req.body);

        try {
            storage.store(appointment);
            storage.updateConfig({ appointmentId: nextAppointmentId });
            res.status(202).send(appointment);
        } catch (reason) {
            res.status(403).send(reason.message);
        }
    });

    /**
     * Update an existing appointment.
     * response:
     *  - (202) updated appointment
     *  - (403) id is not valid
     *  - (404) appointment not found
     */
    app.post("/api/calendar/appointment/:id", async (req, res) => {
        const id = req.params["id"];
        console.log(`Appointment-Update: ${id}`, { params: req.params, query: req.query, body: req.body });

        const newData = req.body;

        let responseState = 403;
        let responseData: any;

        if (typeof id === "string" && id.length > 0) {
            const appointmentId = "appointment-" + id;

            try {
                const loadedData = await storage.read(appointmentId);

                const updatedData = {
                    ...loadedData,
                    ...newData,
                    sequence: Number.parseInt(loadedData["sequence"]) + 1,
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
     * Delete an existing appointment.
     * response:
     *  - (202) deleted appointment
     *  - (403) id is not valid
     *  - (404) appointment not found
     */
    app.delete("/api/calendar/appointment/:id", async (req, res) => {
        const id: string = "" + req.params["id"];

        let responseState = 403;
        let responseData: any;

        if (typeof id === "string" && id.length > 0) {
            const appointmentId = "appointment-" + id;

            try {
                const appointment = await storage.read(appointmentId);
                storage.delete(appointment);

                responseState = 202;
                responseData = appointment;
            } catch (error) {
                responseState = 404;
                responseData = error;
            }
        }

        res.status(responseState).send(responseData);
    });
};
