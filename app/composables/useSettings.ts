import { db } from '~/db';

export const useSettings = () => {
    const SETTINGS_ID = 1;

    const first = async () => {
        return await db.settings.get(SETTINGS_ID) ?? {
            id: SETTINGS_ID,
            resultType: 'GPA',  // 'GPA' or 'CGPA'
        };
    };

    const create = async (data: { resultType: string }) => {
        return await db.settings.put({
            id: SETTINGS_ID,
            ...data,
        });
    };

    const update = async (partial: { resultType?: string }) => {
        return await db.settings.update(SETTINGS_ID, partial);
    };

    const upsert = async (data: { resultType: string }) => {
        const existing = await db.settings.get(SETTINGS_ID);
        if (existing) {
            return await db.settings.update(SETTINGS_ID, data);
        } else {
            return await db.settings.put({ id: SETTINGS_ID, ...data });
        }
    };

    return {
        first,
        create,
        update,
        upsert,
    };
};

