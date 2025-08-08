namespace ParentTeacherBridge.API.DTOs
{
    public class AttendanceDTO
    {
        public DateOnly? Date { get; set; }
        public string? Status { get; set; }
        public string? Remark { get; set; }
        public TimeOnly? MarkedTime { get; set; }
    }

}
