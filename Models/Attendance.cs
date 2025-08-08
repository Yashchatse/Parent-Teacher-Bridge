using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParentTeacherBridge.API.Models;

[Table("attendance")]
public partial class Attendance
{
    [Key]
    [Column("attendance_id")]
    public int AttendanceId { get; set; }

    [Column("student_id")]
    [Required(ErrorMessage = "Student ID is required.")]
    public int? StudentId { get; set; }

    [Column("class_id")]
    [Required(ErrorMessage = "Class ID is required.")]
    public int? ClassId { get; set; }

    [Column("date")]
    [Required(ErrorMessage = "Date is required.")]
    public DateOnly? Date { get; set; }

    [Column("status")]
    [Required(ErrorMessage = "Status is required.")]
    [StringLength(20, ErrorMessage = "Status can't be longer than 20 characters.")]
    public string? Status { get; set; }

    [Column("remark")]
    [StringLength(250, ErrorMessage = "Remark can't exceed 250 characters.")]
    public string? Remark { get; set; }

    [Column("marked_time")]
    public TimeSpan? MarkedTime { get; set; }

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }

    [Column("school_class")]
    public virtual SchoolClass? Class { get; set; }

    [Column("student")]
    public virtual Student? Student { get; set; }
}
