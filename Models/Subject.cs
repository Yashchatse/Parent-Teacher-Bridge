using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParentTeacherBridge.API.Models
{
    [Table("subject")]
    public partial class Subject
    {
        [Key]
        [Column("subject_id")]
        public int SubjectId { get; set; }

        [Column("name")]
        [MaxLength(100)] 
        public string? Name { get; set; }

        [Column("code")]
        [MaxLength(20)] 
        public string? Code { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        // 🔗 Navigation properties
        public virtual ICollection<Performance> Performances { get; set; } = new List<Performance>();

        public virtual ICollection<Timetable> Timetables { get; set; } = new List<Timetable>();
    }
}
