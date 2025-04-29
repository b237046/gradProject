# Authentication Backend with Email Verification

A Node.js and MySQL-based authentication system with email verification.

## Features

- User registration with email
- Email verification with 6-digit code
- Secure login after verification
- JWT token-based authentication
- Rate limiting for security

## Prerequisites

- Node.js (v14 or higher)
- MySQL database
- Email account for sending verification emails

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file based on the provided `.env` example
   - Update database credentials and email settings

4. Start the server:
   ```
   npm run dev
   ```
   
## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/verify-email` - Verify email with code
- `POST /api/auth/resend-verification` - Resend verification code
- `POST /api/auth/login` - Login user

### User

- `GET /api/users/profile` - Get user profile (protected route)

## Database Schema

The system uses a simple user table with the following structure:

- `id` - Primary key
- `name` - User's name 
- `email` - User's email (unique)
- `password` - password
- `is_verified` - Boolean indicating verification status
- `verification_code` - 6-digit verification code
- `code_expiry` - Expiration time for the verification code
- `created_at` - User creation timestamp
- `updated_at` - User update timestamp