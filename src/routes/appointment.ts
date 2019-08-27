import Appointment from "../calendar/entities/Appointment";

export default (app, cors, storage, nextId = 0) => {
    let nextAppointmentId = nextId;

    /**
     * Get all stored appointments.
     * response:
     *  - (200) a list of all appointments
     *  - (500) error loading appointments
     */
    app.get("/api/calendar/appointment", cors(), (req, res) => {
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
    app.post("/api/calendar/appointment", cors(), (req, res) => {
        console.log("Appointment-Add");

        const currentId = nextAppointmentId;
        nextAppointmentId += 1;

        const appointment = new Appointment("appointment-" + currentId, req.query);

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
    app.post("/api/calendar/appointment/:id", cors(), async (req, res) => {
        const id = req.params["id"];
        console.log(`Appointment-Update: ${id}`, { req });

        const newData = req.query;

        let responseState = 403;
        let responseData: any;

        if (typeof id === "string" && id.length > 0) {
            const appointmentId = "appointment-" + id;

            storage
                .read(appointmentId)
                .then((loadedData) => {
                    const updatedData = {
                        ...loadedData,
                        ...newData,
                        id: appointmentId,
                    };

                    storage.store(updatedData);
                    responseState = 202;
                    responseData = updatedData;
                })
                .catch((error) => {
                    responseState = 404;
                    responseData = error;
                });
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
    app.delete("/api/calendar/appointment/:id", cors(), (req, res) => {
        const id: string = "" + req.params["id"];

        let responseState = 403;
        let responseData: any;

        if (typeof id === "string" && id.length > 0) {
            const appointmentId = "appointment-" + id;

            storage
                .read(appointmentId)
                .then((appointment) => {
                    storage.delete(appointment);

                    responseState = 202;
                    responseData = appointment;
                })
                .catch((error) => {
                    responseState = 404;
                    responseData = error;
                });
        }

        res.status(responseState).send(responseData);
    });
};
