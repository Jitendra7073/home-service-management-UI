# Home Service Management - Frontend

This repository contains the frontend user interface for the Home Service Management application. It is built using Next.js and React.

## Technology Stack

- **Framework:** Next.js 16
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **State Management:** Jotai
- **Form Handling:** React Hook Form, Zod
- **Data Fetching:** Tanstack Query
- **UI Components:** Radix UI, Lucide React
- **Testing:** Playwright

## Prerequisites

Ensure you have the following installed:

- Node.js (Latest LTS version recommended)
- npm (Node Package Manager)

## Installation

1. Navigate to the project directory:

   ```bash
   cd home-service-management-UI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Setup

Create a `.env` file in the root directory and configure the necessary environment variables (e.g., Firebase config, Stripe keys, API endpoints).

## Running the Application

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

To build the application for production usage:

```bash
npm run build
```

To start the production server:

```bash
npm dev
```

"C:\Users\EnactOn Technologies\Downloads\stripe_1.34.0_windows_x86_64\stripe.exe" listen --forward-to localhost:5000/api/webhooks/stripe
