export const useWorkspace = () => {
    const { db } = useDatabase();

    const WORKSPACE_ID = 1;

    const first = async () => {
        return await db.workspace.get(WORKSPACE_ID) ?? null;
    };

    const latest = async () => {
        return await db.workspace.orderBy("id").last() ?? null;
    };

    const count = async () => {
        return await db.workspace.count();
    };

    const exists = async () => {
        return (await count()) > 0;
    };

    const create = async (data: any) => {
        return await db.workspace.put({
            id: WORKSPACE_ID,
            ...data,
        });
    };

    const update = async (id: number, partial: any) => {
        return await db.workspace.update(id, partial);
    };

    const remove = async (id: number) => {
        return await db.workspace.delete(id);
    };

    const clear = async () => {
        return await db.workspace.clear();
    };

    return {
        first,
        latest,
        count,
        exists,
        create,
        update,
        remove,
        clear,
    };
};