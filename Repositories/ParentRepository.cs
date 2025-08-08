using Microsoft.EntityFrameworkCore;
using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Repositories
{
    public class ParentRepository : IParentRepository
    {
        private readonly ParentTeacherBridgeAPIContext _context;
        private readonly ILogger<ParentRepository> _logger;

        public ParentRepository(ParentTeacherBridgeAPIContext context, ILogger<ParentRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        
        public async Task<IEnumerable<Parent>> GetAllAsync()
        {
            try
            {
                return await _context.Parent.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving parents.");
                throw;
            }
        }

        
        
        public async Task<Parent?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Parent.FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving parent with ID {id}.");
                throw;
            }
        }

        public async Task AddAsync(Parent parent)
        {
            try
            {
                await _context.Parent.AddAsync(parent);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding parent.");
                throw;
            }
        }
        public async Task CreateAsync(Parent parent)
        {
            parent.CreatedAt = DateTime.UtcNow;
            await _context.Parent.AddAsync(parent);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UpdateAsync(Parent parent)
        {
            var existing = await _context.Parent.FindAsync(parent.ParentId);
            if (existing == null) return false;

            _context.Entry(existing).CurrentValues.SetValues(parent);
            existing.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
        //public async Task UpdateAsync(Parent parent)
        //{
        //    try
        //    {
        //        _context.Parent.Update(parent);
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, $"Error updating parent with ID {parent.ParentId}.");
        //        throw;
        //    }
        //}
        public async Task DeleteAsync(Parent parent)
        {
            try
            {
                _context.Parent.Remove(parent);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting parent with ID {parent.ParentId}.");
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var parent = await _context.Parent.FindAsync(id);
            if (parent == null) return false;

            _context.Parent.Remove(parent);
            await _context.SaveChangesAsync();
            return true;
        }
        //public async Task DeleteAsync(Parent parent)
        //{
        //    try
        //    {
        //        _context.Parent.Remove(parent);
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, $"Error deleting parent with ID {parent.ParentId}.");
        //        throw;
        //    }
        //}

        // 🎓 Get associated student by parentId — using student_id from parent table
        public async Task<Student?> GetAssociatedStudentAsync(int parentId)
        {
            var parent = await _context.Parent
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

            return await _context.Timetable
                .Include(t => t.Subject)
                .Include(t => t.Teacher)
                .Include(t => t.Class)
                .Where(t => t.ClassId == student.ClassId)
                .ToListAsync();
        }

        // 📅 Attendance
        public async Task<IEnumerable<Attendance>> GetAttendancesForStudentAsync(int studentId)
        {
            return await _context.Attendance
                .Where(a => a.StudentId == studentId)
                .ToListAsync();
        }

        // 📘 Behaviour
        public async Task<IEnumerable<Behaviour>> GetBehavioursForStudentAsync(int studentId)
        {
            return await _context.Behaviour
                .Where(b => b.StudentId == studentId)
                .ToListAsync();
        }

        // 🧠 Performance
        public async Task<IEnumerable<Performance>> GetPerformancesForStudentAsync(int studentId)
        {
            return await _context.Performance
                .Where(p => p.StudentId == studentId)
                .ToListAsync();
        }

        // 📊 Timetables (Universal)
        public async Task<IEnumerable<Timetable>> GetAllTimetablesAsync()
        {
            return await _context.Timetable.ToListAsync();
        }

        // 🎉 Events (Universal)
        public async Task<IEnumerable<Event>> GetAllEventsAsync()
        {
            return await _context.Event
                .Where(e => e.IsActive == true)
                .ToListAsync();
        }

        public Task<Student?> GetStudentByIdAsync(int studentId)
        {
            throw new NotImplementedException();
        }
    }
}
