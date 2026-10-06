-- Migration: Add missing `role` column to users table
-- Run this once against your Railway (production) MySQL database
-- Safe to run multiple times — uses IF NOT EXISTS pattern via ALTER IGNORE

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user'
    AFTER avatar_url;
