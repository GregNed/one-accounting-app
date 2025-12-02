# Account Balance Calculator - Frontend

Vue.js + TypeScript frontend application for calculating account balances with transaction processing.

## Features

- Input field for initial balance
- Add multiple transactions (credit/debit)
- Real-time balance calculation
- Visual status indicators (Normal/Overdraft)
- Prominent overdraft warning when account is in overdraft
- Modern, responsive UI

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:3000`

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Usage

1. Enter your initial account balance
2. Click "Add Transaction" to add transactions
3. For each transaction:
   - Select type (Credit or Debit)
   - Enter the amount
4. Click "Calculate Balance" to see the results
5. If the account is in overdraft (negative balance), a warning message will be displayed

## TypeScript

This project uses TypeScript for type safety and better developer experience. The types are shared with the backend API to ensure consistency.

## CI/CD

This project includes GitHub Actions workflows for automated building and deployment to AWS S3. See [`.github/workflows/README.md`](.github/workflows/README.md) for setup instructions.

The workflow:
- Builds TypeScript code and creates production bundle using Vite
- Deploys to S3 bucket `one-app` using OIDC federated identity
- Optionally invalidates CloudFront cache

## Project Structure

```
one_app/
├── src/
│   ├── App.vue          # Main Vue component (TypeScript)
│   ├── api.ts           # API service for backend communication
│   ├── types.ts         # TypeScript type definitions
│   ├── main.ts          # Application entry point
│   ├── env.d.ts         # Vue and Vite type declarations
│   └── style.css        # Global styles
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration (TypeScript)
├── tsconfig.json        # TypeScript configuration
├── tsconfig.node.json   # TypeScript config for Node files
└── package.json         # Dependencies and scripts

```

