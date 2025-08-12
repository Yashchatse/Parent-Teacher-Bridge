# Teacher Management Backend Integration Guide

## Overview
This guide explains how to integrate the teacher management component with your .NET backend API.

## Current Setup

### Mock Service (Current)
The application currently uses a mock service that simulates API calls for testing purposes. This allows you to:
- Test the UI without the backend running
- Develop and debug the frontend independently
- Have realistic data for development

### Real API Integration
When your backend is ready, you can switch to real API calls by following these steps:

## Step 1: Enable Real API Calls

1. **Open** `src/services/teacherService.js`
2. **Comment out** the mock implementation (lines 120-280)
3. **Uncomment** the axios implementation (lines 1-120)
4. **Save** the file

```javascript
// Comment out this section:
/*
const mockTeachers = [...];
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const teacherService = { ... };
*/

// Uncomment this section:
import axios from 'axios';
const api = axios.create({...});
export const teacherService = { ... };
```

## Step 2: Backend API Endpoints

Your backend should implement these endpoints:

### GET /admin/teachers
- **Purpose**: Get all teachers
- **Response**: Array of teacher objects
- **Status**: ✅ Implemented in your controller

### GET /admin/teachers/{id}
- **Purpose**: Get teacher by ID
- **Response**: Single teacher object
- **Status**: ✅ Implemented in your controller

### GET /admin/teachers/active
- **Purpose**: Get active teachers only
- **Response**: Array of active teacher objects
- **Status**: ✅ Implemented in your controller

### GET /admin/teachers/search?term=searchTerm
- **Purpose**: Search teachers by name, email, or qualification
- **Response**: Array of matching teacher objects
- **Status**: ✅ Implemented in your controller

### POST /admin/teachers
- **Purpose**: Create new teacher
- **Request Body**: Teacher object with required fields
- **Response**: Created teacher object
- **Status**: ✅ Implemented in your controller

### PUT /admin/teachers/{id}
- **Purpose**: Update existing teacher
- **Request Body**: Updated teacher object
- **Response**: Updated teacher object
- **Status**: ✅ Implemented in your controller

### DELETE /admin/teachers/{id}
- **Purpose**: Delete teacher
- **Response**: Success confirmation
- **Status**: ✅ Implemented in your controller

## Step 3: Data Structure

### Expected Teacher Object Structure
```javascript
{
  teacherId: number,        // Primary key (auto-increment)
  name: string,             // Required
  email: string,            // Required
  password: string,         // Required for creation
  phone: string,            // Optional
  gender: string,           // Optional: "Male", "Female", "Other"
  photo: string,            // Optional: URL to photo
  qualification: string,    // Optional: e.g., "Ph.D. in Mathematics"
  experienceYears: number,  // Optional: years of experience
  isActive: boolean,        // Optional: true/false
  createdAt: string         // ISO date string
}
```

### Backend Model (C#)
```csharp
public class Teacher
{
    public int TeacherId { get; set; }           // Auto-increment primary key
    public string? Name { get; set; }            // Required
    public string? Email { get; set; }           // Required
    public string? Phone { get; set; }           // Optional
    public string? Gender { get; set; }          // Optional
    public string? Photo { get; set; }           // Optional
    public string? Qualification { get; set; }   // Optional
    public int? ExperienceYears { get; set; }    // Optional
    public bool? IsActive { get; set; }          // Optional
    public DateTime? CreatedAt { get; set; }     // Auto-set on creation
}
```

## Step 4: Database Schema

### SQL Server Table Creation
```sql
CREATE TABLE Teachers (
    TeacherId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Phone NVARCHAR(20) NULL,
    Gender NVARCHAR(10) NULL,
    Photo NVARCHAR(500) NULL,
    Qualification NVARCHAR(200) NULL,
    ExperienceYears INT NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Create indexes for better performance
CREATE INDEX IX_Teachers_Email ON Teachers(Email);
CREATE INDEX IX_Teachers_IsActive ON Teachers(IsActive);
CREATE INDEX IX_Teachers_Name ON Teachers(Name);
```

## Step 5: Teacher Service Implementation

### C# Teacher Service Interface
```csharp
public interface ITeacherService
{
    Task<IEnumerable<Teacher>> GetAllTeachersAsync();
    Task<Teacher?> GetTeacherByIdAsync(int id);
    Task<IEnumerable<Teacher>> GetActiveTeachersAsync();
    Task<IEnumerable<Teacher>> SearchTeachersAsync(string searchTerm);
    Task<bool> CreateTeacherAsync(Teacher teacher);
    Task<bool> UpdateTeacherAsync(int id, Teacher teacher);
    Task<bool> DeleteTeacherAsync(int id);
}
```

### C# Teacher Service Implementation
```csharp
public class TeacherService : ITeacherService
{
    private readonly ApplicationDbContext _context;

    public TeacherService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Teacher>> GetAllTeachersAsync()
    {
        return await _context.Teachers
            .OrderBy(t => t.Name)
            .ToListAsync();
    }

    public async Task<Teacher?> GetTeacherByIdAsync(int id)
    {
        return await _context.Teachers
            .FirstOrDefaultAsync(t => t.TeacherId == id);
    }

    public async Task<IEnumerable<Teacher>> GetActiveTeachersAsync()
    {
        return await _context.Teachers
            .Where(t => t.IsActive == true)
            .OrderBy(t => t.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Teacher>> SearchTeachersAsync(string searchTerm)
    {
        return await _context.Teachers
            .Where(t => t.Name.Contains(searchTerm) || 
                       t.Email.Contains(searchTerm) || 
                       t.Qualification.Contains(searchTerm))
            .OrderBy(t => t.Name)
            .ToListAsync();
    }

    public async Task<bool> CreateTeacherAsync(Teacher teacher)
    {
        try
        {
            teacher.CreatedAt = DateTime.UtcNow;
            teacher.IsActive = teacher.IsActive ?? true;
            
            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> UpdateTeacherAsync(int id, Teacher teacher)
    {
        try
        {
            var existingTeacher = await _context.Teachers.FindAsync(id);
            if (existingTeacher == null)
                return false;

            existingTeacher.Name = teacher.Name;
            existingTeacher.Email = teacher.Email;
            existingTeacher.Phone = teacher.Phone;
            existingTeacher.Gender = teacher.Gender;
            existingTeacher.Photo = teacher.Photo;
            existingTeacher.Qualification = teacher.Qualification;
            existingTeacher.ExperienceYears = teacher.ExperienceYears;
            existingTeacher.IsActive = teacher.IsActive;

            await _context.SaveChangesAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> DeleteTeacherAsync(int id)
    {
        try
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null)
                return false;

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }
}
```

## Step 6: CORS Configuration

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

## Step 7: Authentication (Optional)

If you want to add authentication:

```javascript
// In teacherService.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Step 8: Error Handling

The frontend handles these error scenarios:

- **Network errors**: Connection issues
- **Validation errors**: Invalid data
- **Server errors**: 500 status codes
- **Not found errors**: 404 status codes
- **Unauthorized errors**: 401 status codes

## Testing the Integration

1. **Start your backend** at `https://localhost:44317`
2. **Switch to real API** in `teacherService.js`
3. **Test CRUD operations**:
   - Create new teacher
   - View teacher list
   - Update teacher details
   - Delete teacher
   - Search teachers
   - Filter active teachers

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

4. **Auto-increment Issues**
   - Ensure TeacherId is set as IDENTITY(1,1) in database
   - Check that TeacherId is not being sent in POST requests

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
- [ ] Active teachers filter works
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