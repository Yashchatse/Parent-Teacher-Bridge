using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParentTeacherBridge.API.Models;

[Table("teacher")]
public partial class Teacher
{
    [Key]
    public int TeacherId { get; set; }

    [Required(ErrorMessage = "Name is required")]
    public string? Name { get; set; }

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string? Email { get; set; }

    public string? Password { get; set; }

    [StringLength(10, ErrorMessage = "Phone number cannot exceed 20 characters")]
    public string? Phone { get; set; }

    public string? Gender { get; set; }

    public string? Photo { get; set; }

    public string? Qualification { get; set; }

    [Range(0, 50, ErrorMessage = "Experience years must be between 0 and 50")]
    public int? ExperienceYears { get; set; }

    public bool? IsActive { get; set; } = true;

    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<Behaviour> Behaviours { get; set; } = new List<Behaviour>();

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    public virtual ICollection<Performance> Performances { get; set; } = new List<Performance>();

    public virtual ICollection<SchoolClass> SchoolClasses { get; set; } = new List<SchoolClass>();

    public virtual ICollection<Timetable> Timetables { get; set; } = new List<Timetable>();
}
