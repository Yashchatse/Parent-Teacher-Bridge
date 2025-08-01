using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Repositories
{
    public interface ISchoolClassRepository
    {
        Task<IEnumerable<SchoolClass>> GetAllAsync();
        Task<SchoolClass?> GetByIdAsync(int id);
        Task AddAsync(SchoolClass schoolClass);
        Task UpdateAsync(SchoolClass schoolClass);
        Task DeleteAsync(SchoolClass schoolClass);

    }
}
