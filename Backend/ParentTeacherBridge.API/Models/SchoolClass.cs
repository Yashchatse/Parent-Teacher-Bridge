using System.Text.Json.Serialization;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParentTeacherBridge.API.Models;

[Table("school_class")]
public partial class SchoolClass
{
    [Key]
    [Column("class_id")]

    public int ClassId { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("class_name")]
    public string? ClassName { get; set; }


    [Column("class_teacher_id")]
    public int? ClassTeacherId { get; set; }

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }
    [JsonIgnore]
    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    [JsonIgnore]
    public virtual Teacher? ClassTeacher { get; set; }
    [JsonIgnore]
    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
    [JsonIgnore]
    public virtual ICollection<Timetable> Timetables { get; set; } = new List<Timetable>();
}
