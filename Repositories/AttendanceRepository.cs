using Microsoft.EntityFrameworkCore;
using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class AttendanceRepository : IAttendanceRepository
{
    private readonly ParentTeacherBridgeAPIContext _context;

    public AttendanceRepository(ParentTeacherBridgeAPIContext context)
    {
        _context = context;
    }

    public async Task<Attendance> AddAsync(Attendance attendance)
    {
        _context.Attendance.Add(attendance);
        await _context.SaveChangesAsync();
        return attendance;
    }

    public async Task<Attendance?> UpdateAsync(Attendance attendance)
    {
        var existing = await _context.Attendance.FindAsync(attendance.AttendanceId);
        if (existing == null) return null;

        existing.Status = attendance.Status;
        existing.Remark = attendance.Remark;
        existing.Date = attendance.Date;
        existing.UpdatedAt = DateTime.UtcNow;

        _context.Attendance.Update(existing);
        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var record = await _context.Attendance.FindAsync(id);
        if (record == null) return false;

        _context.Attendance.Remove(record);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Attendance?> GetByIdAsync(int id)
    {
        return await _context.Attendance
            .Include(a => a.Student)
            .Include(a => a.Class)
            .FirstOrDefaultAsync(a => a.AttendanceId == id);
    }

    public async Task<IEnumerable<Attendance>> GetByStudentIdAsync(int studentId)
    {
        return await _context.Attendance
            .Where(a => a.StudentId == studentId)
            .OrderByDescending(a => a.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<Attendance>> GetByClassAndDateAsync(int classId, DateOnly date)
    {
        return await _context.Attendance
            .Where(a => a.ClassId == classId && a.Date == date)
            .Include(a => a.Student)
            .ToListAsync();
    }

    public async Task<bool> AttendanceExistsAsync(int studentId, DateOnly date)
    {
        return await _context.Attendance.AnyAsync(a => a.StudentId == studentId && a.Date == date);
    }
}




//using Microsoft.Extensions.Logging;
//using ParentTeacherBridge.API.Data;
//using ParentTeacherBridge.API.Models;
//using Microsoft.EntityFrameworkCore;

//public class AttendanceRepository : IAttendanceRepository
//{
//    private readonly ParentTeacherBridgeAPIContext _context;
//    private readonly ILogger<AttendanceRepository> _logger;

//    public AttendanceRepository(ParentTeacherBridgeAPIContext context, ILogger<AttendanceRepository> logger)
//    {
//        _context = context;
//        _logger = logger;
//    }

//    public async Task<Attendance> GetByIdAsync(int id)
//    {
//        _logger.LogInformation("Getting attendance by ID: {Id}", id);
//        var attendance = await _context.Attendances.FindAsync(id);
//        if (attendance == null)
//            _logger.LogWarning("Attendance with ID {Id} not found", id);
//        return attendance;
//    }

//    public async Task<IEnumerable<Attendance>> GetByStudentIdAsync(int studentId)
//    {
//        _logger.LogInformation("Retrieving attendance list for student ID: {Student_Id}", studentId);
//        return await _context.Attendances
//                             .Where(a => a.Student_Id == studentId)
//                             .ToListAsync();
//    }

//    public async Task<Attendance> AddAsync(Attendance attendance)
//    {
//        _logger.LogInformation("Adding new attendance record for student ID: {StudentId}", attendance.Student_Id);
//        _context.Attendances.Add(attendance);
//        await _context.SaveChangesAsync();
//        _logger.LogInformation("Attendance record added successfully with ID: {Id}", attendance.Attendance_Id);
//        return attendance;
//    }

//    public async Task<Attendance> UpdateAsync(Attendance attendance)
//    {
//        _logger.LogInformation("Updating attendance record with ID: {Id}", attendance.Attendance_Id);
//        _context.Attendances.Update(attendance);
//        await _context.SaveChangesAsync();
//        _logger.LogInformation("Attendance record updated successfully");
//        return attendance;
//    }

//    public async Task DeleteAsync(int id)
//    {
//        _logger.LogInformation("Deleting attendance record with ID: {Id}", id);
//        var attendance = await _context.Attendances.FindAsync(id);
//        if (attendance != null)
//        {
//            _context.Attendances.Remove(attendance);
//            await _context.SaveChangesAsync();
//            _logger.LogInformation("Attendance record deleted successfully");
//        }
//        else
//        {
//            _logger.LogWarning("Attempted to delete attendance record with ID {Id}, but it was not found", id);
//        }
//    }
//}