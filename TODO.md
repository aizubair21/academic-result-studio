# Mobile Responsiveness Plan

## ✅ Step 1: uiStore.js - Ensure sidebarOpen state works properly
## ✅ Step 2: nav.vue - Transform left sidebar to fixed bottom nav on mobile
## ✅ Step 3: header.vue - Add right-sidebar drawer toggle button
## ✅ Step 4: app.vue - Responsive 3-column grid with mobile drawer
## ✅ Step 5: master.vue - Responsive 2-column grid with mobile drawer
## ✅ Step 6: asside.vue - Right sidebar → Mobile drawer (with Teleport target)
## ✅ Step 7: rightAsside.vue - Teleport page-specific content to mobile drawer
## ✅ Step 8: Ensure content responsiveness across all pages (overflow-x-auto tables, responsive spacing)

## Summary of changes:
- **nav.vue**: Left sidebar hides on mobile, fixed bottom tab bar appears with nav items
- **header.vue**: Hamburger menu button (mobile only) to toggle right sidebar drawer
- **app.vue**: Responsive grid `grid-cols-1` → `md:grid-cols-[80px_1fr_220px]` → `lg:grid-cols-[100px_1fr_250px]`, `pb-20` on mobile for bottom nav space
- **master.vue**: Responsive grid `grid-cols-1` → `md:grid-cols-[80px_1fr]` → `lg:grid-cols-[100px_1fr]`, `pb-20` on mobile for bottom nav space
- **asside.vue**: Desktop sidebar + Mobile slide-over drawer from right with backdrop, Teleport target for page content
- **rightAsside.vue**: On mobile, teleports slot content to drawer; on desktop renders inline
- **uiStore.js**: Uses existing `sidebarOpen` state to control mobile drawer
