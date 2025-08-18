using Microsoft.EntityFrameworkCore;
using ParentTeacherBridge.API.DTO;
using ParentTeacherBridge.API.Models;
using ParentTeacherBridge.API.Repositories;

namespace ParentTeacherBridge.API.Services
{
    public class StudentService:IStudentService
    {
        private readonly IStudentRepository _repository;
        private readonly ILogger<StudentService> _logger;

        public StudentService(IStudentRepository repository, ILogger<StudentService> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        //public async Task<IEnumerable<Student>> GetAllStudentsAsync()
        //{
        //    return await _repository.GetAllStudentsAsync();
        //}
        //public async Task<IEnumerable<Student>> GetStudentsByClassAsync(int classId)
        //{
        //    return await _repository.GetStudentsByClassIdAsync(classId);
        //}



        public async Task<SchoolClass?> GetClassByTeacherIdAsync(int teacherId)
        {
            return await _repository.GetClassByTeacherIdAsync(teacherId);
        }

        //public async Task<Student?> GetStudentByIdAsync(int studentId)
        //{
        //    return await _repository.GetStudentByIdAsync(studentId);
        //}

        public async Task<IEnumerable<Student>> GetAllStudentsAsync()
        {
            try
            {
                return await _repository.GetAllAsync();
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
                return await _repository.GetByIdAsync(id);
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
                return await _repository.GetByEnrollmentNoAsync(enrollmentNo);
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

                await _repository.AddAsync(student);
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
                var existing = await _repository.GetByIdAsync(id);
                if (existing == null)
                    return false;

                // Validate student data (excluding current student from enrollment check)
                if (!await ValidateStudentDataAsync(student, id))
                {
                    return false;
                }

                student.StudentId = id;
                await _repository.UpdateAsync(student);
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
                var student = await _repository.GetByIdAsync(id);
                if (student == null)
                    return false;

                await _repository.DeleteAsync(student);
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
                return await _repository.ExistsAsync(id);
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
                return await _repository.GetStudentsByClassAsync(classId);
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

                return await _repository.SearchStudentsAsync(searchTerm);
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
                    var enrollmentExists = await _repository.EnrollmentNoExistsAsync(student.EnrollmentNo, excludeId);
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

        public Task<IEnumerable<Student>> GetStudentsByTeacherAsync(int teacherId) =>
    _repository.GetStudentsByTeacherAsync(teacherId);


    }
}
