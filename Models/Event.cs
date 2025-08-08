using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParentTeacherBridge.API.Models
{
    [Table("events")]
    public partial class Event
    {
        [Key]
        [Column("event_id")]
        public int EventId { get; set; }

        [Column("title")]
        public string? Title { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("event_date")]
        public DateOnly? EventDate { get; set; }

        [Column("start_time")]
        public TimeOnly? StartTime { get; set; }

        [Column("end_time")]
        public TimeOnly? EndTime { get; set; }

        [Column("venue")]
        public string? Venue { get; set; }

        [Column("event_type")]
        public string? EventType { get; set; }

        [ForeignKey("Teacher")]
        [Column("teacher_id")]
        public int? TeacherId { get; set; }

        [Column("is_active")]
        public bool? IsActive { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        // Navigation property
        public virtual Teacher? Teacher { get; set; }
    }
}
