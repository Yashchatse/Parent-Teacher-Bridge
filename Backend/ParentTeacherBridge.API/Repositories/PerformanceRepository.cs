using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ParentTeacherBridge.API.Repositories
{
    public class PerformanceRepository : IPerformanceRepository
    {
        private readonly ParentTeacherBridgeAPIContext _context;
        private readonly ILogger<PerformanceRepository> _logger;

        public PerformanceRepository(ParentTeacherBridgeAPIContext context, ILogger<PerformanceRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Performance>> GetPerformanceByStudentIdAsync(int studentId)
        {
            try
            {
                _logger.LogInformation("Fetching performances for StudentId {StudentId}", studentId);
                return await _context.Set<Performance>()
                                     .Include(p => p.Student)
                                     .Include(p => p.Subject)
                                     .Where(p => p.StudentId == studentId)
                                     .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching performances for StudentId {StudentId}", studentId);
                throw;
            }
        }

        public async Task<Performance?> GetPerformanceByIdAsync(int id)
        {
            try
            {
                _logger.LogInformation("Fetching performance with ID {PerformanceId}", id);
                return await _context.Set<Performance>()
                                     .Include(p => p.Student)
                                     .Include(p => p.Subject)
                                     .FirstOrDefaultAsync(p => p.PerformanceId == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching performance with ID {PerformanceId}", id);
                throw;
            }
        }

        public async Task<Performance> AddPerformanceAsync(Performance performance)
        {
            try
            {
                performance.CreatedAt = DateTime.UtcNow;
                performance.UpdatedAt = DateTime.UtcNow;
                _context.Add(performance);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Added performance with ID {PerformanceId}", performance.PerformanceId);
                return performance;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding performance");
                throw;
            }
        }

        //public async Task<Performance?> UpdatePerformanceAsync(Performance performance)
        //{
        //    var existing = await _context.Performance.FindAsync(performance.PerformanceId);
        //    if (existing == null) return null;

        //    existing.StudentId = performance.StudentId;
        //    existing.TeacherId = performance.TeacherId;
        //    existing.SubjectId = performance.SubjectId;
        //    existing.ExamType = performance.ExamType;
        //    existing.MarksObtained = performance.MarksObtained;
        //    existing.MaxMarks = performance.MaxMarks;
        //    existing.Percentage = performance.Percentage;
        //    existing.Grade = performance.Grade;
        //    existing.ExamDate = performance.ExamDate;
        //    existing.Remarks = performance.Remarks;
        //    existing.UpdatedAt = DateTime.UtcNow;

        //    await _context.SaveChangesAsync();
        //    return existing;
        //}

        public async Task<Performance?> UpdatePerformanceAsync(Performance performance)
        {
            var existing = await _context.Performance.FindAsync(performance.PerformanceId);
            if (existing == null) return null;

            _context.Entry(existing).CurrentValues.SetValues(performance);
            await _context.SaveChangesAsync();
            return existing;
        }
        public async Task<bool> DeletePerformanceAsync(int id)
        {
            try
            {
                var performance = await _context.Set<Performance>().FindAsync(id);
                if (performance == null)
                {
                    _logger.LogWarning("Delete failed: Performance with ID {PerformanceId} not found", id);
                    return false;
                }

                _context.Remove(performance);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Deleted performance with ID {PerformanceId}", id);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting performance with ID {PerformanceId}", id);
                throw;
            }
        }
        public async Task<IEnumerable<Performance>> GetPerformanceByTeacherIdAsync(int teacherId)
        {
            return await _context.Performance
                                 .Where(p => p.TeacherId == teacherId)
                                 .ToListAsync();
        }

    }
}