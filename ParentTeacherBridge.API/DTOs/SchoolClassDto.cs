using System.ComponentModel.DataAnnotations;

namespace ParentTeacherBridge.API.DTOs
{
    public class SchoolClassDto
    {
        public int ClassId { get; set; }
        public string? ClassName { get; set; }
        public int? ClassTeacherId { get; set; }
        public string? ClassTeacherName { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateSchoolClassDto
    {
        [Required(ErrorMessage = "Class name is required")]
        [StringLength(100, ErrorMessage = "Class name cannot exceed 100 characters")]
        public string ClassName { get; set; } = string.Empty;

        public int? ClassTeacherId { get; set; }
    }

    public class UpdateSchoolClassDto
    {
        [Required(ErrorMessage = "Class name is required")]
        [StringLength(100, ErrorMessage = "Class name cannot exceed 100 characters")]
        public string ClassName { get; set; } = string.Empty;

        public int? ClassTeacherId { get; set; }
    }
}