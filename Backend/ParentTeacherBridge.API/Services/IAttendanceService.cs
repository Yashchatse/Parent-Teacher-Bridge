using ParentTeacherBridge.API.DTO;
using System.Collections.Generic;

public interface IAttendanceService
{
    AttendanceDto CreateAttendance(AttendanceCreateDto dto);
    AttendanceDto UpdateAttendance(int id, AttendanceUpdateDto dto);
    void DeleteAttendance(int id);
    IEnumerable<AttendanceDto> GetAttendanceByStudentId(int studentId);
    // IEnumerable<AttendanceDto> GetAttendanceByTeacherId(int teacherId);
    IEnumerable<AttendanceDto> GetAttendanceByClassId(int classId);
}