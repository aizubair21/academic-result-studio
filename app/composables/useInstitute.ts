import { WorkflowResolver } from "~/service/workflowResolver";

export const useInstitute = () => {
  const { db } = useDatabase();
  const workflowResolver = new WorkflowResolver();
  const ui = useUiStore();

  const INSTITUTE_ID = 1;

  const first = async () => {
    return await db.institute.get(INSTITUTE_ID) ?? null;
  };

  const latest = async () => {
    return await db.institute.orderBy("id").last() ?? null;
  };

  const find = async (id) => {
    return await db.institute.get(id) ?? null;
  };

  const all = async () => {
    return await db.institute.toArray();
  };

  const count = async () => {
    return await db.institute.count();
  };

  const exists = async () => {
    return (await count()) > 0;
  };

  const create = async (data) => {
    await db.institute.put({
      id: INSTITUTE_ID,
      ...data,
    });
    workflowResolver.resolve();
  };

  const update = async (id, partial) => {
    return await db.institute.update(id, partial);
  };

  const remove = async (id) => {
    return await db.institute.delete(id);
  };

  const clear = async () => {
    return await db.institute.clear();
  };

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