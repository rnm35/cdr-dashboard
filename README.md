# Call Analytics Dashboard

A full-stack telecom analytics dashboard for call data records (CDRs), built over two internship assignments:

HEAD
**Live dashboard:** cdr-dashboard-alpha.vercel.app

- **Week 2:** a React dashboard reading a mock CDR API.
- **Week 3:** connected to a secure backend ([cdr-api](https://github.com/rnm35/cdr-api)), with sign-in, role-based access, backend filtering and server-side pagination over 10,000 calls.
>e726fcc (Connect dashboard to backend with sign-in, protected routes and server-side filtering)

## Features

The dashboard is laid out as an analyst's report rather than a grid of cards:

- **Filter sidebar:** date range, direction, outcome, city and caller/receiver number. Filters are applied by the backend, update every section, and are kept in the page address so a filtered view can be refreshed or shared. The report's subtitle describes the current filters in plain English.
- **Summary:** total calls, total and average duration, total and average cost, and successful and failed calls, written as one sentence.
- **Activity:** calls over time (per hour, day, week or month depending on the date range), with the busiest and quietest periods noted.
- **Incoming and outgoing:** the call type split as a single proportional bar.
- **Callers and cities:** top callers by talk time, and the cities with the most calls.
- **Call length:** longest, average and shortest call.
- **Cost by city:** the cities with the highest total spend, and the average cost per call.
- **Call records** (admins only): server-side pagination and sorting, 20 calls per page.
- **Access** (admins only): change any user's role.
- **Sign in and sign up**, protected routes, and a return to the login page if the session expires. Analysts see phone numbers partly hidden.
- Loading and error states, automatic retries while the backend wakes up, and light and dark mode.

## Tech stack

- [React](https://react.dev/) with [Vite](https://vite.dev/) and [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) components (Card, Table, Button, Badge, Input, Label)
- [Recharts](https://recharts.org/) for the charts
- Backend: Node.js, Express, PostgreSQL and JWT (see [cdr-api](https://github.com/rnm35/cdr-api))

## How the frontend talks to the backend

All requests go to `/api` on the same site as the dashboard:

- **In development**, Vite forwards `/api` to the backend on `localhost:4000` (`vite.config.js`).
- **In production**, Vercel forwards `/api` to the backend on Render (`vercel.json`).

Because the browser only ever talks to one site, the login cookie is a normal first-party cookie and no tokens are stored in JavaScript.

## Running locally

Requires Node.js 18 or newer, and the [cdr-api](https://github.com/rnm35/cdr-api) backend running on port 4000.

```bash
npm install
npm run dev
```

Then open http://localhost:5173 and sign in.

To create a production build:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  App.jsx                  routes and protected-route handling
  context/AuthContext.jsx  sign-in state shared across the app
  pages/                   login, sign-up and dashboard pages
  components/
    ui/                    shadcn/ui components
    dashboard/             sidebar, filters, report sections, tables and user management
  hooks/                   dashboard data and theme hooks
  lib/
    api.js                 requests to the backend, error handling and retries
    filters.js             reading filters from, and writing them to, the page address
    format.js              currency, duration and date formatting
```

## Screenshots

![Dashboard overview](docs/overview.png)
<<<<<<< HEAD
=======

## Deployment

Deployed on [Vercel](https://vercel.com/) from this GitHub repository (build command `npm run build`, output directory `dist`). `vercel.json` forwards `/api` requests to the backend and sends every other path to the app, so links like `/login` work on refresh.
>>>>>>> e726fcc (Connect dashboard to backend with sign-in, protected routes and server-side filtering)
