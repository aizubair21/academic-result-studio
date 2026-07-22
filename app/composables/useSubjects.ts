export const useSubjects = () => {
    const { db } = useDatabase();

    return {
        first: () => db.subjects.orderBy("id").first(),
        latest: () => db.subjects.orderBy("id").last(),
        find: (id: number) => db.subjects.get(id),
        all: () => db.subjects.toArray(),
        count: () => db.subjects.count(),
        exists: async () => (await db.subjects.count()) > 0,
        create: (data: any) => db.subjects.add(data),
        update: (id: number, partial: any) => db.subjects.update(id, partial),
        remove: (id: number) => db.subjects.delete(id),
        clear: () => db.subjects.clear(),
    };
};