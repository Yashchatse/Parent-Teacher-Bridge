namespace ParentTeacherBridge.API.DTOs
{
    public class StudentDTO
    {
        public int StudentId { get; set; }
        public string? Name { get; set; }
        public string? EnrollmentNo { get; set; }
        public string? Gender { get; set; }
        public string? BloodGroup { get; set; }
        public int? ClassId { get; set; }
        public string? ProfilePhoto { get; set; }
    }
}
