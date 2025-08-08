namespace ParentTeacherBridge.API.DTOs
{
    public class TimetableDTO
    {
        // 🌐 Optional identifiers for linking/filtering
        public int? SubjectId { get; set; }
        public string? SubjectName { get; set; }

        public int? TeacherId { get; set; }
        public string? TeacherName { get; set; }

        public int? ClassId { get; set; }
        public string? ClassName { get; set; }

        // 🏫 Session details
        public string? Room { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public string? Day { get; set; }
    }
}
