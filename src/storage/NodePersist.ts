import storage from "node-persist";
import { CalendarConfig } from "../types";
import Appointment from "../calendar/entities/Appointment";
import Anniversary from "../calendar/entities/Anniversary";
import Alarm from "../calendar/entities/Alarm";

const KEY_CONFIG_FILE = "__config";

class NodePersist {
    private _queueIsWorking: boolean = false;
    private _queue: { action: string; entry: any }[] = [];

    private _addJob(action: string, entry: any): void {
        this._queue.push({ action, entry });
        this._runQueue();
    }

    private _getJob(): { action: string; entry: any } | undefined {
        return this._queue.shift();
    }

    private async _doJob(job: { action: string; entry: any }): Promise<void> {
        let jobFunction: ((entry: any) => Promise<void>) | undefined;

        if (job.action === "store") jobFunction = this._store;
        else if (job.action === "delete") jobFunction = this._delete;

        if (!jobFunction) return;

        try {
            await jobFunction(job.entry);
        } catch (error) {
            console.error(`a job failed (action: ${job.action}, id:${job.entry["id"]})`);
        }
    }

    private _runQueue() {
        // no need to start, if queue is running already
        if (this._queueIsWorking) return;

        // no need to start, if queue is empty
        if (this._queue.length <= 0) return;

        this._queueIsWorking = true;

        const queueWorkingLoop = async () => {
            const job = this._getJob();

            if (!job) {
                this._queueIsWorking = false;
                return;
            }

            await this._doJob(job);
            queueWorkingLoop();
        };

        queueWorkingLoop();
    }

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

    public store(entity: any): void {
        this._addJob("store", entity);
    }

    public async _store(entity: any): Promise<void> {
        if (typeof entity["longId"] === "undefined") throw new TypeError("entities without 'longId' are not storable");

        return await storage.set(entity["longId"], entity);
    }

    public delete(entity: any): void {
        this._addJob("delete", entity);
    }

    public async _delete(entity: any): Promise<void> {
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
