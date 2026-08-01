import { WorkflowResolver } from "~/service/workflowResolver"
import { useWidgetStore } from "~/stores/widgetStore"
import { useUiStore } from "~/stores/uiStore"

// ─── Route Guard Map ──────────────────────────────────────────────
// Each key is a route path. Each value is an ordered list of workflow
// steps that MUST be completed before the user can access that page.
//
// Workflow order: institute → classes → subjects → students → marks
type WorkflowStep = 'institute' | 'classes' | 'subjects' | 'students';

const ROUTE_PREREQUISITES: Record<string, WorkflowStep[]> = {
    '/classes': ['institute'],
    '/subjects': ['institute', 'classes'],
    '/students': ['institute', 'classes', 'subjects'],
    '/mark': ['institute', 'classes', 'subjects', 'students'],
    '/institute/edit': ['institute'],
};

// Map workflow step → page path used for redirection
const STEP_PAGE: Record<WorkflowStep, string> = {
    institute: '/institute',
    classes: '/classes',
    subjects: '/subjects',
    students: '/students',
};

export default defineNuxtRouteMiddleware(async (to, from) => {
    // ── Server guard ──────────────────────────────────────────────
    // IndexedDB only exists in the browser. On the server there is no
    // DB to check, so skip middleware to avoid SSR errors.
    if (import.meta.server) {
        return;
    }

    // ── Find applicable prerequisites for the target route ────────
    const requiredSteps = ROUTE_PREREQUISITES[to.path];

    // No prerequisites defined → route is freely accessible
    if (!requiredSteps) {
        return;
    }

    // ── Resolve workflow from actual DB state ─────────────────────
    const widgetStore = useWidgetStore();
    const resolver = new WorkflowResolver();

    try {
        await resolver.resolve();
    } catch (err) {
        console.error('[workflow.global] Failed to resolve workflow:', err);
        // If we cannot determine state, allow navigation to avoid
        // blocking the user due to unexpected errors.
        return;
    }

    // ── Check each prerequisite in order ──────────────────────────
    for (const step of requiredSteps) {
        if (!widgetStore.workflow.completed[step]) {
            // Redirect to the first missing prerequisite step
            const redirectPath = STEP_PAGE[step];

            // Only show toast when navigating from a different page
            // (not on first app load) and if a toast store exists.
            if (from && from.path && from.path !== to.path) {
                try {
                    const ui = useUiStore();
                    ui.showToast('error', `আগে "${step}" সম্পন্ন করুন`);
                } catch {
                    // uiStore may not be ready; ignore.
                }
            }

            return navigateTo(redirectPath);
        }
    }

    // All prerequisites satisfied → allow navigation
});

