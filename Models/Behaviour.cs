using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParentTeacherBridge.API.Models
{
    [Table("behaviour")]
    public partial class Behaviour
    {
        [Column("behaviour_id")]
        public int BehaviourId { get; set; }

        [Column("student_id")]
        public int? StudentId { get; set; }

        [Column("teacher_id")]
        public int? TeacherId { get; set; }

        [Column("incident_date")]
        public DateOnly? IncidentDate { get; set; }

        [Column("behaviour_category")]
        public string? BehaviourCategory { get; set; }

        [Column("severity")]
        public string? Severity { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("notify_parent")]
        public bool? NotifyParent { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties (EF handles mapping via conventions or Fluent API)
        public virtual Student? Student { get; set; }
        public virtual Teacher? Teacher { get; set; }
    }
}
