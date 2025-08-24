# Expense Tracker Backend

A Spring Boot 3 backend application for the Expense Tracker application with support for both SQLite (development) and PostgreSQL (production) databases.

## Features

- **Multi-database support**: SQLite for development, PostgreSQL for production
- **RESTful API**: Complete CRUD operations for expenses, income, transfers, and reports
- **Financial Advisor**: AI-powered spending advice based on financial patterns
- **Flyway Migrations**: Database schema management with vendor-specific migrations
- **OpenAPI Documentation**: Swagger UI for API exploration
- **Security**: CORS configuration and CSRF protection
- **Validation**: Input validation using Bean Validation

## Technology Stack

- **Java 17+**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **Spring Security**
- **Flyway Database Migration**
- **SQLite & PostgreSQL**
- **Maven**
- **Lombok**
- **SpringDoc OpenAPI**

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- SQLite (for development)
- PostgreSQL (for production, optional)

## Quick Start

### Development Mode (SQLite)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker-backend
   ```

2. **Run the application**
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

3. **Access the application**
   - API Base URL: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - API Docs: http://localhost:8080/v3/api-docs

### Production Mode (PostgreSQL)

1. **Set environment variables**
   ```bash
   export DB_URL=jdbc:postgresql://localhost:5432/expenses
   export DB_USER=app
   export DB_PASSWORD=app
   export ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
   ```

2. **Run the application**
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=prod
   ```

## API Endpoints

### Accounts
- `GET /api/accounts` - Get all accounts

### Categories
- `GET /api/categories` - Get all categories

### Expenses
- `GET /api/expenses` - Get expenses with filtering
- `POST /api/expenses` - Create new expense
- `DELETE /api/expenses/{id}` - Delete expense

### Income
- `POST /api/income` - Create new income

### Transfers
- `POST /api/transfer` - Create transfer between accounts

### Reports
- `GET /api/reports/monthly` - Monthly financial totals
- `GET /api/reports/by-category` - Category-wise totals

### Financial Advisor
- `POST /api/advisor/can-buy` - Get spending advice

## Database Schema

The application uses Flyway migrations to manage database schema:

- **Users**: Basic user information
- **Accounts**: Financial accounts (cash, bank, wallet, etc.)
- **Categories**: Transaction categories (income/expense)
- **Transactions**: All financial transactions with types

### Migration Files

- **SQLite**: `src/main/resources/db/migration/sqlite/`
- **PostgreSQL**: `src/main/resources/db/migration/postgres/`

## Configuration

### Development Profile (`application-dev.properties`)
- SQLite database with file `expenses.db`
- SQL logging enabled
- Flyway migrations from SQLite folder

### Production Profile (`application-prod.properties`)
- PostgreSQL database (configured via environment variables)
- Optimized for production
- Flyway migrations from PostgreSQL folder

## Security

- **CORS**: Configurable allowed origins
- **CSRF**: Disabled for API endpoints
- **Authentication**: Public API endpoints (configure as needed)

## Building

```bash
# Clean build
mvn clean install

# Run tests
mvn test

# Package JAR
mvn package
```

## Running

```bash
# Development
java -jar target/expense-tracker-backend-1.0.0.jar --spring.profiles.active=dev

# Production
java -jar target/expense-tracker-backend-1.0.0.jar --spring.profiles.active=prod
```

## Development

### Project Structure
```
src/main/java/com/expensetracker/
├── config/          # Configuration classes
├── dto/            # Data Transfer Objects
├── entity/         # JPA entities
├── repo/           # Repository interfaces
├── service/        # Business logic services
└── web/            # REST controllers
```

### Adding New Features

1. **Entity**: Create JPA entity in `entity/` package
2. **Repository**: Add repository interface in `repo/` package
3. **Service**: Implement business logic in `service/` package
4. **Controller**: Create REST endpoints in `web/` package
5. **Migration**: Add Flyway migration if schema changes needed

## Troubleshooting

### Common Issues

1. **Port already in use**: Change `server.port` in properties
2. **Database connection**: Check database URL and credentials
3. **Migration failures**: Verify Flyway locations and database compatibility

### Logs

- Development: SQL queries and detailed logging
- Production: Minimal logging for performance

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## License

This project is licensed under the MIT License.
