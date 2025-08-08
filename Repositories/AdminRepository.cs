using Microsoft.EntityFrameworkCore;
using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly ParentTeacherBridgeAPIContext _context;
        private readonly ILogger<AdminRepository> _logger;

        public AdminRepository(ParentTeacherBridgeAPIContext context, ILogger<AdminRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Admin>> GetAllAsync()
        {
            try
            {
                return await _context.Admins.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving all admins");
                throw;
            }
        }

        public async Task<Admin?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Admins.FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving admin with ID {AdminId}", id);
                throw;
            }
        }

        public async Task AddAsync(Admin admin)
        {
            try
            {
                await _context.Admins.AddAsync(admin);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding admin");
                throw;
            }
        }

        public async Task UpdateAsync(Admin admin)
        {
            try
            {
                _context.Admins.Update(admin);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating admin with ID {AdminId}", admin.AdminId);
                throw;
            }
        }

        public async Task DeleteAsync(Admin admin)
        {
            try
            {
                _context.Admins.Remove(admin);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting admin with ID {AdminId}", admin.AdminId);
                throw;
            }
        }
    }

}
