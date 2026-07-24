import { WorkflowResolver } from "~/service/workflowResolver";

export const useClasses = () => {
    const { db } = useDatabase();
    const wpr = new WorkflowResolver();


    const first = async () => await db.classes.orderBy("id").first();

    const latest = async () => await db.classes.orderBy("id").last();

    const find = async (id: number) => await db.classes.get(id);

    const all = async () => await db.classes.toArray();

    const count = async () => await db.classes.count();

    const exists = async () => (await count()) > 0;

    const create = async (data: any) => {
        await db.classes.add(data);
        wpr.resolve()
    };

    const update = async (id: number, partial: any) =>
        await db.classes.update(id, partial);

    const remove = async (id: number) => await db.classes.delete(id);

    const clear = async () => await db.classes.clear();

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