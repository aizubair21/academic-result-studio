export const useMarks = () => {
    const { db } = useDatabase();

    return {
        first: () => db.marks.orderBy("id").first(),
        latest: () => db.marks.orderBy("id").last(),
        find: (id: number) => db.marks.get(id),
        all: () => db.marks.toArray(),
        count: () => db.marks.count(),
        exists: async () => (await db.marks.count()) > 0,

        /**
         * Get all marks for a specific class
         */
        getMarksForClass: (classId: number) =>
            db.marks.where("classId").equals(classId).toArray(),

        /**
         * Get marks for a specific student in a class
         */
        getMarksForStudent: (classId: number, studentId: number) =>
            db.marks
                .where("[classId+studentId+subjectId]")
                .between([classId, studentId, ""], [classId, studentId, "\uffff"])
                .toArray(),

        /**
         * Find a specific mark record by composite key
         */
        findByComposite: (classId: number, studentId: number, subjectId: number) =>
            db.marks
                .where("[classId+studentId+subjectId]")
                .equals([classId, studentId, subjectId])
                .first(),

        /**
         * Create a new mark record. Prevents duplicates by checking composite key.
         */
        create: async (data: {
            studentId: number;
            classId: number;
            subjectId: number;
            mark: number;
        }) => {
            // Check if a mark already exists for this combination
            const existing = await db.marks
                .where("[classId+studentId+subjectId]")
                .equals([data.classId, data.studentId, data.subjectId])
                .first();

            if (existing) {
                // Update instead of creating duplicate
                return await db.marks.update(existing.id, { mark: data.mark });
            }

            return await db.marks.add(data);
        },

        /**
         * Update a mark record
         */
        update: (id: number, partial: { mark?: number }) =>
            db.marks.update(id, partial),

        /**
         * Upsert a single mark (update if exists, insert if not)
         */
        upsertMark: async (
            studentId: number,
            classId: number,
            subjectId: number,
            mark: number
        ) => {
            const existing = await db.marks
                .where("[classId+studentId+subjectId]")
                .equals([classId, studentId, subjectId])
                .first();

            if (existing) {
                return await db.marks.update(existing.id, { mark });
            } else {
                return await db.marks.add({ studentId, classId, subjectId, mark });
            }
        },

        /**
         * Bulk upsert marks for a student across all subjects
         */
        bulkUpsertForStudent: async (
            studentId: number,
            classId: number,
            marks: Array<{ subjectId: number; mark: number }>
        ) => {
            const promises = marks.map((m) =>
                db.marks
                    .where("[classId+studentId+subjectId]")
                    .equals([classId, studentId, m.subjectId])
                    .first()
                    .then((existing) => {
                        if (existing) {
                            return db.marks.update(existing.id, { mark: m.mark });
                        } else {
                            return db.marks.add({
                                studentId,
                                classId,
                                subjectId: m.subjectId,
                                mark: m.mark,
                            });
                        }
                    })
            );
            return await Promise.all(promises);
        },

        /**
         * Remove a mark record
         */
        remove: (id: number) => db.marks.delete(id),

        /**
         * Remove all marks for a specific class
         */
        removeByClass: (classId: number) =>
            db.marks.where("classId").equals(classId).delete(),

        /**
         * Remove all marks for a specific student
         */
        removeByStudent: (studentId: number) =>
            db.marks.where("studentId").equals(studentId).delete(),

        clear: () => db.marks.clear(),
    };
};

