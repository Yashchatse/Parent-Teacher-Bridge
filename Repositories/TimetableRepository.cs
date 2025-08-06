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

   
}