# SACRISTY Bangkok — Next.js Migration

This is a modern reconstruction of the SACRISTY Bangkok project using Next.js App Router, TypeScript, and Prisma.

## Tech Stack
- **Frontend**: Next.js 15, TypeScript, CSS Modules
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Utilities**: Sharp (image processing), Zod (validation), Bcrypt & JWT (auth)

## Getting Started

### 1. Infrastructure Setup
Ensure you have a PostgreSQL instance running. You can use Docker or a local installation.

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in the values:
```bash
cp .env.example .env
```

### 3. Installation
Install dependencies:
```bash
npm install
```

### 4. Database Migration
Initialize the database and run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

### 5. Development Server
Run the project:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Project Structure
- `src/app`: App Router routes and pages
- `src/features`: Business logic modules (UI + logic)
- `src/lib`: Core infrastructure (Prisma, Auth, Storage)
- `src/services`: Data access layer
- `src/types`: TypeScript interfaces
- `prisma`: Database schema and migrations
