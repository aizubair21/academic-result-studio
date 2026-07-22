export const useClasses = () => {
    const { db } = useDatabase();

    const first = async () => db.classes.orderBy("id").first();

    const latest = async () => db.classes.orderBy("id").last();

    const find = async (id: number) => db.classes.get(id);

    const all = async () => db.classes.toArray();

    const count = async () => db.classes.count();

    const exists = async () => (await count()) > 0;

    const create = async (data: any) => db.classes.add(data);

    const update = async (id: number, partial: any) =>
        db.classes.update(id, partial);

    const remove = async (id: number) => db.classes.delete(id);

    const clear = async () => db.classes.clear();

    return {
        first,
        latest,
        find,
        all,
        count,
        exists,
        create,
        update,
        remove,
        clear,
    };
};