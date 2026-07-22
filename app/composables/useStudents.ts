export const useStudents = () => {
    const { db } = useDatabase();

    return {
        first: () => db.students.orderBy("id").first(),
        latest: () => db.students.orderBy("id").last(),
        find: (id: number) => db.students.get(id),
        all: () => db.students.toArray(),
        count: () => db.students.count(),
        exists: async () => (await db.students.count()) > 0,
        create: (data: any) => db.students.add(data),
        update: (id: number, partial: any) => db.students.update(id, partial),
        remove: (id: number) => db.students.delete(id),
        clear: () => db.students.clear(),
    };
};