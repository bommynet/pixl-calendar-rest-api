import routesFactory from "../../factories/routes";
import storageFactory from "../../factories/storage";

import weightFactory from "./weightFactory";

export default async (app) => {
    const category = "progress";
    const endpointWeight = "weight";

    const storageWeight = await storageFactory(category, endpointWeight);

    await routesFactory(app, storageWeight, category, endpointWeight, weightFactory(endpointWeight));
};
