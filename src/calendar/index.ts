import Storage from "./storage/NodePersist";

import appointments from "./routes/appointment";
import anniversaries from "./routes/anniversary";

export default (app): Promise<void> => {
    const storage = new Storage();

    return new Promise(async (resolve, reject) => {
        try {
            // init store and load config file
            const config = await storage.init();

            // add routes to listen to
            appointments(app, storage, config.appointmentId);
            anniversaries(app, storage, config.anniversaryId);

            console.log("Calendar storage and routes ready");
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};
