using ParentTeacherBridge.API.Models;
using ParentTeacherBridge.API.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

public class TeacherService : ITeacherService
{
    private readonly ITeacherRepository _repository;
    private readonly ILogger<TeacherService> _logger;

    public TeacherService(ITeacherRepository repository, ILogger<TeacherService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    //public async Task<IEnumerable<Teacher>> GetAllTeachersAsync() =>
    //    await _repository.GetAllAsync();

    //public async Task<Teacher> GetTeacherByIdAsync(int id) =>
    //    await _repository.GetByIdAsync(id);

    //public async Task<bool> CreateTeacherAsync(Teacher teacher) =>
    //    await _repository.CreateAsync(teacher);

    //public async Task<bool> UpdateTeacherAsync(Teacher teacher) =>
    //    await _repository.UpdateAsync(teacher);

    //public async Task<bool> DeleteTeacherAsync(int id) =>
    //    await _repository.DeleteAsync(id);

    public async Task<IEnumerable<Teacher>> GetAllTeachersAsync()
    {
        try
        {
            return await _repository.GetAllAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TeacherService.GetAllTeachersAsync");
            throw;
        }
    }

    public async Task<Teacher?> GetTeacherByIdAsync(int id)
    {
        try
        {
            return await _repository.GetByIdAsync(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TeacherService.GetTeacherByIdAsync for ID {TeacherId}", id);
            throw;
        }
    }

    public async Task<Teacher?> GetTeacherByEmailAsync(string email)
    {
        try
        {
            return await _repository.GetByEmailAsync(email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TeacherService.GetTeacherByEmailAsync for email {Email}", email);
            throw;
        }
    }

    public async Task<bool> CreateTeacherAsync(Teacher teacher)
    {
        try
        {
            // Validate teacher data
            if (!await ValidateTeacherDataAsync(teacher))
            {
                return false;
            }

            await _repository.AddAsync(teacher);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TeacherService.CreateTeacherAsync");
            throw;
        }
    }

    public async Task<bool> UpdateTeacherAsync(int id, Teacher teacher)
    {
        try
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                return false;

            // Validate teacher data (excluding current teacher from email check)
            if (!await ValidateTeacherDataAsync(teacher, id))
            {
                return false;
            }

            teacher.TeacherId = id;
            await _repository.UpdateAsync(teacher);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TeacherService.UpdateTeacherAsync for ID {TeacherId}", id);
            throw;
        }
    }

    public async Task<bool> DeleteTeacherAsync(int id)
    {
        try
        {
            var teacher = await _repository.GetByIdAsync(id);
            if (teacher == null)
                return false;

            //await _repository.DeleteAsync(teacher);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TeacherService.DeleteTeacherAsync for ID {TeacherId}", id);
            throw;
        }
    }

    public async Task<bool> TeacherExistsAsync(int id)
    {
        try
        {
            return await _repository.ExistsAsync(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TeacherService.TeacherExistsAsync for ID {TeacherId}", id);
            throw;
        }
    }

    public async Task<IEnumerable<Teacher>> GetActiveTeachersAsync()
    {
        try
        {
            return await _repository.GetActiveTeachersAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TeacherService.GetActiveTeachersAsync");
            throw;
        }
    }

    public async Task<IEnumerable<Teacher>> SearchTeachersAsync(string searchTerm)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return await GetAllTeachersAsync();
            }

            return await _repository.SearchTeachersAsync(searchTerm);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TeacherService.SearchTeachersAsync");
            throw;
        }
    }

    public async Task<bool> ValidateTeacherDataAsync(Teacher teacher, int? excludeId = null)
    {
        try
        {
            // Check if email already exists
            if (!string.IsNullOrWhiteSpace(teacher.Email))
            {
                var emailExists = await _repository.EmailExistsAsync(teacher.Email, excludeId);
                //var emailExists = await _repository.EmailExistsAsync(teacher.Email, excludeId);
                //var emailExists = await _repository.EmailExistsAsync(teacher.Email, excludeId);
                if (emailExists)
                {
                    throw new InvalidOperationException("Email already exists");
                }
            }

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TeacherService.ValidateTeacherDataAsync");
            throw;
        }
    }
}