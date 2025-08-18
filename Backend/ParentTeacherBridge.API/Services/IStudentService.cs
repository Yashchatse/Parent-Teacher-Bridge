using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Services
{
    public interface IStudentService
    {
        Task<IEnumerable<Student>> GetAllStudentsAsync();
        //Task<IEnumerable<Student>> GetStudentsByClassAsync(int classId);
        Task<SchoolClass?> GetClassByTeacherIdAsync(int teacherId);
        //Task<Student?> GetStudentByIdAsync(int studentId);


        //Task<IEnumerable<Student>> GetAllStudentsAsync();
        Task<Student?> GetStudentByIdAsync(int id);
        Task<Student?> GetStudentByEnrollmentNoAsync(string enrollmentNo);
        Task<bool> CreateStudentAsync(Student student);
        Task<bool> UpdateStudentAsync(int id, Student student);
        Task<bool> DeleteStudentAsync(int id);
        Task<bool> StudentExistsAsync(int id);
        Task<IEnumerable<Student>> GetStudentsByClassAsync(int classId);
        Task<IEnumerable<Student>> SearchStudentsAsync(string searchTerm);
        Task<bool> ValidateStudentDataAsync(Student student, int? excludeId = null);
        Task<IEnumerable<Student>> GetStudentsByTeacherAsync(int teacherId);

    }
}
