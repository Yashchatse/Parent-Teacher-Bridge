# Login Integration with C# Backend

## Overview
This React application now integrates with your C# backend API for authentication. The login system uses JWT tokens for secure authentication.

## Backend Requirements
Your C# backend should have the following endpoint:
- **URL**: `https://localhost:44317/login/login/admin/login`
- **Method**: POST
- **Body**: 
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- **Response**: 
  ```json
  {
    "token": "jwt_token_here"
  }
  ```

## Frontend Features

### Login Service (`src/services/loginService.js`)
- Handles authentication with the C# backend
- Stores JWT tokens in localStorage
- Manages user session data
- Provides logout functionality
- Auto-redirects on authentication errors

### Login Component (`src/components/login.tsx`)
- Updated to use the login service
- Shows success/error messages
- Handles loading states
- Validates form inputs

### App Component (`src/App.tsx`)
- Manages authentication state
- Checks for existing tokens on app load
- Handles login/logout flow
- Persists user session

## How to Use

1. **Start your C# backend** on `https://localhost:44317`
2. **Start the React app**: `npm run dev`
3. **Navigate to the login page**
4. **Enter admin credentials** that match your backend database
5. **Login successfully** to access the dashboard

## Authentication Flow

1. User enters email/password
2. Frontend sends POST request to `/login/login/admin/login`
3. Backend validates credentials using BCrypt
4. Backend returns JWT token
5. Frontend stores token in localStorage
6. User is redirected to dashboard
7. All subsequent API calls include the JWT token

## Security Features

- **JWT Token Storage**: Tokens are stored in localStorage
- **Auto-logout**: Invalid tokens trigger automatic logout
- **Request Interceptors**: All API calls automatically include auth headers
- **Error Handling**: Proper error messages for failed logins

## Testing

To test the login system:

1. Ensure your C# backend is running
2. Create an admin user in your database
3. Use those credentials to login
4. Check browser console for detailed logs
5. Verify the dashboard shows the admin name

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure your C# backend allows requests from your React app
2. **Network Errors**: Check if the backend URL is correct
3. **Authentication Errors**: Verify admin credentials exist in your database
4. **Token Issues**: Check browser console for JWT token errors

### Debug Logs:
The login service includes detailed console logs:
- `🔐 Attempting admin login:` - Login attempt
- `✅ Admin login successful:` - Successful login
- `❌ Admin login failed:` - Failed login
- `🔓 User logged out` - Logout action
