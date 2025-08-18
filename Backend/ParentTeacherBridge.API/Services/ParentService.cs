using AutoMapper;
using ParentTeacherBridge.API.DTO;

using ParentTeacherBridge.API.Models;
using ParentTeacherBridge.API.Repositories;

namespace ParentTeacherBridge.API.Services
{
    public class ParentService : IParentService
    {
        private readonly IParentRepository _repo;
        private readonly IMapper _mapper;
        private readonly ILogger<ParentService> _logger;

        public ParentService(IParentRepository repo, IMapper mapper, ILogger<ParentService> logger)
        {
            _repo = repo;
            _mapper = mapper;
            _logger = logger;
        }

        // 📦 CRUD Operations
        public async Task<IEnumerable<ParentDTO>> GetAllAsync()
        {
            var parents = await _repo.GetAllAsync();
            return _mapper.Map<IEnumerable<ParentDTO>>(parents);
        }

        public async Task<ParentDTO?> GetByIdAsync(int id)
        {
            var parent = await _repo.GetByIdAsync(id);
            return parent == null ? null : _mapper.Map<ParentDTO>(parent);
        }

        public async Task CreateAsync(ParentDTO parentDto)
        {
            var parent = _mapper.Map<Parent>(parentDto);
            await _repo.CreateAsync(parent);
        }

        public async Task<bool> UpdateAsync(ParentDTO parentDto)
        {
            var parent = _mapper.Map<Parent>(parentDto);
            return await _repo.UpdateAsync(parent);
        }

        public Task<bool> DeleteAsync(int id) => _repo.DeleteAsync(id);

        // 🎓 Student Access
        public async Task<StudentDto?> GetAssociatedStudentAsync(int parentId)
        {
            var student = await _repo.GetAssociatedStudentAsync(parentId);
            return student == null ? null : _mapper.Map<StudentDto>(student);
        }

        // 📅 Attendance
        public async Task<IEnumerable<AttendanceDto>> GetAttendanceForStudentAsync(int parentId)
        {
            var student = await _repo.GetAssociatedStudentAsync(parentId);
            if (student == null) return Enumerable.Empty<AttendanceDto>();

            var attendance = await _repo.GetAttendancesForStudentAsync(student.StudentId);
            return _mapper.Map<IEnumerable<AttendanceDto>>(attendance);
        }

        // 📘 Behaviour
        public async Task<IEnumerable<BehaviourDto>> GetBehaviourForStudentAsync(int parentId)
        {
            var student = await _repo.GetAssociatedStudentAsync(parentId);
            if (student == null) return Enumerable.Empty<BehaviourDto>();

            var behaviours = await _repo.GetBehavioursForStudentAsync(student.StudentId);
            return _mapper.Map<IEnumerable<BehaviourDto>>(behaviours);
        }

        // 🧠 Performance
        public async Task<IEnumerable<PerformanceDto>> GetPerformanceForStudentAsync(int parentId)
        {
            var student = await _repo.GetAssociatedStudentAsync(parentId);
            if (student == null) return Enumerable.Empty<PerformanceDto>();

            var performances = await _repo.GetPerformancesForStudentAsync(student.StudentId);
            return _mapper.Map<IEnumerable<PerformanceDto>>(performances);
        }

        // 🗓️ Timetables (class-based)
        public async Task<IEnumerable<TimetableDto>> GetTimetableForStudentAsync(int parentId)
        {
            var timetables = await _repo.GetTimetableByParentIdAsync(parentId);
            return _mapper.Map<IEnumerable<TimetableDto>>(timetables);
        }

        // 📊 Timetables (universal)
        public async Task<IEnumerable<TimetableDto>> GetAllTimetablesAsync()
        {
            var timetables = await _repo.GetAllTimetablesAsync();
            return _mapper.Map<IEnumerable<TimetableDto>>(timetables);
        }

        // 🎉 Events
        public async Task<IEnumerable<EventDto>> GetAllEventsAsync()
        {
            var events = await _repo.GetAllEventsAsync();
            return _mapper.Map<IEnumerable<EventDto>>(events);
        }

        // ✅ Fixed Method: Timetable for Parent
        public async Task<IEnumerable<TimetableDto>> GetTimetableForParentAsync(int parentId)
        {
            var timetables = await _repo.GetTimetableByParentIdAsync(parentId);
            return _mapper.Map<IEnumerable<TimetableDto>>(timetables);
        }

        public async Task<Parent?> GetByEmailAndEnrollmentNoAsync(string email, string enrollmentNo)
        {
            try
            {
                var parents = await _repo.GetAllAsync();
                return parents.FirstOrDefault(p =>
                    p.Email.Equals(email, StringComparison.OrdinalIgnoreCase) &&
                    p.StudEnrollmentNo == enrollmentNo);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching parent by email and enrollment no.");
                throw;
            }
        }

        public async Task<bool> ValidateCredentialsAsync(string email, string enrollmentNo, string password)
        {
            var parent = await GetByEmailAndEnrollmentNoAsync(email, enrollmentNo);

            if (parent == null)
                return false;

            // Replace with hashed password check in real application
            return parent.Password == password;
        }
    }
}
