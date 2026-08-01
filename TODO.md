# Workflow Navigation Middleware — Implementation Progress

## Plan Overview

Implement a global route guard middleware that checks prerequisite steps before allowing navigation to workflow pages (classes, subjects, students, marks). If a user directly navigates to a page whose prerequisites aren't met, redirect them to the first missing prerequisite step.

Workflow order: **institute → classes → subjects → students → marks**

## Implementation Steps

### Step 1: Implement global middleware (`app/middleware/workflow.global.ts`)
- [x] Define route guard map for protected pages with prerequisite steps
- [x] Call `WorkflowResolver.resolve()` to refresh DB-based completion flags
- [x] Redirect to first missing prerequisite step
- [x] Skip on server side (IndexedDB is browser-only)
- [x] Leave unguarded routes accessible (`/`, `/welcome`, `/institute`)

### Step 2: Verify nav links & routes are correctly mapped
- [x] Confirm `/classes`, `/subjects`, `/students`, `/mark` are guarded
- [x] Confirm `/institute/edit` requires institute to exist

### Step 3: Test via `npm run dev`
- [ ] Directly navigate to `/subjects` with no classes → redirected to `/classes`
- [ ] Directly navigate to `/students` without subjects → redirected to `/subjects`
- [ ] Directly navigate to `/classes` without institute → redirected to `/institute`
- [ ] Verify no infinite redirect loops

> ✅ Implementation complete. `nuxt prepare` passes with no new errors. Middleware logic reviewed: no infinite redirect loops possible (redirect chains terminate at `/institute` which is unguarded).

