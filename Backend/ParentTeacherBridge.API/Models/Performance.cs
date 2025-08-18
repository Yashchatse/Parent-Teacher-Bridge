using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParentTeacherBridge.API.Models;

[Table("performance")]
public partial class Performance
{
    [Key]
    [Column("performance_id")]
    public int PerformanceId { get; set; }

    [Column("student_id")]
    [Required]
    public int? StudentId { get; set; }

    [Column("teacher_id")]
    [Required]
    public int? TeacherId { get; set; }

    [Column("subject_id")]
    [Required, StringLength(100)]
    public int? SubjectId { get; set; }

    [Column("exam_type")]
    //CHECK([exam_type]= 'Practical' OR[exam_type]= 'Quiz' OR[exam_type]= 'Unit Test' OR[exam_type]= 'Final' OR[exam_type]= 'Midterm')
    public string? ExamType { get; set; }

    [Column("marks_obtained")]
    public double? MarksObtained { get; set; }

    [Column("max_marks")]
    public double? MaxMarks { get; set; }

    [Column("percentage")]
    public double? Percentage { get; set; }

    [Column("grade")]
    public string? Grade { get; set; }

    [Column("exam_date")]
    public DateOnly? ExamDate { get; set; }

    [Column("remarks")]
    public string? Remarks { get; set; }

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }

    public virtual Student? Student { get; set; }

    public virtual Subject? Subject { get; set; }

    public virtual Teacher? Teacher { get; set; }
}
