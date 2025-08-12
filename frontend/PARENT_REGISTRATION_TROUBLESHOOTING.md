# Parent Registration Troubleshooting Guide

## Issues Identified & Fixed

### 1. API URL Configuration Issue
- **Problem**: Service was trying to connect to `https://localhost:44317` instead of the correct backend URL
- **Solution**: Updated to use `http://localhost:5000` as default and improved environment variable handling

### 2. Poor Error Handling
- **Problem**: Generic error messages made debugging difficult
- **Solution**: Added detailed error logging and specific error messages for different failure scenarios

### 3. Missing Debug Information
- **Problem**: No visibility into what was happening during registration
- **Solution**: Added comprehensive logging for API requests, responses, and errors

## Current Configuration

### Environment Variables
Create a `.env.local` file in your project root with:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### API Endpoints
The service tries these endpoints in order:
1. `/parent/Parent/register` (preferred)
2. `/parent/Parent` (fallback)
3. `/parent/Parent` with generated ParentId (last resort)

## Debugging Steps

### 1. Check Console Logs
Open browser developer tools (F12) and look for:
- API Base URL log
- API Request logs
- API Response logs
- Error details

### 2. Verify Backend Status
Ensure your backend service is running on the correct port:
```bash
# Check if port 5000 is listening
netstat -an | grep :5000
# or
lsof -i :5000
```

### 3. Test API Endpoints
Test the registration endpoint directly:
```bash
curl -X POST http://localhost:5000/parent/Parent/register \
  -H "Content-Type: application/json" \
  -d '{
    "Name": "Test Parent",
    "Email": "test@example.com",
    "Password": "TestPass123!",
    "StudEnrollmentNo": "EN001",
    "Phone": "1234567890"
  }'
```

### 4. Check Network Tab
In browser dev tools, check the Network tab for:
- Failed requests
- Response status codes
- Response body content

## Common Error Scenarios

### Connection Refused (ECONNREFUSED)
- **Cause**: Backend service not running
- **Solution**: Start your backend service on port 5000

### 404 Not Found
- **Cause**: Registration endpoint doesn't exist
- **Solution**: Check backend routing configuration

### 500 Server Error
- **Cause**: Backend processing error
- **Solution**: Check backend logs for specific error details

### Validation Errors
- **Cause**: Invalid data format
- **Solution**: Check required fields and data validation rules

## Testing the Fix

1. **Clear browser cache** and reload the page
2. **Open developer console** to see debug logs
3. **Try registration** with valid data
4. **Check console** for detailed error information

## Expected Behavior

After the fix, you should see:
- Clear API Base URL in console
- Detailed request/response logging
- Specific error messages for different failure types
- Better debugging information

## Next Steps

1. **Test registration** with the improved error handling
2. **Check console logs** for any remaining issues
3. **Verify backend connectivity** if errors persist
4. **Update environment variables** if using different backend URL

## Support

If issues persist:
1. Check browser console for error details
2. Verify backend service is running
3. Test API endpoints directly
4. Check network connectivity
