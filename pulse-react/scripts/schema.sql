-- Schema for PulseFit Fitness Studio
-- Tables: users, classes, trainers, pricing_plans, bookings

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
    description TEXT NOT NULL,
    tag_color VARCHAR(100) NOT NULL
);

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
