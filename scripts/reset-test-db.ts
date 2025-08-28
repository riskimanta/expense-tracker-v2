#!/usr/bin/env tsx

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const TEST_DB_PATH = path.join(process.cwd(), 'test-expenses.db')

async function resetTestDb() {
  console.log('🧹 Resetting test database...')
  
  try {
    // Remove test database if it exists
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH)
      console.log('✅ Removed existing test database')
    }
    
    // Copy the main database to test database
    const mainDbPath = path.join(process.cwd(), 'expenses.db')
    if (fs.existsSync(mainDbPath)) {
      fs.copyFileSync(mainDbPath, TEST_DB_PATH)
      console.log('✅ Copied main database to test database')
    } else {
      console.log('⚠️  Main database not found, creating empty test database')
      // Create empty test database with basic schema
      const sqlite3 = require('better-sqlite3')
      const db = new sqlite3(TEST_DB_PATH)
      
      // Create basic schema
      db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'expense',
          color TEXT,
          icon TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS accounts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'CASH',
          opening_balance DECIMAL(15,2) DEFAULT 0,
          user_id INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        );
        
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          category_id INTEGER NOT NULL,
          amount DECIMAL(15,2) NOT NULL,
          note TEXT,
          account_id INTEGER NOT NULL,
          user_id INTEGER DEFAULT 1,
          type TEXT NOT NULL DEFAULT 'EXPENSE',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          transfer_group TEXT,
          FOREIGN KEY (category_id) REFERENCES categories (id),
          FOREIGN KEY (account_id) REFERENCES accounts (id),
          FOREIGN KEY (user_id) REFERENCES users (id)
        );
      `)
      
      // Insert test data
      db.exec(`
        INSERT INTO users (id, name, email) VALUES (1, 'Test User', 'test@example.com');
        
        INSERT INTO categories (name, type, color) VALUES 
          ('Makanan', 'expense', 'var(--needs)'),
          ('Transportasi', 'expense', 'var(--needs)'),
          ('Belanja', 'expense', 'var(--wants)'),
          ('Tagihan', 'expense', 'var(--needs)'),
          ('Lainnya', 'expense', 'var(--wants)'),
          ('Gaji', 'income', 'var(--savings)'),
          ('Bonus', 'income', 'var(--savings)');
        
        INSERT INTO accounts (name, type, opening_balance) VALUES 
          ('Cash', 'CASH', 1000000),
          ('BCA', 'BANK', 5000000);
      `)
      
      db.close()
      console.log('✅ Created test database with schema and seed data')
    }
    
    console.log('🎉 Test database reset complete!')
    console.log(`📁 Test database location: ${TEST_DB_PATH}`)
    
  } catch (error) {
    console.error('❌ Error resetting test database:', error)
    process.exit(1)
  }
}

resetTestDb()
