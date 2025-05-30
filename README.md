# MedEnroll

MedEnroll is a customer registration system designed for internal administrators to efficiently register new customers (such as surgeons) into the system. This reduces manual errors like typographical mistakes or duplicate records, ensuring data accuracy and consistency.

---

## Tech Stack

- Frontend: React with Vite
- Backend: Node.js with TypeScript
- Database: MongoDB
- Containerization: Docker & Docker Compose

---

## Libraries

Tailwind CSS – For utility-first styling and responsive UI/UX.

Fuse.js – For fuzzy searching/filtering of data.

JWT (JSON Web Token) – For stateless authentication and authorization.

Zod – For schema-based validation of data (especially useful with TypeScript).

Axios – For making HTTP API calls from the frontend or backend.

Jest – For unit testing backend logic.

Vitest – For fast and lightweight unit testing in frontend (especially with Vite).

Mongoose – For object modeling and interacting with MongoDB.

## Prerequisites

Before running the project, make sure to create a `.env` file for the backend service containing the following environment variables:

- `ADMIN_KEY` - Secret key for admin authentication
- `JWT_SECRET` - Secret key for JWT token signing

The backend will fail to start without these variables.

---

## Installation and Running

1. Clone the repository.

2. Ensure Docker and Docker Compose are installed and running on your system.

3. From the project root directory, run:

   ```bash
   docker-compose up --build
   ```

4. This command will build and start the backend, frontend, and MongoDB database services.

5. The frontend will be available on http://localhost and the backend API on port 3000.

## 🧪 Tests

Unit tests for the backend are written using Jest, with near 100% coverage.

To run the tests from the project root directory:

```bash
      cd med-enroll-backed/ && npm run test
```

Unit tests for the frontend are written using Vitest, with near 100% coverage.

To run the tests from the project root directory:

```bash
      cd med-enroll-frontend/ && npm run test
```

## Usage

The system allows administrators to register new customers by providing their first and last names.

It includes features to prevent duplicate entries and maintain data integrity.

Administrators can view recently added customers and manage records via the dashboard.

## Project Structure

med-enroll-backend/ - Backend Node.js application
med-enroll-frontend/ - Frontend React application

## Notes

Ensure environment variables are set correctly before starting services.
