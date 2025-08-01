using ParentTeacherBridge.API.Models;
using ParentTeacherBridge.API.Repositories;

namespace ParentTeacherBridge.API.Services
{
    public class TeacherService : ITeacherService
    {
        private readonly ITeacherRepository _repo;
        private readonly ILogger<TeacherService> _logger;

        public TeacherService(ITeacherRepository repo, ILogger<TeacherService> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        public async Task<IEnumerable<Teacher>> GetAllTeachersAsync()
        {
            try
            {
                return await _repo.GetAllAsync();
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
                return await _repo.GetByIdAsync(id);
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
                return await _repo.GetByEmailAsync(email);
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

                await _repo.AddAsync(teacher);
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
                var existing = await _repo.GetByIdAsync(id);
                if (existing == null)
                    return false;

                // Validate teacher data (excluding current teacher from email check)
                if (!await ValidateTeacherDataAsync(teacher, id))
                {
                    return false;
                }

                teacher.TeacherId = id;
                await _repo.UpdateAsync(teacher);
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
                var teacher = await _repo.GetByIdAsync(id);
                if (teacher == null)
                    return false;

                await _repo.DeleteAsync(teacher);
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
                return await _repo.ExistsAsync(id);
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
                return await _repo.GetActiveTeachersAsync();
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

                return await _repo.SearchTeachersAsync(searchTerm);
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
                    var emailExists = await _repo.EmailExistsAsync(teacher.Email, excludeId);
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
}
