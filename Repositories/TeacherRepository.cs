using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public class TeacherRepository : ITeacherRepository
{
    private readonly ParentTeacherBridgeAPIContext _context;

    private readonly ILogger<TeacherRepository> _logger;

    public TeacherRepository(ParentTeacherBridgeAPIContext context, ILogger<TeacherRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    //public async Task<IEnumerable<Teacher>> GetAllAsync()
    //{
    //    _logger.LogInformation("Fetching all teachers from the database.");
    //    return await _context.Teacher.ToListAsync();
    //}

    //public async Task<bool> CreateAsync(Teacher teacher)
    //{
    //    _logger.LogInformation("Creating new teacher with name {TeacherName}", teacher.Name);
    //    _context.Teacher.Add(teacher);
    //    var result = await _context.SaveChangesAsync();
    //    _logger.LogInformation("Create operation result: {Result}", result > 0);
    //    return result > 0;
    //}

    public async Task<Teacher> GetByIdAsync(int id)
    {
        _logger.LogInformation("Fetching teacher with ID {TeacherId}", id);
        return await _context.Teacher.FindAsync(id);
    }

    

    //public async Task<bool> UpdateAsync(Teacher teacher)
    //{
    //    _logger.LogInformation("Updating teacher with ID {TeacherId}", teacher.TeacherId);
    //    _context.Teacher.Update(teacher);
    //    var result = await _context.SaveChangesAsync();
    //    _logger.LogInformation("Update operation result: {Result}", result > 0);
    //    return result > 0;
    //}
    public async Task UpdateAsync(Teacher teacher)
    {
        try
        {
            var existingTeacher = await _context.Teacher.FindAsync(teacher.TeacherId);
            if (existingTeacher == null)
            {
                throw new InvalidOperationException($"Teacher with ID {teacher.TeacherId} not found");
            }

            // Update fields
            existingTeacher.Name = teacher.Name;
            existingTeacher.Email = teacher.Email;
            existingTeacher.Phone = teacher.Phone;
            existingTeacher.Gender = teacher.Gender;
            existingTeacher.Photo = teacher.Photo;
            existingTeacher.Qualification = teacher.Qualification;
            existingTeacher.ExperienceYears = teacher.ExperienceYears;
            existingTeacher.IsActive = teacher.IsActive;
            existingTeacher.UpdatedAt = DateTime.UtcNow;

            // Only update password if provided
            if (!string.IsNullOrWhiteSpace(teacher.Password))
            {
                existingTeacher.Password = teacher.Password;
            }

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating teacher with ID {TeacherId}", teacher.TeacherId);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id)
    {
        _logger.LogInformation("Deleting teacher with ID {TeacherId}", id);
        var teacher = await _context.Teacher.FindAsync(id);
        if (teacher == null)
        {
            _logger.LogWarning("Teacher with ID {TeacherId} not found.", id);
            return false;
        }

        _context.Teacher.Remove(teacher);
        var result = await _context.SaveChangesAsync();
        _logger.LogInformation("Delete operation result: {Result}", result > 0);
        return result > 0;
    }

    public async Task<IEnumerable<Teacher>> GetAllAsync()
    {
        try
        {
            return await _context.Teacher
                .OrderBy(t => t.Name)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving all teachers");
            throw;
        }
    }

    //public async Task<Teacher?> GetByIdAsync(int id)
    //{
    //    try
    //    {
    //        return await _context.Teacher.FindAsync(id);
    //    }
    //    catch (Exception ex)
    //    {
    //        _logger.LogError(ex, "Error occurred while retrieving teacher with ID {TeacherId}", id);
    //        throw;
    //    }
    //}

    public async Task<Teacher?> GetByEmailAsync(string email)
    {
        try
        {
            return await _context.Teacher
                .FirstOrDefaultAsync(t => t.Email == email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving teacher with email {Email}", email);
            throw;
        }
    }

    public async Task AddAsync(Teacher teacher)
    {
        try
        {
            teacher.CreatedAt = DateTime.UtcNow;
            teacher.UpdatedAt = DateTime.UtcNow;
            await _context.Teacher.AddAsync(teacher);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while adding teacher");
            throw;
        }
    }

    

    //public async Task DeleteAsync(Teacher teacher)
    //{
    //    try
    //    {
    //        _context.Teacher.Remove(teacher);
    //        await _context.SaveChangesAsync();
    //    }
    //    catch (Exception ex)
    //    {
    //        _logger.LogError(ex, "Error occurred while deleting teacher with ID {TeacherId}", teacher.TeacherId);
    //        throw;
    //    }
    //}

    public async Task<bool> ExistsAsync(int id)
    {
        try
        {
            return await _context.Teacher.AnyAsync(t => t.TeacherId == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while checking if teacher exists with ID {TeacherId}", id);
            throw;
        }
    }

    public async Task<bool> EmailExistsAsync(string email, int? excludeId = null)
    {
        try
        {
            var query = _context.Teacher.Where(t => t.Email == email);

            if (excludeId.HasValue)
            {
                query = query.Where(t => t.TeacherId != excludeId.Value);
            }

            return await query.AnyAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while checking if email exists: {Email}", email);
            throw;
        }
    }

    public async Task<IEnumerable<Teacher>> GetActiveTeachersAsync()
    {
        try
        {
            return await _context.Teacher
                .Where(t => t.IsActive == true)
                .OrderBy(t => t.Name)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving active teachers");
            throw;
        }
    }

    public async Task<IEnumerable<Teacher>> SearchTeachersAsync(string searchTerm)
    {
        try
        {
            return await _context.Teacher
                .Where(t => t.Name!.Contains(searchTerm) ||
                           t.Email!.Contains(searchTerm) ||
                           t.Qualification!.Contains(searchTerm))
                .OrderBy(t => t.Name)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while searching teachers with term: {SearchTerm}", searchTerm);
            throw;
        }
    }

}