using System;
using System.ComponentModel.DataAnnotations;



namespace ParentTeacherBridge.API.DTO
{
    public class PerformanceDto
    {
            public int PerformanceId { get; set; }
            public int? StudentId { get; set; }
            public int? TeacherId { get; set; }
            public int? SubjectId { get; set; }
            public string? ExamType { get; set; }
            public double? MarksObtained { get; set; }
            public double? MaxMarks { get; set; }
            public double? Percentage { get; set; }
            public string? Grade { get; set; }
            public DateOnly? ExamDate { get; set; }
            public string? Remarks { get; set; }
            public DateTime? CreatedAt { get; set; }
            public DateTime? UpdatedAt { get; set; }
        }

        public class CreatePerformanceDto
        {
        public int PerformanceId { get; set; }
        [Required] public int StudentId { get; set; }
            [Required] public int TeacherId { get; set; }
            [Required] public int SubjectId { get; set; }
            [Required] public string ExamType { get; set; } = string.Empty;
            [Required] public double MarksObtained { get; set; }
            [Required] public double MaxMarks { get; set; }
             public double? Percentage { get; set; }
             public string? Grade { get; set; }
            public DateOnly? ExamDate { get; set; }
            public string? Remarks { get; set; }
        }

        public class UpdatePerformanceDto
        {
            [Required] public string ExamType { get; set; } = string.Empty;
            [Required] public double MarksObtained { get; set; }

        [Required] public double? Percentage { get; set; }
        [Required] public double MaxMarks { get; set; }
            public string? Grade { get; set; }
            public DateOnly? ExamDate { get; set; }
            public string? Remarks { get; set; }
        }
    


}
