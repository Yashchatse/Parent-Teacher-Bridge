using ParentTeacherBridge.API.Models;

public interface ITimetableRepository
{
    Task<IEnumerable<Timetable>> GetTimetableByTeacherIdAsync(int teacherId);

    Task<IEnumerable<Timetable>> GetAllAsync();
    Task<Timetable?> GetByIdAsync(int id);
    Task AddAsync(Timetable timetable);
    Task UpdateAsync(Timetable timetable);
    Task DeleteAsync(Timetable timetable);
    Task<bool> ExistsAsync(int id);
    Task<IEnumerable<Timetable>> GetByClassIdAsync(int classId);
    Task<IEnumerable<Timetable>> GetByTeacherIdAsync(int teacherId);
    Task<IEnumerable<Timetable>> GetByWeekdayAsync(string weekday);
    Task<bool> HasTimeConflictAsync(int classId, string weekday, TimeOnly startTime, TimeOnly endTime, int? excludeId = null);
    Task<bool> TeacherHasTimeConflictAsync(int teacherId, string weekday, TimeOnly startTime, TimeOnly endTime, int? excludeId = null);
}