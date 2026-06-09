# Backoffice Officina

Workshop-management platform for a mechanical garage. It centralizes customers, vehicles, work orders, invoices, appointments, inventory and operational reports in a Nuxt/Supabase dashboard.

## What It Does

- Customer registry for individuals and companies, including Italian fiscal fields
- Vehicle records with technical details, deadlines and service history
- Work-order workflow from intake to completion, including labor and parts
- Invoice generation, payment status tracking and print/export flows
- Appointment calendar with day, week and list views
- Inventory management with stock alerts, OEM codes and compatibility data
- Reporting dashboards for revenue, services and customer activity
- Car-sales area for vehicle listings and sales operations

## Stack

- Nuxt, Vue and TypeScript
- Vuetify for the application UI
- Supabase for PostgreSQL, Auth and Realtime data
- Pinia for state management
- Chart.js and vue-chartjs for reporting
- date-fns for date handling

## Run Locally

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:3000`.

## Configuration

The frontend expects Supabase credentials in `frontend/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

Database schema files live in `frontend/database/`.

## Project Layout

```text
frontend/
  app/
    pages/          # dashboard, customers, vehicles, work orders, invoices, inventory, reports
    composables/    # Supabase data access helpers
    layouts/        # authenticated and blank layouts
    plugins/        # Vuetify setup
    types/          # generated database types
  database/         # schema and migration SQL
Vfcars/             # separate car-sales professional website prototype
```
