import { DEFAULT_GRADE_CRITERIA } from './useGradeCriteria';

type ReportType = 'class' | 'student' | 'subject';

const asNumber = (value: unknown) => Number(value || 0);

export const useResultReport = () => {
    const loadBaseData = async () => {
        const [institute, classes, students, subjects, marks, settings] = await Promise.all([
            useInstitute().first(),
            useClasses().all(),
            useStudents().all(),
            useSubjects().all(),
            useMarks().all(),
            useSettings().first(),
        ]);

        return { institute, classes, students, subjects, marks, settings };
    };

    const getCriteria = async (classId: number) => {
        return (await useGradeCriteria().getByClass(classId)) || DEFAULT_GRADE_CRITERIA;
    };

    const getGrade = (mark: number, totalMark: number, criteria: any[]) => {
        const percentage = totalMark > 0 ? (mark / totalMark) * 100 : 0;
        const grade = criteria.find(item => percentage >= item.minMark && percentage <= item.maxMark)
            || criteria[criteria.length - 1];

        return {
            percentage,
            label: grade?.label || 'F',
            gradePoint: asNumber(grade?.gradePoint),
            passed: grade?.label !== 'F',
        };
    };

    const summarizeStudent = (student: any, subjects: any[], marks: any[], criteria: any[]) => {
        const rows = subjects.map(subject => {
            const mark = marks.find(item => item.studentId === student.id && item.subjectId === subject.id);
            const result = getGrade(asNumber(mark?.mark), asNumber(subject.total_mark || 100), criteria);
            return {
                subject,
                mark: mark?.mark ?? '-',
                ...result,
            };
        });
        const total = rows.reduce((sum, row) => sum + (row.mark === '-' ? 0 : asNumber(row.mark)), 0);
        const totalFullMark = subjects.reduce((sum, subject) => sum + asNumber(subject.total_mark || 100), 0);
        const gradedRows = rows.filter(row => row.mark !== '-');
        const gpa = gradedRows.length
            ? gradedRows.reduce((sum, row) => sum + row.gradePoint, 0) / gradedRows.length
            : 0;

        return {
            student,
            rows,
            total,
            totalFullMark,
            gpa: gpa.toFixed(2),
            passed: rows.length > 0 && rows.every(row => row.passed && row.mark !== '-'),
        };
    };

    const loadReport = async (type: ReportType, classId: number, studentId?: number, subjectId?: number) => {
        const data = await loadBaseData();
        const selectedClass = data.classes.find(item => item.id === Number(classId));
        const classSubjects = data.subjects
            .filter(item => item.classId === Number(classId))
            .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
        const classStudents = data.students
            .filter(item => item.classId === Number(classId))
            .sort((a, b) => (a.roll ?? 0) - (b.roll ?? 0));
        const criteria = await getCriteria(Number(classId));
        const classMarks = data.marks.filter(item => item.classId === Number(classId));

        const report = {
            type,
            institute: data.institute,
            settings: data.settings,
            selectedClass,
            subjects: classSubjects,
            students: classStudents,
            criteria,
            marks: classMarks,
            studentSummary: null as any,
            subject: null as any,
            studentSummaries: [] as any[],
        };

        if (type === 'student') {
            const student = classStudents.find(item => item.id === Number(studentId)) || classStudents[0];
            report.studentSummary = student ? summarizeStudent(student, classSubjects, classMarks, criteria) : null;
        }

        if (type === 'subject') {
            const subject = classSubjects.find(item => item.id === Number(subjectId)) || classSubjects[0];
            report.subject = subject;
        }

        if (type === 'class') {
            report.studentSummaries = classStudents.map(student => summarizeStudent(student, classSubjects, classMarks, criteria));
        }

        return report;
    };

    return { loadBaseData, loadReport, getGrade, summarizeStudent };
};