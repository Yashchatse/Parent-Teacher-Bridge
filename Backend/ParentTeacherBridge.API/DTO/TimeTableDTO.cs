using System.ComponentModel.DataAnnotations;

namespace ParentTeacherBridge.API.DTO
{
    public class TimetableDto
    {
        public int TimetableId { get; set; }
        public int? ClassId { get; set; }
        //public string? ClassName { get; set; }
        public int? SubjectId { get; set; }
        //public string? SubjectName { get; set; }
        public int? TeacherId { get; set; }
        //public string? TeacherName { get; set; }
        public string? Weekday { get; set; }
        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateTimetableDto
    {

        public int TimetableId { get; set; }

        [Required(ErrorMessage = "Class is required")]
        public int ClassId { get; set; }

        [Required(ErrorMessage = "Subject is required")]
        public int SubjectId { get; set; }

        [Required(ErrorMessage = "Teacher is required")]
        public int TeacherId { get; set; }

        [Required(ErrorMessage = "Weekday is required")]
        [RegularExpression(@"^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$",
            ErrorMessage = "Weekday must be one of: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday")]
        public string Weekday { get; set; } = string.Empty;

        [Required(ErrorMessage = "Start time is required")]
        public TimeOnly StartTime { get; set; }

        [Required(ErrorMessage = "End time is required")]
        public TimeOnly EndTime { get; set; }
    }

    public class UpdateTimetableDto
    {

        public int TimetableId { get; set; }

        [Required(ErrorMessage = "Class is required")]
        public int ClassId { get; set; }

        [Required(ErrorMessage = "Subject is required")]
        public int SubjectId { get; set; }

        [Required(ErrorMessage = "Teacher is required")]
        public int TeacherId { get; set; }

        [Required(ErrorMessage = "Weekday is required")]
        [RegularExpression(@"^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$",
            ErrorMessage = "Weekday must be one of: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday")]
        public string Weekday { get; set; } = string.Empty;

        [Required(ErrorMessage = "Start time is required")]
        public TimeOnly StartTime { get; set; }

        [Required(ErrorMessage = "End time is required")]
        public TimeOnly EndTime { get; set; }
    }
}