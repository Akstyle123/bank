# Modern Banking App

A modern banking application built with React, TypeScript, and Vite. This app features separate portals for admin and client users, user authentication with OTP verification, and a responsive UI styled with Tailwind CSS. It includes toast notifications and uses lucide-react for icons.

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- react-hot-toast (for notifications)
- lucide-react (icon library)
- ESLint (for linting)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd modern-banking-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Development Server

Start the development server with:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

## Building for Production

Build the app for production with:

```bash
npm run build
```

## Previewing the Production Build

Preview the production build locally with:

```bash
npm run preview
```

## Project Structure

- `src/` - Source code
  - `components/` - React components organized by feature:
    - `admin/` - Admin portal components including:
      - `AdminDashboard.tsx` - Main admin dashboard with tabs for Dashboard Overview, Account Holders, Financial Operations, Reports & Analytics, Documents, and Settings.
      - `DashboardOverview.tsx` - Summary and key metrics overview.
      - `HolderManagement.tsx` - Manage account holders.
      - `FinancialOperations.tsx` - Handle deposits, withdrawals, penalties, and daily collections.
      - `Reports.tsx` - View reports and analytics.
      - `AdminSettings.tsx` - Admin user settings.
    - `client/` - Client portal components including:
      - `ClientDashboard.tsx` - Client dashboard showing account summary, recent transactions, and quick actions.
      - `ClientPortal.tsx` - Main client portal container.
      - `ClientRequests.tsx` - Client service requests.
      - `ClientSettings.tsx` - Client user settings.
      - `ClientTransactions.tsx` - Client transaction history.
    - `auth/` - Authentication components:
      - `LoginModal.tsx` - Login modal with email/password and OTP verification for admin and client users.
    - `ui/` - UI components like LoadingSpinner and Toast notifications.
  - `context/` - React context for global state management (`AppContext.tsx`).
  - `services/` - API service utilities (`apiService.ts`).
  - `App.tsx` - Main app component handling routing based on user type and authentication state.
  - `main.tsx` - Application entry point.
- `public/` - Static assets (if any).
- `vite.config.ts` - Vite configuration.
- `tailwind.config.js` - Tailwind CSS configuration.
- `postcss.config.js` - PostCSS configuration.

## Features and Functionality

### Application Flow

- Users start at the HomePage if not authenticated.
- Login modal supports admin and client login with email/password and OTP verification.
- Upon successful login, users are routed based on their role:
  - Admin users see the AdminDashboard with multiple management tabs.
  - Client users see the ClientDashboard with account overview and actions.
- Global state and user context are managed via React Context (`AppContext`).
- Toast notifications provide feedback on user actions and system events.

### Project Structure and Data Flow

- `src/context/AppContext.tsx` manages global state including user authentication, user type, and loading states.
- `src/services/apiService.ts` handles API calls for fetching and submitting data such as client transactions and admin operations.
- Components are organized by feature area under `src/components/` for modularity and maintainability.
- Admin and Client dashboards fetch and display relevant data using hooks and context.
- UI components like LoadingSpinner and Toast are reused across the app for consistent UX.

### User Roles and Permissions

- Admin users have access to comprehensive management features including account holders, financial operations, reports, and settings.
- Client users have access to their personal account dashboard, transaction history, and support requests.
- Authentication flow ensures secure access with OTP verification.

### Authentication

- Supports admin and client user types.
- Login with email and password.
- OTP verification step for added security.
- Separate login flows and UI themes for admin (blue) and client (green).

### Admin Portal

- Tabbed dashboard with sections for:
  - Dashboard Overview: Key metrics and summaries.
  - Account Holders: Manage account holders.
  - Financial Operations: Handle deposits, withdrawals, penalties, and daily collections.
  - Reports & Analytics: View financial reports and analytics.
  - Documents: Manage related documents.
  - Settings: Admin user settings.
- Responsive sidebar and header with user info and logout.

### Client Portal

- Dashboard showing:
  - Account summary cards (balance, deposits, withdrawals, pending charges).
  - Account information.
  - Recent transactions.
  - Quick action buttons (view transactions, download statements, contact support).
- Fetches client transaction data from API service.

## Styling

This project uses Tailwind CSS for styling. Utility classes are used throughout the components for rapid UI development.

## Notifications

Uses `react-hot-toast` for toast notifications with custom styling for success and error messages.

## Linting

ESLint is configured for code quality and consistency. Run linting with:

```bash
npm run lint
```

---

This README provides an overview to get started with the Modern Banking App project. For any questions or contributions, please refer to the project repository.
