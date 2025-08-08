using AutoMapper;
using ParentTeacherBridge.API.DTOs;
using ParentTeacherBridge.API.Models;
using ParentTeacherBridge.API.Repositories;

namespace ParentTeacherBridge.API.Services
{
    public class ParentService : IParentService
    {
        private readonly IParentRepository _repo;
        private readonly IMapper _mapper;

        public ParentService(IParentRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
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
        public async Task<StudentDTO?> GetAssociatedStudentAsync(int parentId)
        {
            var student = await _repo.GetAssociatedStudentAsync(parentId);
            return student == null ? null : _mapper.Map<StudentDTO>(student);
        }

        // 📅 Attendance
        public async Task<IEnumerable<AttendanceDTO>> GetAttendanceForStudentAsync(int parentId)
        {
            var student = await _repo.GetAssociatedStudentAsync(parentId);
            if (student == null) return Enumerable.Empty<AttendanceDTO>();

            var attendance = await _repo.GetAttendancesForStudentAsync(student.StudentId);
            return _mapper.Map<IEnumerable<AttendanceDTO>>(attendance);
        }

        // 📘 Behaviour
        public async Task<IEnumerable<BehaviourDTO>> GetBehaviourForStudentAsync(int parentId)
        {
            var student = await _repo.GetAssociatedStudentAsync(parentId);
            if (student == null) return Enumerable.Empty<BehaviourDTO>();

            var behaviours = await _repo.GetBehavioursForStudentAsync(student.StudentId);
            return _mapper.Map<IEnumerable<BehaviourDTO>>(behaviours);
        }

        // 🧠 Performance
        public async Task<IEnumerable<PerformanceDTO>> GetPerformanceForStudentAsync(int parentId)
        {
            var student = await _repo.GetAssociatedStudentAsync(parentId);
            if (student == null) return Enumerable.Empty<PerformanceDTO>();

            var performances = await _repo.GetPerformancesForStudentAsync(student.StudentId);
            return _mapper.Map<IEnumerable<PerformanceDTO>>(performances);
        }

        // 🗓️ Timetables (class-based)
        public async Task<IEnumerable<TimetableDTO>> GetTimetableForStudentAsync(int parentId)
        {
            var timetables = await _repo.GetTimetableByParentIdAsync(parentId);
            return _mapper.Map<IEnumerable<TimetableDTO>>(timetables);
        }

        // 📊 Timetables (universal)
        public async Task<IEnumerable<TimetableDTO>> GetAllTimetablesAsync()
        {
            var timetables = await _repo.GetAllTimetablesAsync();
            return _mapper.Map<IEnumerable<TimetableDTO>>(timetables);
        }

        // 🎉 Events
        public async Task<IEnumerable<EventDTO>> GetAllEventsAsync()
        {
            var events = await _repo.GetAllEventsAsync();
            return _mapper.Map<IEnumerable<EventDTO>>(events);
        }

        // ✅ Fixed Method: Timetable for Parent
        public async Task<IEnumerable<TimetableDTO>> GetTimetableForParentAsync(int parentId)
        {
            var timetables = await _repo.GetTimetableByParentIdAsync(parentId);
            return _mapper.Map<IEnumerable<TimetableDTO>>(timetables);
        }
    }
}
