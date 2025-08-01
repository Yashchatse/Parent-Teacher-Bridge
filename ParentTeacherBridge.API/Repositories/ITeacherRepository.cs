using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Repositories
{
    public interface ITeacherRepository
    {
        Task<IEnumerable<Teacher>> GetAllAsync();
        Task<Teacher?> GetByIdAsync(int id);
        Task<Teacher?> GetByEmailAsync(string email);
        Task AddAsync(Teacher teacher);
        Task UpdateAsync(Teacher teacher);
        Task DeleteAsync(Teacher teacher);
        Task<bool> ExistsAsync(int id);
        Task<bool> EmailExistsAsync(string email, int? excludeId = null);
        Task<IEnumerable<Teacher>> GetActiveTeachersAsync();
        Task<IEnumerable<Teacher>> SearchTeachersAsync(string searchTerm);

    }
}
