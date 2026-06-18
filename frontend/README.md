# SecureSign Frontend

This folder contains the React frontend for the SecureSign document signature app.

## What This Page Shows

- A simple dashboard for uploading and preparing documents.
- Recent document cards with the same statuses used by the Java backend: `PENDING`, `SIGNED`, and `REJECTED`.
- A signature preview area with five font choices.
- A small flow section that explains the user journey.

## Tech Used

- React for building the page as components.
- Vite for running the frontend during development.
- Tailwind CSS for styling with utility classes.

## How To Run

Install dependencies first:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Then open the local URL printed in the terminal.

## Files To Read First

- `src/App.jsx` contains the main page.
- `src/index.css` imports Tailwind and the five signature fonts.
- `src/main.jsx` connects React to `index.html`.

## Notes

The frontend currently uses sample data so the page stays easy to understand. Later, it can connect to the backend routes:

- `POST /api/documents/upload`
- `GET /api/documents`
- `POST /api/signatures`
- `PUT /api/signatures/{id}/status`
