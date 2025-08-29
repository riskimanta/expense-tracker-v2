-- Sample Queries untuk Database expenses.db
-- Gunakan di DBeaver SQL Editor

-- 1. Lihat semua akun
SELECT * FROM accounts;

-- 2. Lihat semua kategori
SELECT * FROM categories;

-- 3. Lihat semua user
SELECT * FROM users;

-- 4. Lihat semua transaksi
SELECT * FROM transactions;

-- 5. Hitung total saldo semua akun
SELECT 
    SUM(opening_balance) as total_balance,
    COUNT(*) as total_accounts
FROM accounts;

-- 6. Lihat akun berdasarkan tipe
SELECT 
    type,
    COUNT(*) as jumlah_akun,
    SUM(opening_balance) as total_saldo
FROM accounts 
GROUP BY type;

-- 7. Lihat kategori berdasarkan tipe
SELECT 
    type,
    COUNT(*) as jumlah_kategori,
    GROUP_CONCAT(name) as nama_kategori
FROM categories 
GROUP BY type;

-- 8. Lihat transaksi dengan detail akun dan kategori
SELECT 
    t.id,
    t.amount,
    t.description,
    t.date,
    a.name as account_name,
    c.name as category_name
FROM transactions t
LEFT JOIN accounts a ON t.account_id = a.id
LEFT JOIN categories c ON t.category_id = c.id
ORDER BY t.date DESC;

-- 9. Lihat user dengan jumlah akun
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(a.id) as jumlah_akun,
    SUM(a.opening_balance) as total_saldo
FROM users u
LEFT JOIN accounts a ON u.id = a.user_id
GROUP BY u.id, u.name, u.email;

-- 10. Lihat riwayat perubahan schema (Flyway)
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC;
