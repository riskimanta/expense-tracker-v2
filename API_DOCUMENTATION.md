# Expense Tracker API Documentation

## Overview
This document describes the REST API endpoints for the Expense Tracker application. All endpoints return JSON responses and use standard HTTP status codes.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, the API does not require authentication for development purposes.

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "error": "Detailed error message",
  "status": 400
}
```

### Conflict Response (409)
```json
{
  "success": false,
  "error": "Business logic constraint message",
  "status": 409
}
```

## HTTP Status Codes

| Code | Status | Description | Usage |
|------|--------|-------------|-------|
| 200 | OK | Request successful | GET, POST, PUT, DELETE operations completed |
| 201 | Created | Resource created successfully | POST operations |
| 400 | Bad Request | Invalid request data | Validation errors, missing required fields |
| 404 | Not Found | Resource not found | ID doesn't exist, invalid endpoint |
| 409 | Conflict | Business logic constraint | Foreign key violations, duplicate data |
| 500 | Internal Server Error | Server error | Database errors, system failures |

## Accounts API

### GET /api/accounts
Retrieve all accounts.

**Query Parameters:**
- `userId` (optional): Filter by user ID

**Response:**
```json
[
  {
    "id": "1",
    "name": "Cash",
    "type": "cash",
    "balance": 1000000,
    "icon": "💵",
    "currency": "IDR",
    "accountNumber": ""
  }
]
```

**Error Codes:**
- `500`: Database connection failed

### POST /api/accounts
Create a new account.

**Request Body:**
```json
{
  "name": "Bank BCA",
  "type": "bank",
  "balance": 5000000
}
```

**Response:**
```json
{
  "id": "2",
  "message": "Account created successfully"
}
```

**Error Codes:**
- `400`: Missing required fields (name, type, balance)
- `409`: Account name already exists
- `500`: Database error

### PUT /api/accounts
Update an existing account.

**Request Body:**
```json
{
  "id": "1",
  "name": "Cash Updated",
  "type": "cash",
  "balance": 1500000
}
```

**Response:**
```json
{
  "id": "1",
  "name": "Cash Updated",
  "type": "cash",
  "balance": 1500000,
  "icon": "💵",
  "createdAt": "2024-01-01"
}
```

**Error Codes:**
- `400`: Missing required fields
- `404`: Account not found
- `409`: Account name conflicts with existing account
- `500`: Database error

### DELETE /api/accounts/[id]
Delete an account.

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

**Error Codes:**
- `404`: Account not found
- `409`: Account cannot be deleted (used in transactions)
- `500`: Database error

**Conflict Example (409):**
```json
{
  "error": "Cannot delete account \"Bank BCA\" because it is used in 1 transaction(s). Please delete or reassign the transactions first."
}
```

## Users API

### GET /api/users
Retrieve all users.

**Response:**
```json
[
  {
    "id": "1",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "status": "active",
    "createdAt": "2024-01-01"
  }
]
```

**Error Codes:**
- `500`: Database error

### POST /api/users
Create a new user.

**Request Body:**
```json
{
  "name": "New User",
  "email": "user@example.com",
  "role": "user",
  "status": "active"
}
```

**Response:**
```json
{
  "id": "3",
  "name": "New User",
  "email": "user@example.com",
  "role": "user",
  "status": "active",
  "createdAt": "2024-01-01"
}
```

**Error Codes:**
- `400`: Missing required fields
- `409`: Email already exists
- `500`: Database error

### PUT /api/users/[id]
Update an existing user.

**Request Body:**
```json
{
  "name": "Updated User",
  "email": "user@example.com",
  "role": "admin",
  "status": "active"
}
```

**Response:**
```json
{
  "id": "1",
  "name": "Updated User",
  "email": "user@example.com",
  "role": "admin",
  "status": "active",
  "createdAt": "2024-01-01"
}
```

**Error Codes:**
- `400`: Missing required fields
- `404`: User not found
- `409`: Email conflicts with existing user
- `500`: Database error

### DELETE /api/users/[id]
Delete a user.

**Response:**
```json
{
  "success": true
}
```

**Error Codes:**
- `404`: User not found
- `500`: Database error

## Transactions API

### GET /api/transactions
Retrieve transactions with optional filters.

**Query Parameters:**
- `type` (optional): Filter by transaction type
- `from` (optional): Filter by start date
- `to` (optional): Filter by end date
- `userId` (optional): Filter by user ID
- `categoryId` (optional): Filter by category ID
- `accountId` (optional): Filter by account ID

**Response:**
```json
[
  {
    "id": "1",
    "date": "2024-01-15",
    "categoryId": "1",
    "amount": 50000,
    "description": "Lunch",
    "accountId": "1",
    "userId": "1",
    "type": "expense"
  }
]
```

**Error Codes:**
- `500`: Database error

### POST /api/transactions
Create a new transaction.

**Request Body:**
```json
{
  "date": "2024-01-15",
  "categoryId": "1",
  "amount": 50000,
  "description": "Lunch",
  "accountId": "1",
  "type": "expense"
}
```

**Response:**
```json
{
  "id": "1",
  "message": "Transaction created successfully"
}
```

**Error Codes:**
- `400`: Missing required fields
- `404`: Category or account not found
- `500`: Database error

### PATCH /api/transactions/[id]
Update an existing transaction.

**Request Body:**
```json
{
  "date": "2024-01-15",
  "categoryId": "1",
  "amount": 60000,
  "description": "Lunch with dessert",
  "accountId": "1",
  "type": "expense"
}
```

**Response:**
```json
{
  "id": "1",
  "message": "Transaction updated successfully"
}
```

**Error Codes:**
- `400`: Missing required fields
- `404`: Transaction not found
- `500`: Database error

### DELETE /api/transactions/[id]
Delete a transaction.

**Response:**
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

**Error Codes:**
- `404`: Transaction not found
- `409`: Transaction cannot be deleted (business rule violation)
- `500`: Database error

## Categories API

### GET /api/categories
Retrieve all categories.

**Query Parameters:**
- `type` (optional): Filter by category type (expense/income)

**Response:**
```json
[
  {
    "id": "1",
    "name": "Food & Dining",
    "type": "expense",
    "color": "#FF6B6B",
    "icon": "🍽️"
  }
]
```

**Error Codes:**
- `500`: Database error

## Error Handling Patterns

### Frontend Error Handling
All API functions follow a consistent error handling pattern:

```typescript
// For 409 Conflict, return the error data instead of throwing
if (response.status === 409) {
  return { success: false, error: errorData.error, status: response.status }
}

// For other errors, throw with informative message
throw new Error(errorData.error || `Failed to ${action} ${entity} (${response.status})`)
```

### Conflict Response Handling
Conflict responses (409) are handled as business logic, not errors:

```typescript
// Check if it's a conflict response
if (result && typeof result === 'object' && 'success' in result && !result.success) {
  // Show conflict message to user
  showToast({
    title: 'Tidak Dapat Dihapus',
    description: result.error,
    variant: 'destructive'
  })
  return
}
```

## Rate Limiting
Currently, no rate limiting is implemented.

## Caching
API responses are not cached by default.

## Database Schema
The API uses SQLite database with the following main tables:
- `users`: User management
- `accounts`: Financial accounts
- `categories`: Transaction categories
- `transactions`: Financial transactions
- `budgets`: Budget rules
- `currencies`: Currency information

## Development Notes
- Database file: `expenses.db`
- Foreign key constraints are enforced
- All database connections are properly managed
- Error logging is implemented for debugging
