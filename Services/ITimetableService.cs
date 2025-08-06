using ParentTeacherBridge.API.Models;

public interface ITimetableService
{
    Task<IEnumerable<Timetable>> GetTimetableForTeacherAsync(int teacherId);
   
}