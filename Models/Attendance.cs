using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParentTeacherBridge.API.Models
{
    [Table("attendance")]
    public partial class Attendance
    {
        [Column("attendance_id")]
        public int AttendanceId { get; set; }

        [Column("student_id")]
        public int? StudentId { get; set; }

        [Column("class_id")]
        public int? ClassId { get; set; }

        [Column("date")]
        public DateOnly? Date { get; set; }

        [Column("status")]
        public string? Status { get; set; }

        [Column("remark")]
        public string? Remark { get; set; }

        [Column("marked_time")]
        public TimeOnly? MarkedTime { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties (handled via EF conventions or Fluent API)
        public virtual SchoolClass? Class { get; set; }

        public virtual Student? Student { get; set; }
    }
}
