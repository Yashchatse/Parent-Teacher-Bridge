# Backend Integration Guide

## Overview
This guide explains how to integrate the admin management component with your .NET backend API.

## Current Setup

### Mock Service (Current)
The application currently uses a mock service that simulates API calls for testing purposes. This allows you to:
- Test the UI without the backend running
- Develop and debug the frontend independently
- Have realistic data for development

### Real API Integration
When your backend is ready, you can switch to real API calls by following these steps:

## Step 1: Enable Real API Calls

1. **Open** `src/services/adminService.js`
2. **Comment out** the mock implementation (lines 1-150)
3. **Uncomment** the axios implementation (lines 152-250)
4. **Save** the file

```javascript
// Comment out this section:
/*
const mockAdmins = [...];
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const adminService = { ... };
*/

// Uncomment this section:
import axios from 'axios';
const api = axios.create({...});
export const adminService = { ... };
```

## Step 2: Backend API Endpoints

Your backend should implement these endpoints:

### GET /admin/Admins
- **Purpose**: Get all admins
- **Response**: Array of admin objects
- **Status**: ✅ Implemented in your controller

### GET /admin/Admins/{id}
- **Purpose**: Get admin by ID
- **Response**: Single admin object
- **Status**: ✅ Implemented in your controller

### POST /admin/Admins
- **Purpose**: Create new admin
- **Request Body**: Admin object with required fields
- **Response**: Created admin object
- **Status**: ✅ Implemented in your controller

### PUT /admin/Admins/{id}
- **Purpose**: Update existing admin
- **Request Body**: Updated admin object
- **Response**: Updated admin object
- **Status**: ✅ Implemented in your controller

### DELETE /admin/Admins/{id}
- **Purpose**: Delete admin
- **Response**: Success confirmation
- **Status**: ✅ Implemented in your controller

## Step 3: Data Structure

### Expected Admin Object Structure
```javascript
{
  adminId: number,        // Primary key
  name: string,           // Required
  email: string,          // Required
  password: string,       // Required for creation
  phone: string,          // Optional
  address: string,        // Optional
  role: string,           // "Admin", "Super Admin", "System Admin"
  status: string,         // "Active", "Inactive", "Suspended"
  createdDate: string     // ISO date string
}
```

### Backend Model (C#)
```csharp
public class Admin
{
    public int AdminId { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public string Role { get; set; }
    public string Status { get; set; }
    public DateTime CreatedDate { get; set; }
}
```

## Step 4: CORS Configuration

Ensure your backend allows CORS requests from your frontend:

```csharp
// In Startup.cs or Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// In Configure method
app.UseCors("AllowFrontend");
```

## Step 5: Authentication (Optional)

If you want to add authentication:

1. **Add JWT token handling** in the axios interceptors
2. **Implement login endpoint** in your backend
3. **Store tokens** in localStorage
4. **Add authorization headers** to requests

```javascript
// In adminService.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Step 6: Error Handling

The frontend handles these error scenarios:

- **Network errors**: Connection issues
- **Validation errors**: Invalid data
- **Server errors**: 500 status codes
- **Not found errors**: 404 status codes
- **Unauthorized errors**: 401 status codes

## Testing the Integration

1. **Start your backend** at `https://localhost:44317`
2. **Switch to real API** in `adminService.js`
3. **Test CRUD operations**:
   - Create new admin
   - View admin list
   - Update admin details
   - Delete admin
   - Search admins

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CORS is configured in backend
   - Check origin URLs match

2. **Network Errors**
   - Verify backend is running
   - Check URL in axios configuration
   - Ensure HTTPS/HTTP matches

3. **Data Format Errors**
   - Verify JSON structure matches
   - Check field names (camelCase vs PascalCase)
   - Ensure required fields are present

4. **Authentication Errors**
   - Check token format
   - Verify token expiration
   - Ensure authorization headers

### Debug Steps

1. **Check Network Tab** in browser dev tools
2. **Verify Request/Response** data
3. **Check Console** for error messages
4. **Test API endpoints** directly (Postman/curl)
5. **Verify Backend Logs** for errors

## Migration Checklist

- [ ] Backend API is running and accessible
- [ ] CORS is configured correctly
- [ ] API endpoints match expected structure
- [ ] Data format is consistent
- [ ] Error handling is implemented
- [ ] Authentication is configured (if needed)
- [ ] Frontend service is updated
- [ ] All CRUD operations work
- [ ] Search functionality works
- [ ] Error messages display correctly

## Performance Considerations

1. **Pagination**: For large datasets
2. **Caching**: Implement client-side caching
3. **Optimistic Updates**: Show changes immediately
4. **Loading States**: Provide user feedback
5. **Error Recovery**: Graceful error handling

## Security Considerations

1. **Input Validation**: Both client and server
2. **Password Hashing**: Use BCrypt (already implemented)
3. **HTTPS**: Use secure connections
4. **Token Security**: Secure token storage
5. **SQL Injection**: Use parameterized queries
6. **XSS Protection**: Sanitize user inputs 