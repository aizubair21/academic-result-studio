# Academic Result Studio

## Master Layout UI Specification (v1.0)

> **Purpose**
>
> This document defines the complete master layout and user experience for the application. It is intended for an AI coding agent to build the exact UI structure. Focus only on frontend UI and interactions. Do **not** implement business logic, database integration, authentication, or API calls.

---

# 1. Application Overview

Academic Result Studio is an **offline-first academic result builder**.

It is **NOT** an admin dashboard.

It is **NOT** a CRUD management system.

It is **NOT** a multi-page web application.

The application should feel like professional desktop software such as Microsoft Excel, Figma, Notion, or Photoshop, where users stay inside a single workspace and complete the entire workflow.

The entire application should work inside **one master workspace**.

No page reloads.

No unnecessary routing.

Only the workspace content changes according to the current task.

---

# 2. Design Philosophy

The interface should be:

* Minimal
* Professional
* Teacher-friendly
* Spacious
* Fast
* Mobile responsive
* Offline-first

The user should never feel lost.

Every screen should clearly indicate the next step.

---

# 3. Design Language

## Language

Primary Language

> Bengali

Future Support

* English

---

## Typography

Font Family

> Hind Siliguri

Typography Scale

| Element       | Size |
| ------------- | ---- |
| Hero Title    | 36px |
| Page Title    | 30px |
| Section Title | 22px |
| Card Title    | 18px |
| Body Text     | 17px |
| Table Text    | 16px |
| Button Text   | 16px |
| Caption       | 14px |

Typography should prioritize readability over density.

---

# 4. Color System

Primary

Blue

Secondary

Indigo

Accent

Emerald

Danger

Red

Warning

Orange

Background

Very light gray

Cards

Pure white

Use soft gradients only for:

* Hero
* Primary Buttons
* Progress
* Highlights

Avoid dark UI.

Avoid glassmorphism.

Avoid neumorphism.

Keep the design modern and clean.

---

# 5. Application Layout

The application consists of exactly four permanent areas.

```
┌───────────────────────────────────────────────────────────────┐
│                     Top Application Bar                       │
├──────────┬──────────────────────────────────────┬─────────────┤
│          │                                      │             │
│ Left     │                                      │ Right       │
│ Workspace│         Main Workspace               │ Assistant   │
│ Navigator│                                      │ Panel       │
│          │                                      │             │
├──────────┴──────────────────────────────────────┴─────────────┤
│                      Bottom Status Bar                         │
└───────────────────────────────────────────────────────────────┘
```

These four regions must remain visible throughout the application.

---

# 6. Top Application Bar

Height

72px

Purpose

Global actions only.

Never place navigation modules here.

Include:

* Application Logo
* Application Name
* Current Project Name
* Save Button
* Undo
* Redo
* Export
* Print
* Settings

Layout

```
Logo

Academic Result Studio

Project Name

------------------------------------

Undo

Redo

Save

Export

Print

Settings
```

Sticky

Yes

---

# 7. Left Workspace Navigator

Width

72px

Purpose

Workspace navigation.

Only icons.

No labels.

Show tooltip on hover.

Navigation Items

🏫 Institution

📚 Subjects

👨‍🎓 Students

📝 Marks

📄 Reports

⚙ Settings

Only one item can be active.

The active item should have

* colored background
* rounded corners
* subtle shadow

---

# 8. Main Workspace

This is the heart of the application.

The content changes depending on the current workflow.

There are no page transitions.

Only workspace transitions.

Every module loads inside this area.

---

# 9. Right Context Assistant

Width

320px

Purpose

Guide the user.

This is NOT a chatbot.

This panel should dynamically change according to the current workspace state.

Example

```
Next Step

Add Subjects

[ Add Subject ]

-----------------------

Tips

Ctrl + S

Auto Save Enabled

-----------------------

Project Progress

Institution ✓

Subjects ✓

Students ○

Marks ○

Reports ○
```

This panel should always encourage the next logical action.

---

# 10. Bottom Status Bar

Height

36px

Show

Auto Save Status

Project Name

Database Status

Current Time

Version

Example

```
Auto Save ✓

IndexedDB Ready

Project

ABC School

v1.0
```

---

# 11. Workspace States

The workspace changes according to project progress.

---

## State 1

Empty Workspace

Show

Large welcome message

Workflow

Primary CTA

```
Welcome

Academic Result Studio

This project is currently empty.

Workflow

① Institution

② Subjects

③ Students

④ Marks

⑤ Reports

[ Add Institution ]
```

Disable every navigation item except Institution.

---

## State 2

Institution Ready

Show

Institution Summary Card

Enable

Subjects

Display

```
ABC High School

Dhaka

Bangladesh

[ Edit ]

Next Step

Add Subjects
```

---

## State 3

Subjects Ready

Display subject cards

```
Bangla

English

Mathematics

Science

ICT

(+)
```

Enable Student module.

---

## State 4

Students Ready

Display student table

Columns

Roll

Name

Edit

Delete

Primary Button

Add Student

Enable Marks module.

---

## State 5

Marks Entry

This becomes the primary working mode.

Design inspiration

Microsoft Excel

Google Sheets

Editable table

Columns

Roll

Name

Subject 1

Subject 2

Subject 3

...

Total

Status

Toolbar

Generate Result

Save

Search Student

Keyboard support

Enter

Tab

Arrow Keys

Sticky Header

Required

---

## State 6

Report Mode

Tabs

Class Result

Subject Result

Student Result

Statistics

Display

Summary Cards

Pass

Fail

Highest

Lowest

Merit Table

Buttons

Print

Export

Back to Marks

---

# 12. Navigation Rules

Never navigate to another page.

Never reload.

Never open large forms in separate pages.

Every action should happen inside:

* Modal
* Right Drawer
* Workspace

---

# 13. Modals

Use modals only for

Institution

Settings

Simple Forms

Maximum Width

600px

---

# 14. Right Drawer

Use drawer for

Subjects

Students

Quick Editing

Slide from the right.

---

# 15. Tables

Rounded corners

Sticky header

Hover row

Soft borders

Responsive

Large cells

Comfortable spacing

Teacher-friendly

---

# 16. Buttons

Primary

Gradient Blue → Indigo

Secondary

White

Danger

Red

Large border radius

Minimum height

44px

---

# 17. Cards

White background

Rounded 2xl

Soft shadow

Large padding

No hard borders

---

# 18. Icons

Use Lucide Icons.

Keep icons simple and consistent.

---

# 19. Responsive Behaviour

Desktop

Full layout.

Tablet

Collapse assistant panel.

Mobile

Hide left navigation.

Move navigation to bottom navigation bar.

Assistant becomes collapsible.

Workspace fills remaining screen.

---

# 20. Animation

Use only subtle animations.

Duration

200ms–300ms

Examples

Fade

Slide

Scale

Do not use excessive motion.

---

# 21. Accessibility

Large clickable targets

Keyboard accessible

Visible focus ring

Readable color contrast

Large typography

---

# 22. User Experience Principles

The user should always know:

* Where they are.
* What has already been completed.
* What should be done next.

The application should guide the user naturally without requiring tutorials.

---

# 23. AI Implementation Rules

Build the UI exactly according to this specification.

Requirements:

* Nuxt 3
* TypeScript
* Tailwind CSS
* Composition API
* Reusable components
* Mobile-first
* Responsive
* Production-quality code

Do NOT implement:

* Authentication
* API
* IndexedDB
* Business logic
* Result calculation
* Real data

Use realistic dummy data for every screen.

The output should resemble a polished desktop application optimized for teachers creating academic result sheets.
