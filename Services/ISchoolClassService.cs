using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Services
{
    public interface ISchoolClassService
    {
        Task<IEnumerable<SchoolClass>> GetAllAsync();
        Task<SchoolClass?> GetByIdAsync(int id);
        Task<SchoolClass> CreateAsync(SchoolClass schoolClass);
        Task<SchoolClass?> UpdateAsync(SchoolClass schoolClass);
        Task<bool> DeleteAsync(int id);
        
    }
}
