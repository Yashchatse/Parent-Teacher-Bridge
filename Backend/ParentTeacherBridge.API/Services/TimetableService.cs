using ParentTeacherBridge.API.Models;

public class TimetableService : ITimetableService
{
    private readonly ITimetableRepository _repository;
    private readonly ILogger<TimetableService> _logger;

    public TimetableService(ITimetableRepository repository, ILogger<TimetableService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<IEnumerable<Timetable>> GetTimetableForTeacherAsync(int teacherId)
    {
        return await _repository.GetTimetableByTeacherIdAsync(teacherId);
    }

    public async Task<IEnumerable<Timetable>> GetAllTimetablesAsync()
    {
        try
        {
            return await _repository.GetAllAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TimetableService.GetAllTimetablesAsync");
            throw;
        }
    }

    public async Task<Timetable?> GetTimetableByIdAsync(int id)
    {
        try
        {
            return await _repository.GetByIdAsync(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TimetableService.GetTimetableByIdAsync for ID {TimetableId}", id);
            throw;
        }
    }

    public async Task<bool> CreateTimetableAsync(Timetable timetable)
    {
        try
        {
            // Validate timetable data
            if (!await ValidateTimetableDataAsync(timetable))
            {
                return false;
            }

            await _repository.AddAsync(timetable);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TimetableService.CreateTimetableAsync");
            throw;
        }
    }

    public async Task<bool> UpdateTimetableAsync(int id, Timetable timetable)
    {
        try
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                return false;

            // Validate timetable data (excluding current timetable from conflict check)
            if (!await ValidateTimetableDataAsync(timetable, id))
            {
                return false;
            }

            timetable.TimetableId = id;
            await _repository.UpdateAsync(timetable);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TimetableService.UpdateTimetableAsync for ID {TimetableId}", id);
            throw;
        }
    }

    public async Task<bool> DeleteTimetableAsync(int id)
    {
        try
        {
            var timetable = await _repository.GetByIdAsync(id);
            if (timetable == null)
                return false;

            await _repository.DeleteAsync(timetable);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TimetableService.DeleteTimetableAsync for ID {TimetableId}", id);
            throw;
        }
    }

    public async Task<bool> TimetableExistsAsync(int id)
    {
        try
        {
            return await _repository.ExistsAsync(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TimetableService.TimetableExistsAsync for ID {TimetableId}", id);
            throw;
        }
    }

    public async Task<IEnumerable<Timetable>> GetTimetablesByClassAsync(int classId)
    {
        try
        {
            return await _repository.GetByClassIdAsync(classId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TimetableService.GetTimetablesByClassAsync for class {ClassId}", classId);
            throw;
        }
    }

    public async Task<IEnumerable<Timetable>> GetTimetablesByTeacherAsync(int teacherId)
    {
        try
        {
            return await _repository.GetByTeacherIdAsync(teacherId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TimetableService.GetTimetablesByTeacherAsync for teacher {TeacherId}", teacherId);
            throw;
        }
    }

    public async Task<IEnumerable<Timetable>> GetTimetablesByWeekdayAsync(string weekday)
    {
        try
        {
            return await _repository.GetByWeekdayAsync(weekday);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TimetableService.GetTimetablesByWeekdayAsync for weekday {Weekday}", weekday);
            throw;
        }
    }

    public async Task<bool> ValidateTimetableDataAsync(Timetable timetable, int? excludeId = null)
    {
        try
        {
            // Validate start time is before end time
            if (timetable.StartTime >= timetable.EndTime)
            {
                throw new InvalidOperationException("Start time must be before end time");
            }

            // Check for class time conflicts
            if (timetable.ClassId.HasValue && !string.IsNullOrWhiteSpace(timetable.Weekday) &&
                timetable.StartTime.HasValue && timetable.EndTime.HasValue)
            {
                var hasClassConflict = await _repository.HasTimeConflictAsync(
                    timetable.ClassId.Value,
                    timetable.Weekday,
                    timetable.StartTime.Value,
                    timetable.EndTime.Value,
                    excludeId);

                if (hasClassConflict)
                {
                    throw new InvalidOperationException("Time conflict exists for this class on the specified day and time");
                }
            }

            // Check for teacher time conflicts
            if (timetable.TeacherId.HasValue && !string.IsNullOrWhiteSpace(timetable.Weekday) &&
                timetable.StartTime.HasValue && timetable.EndTime.HasValue)
            {
                var hasTeacherConflict = await _repository.TeacherHasTimeConflictAsync(
                    timetable.TeacherId.Value,
                    timetable.Weekday,
                    timetable.StartTime.Value,
                    timetable.EndTime.Value,
                    excludeId);

                if (hasTeacherConflict)
                {
                    throw new InvalidOperationException("Teacher has a time conflict on the specified day and time");
                }
            }

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in TimetableService.ValidateTimetableDataAsync");
            throw;
        }
    }

}