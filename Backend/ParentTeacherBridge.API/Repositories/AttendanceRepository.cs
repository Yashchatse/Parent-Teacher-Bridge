using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Models;
using System.Collections.Generic;
using System.Linq;

public class AttendanceRepository : IAttendanceRepository
{
    private readonly ParentTeacherBridgeAPIContext _context;

    public AttendanceRepository(ParentTeacherBridgeAPIContext context)
    {
        _context = context;
    }

    public Attendance Create(Attendance attendance)
    {
        _context.Attendance.Add(attendance);
        _context.SaveChanges();
        return attendance;
    }

    public Attendance Update(int id, Attendance attendance)
    {
        var existing = _context.Attendance.Find(id);
        if (existing == null) return null;

        existing.StudentId = attendance.StudentId;
        //existing.TeacherId = attendance.TeacherId;
        existing.ClassId = attendance.ClassId;
        existing.Date = attendance.Date;
        //existing.IsPresent = attendance.IsPresent;
        //existing.Remarks = attendance.Remarks;

        _context.SaveChanges();
        return existing;
    }

    public void Delete(int id)
    {
        var attendance = _context.Attendance.Find(id);
        if (attendance != null)
        {
            _context.Attendance.Remove(attendance);
            _context.SaveChanges();
        }
    }

    public Attendance GetById(int id) => _context.Attendance.Find(id);

    public IEnumerable<Attendance> GetByStudentId(int studentId) =>
        _context.Attendance.Where(a => a.StudentId == studentId).ToList();

    //public IEnumerable<Attendance> GetByTeacherId(int teacherId) =>
    //    _context.Attendance.Where(a => a.TeacherId == teacherId).ToList();

    public IEnumerable<Attendance> GetByClassId(int classId) =>
        _context.Attendance.Where(a => a.ClassId == classId).ToList();
}