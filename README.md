# LeatherCraft

An inventory and project management tool built for a small leather goods workshop. Tracks raw materials, commissioned projects, supplier contacts, and helps calculate pricing with a margin tool.

Built with Node/Express on the backend and plain HTML/CSS/JS on the frontend — no frontend framework, just Tailwind from a CDN. MongoDB for storage.

---

## What it does

**Inventory** — keeps track of leather hides, threads, hardware, and other materials. Shows what's running low, calculates total stock value, and lets you export a CSV report. Admin accounts can add, edit, and delete items. Non-admin users can view but not modify.

**Projects (Archive)** — a gallery of commissioned work. Each project has a status (In Progress, Completed, Commissioned, Archived), material info, and an optional image. Anyone logged in can update a project's status. Only admins can create or delete projects.

**Cost Estimation** — enter your leather grade, square footage, labor hours + rate, and any hardware costs. Drag a margin slider and it shows you the suggested retail price. Hardware items are pulled directly from your inventory, so if you've added brass buckles as a stock item, they show up here automatically.

**Suppliers** — a short list of your regular tanneries and hardware suppliers. Each supplier is linked to the material categories they stock, so the app can flag which ones you need to contact when stock gets low. The mail button opens a pre-filled email with the specific low-stock items listed in the body.

**Profile** — change your currency (USD, INR, EUR) or password. Admin accounts get an extra panel to see all users and manage their roles.

**Workshop / Pattern Studio** — two UI mockups for a 3D leather visualizer and a pattern canvas. Not hooked up to the backend yet, but the UIs are there.

---

## Getting it running

You need Node.js and MongoDB installed. MongoDB should be running locally on the default port.

```bash
# clone and go into the backend folder
cd backend

# install dependencies
npm install

# create a .env file
touch .env
```

Add this to your `.env`:

```
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/leathercraft
JWT_SECRET=pick_something_long_and_random_here
```

Then start the server:

```bash
npx nodemon server.js
```

For the frontend, just open `frontend/index.html` in your browser, or run it through VS Code Live Server if you want auto-reload. It'll redirect you to the login page since there's no session yet.

---

## First time setup

The database starts empty, so you'll need to create your first user via the register form. On a fresh database, the first account registered with role `Admin` is allowed and becomes your bootstrap admin account.

After at least one admin exists, new registrations keep the selected non-admin roles and cannot self-elevate to admin.

---

## Project structure

```
├── backend/
│   ├── server.js
│   ├── .env                   ← not committed, you create this
│   ├── models/                ← User, Inventory, Project, Supplier
│   ├── controllers/           ← logic per resource
│   ├── routes/                ← express routers
│   └── middlewares/
│       └── authMiddleware.js  ← JWT verification + admin check
│
└── frontend/
    ├── index.html             ← dashboard
    ├── js/
    │   ├── api.js             ← all fetch calls in one place
    │   └── theme.js           ← dark/light mode
    └── pages/
        ├── auth.html
        ├── inventory.html
        ├── archive.html
        ├── cost.html
        ├── profile.html
        ├── workshop.html
        └── pattern.html
```

---

## Tech

- **Backend:** Express 5, Mongoose 9, bcryptjs, jsonwebtoken
- **Security:** helmet, express-rate-limit (auth routes), CORS restricted to localhost, 10kb body cap
- **Frontend:** Tailwind CSS (CDN), vanilla JS, Google Fonts (Noto Serif + Manrope)
- **Database:** MongoDB (local)

---

## Notes

- JWTs expire after 7 days. Users will get kicked to the login page after that.
- The supplier mail button opens your default mail client, not a native in-app mailer. Make sure the supplier's email is saved properly when adding them.
- If you run the frontend on a port other than `3000` or `5500`, the backend's CORS config will block requests. Either update `server.js` to add your port, or just use Live Server's default (`127.0.0.1:5500`).
- The `.env` file is gitignored. Don't commit it.
