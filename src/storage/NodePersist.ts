import storage from 'node-persist';
import { CalendarConfig } from '../types';
import Appointment from '../calendar/entities/Appointment';
import Anniversary from '../calendar/entities/Anniversary';

const KEY_CONFIG_FILE = '__config';

class NodePersist {

    public async init(): Promise<CalendarConfig> {
        await storage.init();

        let config: CalendarConfig;
        try {
            config = await storage.get(KEY_CONFIG_FILE);
        } catch (e) {
            config = { anniversaryId: 0, appointmentId: 0 };
        }

        return !!config ? config : { anniversaryId: 0, appointmentId: 0 };
    }

    public async updateConfig(anniversaryId: number, appointmentId: number): Promise<void> {
        return await storage.set(KEY_CONFIG_FILE, { anniversaryId, appointmentId });
    }

    public async store(entity: any): Promise<void> {
        if (typeof entity['id'] === 'undefined')
            throw new TypeError("entities without 'id' are not storable");

        return await storage.set(entity['id'], entity);
    }

    public async delete(entity: any): Promise<void> {
        if (typeof entity['id'] === 'undefined')
            throw new TypeError("entities without 'id' are not deletable");

        return await storage.del(entity['id']);
    }

    public async read(id: string): Promise<any> {
        return await storage.get(id);
    }

    public async loadAllAppointments(): Promise<Appointment[]> {
        return await storage.valuesWithKeyMatch(/appointment/);
    }

    public async loadAllAnniversaries(): Promise<Anniversary[]> {
        return await storage.valuesWithKeyMatch(/anniversary/);
    }
}

export default NodePersist;
