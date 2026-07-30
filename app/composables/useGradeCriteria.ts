import { db } from '~/db';

// Standard Bangladesh grade boundaries
export const DEFAULT_GRADE_CRITERIA = [
    { label: 'A+', minMark: 80, maxMark: 100, gradePoint: 5.0 },
    { label: 'A', minMark: 70, maxMark: 79, gradePoint: 4.0 },
    { label: 'A-', minMark: 60, maxMark: 69, gradePoint: 3.5 },
    { label: 'B', minMark: 50, maxMark: 59, gradePoint: 3.0 },
    { label: 'C', minMark: 40, maxMark: 49, gradePoint: 2.0 },
    { label: 'D', minMark: 33, maxMark: 39, gradePoint: 1.0 },
    { label: 'F', minMark: 0, maxMark: 32, gradePoint: 0.0 },
];

export const useGradeCriteria = () => {
    /**
     * Get grade criteria for a specific class
     */
    const getByClass = async (classId: number) => {
        const criteria = await db.gradeCriteria
            .where('classId')
            .equals(classId)
            .toArray();

        return criteria.length > 0 ? criteria : null;
    };

    /**
     * Get all grade criteria entries
     */
    const all = async () => {
        return await db.gradeCriteria.toArray();
    };

    /**
     * Set custom grade criteria for a class
     */
    const setForClass = async (classId: number, criteria: Array<{
        label: string;
        minMark: number;
        maxMark: number;
        gradePoint: number;
    }>) => {
        // Remove existing criteria for this class
        await db.gradeCriteria.where('classId').equals(classId).delete();

        // Add new criteria
        const data = criteria.map(c => ({
            classId,
            ...c,
        }));
        return await db.gradeCriteria.bulkAdd(data);
    };

    /**
     * Set default grade criteria for a class
     */
    const setDefaultForClass = async (classId: number) => {
        return await setForClass(classId, DEFAULT_GRADE_CRITERIA);
    };

    /**
     * Delete all criteria for a class
     */
    const removeByClass = async (classId: number) => {
        return await db.gradeCriteria.where('classId').equals(classId).delete();
    };

    /**
     * Update a single grade criterion
     */
    const updateCriteria = async (id: number, partial: {
        label?: string;
        minMark?: number;
        maxMark?: number;
        gradePoint?: number;
    }) => {
        return await db.gradeCriteria.update(id, partial);
    };

    /**
     * Delete a single criterion
     */
    const remove = async (id: number) => {
        return await db.gradeCriteria.delete(id);
    };

    return {
        getByClass,
        all,
        setForClass,
        setDefaultForClass,
        removeByClass,
        updateCriteria,
        remove,
    };
};

