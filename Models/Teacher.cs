using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParentTeacherBridge.API.Models;

[Table("teacher")]
public partial class Teacher
{
    [Key]
    [Column("teacher_id")]
    public int TeacherId { get; set; }

    [Column("name")]
    [MaxLength(100)] // Optional: update based on actual schema
    public string? Name { get; set; }

    [Column("email")]
    [MaxLength(150)]
    public string? Email { get; set; }

    [Column("password")]
    [MaxLength(255)]
    public string? Password { get; set; }

    [Column("phone")]
    [MaxLength(20)]
    public string? Phone { get; set; }

    [Column("gender")]
    [MaxLength(10)]
    public string? Gender { get; set; }

    [Column("photo")]
    public string? Photo { get; set; }

    [Column("qualification")]
    [MaxLength(100)]
    public string? Qualification { get; set; }

    [Column("experience_years")]
    public int? ExperienceYears { get; set; }

    [Column("is_active")]
    public bool? IsActive { get; set; }

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }

    // 🔗 Navigation properties
    public virtual ICollection<Behaviour> Behaviours { get; set; } = new List<Behaviour>();

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    public virtual ICollection<Performance> Performances { get; set; } = new List<Performance>();

    public virtual ICollection<SchoolClass> SchoolClasses { get; set; } = new List<SchoolClass>();

    public virtual ICollection<Timetable> Timetables { get; set; } = new List<Timetable>();
}
