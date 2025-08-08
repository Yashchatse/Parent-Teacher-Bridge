using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Services
{
    public interface IAdminService
    {
        Task<IEnumerable<Admin>> GetAllAdminsAsync();
        Task<Admin?> GetAdminByIdAsync(int id);
        Task<bool> CreateAdminAsync(Admin admin);
        Task<bool> UpdateAdminAsync(int id, Admin admin);
        Task<bool> DeleteAdminAsync(int id);
    }

}
