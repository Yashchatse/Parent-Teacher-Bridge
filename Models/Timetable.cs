using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParentTeacherBridge.API.Models
{
    [Table("timetable")]
    public partial class Timetable
    {
        [Key]
        [Column("timetable_id")]
        public int TimetableId { get; set; }

        [ForeignKey("SchoolClass")]
        [Column("class_id")]
        public int? ClassId { get; set; }

        [ForeignKey("Subject")]
        [Column("subject_id")]
        public int? SubjectId { get; set; }

        [ForeignKey("Teacher")]
        [Column("teacher_id")]
        public int? TeacherId { get; set; }

        [Column("weekday")]
        public string? Weekday { get; set; }

        [Column("start_time")]
        public TimeOnly? StartTime { get; set; }

        [Column("end_time")]
        public TimeOnly? EndTime { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual SchoolClass? Class { get; set; }
        public virtual Subject? Subject { get; set; }
        public virtual Teacher? Teacher { get; set; }
    }
}
