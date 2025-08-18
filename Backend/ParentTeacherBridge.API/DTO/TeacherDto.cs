using System.ComponentModel.DataAnnotations;

namespace ParentTeacherBridge.API.DTO
{
    public class TeacherDto
    {
        public int TeacherId { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Gender { get; set; }
        public string? Photo { get; set; }
        public string? Qualification { get; set; }
        public int? ExperienceYears { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
        public class CreateTeacherDto
        {
            [Required(ErrorMessage = "Name is required")]
            [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
            public string Name { get; set; } = string.Empty;

            [Required(ErrorMessage = "Email is required")]
            [EmailAddress(ErrorMessage = "Invalid email format")]
            [StringLength(255, ErrorMessage = "Email cannot exceed 255 characters")]
            public string Email { get; set; } = string.Empty;

        //[Required(ErrorMessage = "Password is required")]
       
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
ErrorMessage = "Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.")]
        public string Password { get; set; } = string.Empty;

        [StringLength(10, ErrorMessage = "Phone number cannot exceed 10 characters")]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be exactly 10 digits")]

        public string? Phone { get; set; }

            [RegularExpression(@"^(Male|Female|Other)$", ErrorMessage = "Gender must be Male, Female, or Other")]
            public string? Gender { get; set; }

            public string? Photo { get; set; }

            [StringLength(200, ErrorMessage = "Qualification cannot exceed 200 characters")]
            public string? Qualification { get; set; }

            [Range(0, 50, ErrorMessage = "Experience years must be between 0 and 50")]
            public int? ExperienceYears { get; set; }

            public bool IsActive { get; set; } = true;
    }

        public class UpdateTeacherDto
        {
            [Required(ErrorMessage = "Name is required")]
            [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
            public string Name { get; set; } = string.Empty;

            [Required(ErrorMessage = "Email is required")]
            [EmailAddress(ErrorMessage = "Invalid email format")]
            [StringLength(255, ErrorMessage = "Email cannot exceed 255 characters")]
            public string Email { get; set; } = string.Empty;

            [StringLength(255, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 255 characters")]
            public string? Password { get; set; }

            [StringLength(10, ErrorMessage = "Phone number cannot exceed 15 characters")]
            [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be between 10-15 digits")]
            public string? Phone { get; set; }

            [RegularExpression(@"^(Male|Female|Other)$", ErrorMessage = "Gender must be Male, Female, or Other")]
            public string? Gender { get; set; }

            public string? Photo { get; set; }

            [StringLength(200, ErrorMessage = "Qualification cannot exceed 200 characters")]
            public string? Qualification { get; set; }

            [Range(0, 50, ErrorMessage = "Experience years must be between 0 and 50")]
            public int? ExperienceYears { get; set; }

            public bool IsActive { get; set; } = true;
        }
    
}
