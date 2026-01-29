# End-Term-Project-Web-Dev

# My DOM App (Web Dev II Final Project)

## Description
A fully functional DOM-based web application built using **Vanilla JavaScript**, demonstrating DOM manipulation, event handling, and client-side state management.

## Problem Statement
Users need a simple way to create, filter, search, edit, and delete items (like tasks/notes) directly in the browser without any frameworks.

## Features Implemented
- Add items using a form
- Dynamic DOM rendering (create/update/remove elements)
- Search items (live input filtering)
- Filter by category
- Edit item using prompt
- Delete individual items
- Clear all items (with confirmation)
- LocalStorage persistence (data stays after refresh)
- Handles invalid inputs (empty / too long)

## DOM Concepts Used
- `document.getElementById`
- `createElement`, `appendChild`
- `innerHTML` (only for clearing safely)
- `classList` and inline style toggling
- `dataset` attributes for item IDs and actions
- Event delegation using `closest()`

## Steps to Run
1. Download / clone this repo
2. Open `index.html` in a browser  
   OR use VS Code Live Server

## Known Limitations
- Editing uses `prompt()` (basic UX)
- No backend (client-only)

