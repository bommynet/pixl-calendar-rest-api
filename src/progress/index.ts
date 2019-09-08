import Storage from "./storage/NodePersist";

import weightEntries from "./routes/weightEntry";

export default (app): Promise<void> => {
    const storage = new Storage();

    return new Promise(async (resolve, reject) => {
        try {
            // init store and load config file
            const config = await storage.init();

            // add routes to listen to
            weightEntries(app, storage, config.entryId);

            console.log("Progress storage and routes ready");
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};
