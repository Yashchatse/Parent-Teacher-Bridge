using ParentTeacherBridge.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IAttendanceRepository
{
    Attendance Create(Attendance attendance);
    Attendance Update(int id, Attendance attendance);
    void Delete(int id);
    Attendance GetById(int id);
    IEnumerable<Attendance> GetByStudentId(int studentId);
    // IEnumerable<Attendance> GetByTeacherId(int teacherId);
    IEnumerable<Attendance> GetByClassId(int classId);
}



    //Task<Attendance> GetByIdAsync(int id);
    //Task<IEnumerable<Attendance>> GetByStudentIdAsync(int studentId);
    //Task<Attendance> AddAsync(Attendance attendance);
    //Task<Attendance> UpdateAsync(Attendance attendance);
    //Task DeleteAsync(int id);
