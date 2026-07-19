# TODO - Academic Result Studio

## Planned Fix: add missing Classes section + remove dummy data flow

- [ ] Update `app/pages/index.vue` state machine: empty → institution → classes → subjects → students → marks → reports
- [ ] Implement Classes drawer (fresh form): class has (name, order); save creates classes
- [ ] Update Subjects UI + drawer: subjects belong to selected class; fields (id, name, classId, totalMark, passMark)
- [ ] Update Students UI + drawer: students belong to selected class; fields (id, name, roll, className)
- [ ] Remove all dummyInstitution/dummyClasses/dummyStudents/hardcoded subjects/students/report rows
- [ ] Make Marks/Reports scaffolds depend on existing data arrays (no dummy rows)
- [ ] Run `npm run build` and fix any TypeScript/template errors

