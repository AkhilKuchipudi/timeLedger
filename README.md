# TimeLedger: Workforce & Task Management System

A high-performance Enterprise Management platform designed for Employers and Employees. Built with a robust polyglot backend and a sophisticated glassmorphism frontend.

## 🚀 Key Features

- **Employer-Employee Model**: Organization-level isolation with role-based access control.
- **Work Consistency Tracking**: Automated productivity metrics and consistency scoring based on logged hours.
- **Kanban Task Management**: Dynamic drag-and-drop board for workflow visualization.
- **Polyglot Persistence**: 
    - **PostgreSQL**: Transactional data (Users, Roles, Time Entries).
    - **MongoDB**: Flexible task metadata and dynamic sub-tasks.
- **Live Time Tracking**: Real-time logging of employee work hours.

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.5 (Java 21)
- **Security**: Spring Security + JWT (Stateless)
- **Persistence**: Spring Data JPA (Postgres) & Spring Data MongoDB
- **Database**: PostgreSQL (Relational) & MongoDB (NoSQL)
- **Documentation**: SpringDoc OpenAPI (Swagger)

### Frontend
- **Framework**: Angular 21 (Modern Signals-based architecture)
- **Styling**: SCSS with Glassmorphism Design System
- **Charts**: Chart.js / ng2-charts
- **State Management**: Angular Signals & RxJS

## 🏗 Project Structure

```
timeLedger/
├── backend/                 # Spring Boot Maven Project
│   └── src/main/java/com/timeledger/backend/
│       ├── controller/      # REST API Endpoints
│       ├── model/           # Data Entities
│       ├── repository/      # Data Access Layers
│       └── security/        # JWT & Security Configuration
└── timeLedgerUI/            # Angular SPA
    └── src/app/
        ├── components/      # UI Views (Dashboard, Kanban, etc.)
        └── services/        # API Integration & Business Logic
```

## 🏁 Getting Started

### Backend Setup
1. Ensure PostgreSQL and MongoDB are running locally.
2. Update `application.yaml` credentials if necessary.
3. Run `./mvnw spring-boot:run`.
4. **Data Seeder**: On startup, the system automatically creates:
    - **Employer**: `employer@timeledger.com` / `password123`
    - **Employee**: `employee@timeledger.com` / `password123`
5. Swagger UI: `http://localhost:8080/swagger-ui.html`

### Frontend Setup
1. `cd timeLedgerUI`
2. `npm install`
3. `ng serve`
4. Access: `http://localhost:4200`

## 👥 Roles & Access
- **Employer (ORGANIZATION)**: Can manage staff, view team consistency, and approve timesheets.
- **Employee (INDIVIDUAL)**: Can manage personal tasks, track time, and view personal productivity.

## 📜 License
MIT License
