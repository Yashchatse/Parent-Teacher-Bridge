using System.ComponentModel.DataAnnotations;

namespace ParentTeacherBridge.API.DTO
{
    public class SubjectDto
    {
        public int SubjectId { get; set; }
        public string? Name { get; set; }
        public string? Code { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateSubjectDto
    {
        public int SubjectId { get; set; }
        [Required(ErrorMessage = "Subject name is required")]
        [StringLength(100, ErrorMessage = "Subject name cannot exceed 100 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Subject code is required")]
        //[StringLength(20, ErrorMessage = "Subject code cannot exceed 20 characters")]
        //[RegularExpression(@"^[A-Z0-9]+$", ErrorMessage = "Subject code must contain only uppercase letters and numbers")]
        public string Code { get; set; } = string.Empty;
    }

    public class UpdateSubjectDto
    {
        [Required(ErrorMessage = "Subject name is required")]
        [StringLength(100, ErrorMessage = "Subject name cannot exceed 100 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Subject code is required")]
        [StringLength(20, ErrorMessage = "Subject code cannot exceed 20 characters")]
        [RegularExpression(@"^[A-Z0-9]+$", ErrorMessage = "Subject code must contain only uppercase letters and numbers")]
        public string Code { get; set; } = string.Empty;
    }
}