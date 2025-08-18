using ParentTeacherBridge.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface ITeacherService
{
    //Task<IEnumerable<Teacher>> GetAllTeachersAsync();
    //Task<bool> CreateTeacherAsync(Teacher teacher);
    //Task<Teacher> GetTeacherByIdAsync(int id);
    //Task<bool> UpdateTeacherAsync(Teacher teacher);
    //Task<bool> DeleteTeacherAsync(int id);

    Task<IEnumerable<Teacher>> GetAllTeachersAsync();
    Task<Teacher?> GetTeacherByIdAsync(int id);
    Task<Teacher?> GetTeacherByEmailAsync(string email);
    Task<bool> CreateTeacherAsync(Teacher teacher);
    Task<bool> UpdateTeacherAsync(int id, Teacher teacher);
    Task<bool> DeleteTeacherAsync(int id);
    Task<bool> TeacherExistsAsync(int id);
    Task<IEnumerable<Teacher>> GetActiveTeachersAsync();
    Task<IEnumerable<Teacher>> SearchTeachersAsync(string searchTerm);
    Task<bool> ValidateTeacherDataAsync(Teacher teacher, int? excludeId = null);
}