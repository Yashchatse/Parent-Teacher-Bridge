using ParentTeacherBridge.API.Models;

public interface ITimetableService
{
    Task<IEnumerable<Timetable>> GetTimetableForTeacherAsync(int teacherId);

    Task<IEnumerable<Timetable>> GetAllTimetablesAsync();
    Task<Timetable?> GetTimetableByIdAsync(int id);
    Task<bool> CreateTimetableAsync(Timetable timetable);
    Task<bool> UpdateTimetableAsync(int id, Timetable timetable);
    Task<bool> DeleteTimetableAsync(int id);
    Task<bool> TimetableExistsAsync(int id);
    Task<IEnumerable<Timetable>> GetTimetablesByClassAsync(int classId);
    Task<IEnumerable<Timetable>> GetTimetablesByTeacherAsync(int teacherId);
    Task<IEnumerable<Timetable>> GetTimetablesByWeekdayAsync(string weekday);
    Task<bool> ValidateTimetableDataAsync(Timetable timetable, int? excludeId = null);

}