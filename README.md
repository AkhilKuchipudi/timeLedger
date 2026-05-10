# TimeLedger: Personal Project

A comprehensive personal project built with Next.js, TypeScript, and Tailwind CSS. This application serves as a robust platform for personal finance tracking, task management, and time logging.

## Key Features

- **Finance Tracking**: Detailed expense and income management with category-based organization.
- **Task Management**: A full-featured todo list with task details, subtasks, and status tracking.
- **Time Logging**: System for tracking daily time entries with productivity metrics.
- **Unified Interface**: A single, intuitive dashboard to view and manage all aspects of personal productivity.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React framework for production)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Static type checking for JavaScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS framework)
- **Database**: [Supabase](https://supabase.com/) (Open-source Firebase alternative with Postgres)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) (Lightweight SQL ORM for TypeScript)
- **Development Tools**:
    - [Bun](https://bun.sh/) (Fast JavaScript runtime)
    - [shadcn/ui](https://ui.shadcn.com/) (Component library)
    - [Zustand](https://github.com/pmndrs/zustand) (Small, fast, and scalable state management)

## Project Structure

The project follows a standard Next.js structure with specific additions for the application's features:

```
timeLedger/
├── app/                     # Next.js App Router (pages and layouts)
├── components/              # Reusable React components
│   ├── ui/                  # shadcn/ui components
│   ├── common/              # General-purpose UI components
│   ├── finance/             # Finance-specific components
│   ├── todo/                # Task-related components
│   └── time-ledger/         # Time tracking components
├── config/                  # Configuration files
├── lib/                     # Utility functions and helpers
├── services/                # API and database service layers
├── types/                   # TypeScript type definitions
├── prisma/                  # Database schema (if using Prisma, though Drizzle is primary)
└── drizzle/                 # Drizzle ORM schema definitions (primary ORM)
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher) or Bun (v1.0 or higher)
- A Supabase account (for database)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/timeLedger.git
   cd timeLedger
   ```

2. **Install dependencies:**
   Using Bun:
   ```bash
   bun install
   ```
   Or using npm:
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_ANON_KEY="your-anon-key"
   ```

4. **Run database migrations (if needed):**
   If using Drizzle:
   ```bash
   bun run db:migrate
   ```

### Development

Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run start` | Run production build |
| `bun run db:generate` | Generate database migrations |
| `bun run db:migrate` | Run database migrations |
| `bun run db:push` | Push database schema to database |
| `bun run lint` | Run ESLint to check code quality |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.