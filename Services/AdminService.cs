using ParentTeacherBridge.API.Models;
using ParentTeacherBridge.API.Repositories;

namespace ParentTeacherBridge.API.Services
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _repo;

        public AdminService(IAdminRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Admin>> GetAllAdminsAsync()
        {
            return await _repo.GetAllAsync();
        }

        public async Task<Admin?> GetAdminByIdAsync(int id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task<bool> CreateAdminAsync(Admin admin)
        {
            await _repo.AddAsync(admin);
            return true;
        }

        public async Task<bool> UpdateAdminAsync(int id, Admin admin)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return false;

            existing.Name = admin.Name;
            existing.Email = admin.Email;
            // Update other fields

            await _repo.UpdateAsync(existing);
            return true;
        }

        public async Task<bool> DeleteAdminAsync(int id)
        {
            var admin = await _repo.GetByIdAsync(id);
            if (admin == null) return false;

            await _repo.DeleteAsync(admin);
            return true;
        }
    }

}
