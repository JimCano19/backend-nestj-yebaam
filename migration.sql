-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS users;

-- Create users table with UUID
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'system')),
    is_read TEXT DEFAULT 'false' CHECK (is_read IN ('true', 'false')),
    metadata TEXT, -- JSON as string
    created_at TIMESTAMP DEFAULT NOW(),
    read_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Insert some sample data
INSERT INTO users (name, email) VALUES 
('Admin User', 'admin@yebaam.com'),
('Test User', 'test@yebaam.com');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type) 
SELECT 
    u.id,
    'Bienvenido a Yebaam',
    'Gracias por unirte a nuestra plataforma',
    'info'
FROM users u WHERE u.email = 'test@yebaam.com';
