using Microsoft.EntityFrameworkCore;
using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Repositories
{
    public class SubjectRepository : ISubjectRepository
    {
        private readonly ParentTeacherBridgeAPIContext _context;
        private readonly ILogger<SubjectRepository> _logger;

        public SubjectRepository(ParentTeacherBridgeAPIContext context, ILogger<SubjectRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Subject>> GetAllAsync()
        {
            try
            {
                return await _context.Subject
                    .OrderBy(s => s.Name)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving all subjects");
                throw;
            }
        }

        public async Task<Subject?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Subject.FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving subject with ID {SubjectId}", id);
                throw;
            }
        }

        public async Task<Subject?> GetByCodeAsync(string code)
        {
            try
            {
                return await _context.Subject
                    .FirstOrDefaultAsync(s => s.Code == code);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving subject with code {Code}", code);
                throw;
            }
        }

        public async Task AddAsync(Subject subject)
        {
            try
            {
                subject.CreatedAt = DateTime.UtcNow;
                subject.UpdatedAt = DateTime.UtcNow;
                await _context.Subject.AddAsync(subject);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding subject");
                throw;
            }
        }

        public async Task UpdateAsync(Subject subject)
        {
            try
            {
                var existingSubject = await _context.Subject.FindAsync(subject.SubjectId);
                if (existingSubject == null)
                {
                    throw new InvalidOperationException($"Subject with ID {subject.SubjectId} not found");
                }

                // Update fields
                existingSubject.Name = subject.Name;
                existingSubject.Code = subject.Code;
                existingSubject.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating subject with ID {SubjectId}", subject.SubjectId);
                throw;
            }
        }

        public async Task DeleteAsync(Subject subject)
        {
            try
            {
                _context.Subject.Remove(subject);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting subject with ID {SubjectId}", subject.SubjectId);
                throw;
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            try
            {
                return await _context.Subject.AnyAsync(s => s.SubjectId == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while checking if subject exists with ID {SubjectId}", id);
                throw;
            }
        }

        public async Task<bool> CodeExistsAsync(string code, int? excludeId = null)
        {
            try
            {
                var query = _context.Subject.Where(s => s.Code == code);

                if (excludeId.HasValue)
                {
                    query = query.Where(s => s.SubjectId != excludeId.Value);
                }

                return await query.AnyAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while checking if subject code exists: {Code}", code);
                throw;
            }
        }

        public async Task<IEnumerable<Subject>> SearchSubjectsAsync(string searchTerm)
        {
            try
            {
                return await _context.Subject
                    .Where(s => s.Name!.Contains(searchTerm) ||
                               s.Code!.Contains(searchTerm))
                    .OrderBy(s => s.Name)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while searching subjects with term: {SearchTerm}", searchTerm);
                throw;
            }
        }
    }
}
