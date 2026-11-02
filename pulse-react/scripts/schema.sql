-- Schema for PulseFit Fitness Studio
-- Tables: users, classes, trainers, pricing_plans, bookings, orders, order_items

-- 1. Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Classes table (Week 2 class timetable)
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL,
    days JSONB NOT NULL,
    duration VARCHAR(50) NOT NULL,
    trainer VARCHAR(100) NOT NULL,
    spots_available INTEGER NOT NULL,
    price INTEGER NOT NULL DEFAULT 15,
    description TEXT NOT NULL,
    tag_color VARCHAR(100) NOT NULL
);

ALTER TABLE classes ADD COLUMN IF NOT EXISTS price INTEGER NOT NULL DEFAULT 15;

-- 3. Trainers table (coaching staff)
CREATE TABLE IF NOT EXISTS trainers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    bio TEXT NOT NULL,
    avatar VARCHAR(20) NOT NULL
);

-- 4. Pricing Plans table (membership tiers)
CREATE TABLE IF NOT EXISTS pricing_plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    period VARCHAR(50) NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    badge VARCHAR(50),
    features JSONB NOT NULL,
    button_text VARCHAR(50) NOT NULL
);

-- 5. Bookings table (linking authenticated users with reserved classes)
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    spots INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Orders table (one row per purchase)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    total_amount INTEGER NOT NULL,
    stripe_session_id VARCHAR(255) UNIQUE,
    stripe_payment_intent_id VARCHAR(255),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Order Items table (what was bought, and at what price)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL,
    item_id VARCHAR(100) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price INTEGER NOT NULL
);
