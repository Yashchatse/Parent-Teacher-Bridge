using ParentTeacherBridge.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
public interface IAttendanceRepository
{

    Task<Attendance> AddAsync(Attendance attendance);
    Task<Attendance?> UpdateAsync(Attendance attendance);
    Task<bool> DeleteAsync(int id);
    Task<Attendance?> GetByIdAsync(int id);
    Task<IEnumerable<Attendance>> GetByStudentIdAsync(int studentId);
    Task<IEnumerable<Attendance>> GetByClassAndDateAsync(int classId, DateOnly date);
    Task<bool> AttendanceExistsAsync(int studentId, DateOnly date); // Prevent duplicate



    //Task<Attendance> GetByIdAsync(int id);
    //Task<IEnumerable<Attendance>> GetByStudentIdAsync(int studentId);
    //Task<Attendance> AddAsync(Attendance attendance);
    //Task<Attendance> UpdateAsync(Attendance attendance);
    //Task DeleteAsync(int id);
}