# Implementation Plan - Settings Modal & System Settings

## Steps

### 1. Database Schema Update (`app/db.js`)
- [ ] Add `settings` table
- [ ] Add `gradeCriteria` table  
- [ ] Increment DB version to 3

### 2. New Composables
- [ ] Create `app/composables/useSettings.ts`
- [ ] Create `app/composables/useGradeCriteria.ts`

### 3. Update Settings Modal (`app/components/layouts/partials/header.vue`)
- [ ] Add Result Type selector (GPA/CGPA) with DB persistence
- [ ] Add Grade Criteria editor section (per class)
- [ ] Add Reset All button with confirmation
- [ ] Save/Load from database

### 4. Remove Duplicate Settings Modal (`app/layouts/master.vue`)
- [ ] Remove duplicate AppModal settings section
- [ ] Keep header's settings modal only

### 5. Store Updates
- [ ] Update `app/stores/uiStore.js` - Add enhanced reset
- [ ] Update `app/stores/widgetStore.js` - Add enhanced reset
- [ ] Update `app/stores/dbStore.ts` - Add settings state

### 6. Testing
- [ ] Verify DB upgrade works
- [ ] Verify settings persist
- [ ] Verify grade criteria CRUD
- [ ] Verify reset functionality

