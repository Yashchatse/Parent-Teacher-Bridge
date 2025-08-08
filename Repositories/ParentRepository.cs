using Microsoft.EntityFrameworkCore;
using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Repositories
{
    public class ParentRepository : IParentRepository
    {
        private readonly ParentTeacherBridgeAPIContext _context;

        public ParentRepository(ParentTeacherBridgeAPIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Parent>> GetAllAsync()
        {
            return await _context.Parents.ToListAsync();
        }

        public async Task<Parent?> GetByIdAsync(int id)
        {
            return await _context.Parents.FindAsync(id);
        }

        public async Task CreateAsync(Parent parent)
        {
            parent.CreatedAt = DateTime.UtcNow;
            await _context.Parents.AddAsync(parent);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UpdateAsync(Parent parent)
        {
            var existing = await _context.Parents.FindAsync(parent.ParentId);
            if (existing == null) return false;

            _context.Entry(existing).CurrentValues.SetValues(parent);
            existing.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var parent = await _context.Parents.FindAsync(id);
            if (parent == null) return false;

            _context.Parents.Remove(parent);
            await _context.SaveChangesAsync();
            return true;
        }

        // 🎓 Get associated student by parentId — using student_id from parent table
        public async Task<Student?> GetAssociatedStudentAsync(int parentId)
        {
            var parent = await _context.Parents
                .Include(p => p.Student)
                .FirstOrDefaultAsync(p => p.ParentId == parentId);

            return parent?.Student;
        }

        // 🗓️ Get timetable based on student's class
        public async Task<IEnumerable<Timetable>> GetTimetableByParentIdAsync(int parentId)
        {
            var student = await GetAssociatedStudentAsync(parentId);

            if (student?.ClassId == null)
                return Enumerable.Empty<Timetable>();

            return await _context.Timetables
                .Include(t => t.Subject)
                .Include(t => t.Teacher)
                .Include(t => t.Class)
                .Where(t => t.ClassId == student.ClassId)
                .ToListAsync();
        }

        // 📅 Attendance
        public async Task<IEnumerable<Attendance>> GetAttendancesForStudentAsync(int studentId)
        {
            return await _context.Attendances
                .Where(a => a.StudentId == studentId)
                .ToListAsync();
        }

        // 📘 Behaviour
        public async Task<IEnumerable<Behaviour>> GetBehavioursForStudentAsync(int studentId)
        {
            return await _context.Behaviours
                .Where(b => b.StudentId == studentId)
                .ToListAsync();
        }

        // 🧠 Performance
        public async Task<IEnumerable<Performance>> GetPerformancesForStudentAsync(int studentId)
        {
            return await _context.Performances
                .Where(p => p.StudentId == studentId)
                .ToListAsync();
        }

        // 📊 Timetables (Universal)
        public async Task<IEnumerable<Timetable>> GetAllTimetablesAsync()
        {
            return await _context.Timetables.ToListAsync();
        }

        // 🎉 Events (Universal)
        public async Task<IEnumerable<Event>> GetAllEventsAsync()
        {
            return await _context.Events
                .Where(e => e.IsActive == true)
                .ToListAsync();
        }

        public Task<Student?> GetStudentByIdAsync(int studentId)
        {
            throw new NotImplementedException();
        }
    }
}
