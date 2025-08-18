using Microsoft.EntityFrameworkCore;
using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Repositories
{
    public class StudentRepository:IStudentRepository
    {

        private readonly ParentTeacherBridgeAPIContext _context;
        private readonly ILogger<StudentRepository> _logger;

        public StudentRepository(ParentTeacherBridgeAPIContext context, ILogger<StudentRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Student>> GetAllStudentsAsync()
        {
            return await _context.Student.ToListAsync();
        }

        public async Task<IEnumerable<Student>> GetStudentsByClassIdAsync(int classId)
        {
            return await _context.Student
                                 .Where(s => s.ClassId == classId)
                                 .ToListAsync();
        }

        public async Task<SchoolClass?> GetClassByTeacherIdAsync(int teacherId)
        {
            return await _context.SchoolClass
                                 .FirstOrDefaultAsync(c => c.ClassTeacherId == teacherId);
        }

        public async Task<Student?> GetStudentByIdAsync(int studentId)
        {
            return await _context.Student
                                 .FirstOrDefaultAsync(s => s.StudentId == studentId);
        }
        public async Task<IEnumerable<Student>> GetAllAsync()
        {
            try
            {
                return await _context.Student
                    .Include(s => s.Class)
                    .OrderBy(s => s.Name)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving all students");
                throw;
            }
        }

        public async Task<Student?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Student
                    .Include(s => s.Class)
                    .FirstOrDefaultAsync(s => s.StudentId == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving student with ID {StudentId}", id);
                throw;
            }
        }

        public async Task<Student?> GetByEnrollmentNoAsync(string enrollmentNo)
        {
            try
            {
                return await _context.Student
                    .Include(s => s.Class)
                    .FirstOrDefaultAsync(s => s.EnrollmentNo == enrollmentNo);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving student with enrollment number {EnrollmentNo}", enrollmentNo);
                throw;
            }
        }

        public async Task AddAsync(Student student)
        {
            try
            {
                student.CreatedAt = DateTime.UtcNow;
                student.UpdatedAt = DateTime.UtcNow;
                await _context.Student.AddAsync(student);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding student");
                throw;
            }
        }

        public async Task UpdateAsync(Student student)
        {
            try
            {
                var existingStudent = await _context.Student.FindAsync(student.StudentId);
                if (existingStudent == null)
                {
                    throw new InvalidOperationException($"Student with ID {student.StudentId} not found");
                }

                // Update fields
                existingStudent.Name = student.Name;
                existingStudent.Dob = student.Dob;
                existingStudent.Gender = student.Gender;
                existingStudent.EnrollmentNo = student.EnrollmentNo;
                existingStudent.BloodGroup = student.BloodGroup;
                existingStudent.ClassId = student.ClassId;
                existingStudent.ProfilePhoto = student.ProfilePhoto;
                existingStudent.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating student with ID {StudentId}", student.StudentId);
                throw;
            }
        }

        public async Task DeleteAsync(Student student)
        {
            try
            {
                _context.Student.Remove(student);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting student with ID {StudentId}", student.StudentId);
                throw;
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            try
            {
                return await _context.Student.AnyAsync(s => s.StudentId == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while checking if student exists with ID {StudentId}", id);
                throw;
            }
        }

        public async Task<bool> EnrollmentNoExistsAsync(string enrollmentNo, int? excludeId = null)
        {
            try
            {
                var query = _context.Student.Where(s => s.EnrollmentNo == enrollmentNo);

                if (excludeId.HasValue)
                {
                    query = query.Where(s => s.StudentId != excludeId.Value);
                }

                return await query.AnyAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while checking if enrollment number exists: {EnrollmentNo}", enrollmentNo);
                throw;
            }
        }

        public async Task<IEnumerable<Student>> GetStudentsByClassAsync(int classId)
        {
            try
            {
                return await _context.Student
                    .Include(s => s.Class)
                    .Where(s => s.ClassId == classId)
                    .OrderBy(s => s.Name)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving students for class {ClassId}", classId);
                throw;
            }
        }

        public async Task<IEnumerable<Student>> SearchStudentsAsync(string searchTerm)
        {
            try
            {
                return await _context.Student
                    .Include(s => s.Class)
                    .Where(s => s.Name!.Contains(searchTerm) ||
                               s.EnrollmentNo!.Contains(searchTerm))
                    .OrderBy(s => s.Name)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while searching students with term: {SearchTerm}", searchTerm);
                throw;
            }
        }

        public async Task<IEnumerable<Student>> GetStudentsByTeacherAsync(int teacherId)
        {
            return await _context.Student
                .Where(s => s.ClassId != null &&
                            _context.SchoolClass
                                .Any(c => c.ClassId == s.ClassId && c.ClassTeacherId == teacherId))
                .ToListAsync();
        }

    }
}
