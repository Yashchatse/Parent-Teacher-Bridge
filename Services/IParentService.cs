using ParentTeacherBridge.API.DTO;
using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Services
{
    public interface IParentService
    {
        Task<IEnumerable<ParentDTO>> GetAllAsync();
        Task<ParentDTO?> GetByIdAsync(int id);
        Task CreateAsync(ParentDTO parentDto);
        Task<bool> UpdateAsync(ParentDTO parentDto);
        Task<bool> DeleteAsync(int id);

        // 👨‍🎓 Student linkage
        Task<StudentDto?> GetAssociatedStudentAsync(int parentId);

        // 📅 Attendance
        Task<IEnumerable<AttendanceDto>> GetAttendanceForStudentAsync(int parentId);

        // 📘 Behaviour
        Task<IEnumerable<BehaviourDto>> GetBehaviourForStudentAsync(int parentId);

        // 🧠 Performance
        Task<IEnumerable<PerformanceDto>> GetPerformanceForStudentAsync(int parentId);

        // 🗓️ Timetable (Universal)
        Task<IEnumerable<TimetableDto>> GetAllTimetablesAsync();

        // 🗓️ Timetable (class-based by parent)
        Task<IEnumerable<TimetableDto>> GetTimetableForStudentAsync(int parentId);

        // 🎉 Events (Universal)
        Task<IEnumerable<EventDto>> GetAllEventsAsync();

        // 📊 Timetable (for parent’s associated student)
        Task<IEnumerable<TimetableDto>> GetTimetableForParentAsync(int id);

        Task<Parent?> GetByEmailAndEnrollmentNoAsync(string email, string enrollmentNo);
        Task<bool> ValidateCredentialsAsync(string email, string enrollmentNo, string password);
        // Add more methods as needed like:
        // Task RegisterAsync(Parent parent);
        // Task<IEnumerable<Parent>> GetAllAsync();
    }
}
