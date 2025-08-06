using ParentTeacherBridge.API.Models;

public interface ITimetableRepository
{
    Task<IEnumerable<Timetable>> GetTimetableByTeacherIdAsync(int teacherId);
}