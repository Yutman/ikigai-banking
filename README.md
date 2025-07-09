# Ikigai Banking App

## Introduction
Built with Next.js, Ikigai is a financial SaaS platform that connects to multiple bank accounts, displays transactions in real-time, allows users to transfer money to other platform users, and manages their finances altogether. This app provides a secure and private environment for users to track, connect, and transfer funds seamlessly.


## ⚙️ Tech Stack
- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- MongoDB
- Axios

## 🔋 Features
**Authentication**: An ultra-secure SSR authentication with proper validations and authorization, implemented with a local JWT-based system.

**Connect Banks**: Integrates with bank account linking functionality (Plaid support pending).

**Home Page**: Shows a general overview of user accounts with total balance from all connected banks, recent transactions, and a 'View All' option.

**My Banks**: Check the complete list of all connected banks with respective balances and account details.

**Transaction History**: Includes pagination and filtering options for viewing transaction history.

**Funds Transfer**: Allows users to transfer funds (integration pending).

## Quick Start
Follow these steps to set up the Ikigai Banking App locally on your machine.

### Prerequisites
Make sure you have the following installed on your machine:
- Git
- Node.js (v18.x or later)
- npm (Node Package Manager) or yarn

### Cloning the Repository
1. Clone the repository: `git clone https://github.com/Yutman/ikigai-banking.git`
2. Navigate to the project directory: `cd ikigai-banking`
3. Install dependencies: `npm install` or `yarn install`
4. Set up environment variables (see `.env.example`).

## Running the Project
- Development: `npm run dev` or `yarn dev` (runs on `http://localhost:3000`)
- Build: `npm run build`
- Start: `npm run start`

## Project Structure
- `app/`: Next.js app directory with pages (e.g., `page.tsx`, `(root)/layout.tsx`)
- `components/`: Reusable UI components (e.g., `Sidebar`, `RightSidebar`, `TotalBalanceBox`)
- `lib/`: Utility functions and API logic (e.g., `actions/bank.actions.ts`, `actions/user.actions.ts`)
- `prisma/`: Database schema and migrations
- `app/globals.css`: Global styles with Tailwind CSS

## Environment Variables
Copy `.env.example` to `.env` and update:

## API Endpoints
- `GET /api/transactions`: Fetch recent transactions
- `POST /api/transactions`: Add a new transaction

## Changes and Files Provided
- Updated `app/(root)/layout.tsx` to manage the main layout with `Sidebar` and `MobileNav`, ensuring flexibility for different screen sizes.
- Modified `app/(root)/page.tsx` to structure the `home` section with `home-content` and `RightSidebar`, incorporating `HeaderBox`, `TotalBalanceBox`, and `RecentTransactions`.
- Adjusted `app/globals.css` to refine widths (`Sidebar` at 150px/275px, `RightSidebar` at 200px/275px, `home-content` with calculated max-widths), restore horizontal scrolling, and reposition the 'View All' button near 'Recent Transactions'.
- Integrated `lib/actions/bank.actions.ts` and `lib/actions/user.actions.ts` for account and user data management, with updates to support JWT authentication.
- Included `db/hasura.js`, `middleware.js`, `utils/redirectUser.js`, and `lib/utils.js` to implement a local authentication fallback, replacing previous Magic link issues.

## Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request

## License
MIT License - See `LICENSE` for details.

## Contact
For issues, open a ticket on [GitHub Issues](https://github.com/Yutman/ikigai-banking/issues).

## Acknowledgments
Thanks to [Tailwind CSS](https://tailwindcss.com), the Next.js community, inspiration from JS Mastery by Adrian where I sourced the tutorial and LLM assistance by xAI Grok.
