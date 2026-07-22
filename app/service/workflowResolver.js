import { useWorkspace } from "~/composables/useWorkspace";
import { useInstitute } from "~/composables/useInstitute";
import { useClasses } from "~/composables/useClasses";
import { useSubjects } from "~/composables/useSubjects";
import { useStudents } from "~/composables/useStudents";

export class WorkflowResolver {

    async resolve() {

        const workspaceRepo = useWorkspace();
        const instituteRepo = useInstitute();
        const classRepo = useClasses();
        const subjectRepo = useSubjects();
        const studentRepo = useStudents();

        const workspace = await workspaceRepo.first();

        const institutionCount = await instituteRepo.count();
        const classCount = await classRepo.count();
        const subjectCount = await subjectRepo.count();
        const studentCount = await studentRepo.count();

        let workflow = "institute";

        if (institutionCount === 0) {

            workflow = "institute";

        } else if (classCount === 0) {

            workflow = "classes";

        } else if (subjectCount === 0) {

            workflow = "subjects";

        } else if (studentCount === 0) {

            workflow = "students";

        } else {

            workflow = "dashboard";

        }

        if (workspace) {

            if (workspace.workflow !== workflow) {

                await workspaceRepo.update(workspace.id, {
                    workflow
                });

            }

        } else {

            await workspaceRepo.create({
                workflow
            });

        }

        return {

            workflow

        };

    }

}