using ParentTeacherBridge.API.Models;

public class TimetableService : ITimetableService
{
    private readonly ITimetableRepository _repository;

    public TimetableService(ITimetableRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Timetable>> GetTimetableForTeacherAsync(int teacherId)
    {
        return await _repository.GetTimetableByTeacherIdAsync(teacherId);
    }

    
}