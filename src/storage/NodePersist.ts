import storage from "node-persist";
import { CalendarConfig } from "../types";
import Appointment from "../calendar/entities/Appointment";
import Anniversary from "../calendar/entities/Anniversary";
import Alarm from "../calendar/entities/Alarm";

const KEY_CONFIG_FILE = "__config";

class NodePersist {
    public async init(): Promise<CalendarConfig> {
        await storage.init();

        let config: CalendarConfig = { alarmId: 0, anniversaryId: 0, appointmentId: 0 };
        try {
            config = await storage.get(KEY_CONFIG_FILE);
        } catch (e) {
            // nothing to do here
            console.log("config file does not exists - use default values");
        }

        return config || { alarmId: 0, anniversaryId: 0, appointmentId: 0 };
    }

    public async updateConfig(config: {
        alarmId?: number;
        anniversaryId?: number;
        appointmentId?: number;
    }): Promise<void> {
        let _config;

        // load existing config
        try {
            _config = await storage.get(KEY_CONFIG_FILE);
        } catch (error) {
            _config = { alarmId: 0, anniversaryId: 0, appointmentId: 0 };
        }

        _config = _config || { alarmId: 0, anniversaryId: 0, appointmentId: 0 };

        // update values
        if (config.alarmId) _config.alarmId = config.alarmId;
        if (config.anniversaryId) _config.anniversaryId = config.anniversaryId;
        if (config.appointmentId) _config.appointmentId = config.appointmentId;

        return await storage.set(KEY_CONFIG_FILE, _config);
    }

    public async store(entity: any): Promise<void> {
        if (typeof entity["longId"] === "undefined") throw new TypeError("entities without 'longId' are not storable");

        return await storage.set(entity["longId"], entity);
    }

    public async delete(entity: any): Promise<void> {
        if (typeof entity["longId"] === "undefined") throw new TypeError("entities without 'longId' are not deletable");

        return await storage.del(entity["longId"]);
    }

    public async read(id: string): Promise<any> {
        return await storage.get(id);
    }

    public async loadAllAlarms(): Promise<Alarm[]> {
        return await storage.valuesWithKeyMatch(/alarm/);
    }

    public async loadAllAppointments(): Promise<Appointment[]> {
        return await storage.valuesWithKeyMatch(/appointment/);
    }

    public async loadAllAnniversaries(): Promise<Anniversary[]> {
        return await storage.valuesWithKeyMatch(/anniversary/);
    }
}

export default NodePersist;
