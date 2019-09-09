import routesFactory from "../../factories/routes";
import storageFactory from "../../factories/storage";

import anniversaryFactory from "./anniversaryFactory";
import appointmentFactory from "./appointmentFactory";

export default async (app) => {
    const category = "calendar";
    const endpointAnniversary = "anniversary";
    const endpointAppointment = "appointment";

    const storageAnniversary = await storageFactory(category, endpointAnniversary);
    const storageAppointment = await storageFactory(category, endpointAppointment);

    await routesFactory(app, storageAnniversary, category, endpointAnniversary, anniversaryFactory(endpointAnniversary));
    await routesFactory(app, storageAppointment, category, endpointAppointment, appointmentFactory(endpointAppointment));
};
