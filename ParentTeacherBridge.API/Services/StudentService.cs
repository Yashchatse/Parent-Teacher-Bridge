using Microsoft.EntityFrameworkCore;
using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Models;
using ParentTeacherBridge.API.Repositories;

namespace ParentTeacherBridge.API.Services
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _repo;
        private readonly ILogger<StudentService> _logger;

        public StudentService(IStudentRepository repo, ILogger<StudentService> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        public async Task<IEnumerable<Student>> GetAllStudentsAsync()
        {
            try
            {
                return await _repo.GetAllAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in StudentService.GetAllStudentsAsync");
                throw;
            }
        }

        public async Task<Student?> GetStudentByIdAsync(int id)
        {
            try
            {
                return await _repo.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in StudentService.GetStudentByIdAsync for ID {StudentId}", id);
                throw;
            }
        }

        public async Task<Student?> GetStudentByEnrollmentNoAsync(string enrollmentNo)
        {
            try
            {
                return await _repo.GetByEnrollmentNoAsync(enrollmentNo);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in StudentService.GetStudentByEnrollmentNoAsync for enrollment number {EnrollmentNo}", enrollmentNo);
                throw;
            }
        }

        public async Task<bool> CreateStudentAsync(Student student)
        {
            try
            {
                // Validate student data
                if (!await ValidateStudentDataAsync(student))
                {
                    return false;
                }

                await _repo.AddAsync(student);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in StudentService.CreateStudentAsync");
                throw;
            }
        }

        public async Task<bool> UpdateStudentAsync(int id, Student student)
        {
            try
            {
                var existing = await _repo.GetByIdAsync(id);
                if (existing == null)
                    return false;

                // Validate student data (excluding current student from enrollment check)
                if (!await ValidateStudentDataAsync(student, id))
                {
                    return false;
                }

                student.StudentId = id;
                await _repo.UpdateAsync(student);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in StudentService.UpdateStudentAsync for ID {StudentId}", id);
                throw;
            }
        }

        public async Task<bool> DeleteStudentAsync(int id)
        {
            try
            {
                var student = await _repo.GetByIdAsync(id);
                if (student == null)
                    return false;

                await _repo.DeleteAsync(student);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in StudentService.DeleteStudentAsync for ID {StudentId}", id);
                throw;
            }
        }

        public async Task<bool> StudentExistsAsync(int id)
        {
            try
            {
                return await _repo.ExistsAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in StudentService.StudentExistsAsync for ID {StudentId}", id);
                throw;
            }
        }

        public async Task<IEnumerable<Student>> GetStudentsByClassAsync(int classId)
        {
            try
            {
                return await _repo.GetStudentsByClassAsync(classId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in StudentService.GetStudentsByClassAsync for class {ClassId}", classId);
                throw;
            }
        }

        public async Task<IEnumerable<Student>> SearchStudentsAsync(string searchTerm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return await GetAllStudentsAsync();
                }

                return await _repo.SearchStudentsAsync(searchTerm);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in StudentService.SearchStudentsAsync");
                throw;
            }
        }

        public async Task<bool> ValidateStudentDataAsync(Student student, int? excludeId = null)
        {
            try
            {
                // Check if enrollment number already exists
                if (!string.IsNullOrWhiteSpace(student.EnrollmentNo))
                {
                    var enrollmentExists = await _repo.EnrollmentNoExistsAsync(student.EnrollmentNo, excludeId);
                    if (enrollmentExists)
                    {
                        throw new InvalidOperationException("Enrollment number already exists");
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in StudentService.ValidateStudentDataAsync");
                throw;
            }
        }
    }
}
