using System.ComponentModel.DataAnnotations;

namespace ParentTeacherBridge.API.DTO
{
    public class StudentDto
    {
        public int StudentId { get; set; }
        public string? Name { get; set; }
        public DateOnly? Dob { get; set; }
        public string? Gender { get; set; }
        public string? EnrollmentNo { get; set; }
        public string? BloodGroup { get; set; }
        public int? ClassId { get; set; }
        public string? ClassName { get; set; }
        public string? ProfilePhoto { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateStudentDto
    {

        public int StudentId { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Date of birth is required")]
        public DateOnly Dob { get; set; }

        [RegularExpression(@"^(Male|Female|Other)$", ErrorMessage = "Gender must be Male, Female, or Other")]
        public string? Gender { get; set; }

        [Required(ErrorMessage = "Enrollment number is required")]
        [StringLength(50, ErrorMessage = "Enrollment number cannot exceed 50 characters")]
        public string EnrollmentNo { get; set; } = string.Empty;

        [RegularExpression(@"^(A\+|A-|B\+|B-|AB\+|AB-|O\+|O-)$", ErrorMessage = "Invalid blood group")]
        public string? BloodGroup { get; set; }

        [Required(ErrorMessage = "Class is required")]
        public int ClassId { get; set; }

        public string? ProfilePhoto { get; set; }
    }

    public class UpdateStudentDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Date of birth is required")]
        public DateOnly Dob { get; set; }

        [RegularExpression(@"^(Male|Female|Other)$", ErrorMessage = "Gender must be Male, Female, or Other")]
        public string? Gender { get; set; }

        [Required(ErrorMessage = "Enrollment number is required")]
        [StringLength(50, ErrorMessage = "Enrollment number cannot exceed 50 characters")]
        public string EnrollmentNo { get; set; } = string.Empty;

        [RegularExpression(@"^(A\+|A-|B\+|B-|AB\+|AB-|O\+|O-)$", ErrorMessage = "Invalid blood group")]
        public string? BloodGroup { get; set; }

        [Required(ErrorMessage = "Class is required")]
        public int ClassId { get; set; }

        public string? ProfilePhoto { get; set; }
    }
}