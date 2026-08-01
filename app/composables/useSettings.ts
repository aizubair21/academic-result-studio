import { db } from '~/db';

export type ResultPreviewSettings = {
    resultType: string;
    showFooter: boolean;
    showTotalMark: boolean;
    showGpa: boolean;
    showPercentage: boolean;
    showGrade: boolean;
    showGradePoint: boolean;
    showResult: boolean;
};

export const DEFAULT_RESULT_PREVIEW_SETTINGS: ResultPreviewSettings = {
    resultType: 'GPA',
    showFooter: true,
    showTotalMark: true,
    showGpa: true,
    showPercentage: true,
    showGrade: true,
    showGradePoint: true,
    showResult: true,
};

export const useSettings = () => {
    const SETTINGS_ID = 1;

    const first = async () => {
        return {
            ...DEFAULT_RESULT_PREVIEW_SETTINGS,
            id: SETTINGS_ID,
            ...(await db.settings.get(SETTINGS_ID) ?? {}),
        };
    };

    const create = async (data: Partial<ResultPreviewSettings>) => {
        return await db.settings.put({
            id: SETTINGS_ID,
            ...DEFAULT_RESULT_PREVIEW_SETTINGS,
            ...data,
        });
    };

    const update = async (partial: Partial<ResultPreviewSettings>) => {
        return await db.settings.update(SETTINGS_ID, partial);
    };

    const upsert = async (data: Partial<ResultPreviewSettings>) => {
        const existing = await db.settings.get(SETTINGS_ID);
        if (existing) {
            return await db.settings.update(SETTINGS_ID, data);
        } else {
            return await db.settings.put({ id: SETTINGS_ID, ...DEFAULT_RESULT_PREVIEW_SETTINGS, ...data });
        }
    };

    return {
        first,
        create,
        update,
        upsert,
    };
};

