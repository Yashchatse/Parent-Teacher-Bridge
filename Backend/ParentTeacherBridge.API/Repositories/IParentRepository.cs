using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Repositories
{
    public interface IParentRepository
    {
        Task<IEnumerable<Parent>> GetAllAsync();
        Task<Parent?> GetByIdAsync(int id);
        Task CreateAsync(Parent parent);
        Task AddAsync(Parent parent);
        Task<bool> UpdateAsync(Parent parent);
        Task<bool> DeleteAsync(int id);
        //Task DeleteAsync(Parent parent);

        //  Student Access
        Task<Student?> GetAssociatedStudentAsync(int parentId);
        Task<Student?> GetStudentByIdAsync(int studentId);

        //  Attendance
        Task<IEnumerable<Attendance>> GetAttendancesForStudentAsync(int studentId);

        //  Behaviour
        Task<IEnumerable<Behaviour>> GetBehavioursForStudentAsync(int studentId);

        // Performance
        Task<IEnumerable<Performance>> GetPerformancesForStudentAsync(int studentId);

        //  Timetables
        Task<IEnumerable<Timetable>> GetAllTimetablesAsync();
        Task<IEnumerable<Timetable>> GetTimetableByParentIdAsync(int parentId);

        // 🎉 Events
        Task<IEnumerable<Event>> GetAllEventsAsync();
    }
}
