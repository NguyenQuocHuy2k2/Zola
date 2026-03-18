# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zola is an e-commerce application with a Spring Boot 3.4.2 backend (Java 21) and an Expo/React Native frontend.

## Tech Stack

**Backend:**
- Spring Boot 3.4.2 with Java 21
- Spring Data JPA, Spring Security (OAuth2 Resource Server)
- PostgreSQL database
- Redis for caching
- JWT authentication (custom signing with Nimbus JOSE)
- MapStruct for DTO mapping
- Cloudinary for image uploads
- Brevo for email service
- Springdoc OpenAPI for Swagger documentation

**Frontend:**
- Expo with React Native
- TypeScript
- Tailwind CSS (NativeWind)
- React Navigation with file-based routing

## Project Structure

```
Zola/
├── backend/               # Spring Boot backend
│   └── src/main/java/com/zola/
│       ├── ZolaApplication.java
│       ├── configuration/ # Security, Redis, Cloudinary configs
│       ├── controller/    # REST controllers
│       ├── dto/           # Request/Response DTOs
│       ├── entity/        # JPA entities
│       ├── repository/    # Spring Data repositories
│       └── services/      # Business logic (modular by feature)
├── frontend/              # Expo React Native app
│   └── src/
│       ├── app/           # File-based routing (pages)
│       ├── components/    # Reusable UI components
│       ├── constants/     # Theme, colors, config
│       ├── contexts/      # React contexts (AuthContext)
│       └── services/      # API client, utilities
```

## Backend Architecture

### Layered Pattern
- **Controllers** (`com.zola.controllers`): REST endpoints under `/api` prefix
- **Services** (`com.zola.services`): Business logic, organized by domain (authentication, cart, order, product, etc.)
- **Repositories** (`com.zola.repository`): Data access layer
- **Entities** (`com.zola.entity`): JPA models with PostgreSQL mappings
- **DTOs** (`com.zola.dto`): Request/response objects with MapStruct mapping

### Key Features
- JWT-based auth with access/refresh tokens
- Role-based access control (USER/ADMIN)
- OTP verification via email (Brevo)
- Image uploads via Cloudinary
- Redis caching for performance
- OpenAPI/Swagger docs at `/api/swagger-ui.html`

### Domain Modules
- `authentication`: Login, register, token refresh
- `cart`: Shopping cart management
- `order`: Order processing and fulfillment
- `product`: Product catalog with variants (color, size)
- `profile`: User profile management
- `address`: Shipping addresses
- `dashboard`: Admin dashboard metrics

## Frontend Architecture

### File-Based Routing
- `(user)/` - User-facing screens
- `(admin)/` - Admin screens
- Root `_layout.tsx` configures navigation structure

### State Management
- `AuthContext`: Authentication state and user session

### API Integration
- `services/api.ts`: Axios client with base URL and interceptors

## Development Commands

### Backend (Maven)
```bash
# Run application
cd backend && mvn spring-boot:run

# Build JAR
mvn clean package

# Run tests
mvn test

# Run specific test
mvn test -Dtest=AuthenticationServiceTest

# Generate OpenAPI docs
# Available at http://localhost:8080/api/swagger-ui.html
```

### Frontend (Expo)
```bash
# Install dependencies
cd frontend && npm install

# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run linting
npm run lint
```

## Environment Configuration

### Backend (application.yaml)
Key environment variables:
- `SERVER_PORT`: Backend port (default: 8080)
- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`: PostgreSQL config
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`: Redis config
- `JWT_ACCESS_SIGNER_KEY`, `JWT_REFRESH_SIGNER_KEY`: JWT secrets
- `EMAIL_API_KEY`, `EMAIL_SENDER_EMAIL`: Brevo email config
- `CLOUDINARY_*`: Cloudinary upload config
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`: Initial admin account

### Frontend
API base URL configured in `src/services/api.ts`

## Common Development Tasks

### Adding a new feature
1. Create entity in `com.zola.entity`
2. Create repository interface in `com.zola.repository`
3. Create service class in `com.zola.services/<feature>`
4. Create request/response DTOs in `com.zola.dto`
5. Add controller in `com.zola.controller`
6. Add frontend API calls in `src/services/`
7. Add screens in `src/app/`

### Database migrations
DDL-auto is set to `update` for development. For production, consider Flyway/Liquibase.

## API Conventions
- Base path: `/api`
- Auth endpoints: `/api/authentication/*` (public)
- Protected endpoints require Bearer JWT token
- Admin endpoints require ADMIN role

## Testing
- Backend: JUnit 5 + Mockito via `mvn test`
- Frontend: Jest + React Native Testing Library
