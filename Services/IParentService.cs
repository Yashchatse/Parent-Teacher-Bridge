using ParentTeacherBridge.API.DTOs;

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
        Task<StudentDTO?> GetAssociatedStudentAsync(int parentId);

        // 📅 Attendance
        Task<IEnumerable<AttendanceDTO>> GetAttendanceForStudentAsync(int parentId);

        // 📘 Behaviour
        Task<IEnumerable<BehaviourDTO>> GetBehaviourForStudentAsync(int parentId);

        // 🧠 Performance
        Task<IEnumerable<PerformanceDTO>> GetPerformanceForStudentAsync(int parentId);

        // 🗓️ Timetable (Universal)
        Task<IEnumerable<TimetableDTO>> GetAllTimetablesAsync();

        // 🗓️ Timetable (class-based by parent)
        Task<IEnumerable<TimetableDTO>> GetTimetableForStudentAsync(int parentId);

        // 🎉 Events (Universal)
        Task<IEnumerable<EventDTO>> GetAllEventsAsync();

        // 📊 Timetable (for parent’s associated student)
        Task<IEnumerable<TimetableDTO>> GetTimetableForParentAsync(int id);
    }
}
