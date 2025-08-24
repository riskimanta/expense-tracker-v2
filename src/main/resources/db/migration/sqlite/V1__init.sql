-- SQLite Migration V1 - Initialize Schema

-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

-- Accounts table
CREATE TABLE accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    opening_balance REAL NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Categories table
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income','expense')),
    color TEXT,
    icon TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Transactions table
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    category_id INTEGER,
    type TEXT NOT NULL CHECK(type IN ('EXPENSE','INCOME','TRANSFER_OUT','TRANSFER_IN')),
    date TEXT NOT NULL,
    amount REAL NOT NULL,
    note TEXT,
    transfer_group TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Indexes
CREATE INDEX idx_tx_user_date ON transactions(user_id, date);
CREATE INDEX idx_tx_account ON transactions(account_id);
CREATE INDEX idx_tx_category ON transactions(category_id);

-- Seed data
INSERT INTO users(id, name, email) VALUES (1, 'Manta', 'manta@mail.com');

INSERT INTO accounts(id, user_id, name, type, opening_balance) VALUES 
    (1, 1, 'Cash', 'cash', 500000),
    (2, 1, 'Bank BCA', 'bank', 8500000),
    (3, 1, 'OVO', 'wallet', 250000);

INSERT INTO categories(id, user_id, name, type) VALUES 
    (1, 1, 'Makanan', 'expense'),
    (2, 1, 'Transport', 'expense'),
    (3, 1, 'Gaji', 'income');
