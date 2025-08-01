using System;
using System.Collections.Generic;

namespace ParentTeacherBridge.API.Models;

public partial class Performance
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

    public virtual Student? Student { get; set; }

    public virtual Subject? Subject { get; set; }

    public virtual Teacher? Teacher { get; set; }
}
