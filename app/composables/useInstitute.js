// composables/useInstitute.js
export const useInstitute = () => {
  const { db } = useDatabase();
  
  const INSTITUTE_ID = 1; // Singleton
  
  const getInstitute = async () => {
    return await db.institute.get(INSTITUTE_ID) || null;
  };
  
  const saveInstitute = async (data) => {
    await db.institute.put({ id: INSTITUTE_ID, ...data });
    useUiStore().activeTab = 'Classes';
  };
  
  const updateInstitute = async (partial) => {
    const current = await getInstitute();
    if (current) {
      await db.institute.put({ ...current, ...partial });
    }
  };
  
  return { getInstitute, saveInstitute, updateInstitute };
};