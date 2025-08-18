using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ParentTeacherBridge.API.Repositories
{
    public class BehaviourRepository : IBehaviourRepository
    {
        private readonly ParentTeacherBridgeAPIContext _context;

        public BehaviourRepository(ParentTeacherBridgeAPIContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<Behaviour>> GetAllBehavioursByTeacherAsync(int teacherId)
        {
            return await _context.Behaviour
                .Where(b => b.TeacherId == teacherId)
                .OrderByDescending(b => b.CreatedAt) // Optional: Order by creation date
                .ToListAsync();
        }

        public async Task<IEnumerable<Behaviour>> GetBehavioursByStudentAsync(int teacherId, int studentId)
        {
            return await _context.Behaviour
                .Where(b => b.TeacherId == teacherId && b.StudentId == studentId)
                .ToListAsync();
        }

        public async Task<Behaviour> GetBehaviourByIdAsync(int teacherId, int studentId, int behaviourId)
        {
            return await _context.Behaviour
                .FirstOrDefaultAsync(b => b.BehaviourId == behaviourId && b.TeacherId == teacherId && b.StudentId == studentId);
        }

        public async Task<Behaviour> AddBehaviourAsync(Behaviour behaviour)
        {
            _context.Behaviour.Add(behaviour);
            await _context.SaveChangesAsync();
            return behaviour;
        }

        public async Task<Behaviour> UpdateBehaviourAsync(int teacherId, int studentId, int behaviourId, Behaviour behaviour)
        {
            var existing = await GetBehaviourByIdAsync(teacherId, studentId, behaviourId);
            if (existing == null) return null;

            existing.Description = behaviour.Description;
            existing.IncidentDate = behaviour.IncidentDate;

            _context.Behaviour.Update(existing);
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteBehaviourAsync(int teacherId, int studentId, int behaviourId)
        {
            var behaviour = await GetBehaviourByIdAsync(teacherId, studentId, behaviourId);
            if (behaviour == null) return false;

            _context.Behaviour.Remove(behaviour);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine("Inner Exception: " + ex.InnerException?.Message);
                throw; // Optional: rethrow to preserve stack trace
            }
            //await _context.SaveChangesAsync();
            return true;
        }
    }
    //private readonly ParentTeacherBridgeAPIContext _context;

    //public BehaviourRepository(ParentTeacherBridgeAPIContext context)
    //{
    //    _context = context;
    //}

    //// ✅ Get all behaviours by teacher
    //public async Task<IEnumerable<Behaviour>> GetBehavioursByTeacherAsync(int teacherId)
    //{
    //    return await _context.Behaviour
    //                         .Include(b => b.Student) // Include Student details if needed
    //                         .Where(b => b.TeacherId == teacherId)
    //                         .ToListAsync();
    //}

    //// ✅ Get specific behaviour by ID
    //public async Task<Behaviour?> GetBehaviourByIdAsync(int teacherId, int behaviourId)
    //{
    //    return await _context.Behaviour
    //                         .Include(b => b.Student)
    //                         .FirstOrDefaultAsync(b => b.BehaviourId == behaviourId && b.TeacherId == teacherId);
    //}

    //// ✅ Add new behaviour
    //public async Task<Behaviour> AddBehaviourAsync(Behaviour behaviour)
    //{
    //    _context.Behaviour.Add(behaviour);
    //    await _context.SaveChangesAsync();
    //    return behaviour;
    //}

    //// ✅ Update existing behaviour
    //public async Task<Behaviour?> UpdateBehaviourAsync(Behaviour behaviour)
    //{
    //    _context.Behaviour.Update(behaviour);
    //    await _context.SaveChangesAsync();
    //    return behaviour;
    //}

    //// ✅ Delete behaviour
    //public async Task<bool> DeleteBehaviourAsync(int teacherId, int behaviourId)
    //{
    //    var behaviour = await GetBehaviourByIdAsync(teacherId, behaviourId);
    //    if (behaviour == null) return false;

    //    _context.Behaviour.Remove(behaviour);
    //    await _context.SaveChangesAsync();
    //    return true;
    //}




}
