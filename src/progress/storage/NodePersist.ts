import storage from "node-persist";

import { ProgressConfig } from "../../types";
import WeightEntry from "../entities/WeightEntry";

const KEY_CONFIG_FILE = "__config";

class NodePersist {
    private _storage;

    public constructor() {
        this._storage = storage.create({ dir: "storage/progress" });
    }

    public async init(): Promise<ProgressConfig> {
        await this._storage.init();

        let config: ProgressConfig = { entryId: 0 };
        try {
            config = await this._storage.get(KEY_CONFIG_FILE);
        } catch (e) {
            // nothing to do here
            console.log("config file does not exists - use default values");
        }

        return config || { entryId: 0 };
    }

    public async updateConfig(config: ProgressConfig): Promise<void> {
        await this._storage.set(KEY_CONFIG_FILE, config);
    }

    public async store(entity: any): Promise<void> {
        if (typeof entity["longId"] === "undefined") throw new TypeError("entities without 'longId' are not storable");

        return await this._storage.set(entity["longId"], entity);
    }

    public async delete(entity: any): Promise<void> {
        if (typeof entity["longId"] === "undefined") throw new TypeError("entities without 'longId' are not deletable");

        return await this._storage.del(entity["longId"]);
    }

    public async read(id: string): Promise<any> {
        return await this._storage.get(id);
    }

    public async loadAllWeights(): Promise<WeightEntry[]> {
        return await this._storage.valuesWithKeyMatch(/weight/);
    }
}

export default NodePersist;
