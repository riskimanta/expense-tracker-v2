# Testing Guide

This document describes the testing setup for the Expense Tracker application.

## Overview

The application uses a comprehensive testing strategy:
- **Unit Tests**: Vitest + React Testing Library for component testing
- **E2E Tests**: Playwright for end-to-end testing
- **Accessibility Tests**: axe-core integration for a11y compliance
- **Visual Tests**: Screenshot comparison for UI consistency

## Prerequisites

- Node.js 20+
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run pretest:e2e
```

## Test Database Setup

The testing environment uses a separate SQLite database:

```bash
# Reset test database
node scripts/reset-test-db.ts
```

This creates `test-expenses.db` with:
- Test user
- Sample categories (Makanan, Transportasi, Belanja, Tagihan, Lainnya)
- Sample accounts (Cash, BCA)

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Update snapshots
npm run test:e2e:update

# Run specific test file
npx playwright test tests/e2e/smoke.spec.ts

# Run tests in headed mode
npx playwright test --headed
```

### Test Server

```bash
# Start test server (for E2E testing)
npm run test:serve
```

## Test Structure

### Unit Tests (`src/test/`)

- **Components**: Test individual React components
- **Utilities**: Test helper functions and utilities
- **Hooks**: Test custom React hooks

### E2E Tests (`tests/e2e/`)

- **smoke.spec.ts**: Basic functionality verification
- **filter-and-period.spec.ts**: Filter and period selection
- **currency-input.spec.ts**: Currency input formatting
- **create-income-expense.spec.ts**: Transaction creation
- **can-buy.spec.ts**: "Bisa Beli Nggak?" functionality
- **a11y.spec.ts**: Accessibility compliance
- **visual-smoke.spec.ts**: Visual consistency

## Data Test IDs

The application uses stable selectors for testing:

### Form Elements
- `tx-date`: Transaction date input
- `tx-category`: Category selection
- `amount-input`: Amount input with currency formatting
- `tx-account`: Account selection
- `tx-note`: Transaction note/description
- `tx-submit`: Submit button

### Filter Elements
- `period-trigger`: Month/year picker
- `category-select`: Category filter
- `account-select`: Account filter

### Data Display
- `tx-table`: Transaction table
- `tx-row`: Individual transaction row
- `chart-daily`: Daily cash flow chart
- `chart-donut`: Category breakdown chart

### Mini Advisor
- `canbuy-input`: Price input field
- `canbuy-submit`: Check affordability button
- `canbuy-result`: Affordability result display

## Test Data

### Categories
- **Expense**: Makanan, Transportasi, Belanja, Tagihan, Lainnya
- **Income**: Gaji, Bonus

### Accounts
- **Cash**: Rp 1.000.000
- **BCA**: Rp 5.000.000

## CI/CD Integration

GitHub Actions automatically runs tests on:
- Push to main/develop branches
- Pull requests

### CI Pipeline
1. Install dependencies
2. Setup test database
3. Run unit tests
4. Build application
5. Install Playwright browsers
6. Start test server
7. Run E2E tests
8. Upload test reports and artifacts

## Debugging Tests

### Playwright Debug Mode

```bash
# Run tests in debug mode
npx playwright test --debug

# Show browser during test execution
npx playwright test --headed
```

### Test Reports

```bash
# Open Playwright HTML report
npx playwright show-report

# Show test results
npx playwright show-results
```

### Screenshots and Videos

Failed tests automatically generate:
- Screenshots (`test-results/`)
- Video recordings (`test-results/`)
- Trace files for debugging

## Best Practices

### Writing Tests

1. **Use data-testid**: Prefer stable selectors over text content
2. **Test User Behavior**: Focus on user interactions, not implementation details
3. **Clean Test Data**: Reset state between tests
4. **Meaningful Assertions**: Test business logic, not just presence

### Test Organization

1. **Group Related Tests**: Use `test.describe()` for logical grouping
2. **Descriptive Names**: Test names should explain the expected behavior
3. **Setup and Teardown**: Use `beforeEach`/`afterEach` for common operations
4. **Isolation**: Tests should not depend on each other

### Performance

1. **Parallel Execution**: Tests run in parallel by default
2. **Efficient Selectors**: Use specific selectors for faster element location
3. **Minimal Waits**: Use `waitFor` instead of arbitrary timeouts
4. **Resource Cleanup**: Close browsers and clean up resources

## Troubleshooting

### Common Issues

1. **Test Database**: Ensure `test-expenses.db` exists and has correct schema
2. **Port Conflicts**: Check if port 3000 is available for test server
3. **Browser Issues**: Reinstall Playwright browsers if needed
4. **Environment Variables**: Verify test environment configuration

### Debug Commands

```bash
# Check test database
sqlite3 test-expenses.db ".schema"

# Verify Playwright installation
npx playwright --version

# Check test configuration
npx playwright test --list
```

## Contributing

When adding new features:

1. **Add Unit Tests**: Test individual components and functions
2. **Add E2E Tests**: Test user workflows end-to-end
3. **Update Test IDs**: Add `data-testid` attributes for new elements
4. **Update Documentation**: Keep this guide current

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [axe-core Accessibility Testing](https://github.com/dequelabs/axe-core)
