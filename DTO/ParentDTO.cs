namespace ParentTeacherBridge.API.DTO
{
    public class ParentDTO
    {
        public int ParentId { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? StudEnrollmentNo { get; set; }
        public int? StudentId { get; set; } // 🧩 New: links to associated student
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Gender { get; set; }
        public string? Occupation { get; set; }
        public string? Photo { get; set; }

        // 🚫 Password, IsActive, CreatedAt, UpdatedAt are intentionally excluded
    }
}
