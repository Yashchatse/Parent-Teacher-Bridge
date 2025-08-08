using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Repositories
{
    public interface ISubjectRepository
    {
        Task<IEnumerable<Subject>> GetAllAsync();
        Task<Subject?> GetByIdAsync(int id);
        Task<Subject?> GetByCodeAsync(string code);
        Task AddAsync(Subject subject);
        Task UpdateAsync(Subject subject);
        Task DeleteAsync(Subject subject);
        Task<bool> ExistsAsync(int id);
        Task<bool> CodeExistsAsync(string code, int? excludeId = null);
        Task<IEnumerable<Subject>> SearchSubjectsAsync(string searchTerm);
    }
}
