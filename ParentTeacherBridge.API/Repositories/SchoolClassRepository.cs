using Microsoft.EntityFrameworkCore;
using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Repositories
{
    public class SchoolClassRepository : ISchoolClassRepository
    {
        private readonly ParentTeacherBridgeAPIContext _context;
        private readonly ILogger<SchoolClassRepository> _logger;

        public SchoolClassRepository(ParentTeacherBridgeAPIContext context, ILogger<SchoolClassRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<SchoolClass>> GetAllAsync()
        {
            try
            {
                return await _context.SchoolClass
                    .Include(sc => sc.ClassTeacher)
                    .OrderBy(sc => sc.ClassName)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving all school classes");
                throw;
            }
        }

        public async Task<SchoolClass?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.SchoolClass
                    .Include(sc => sc.ClassTeacher)
                    .FirstOrDefaultAsync(sc => sc.ClassId == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving school class with ID {ClassId}", id);
                throw;
            }
        }

        

        

        public async Task AddAsync(SchoolClass schoolClass)
        {
            try
            {
                schoolClass.CreatedAt = DateTime.UtcNow;
                schoolClass.UpdatedAt = DateTime.UtcNow;
                await _context.SchoolClass.AddAsync(schoolClass);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding school class");
                throw;
            }
        }

        public async Task UpdateAsync(SchoolClass schoolClass)
        {
            try
            {
                var existingClass = await _context.SchoolClass.FindAsync(schoolClass.ClassId);
                if (existingClass == null)
                {
                    throw new InvalidOperationException($"School class with ID {schoolClass.ClassId} not found");
                }

                // Update fields
                existingClass.ClassName = schoolClass.ClassName;
                existingClass.ClassTeacherId = schoolClass.ClassTeacherId;
                existingClass.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating school class with ID {ClassId}", schoolClass.ClassId);
                throw;
            }
        }

        public async Task DeleteAsync(SchoolClass schoolClass)
        {
            try
            {
                _context.SchoolClass.Remove(schoolClass);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting school class with ID {ClassId}", schoolClass.ClassId);
                throw;
            }
        }

       
    }
}