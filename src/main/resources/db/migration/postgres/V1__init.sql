-- PostgreSQL Migration V1 - Initialize Schema

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Accounts table
CREATE TABLE accounts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    opening_balance NUMERIC(18,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Categories table
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('income','expense')),
    color VARCHAR(7),
    icon VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Transaction type enum
CREATE TYPE tx_type AS ENUM ('EXPENSE','INCOME','TRANSFER_OUT','TRANSFER_IN');

-- Transactions table
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    account_id BIGINT NOT NULL,
    category_id BIGINT,
    type tx_type NOT NULL,
    date DATE NOT NULL,
    amount NUMERIC(18,2) NOT NULL,
    note TEXT,
    transfer_group VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    (1, 1, 'Cash', 'cash', 500000.00),
    (2, 1, 'Bank BCA', 'bank', 8500000.00),
    (3, 1, 'OVO', 'wallet', 250000.00);

INSERT INTO categories(id, user_id, name, type) VALUES 
    (1, 1, 'Makanan', 'expense'),
    (2, 1, 'Transport', 'expense'),
    (3, 1, 'Gaji', 'income');
