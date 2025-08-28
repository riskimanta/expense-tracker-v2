# Admin Area Documentation

## Overview
Admin area untuk mengelola master data sistem Expense Tracker dengan CRUD operations lengkap.

## Setup

### 1. Environment Variables
```bash
# Enable admin access
NEXT_PUBLIC_SHOW_ADMIN=1

# Optional: Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Dependencies
```bash
npm install @tanstack/react-query zod react-hook-form @hookform/resolvers lucide-react
```

## Features

### 🔐 Access Control
- Admin area hanya muncul ketika `NEXT_PUBLIC_SHOW_ADMIN=1`
- Jika tidak di-set, akan menampilkan halaman "Hanya Admin"
- Admin link di TopNav juga hanya muncul ketika enabled

### 📊 Admin Dashboard (`/admin`)
- Statistik ringkas: Users, Categories, Accounts, Budgets, Currencies
- Quick actions untuk navigasi cepat
- System status indicator

### 👥 Users Management (`/admin/users`)
- **CRUD Operations**: Create, Read, Update, Delete
- **Fields**: Nama, Email, Role (admin/user), Status (active/inactive)
- **Validation**: Nama min 3 karakter, email valid, role enum
- **Features**: Search, Sort, Pagination, Confirmation dialogs

### 📁 Categories Management (`/admin/categories`)
- **CRUD Operations**: Create, Read, Update, Delete
- **Fields**: Nama, Tipe (expense/income), Color (hex), Icon, Default
- **Validation**: Nama min 2 karakter, color hex format
- **Features**: Type filtering, Color picker, Icon input, Default toggle

### 💰 Accounts Management (`/admin/accounts`)
- **CRUD Operations**: Create, Read, Update, Delete
- **Fields**: Nama, Tipe (cash/bank/wallet), Saldo
- **Validation**: Saldo ≥ 0
- **Features**: Search, Sort, Pagination

### 🎯 Budget Rules (`/admin/budgets`)
- **Edit Only**: Single rule per user
- **Fields**: Needs, Wants, Savings, Invest, Coins
- **Validation**: Total harus tepat 100%
- **Features**: Live sum calculation, Preset buttons (50/25/15/5/5)

### 💱 Currencies Management (`/admin/currencies`)
- **CRUD Operations**: Create, Read, Update, Delete
- **Fields**: Code, Name, Symbol, Rate to IDR, Updated
- **Validation**: Code uppercase, Rate > 0
- **Features**: IDR currency protected from deletion

### ⚙️ Settings (`/admin/settings`)
- **Fields**: Safe-to-spend buffer %, Month start date, Show decimals toggle
- **Storage**: localStorage atau mock settings
- **Features**: Export/Import JSON untuk master data

## Technical Implementation

### Data Layer
- **API Services**: `src/api/*.ts` - REST API calls dengan fallback ke mock
- **Mock Services**: `src/mock/*.ts` - In-memory data untuk development
- **Type Safety**: `src/types/admin.ts` - Zod schemas dan TypeScript types

### Components
- **AdminTable**: Generic table dengan search, sort, pagination
- **RowActions**: Edit/Delete buttons dengan icons
- **EditDrawer**: Modal form untuk create/edit
- **ConfirmDialog**: Confirmation untuk delete operations

### State Management
- **React Query**: Data fetching, caching, mutations
- **React Hook Form**: Form handling dengan Zod validation
- **Toast Notifications**: Success/error feedback

### Styling
- **CSS Variables**: Menggunakan token system (--bg, --surface, --border, --txt-*)
- **Tailwind**: Utility classes dengan custom tokens
- **Responsive**: Mobile-first design

## API Contract

### Endpoints (jika `NEXT_PUBLIC_API_URL` ada)
```
GET/POST/PUT/DELETE /api/users
GET/POST/PUT/DELETE /api/categories  
GET/POST/PUT/DELETE /api/accounts
GET/PUT /api/budgets/:userId
GET/POST/PUT/DELETE /api/currencies
```

### Fallback Behavior
- Jika API tidak tersedia, sistem otomatis menggunakan mock services
- Mock data memiliki struktur identik dengan API response
- Semua CRUD operations tetap berfungsi offline

## Usage Examples

### Enable Admin Access
```bash
# .env.local
NEXT_PUBLIC_SHOW_ADMIN=1
```

### Access Admin Area
1. Set environment variable
2. Restart development server
3. Navigate to `/admin`
4. Admin link akan muncul di TopNav

### Create New Category
1. Go to `/admin/categories`
2. Click "Tambah Kategori"
3. Fill form: Nama, Tipe, Color, Icon, Default
4. Submit form
5. Success toast akan muncul

### Edit Budget Rules
1. Go to `/admin/budgets`
2. Adjust percentages (total harus 100%)
3. Use preset button "50 / 25 / 5 / 15 / 5"
4. Save changes

## Development Notes

### Adding New Admin Pages
1. Create page component di `src/app/admin/[page]/page.tsx`
2. Add route ke `src/app/admin/layout.tsx` navigation
3. Implement CRUD operations dengan API/mock services
4. Use shared admin components untuk consistency

### Customizing Validation
1. Modify Zod schemas di page components
2. Add custom validation rules
3. Update error messages dalam bahasa Indonesia

### Styling Consistency
1. Use CSS variables dari token system
2. Follow component patterns dari existing admin pages
3. Maintain responsive design principles

## Troubleshooting

### Admin Not Showing
- Check `NEXT_PUBLIC_SHOW_ADMIN=1` in environment
- Restart development server
- Clear browser cache

### Form Validation Errors
- Check Zod schema definitions
- Verify form field names match schema
- Ensure all required fields are filled

### API Integration Issues
- Verify `NEXT_PUBLIC_API_URL` format
- Check network requests in browser dev tools
- Fallback ke mock services jika API down
