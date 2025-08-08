using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Models;
using Microsoft.EntityFrameworkCore;

public class TimetableRepository : ITimetableRepository
{
    private readonly ParentTeacherBridgeAPIContext _context;
    private readonly ILogger<TimetableRepository> _logger;

    public TimetableRepository(ParentTeacherBridgeAPIContext context, ILogger<TimetableRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<Timetable>> GetTimetableByTeacherIdAsync(int teacherId)
    {
        _logger.LogInformation("Fetching timetable for TeacherId: {TeacherId}", teacherId);

        var result = await _context.Timetable
            .Where(t => t.TeacherId == teacherId)
            .ToListAsync();

        _logger.LogInformation("Found {Count} timetable entries for TeacherId: {TeacherId}", result.Count, teacherId);

        return result;
    }

    public async Task<IEnumerable<Timetable>> GetAllAsync()
    {
        try
        {
            return await _context.Timetable
                .Include(t => t.Class)
                .Include(t => t.Subject)
                .Include(t => t.Teacher)
                .OrderBy(t => t.Weekday)
                .ThenBy(t => t.StartTime)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving all timetables");
            throw;
        }
    }

    public async Task<Timetable?> GetByIdAsync(int id)
    {
        try
        {
            return await _context.Timetable
                .Include(t => t.Class)
                .Include(t => t.Subject)
                .Include(t => t.Teacher)
                .FirstOrDefaultAsync(t => t.TimetableId == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving timetable with ID {TimetableId}", id);
            throw;
        }
    }

    public async Task AddAsync(Timetable timetable)
    {
        try
        {
            timetable.CreatedAt = DateTime.UtcNow;
            timetable.UpdatedAt = DateTime.UtcNow;
            await _context.Timetable.AddAsync(timetable);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while adding timetable");
            throw;
        }
    }

    public async Task UpdateAsync(Timetable timetable)
    {
        try
        {
            var existingTimetable = await _context.Timetable.FindAsync(timetable.TimetableId);
            if (existingTimetable == null)
            {
                throw new InvalidOperationException($"Timetable with ID {timetable.TimetableId} not found");
            }

            // Update fields
            existingTimetable.ClassId = timetable.ClassId;
            existingTimetable.SubjectId = timetable.SubjectId;
            existingTimetable.TeacherId = timetable.TeacherId;
            existingTimetable.Weekday = timetable.Weekday;
            existingTimetable.StartTime = timetable.StartTime;
            existingTimetable.EndTime = timetable.EndTime;
            existingTimetable.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating timetable with ID {TimetableId}", timetable.TimetableId);
            throw;
        }
    }

    public async Task DeleteAsync(Timetable timetable)
    {
        try
        {
            _context.Timetable.Remove(timetable);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting timetable with ID {TimetableId}", timetable.TimetableId);
            throw;
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        try
        {
            return await _context.Timetable.AnyAsync(t => t.TimetableId == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while checking if timetable exists with ID {TimetableId}", id);
            throw;
        }
    }

    public async Task<IEnumerable<Timetable>> GetByClassIdAsync(int classId)
    {
        try
        {
            return await _context.Timetable
                .Include(t => t.Class)
                .Include(t => t.Subject)
                .Include(t => t.Teacher)
                .Where(t => t.ClassId == classId)
                .OrderBy(t => t.Weekday)
                .ThenBy(t => t.StartTime)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving timetables for class {ClassId}", classId);
            throw;
        }
    }

    public async Task<IEnumerable<Timetable>> GetByTeacherIdAsync(int teacherId)
    {
        try
        {
            return await _context.Timetable
                .Include(t => t.Class)
                .Include(t => t.Subject)
                .Include(t => t.Teacher)
                .Where(t => t.TeacherId == teacherId)
                .OrderBy(t => t.Weekday)
                .ThenBy(t => t.StartTime)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving timetables for teacher {TeacherId}", teacherId);
            throw;
        }
    }

    public async Task<IEnumerable<Timetable>> GetByWeekdayAsync(string weekday)
    {
        try
        {
            return await _context.Timetable
                .Include(t => t.Class)
                .Include(t => t.Subject)
                .Include(t => t.Teacher)
                .Where(t => t.Weekday == weekday)
                .OrderBy(t => t.StartTime)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving timetables for weekday {Weekday}", weekday);
            throw;
        }
    }

    public async Task<bool> HasTimeConflictAsync(int classId, string weekday, TimeOnly startTime, TimeOnly endTime, int? excludeId = null)
    {
        try
        {
            var query = _context.Timetable
                .Where(t => t.ClassId == classId &&
                           t.Weekday == weekday &&
                           ((t.StartTime < endTime && t.EndTime > startTime)));

            if (excludeId.HasValue)
            {
                query = query.Where(t => t.TimetableId != excludeId.Value);
            }

            return await query.AnyAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while checking time conflict for class {ClassId}", classId);
            throw;
        }
    }

    public async Task<bool> TeacherHasTimeConflictAsync(int teacherId, string weekday, TimeOnly startTime, TimeOnly endTime, int? excludeId = null)
    {
        try
        {
            var query = _context.Timetable
                .Where(t => t.TeacherId == teacherId &&
                           t.Weekday == weekday &&
                           ((t.StartTime < endTime && t.EndTime > startTime)));

            if (excludeId.HasValue)
            {
                query = query.Where(t => t.TimetableId != excludeId.Value);
            }

            return await query.AnyAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while checking teacher time conflict for teacher {TeacherId}", teacherId);
            throw;
        }
    }

}