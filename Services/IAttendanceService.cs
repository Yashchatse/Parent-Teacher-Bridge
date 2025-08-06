using ParentTeacherBridge.API.DTO;

public interface IAttendanceService
{
    Task<AttendanceDto> CreateAsync(CreateAttendanceDto dto);
    Task<AttendanceDto?> UpdateAsync(int id, AttendanceDto dto);
    Task<bool> DeleteAsync(int id);
    Task<AttendanceDto?> GetByIdAsync(int id);
    Task<IEnumerable<AttendanceDto>> GetByStudentIdAsync(int studentId);
    Task<IEnumerable<AttendanceDto>> GetByClassAndDateAsync(int classId, DateOnly date);
    //Task<AttendanceDTO> CreateAsync(AttendanceDTO dto);
    //Task<AttendanceDTO> UpdateAsync(int id, AttendanceDTO dto);
    //Task DeleteAsync(int id);
    //Task<AttendanceDTO> GetByIdAsync(int id);
    //Task<IEnumerable<AttendanceDTO>> GetByStudentIdAsync(int studentId);
}