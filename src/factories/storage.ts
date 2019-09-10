import storage from "node-persist";

export default async (category, endpoint): Promise<any> => {
    const _storage = storage.create({ dir: `storage/${category}` });
    const keyConfigFile = `__config-${endpoint}`;

    let config;

    // init
    try {
        await _storage.init();
    } catch (reason) {
        return Promise.reject(reason.message);
    }

    // config
    try {
        config = await _storage.get(keyConfigFile);
    } catch (e) {
        console.log("config file does not exists - use default values");
    }
    config = config || { nextEntryId: 0 };

    async function loadConfig(): Promise<{ nextEntryId: number }> {
        return await _storage.get(keyConfigFile);
    }

    async function updateConfig(config: { nextEntryId: number }): Promise<void> {
        return await _storage.set(keyConfigFile, config);
    }

    async function store(entity: any): Promise<void> {
        if (typeof entity["longId"] === "undefined") throw new TypeError("entities without 'longId' are not storable");
        return await _storage.set(entity["longId"], entity);
    }

    async function read(longId: string): Promise<any> {
        return await _storage.get(longId);
    }

    async function readAll(): Promise<any[]> {
        return await _storage.valuesWithKeyMatch(`${endpoint}-`);
    }

    async function remove(longId: string): Promise<any> {
        const deletedEntry = await _storage.get(longId);
        await _storage.del(longId);

        return deletedEntry;
    }

    console.log(`storage storage/${category}/${endpoint}-* is ready`);

    return {
        loadConfig,
        updateConfig,
        store,
        read,
        readAll,
        remove,
    };
};
