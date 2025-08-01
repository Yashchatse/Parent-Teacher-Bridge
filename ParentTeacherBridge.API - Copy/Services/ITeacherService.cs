using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Services
{
    public interface ITeacherService
    {
        Task<IEnumerable<Teacher>> GetAllTeachersAsync();
        Task<Teacher?> GetTeacherByIdAsync(int id);
        Task<Teacher?> GetTeacherByEmailAsync(string email);
        Task<bool> CreateTeacherAsync(Teacher teacher);
        Task<bool> UpdateTeacherAsync(int id, Teacher teacher);
        Task<bool> DeleteTeacherAsync(int id);
        Task<bool> TeacherExistsAsync(int id);
        Task<IEnumerable<Teacher>> GetActiveTeachersAsync();
        Task<IEnumerable<Teacher>> SearchTeachersAsync(string searchTerm);


        // this method for validating teacher data
        Task<bool> ValidateTeacherDataAsync(Teacher teacher, int? excludeId = null);
    }
}
