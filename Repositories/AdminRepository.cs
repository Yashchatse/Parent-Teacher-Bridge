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

        // Replace all occurrences of '_context.Admin' with '_context.Set<Admin>()'

        public async Task<IEnumerable<Admin>> GetAllAsync()
        {
            try
            {
                return await _context.Set<Admin>().ToListAsync();
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
                return await _context.Set<Admin>().FindAsync(id);
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
                await _context.Set<Admin>().AddAsync(admin);
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
                var existingAdmin = await _context.Set<Admin>().FindAsync(admin.AdminId);
                if (existingAdmin == null)
                {
                    throw new InvalidOperationException($"Admin with ID {admin.AdminId} not found");
                }

                // Explicitly update only the fields that should change
                existingAdmin.Name = admin.Name;
                existingAdmin.Email = admin.Email;

                // Only update password if provided
                if (!string.IsNullOrWhiteSpace(admin.Password))
                {
                    existingAdmin.Password = admin.Password;
                }

                existingAdmin.IsActive = admin.IsActive;

                // SaveChanges will automatically detect and save only the changed properties
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
                _context.Set<Admin>().Remove(admin);
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
