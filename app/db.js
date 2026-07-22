import Dexie from 'dexie';

export const db = new Dexie('ResultSheetDB');

db.version(1).stores({
  workspace: 'id',

  // একটাই রেকর্ড
  institute: 'id',
  
  // ক্লাস
  classes: 'id',
  
  // সাবজেক্ট - ক্লাস অনুযায়ী ফিল্টার করতে classId ইনডেক্স
  subjects: 'id, classId, [classId+name]',  // same class-এ একই নামের সাবজেক্ট ব্লক
  
  // স্টুডেন্ট - ক্লাস অনুযায়ী ফিল্টার
  students: 'id, classId, [classId+roll]',
  
  // মার্কস - কম্পোজিট কী + আলাদা ইনডেক্স ফিল্টারিং-এর জন্য
  marks: '[classId+studentId+subjectId], classId, studentId, subjectId',
  
  // (অপশনাল) ক্যাশে টেবিল - ফ্রিকোয়েন্ট রেজাল্ট ডাটা স্টোর
  resultCache: 'id',  // id = classId বা composite key
});

// ডাটাবেস ওপেন (Dexie অটো করে, কিন্তু explicit ওপেন ভালো প্র্যাকটিস)
db.open().catch(err => {
  console.error('Database failed to open:', err);
});