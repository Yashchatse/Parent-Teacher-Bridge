using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Repositories
{
    public interface IAdminRepository
    {
        Task<IEnumerable<Admin>> GetAllAsync();
        Task<Admin?> GetByIdAsync(int id);
        Task AddAsync(Admin admin);
        Task UpdateAsync(Admin admin);
        Task DeleteAsync(Admin admin);
    }

}
