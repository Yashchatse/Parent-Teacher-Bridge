using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ParentTeacherBridge.API.Models;

public partial class Teacher
{
        [Key]
        [Column("teacher_id")]
        public int TeacherId { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [Column("name")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [Column("email")]
        public string Email { get; set; }

    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
ErrorMessage = "Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.")]
    [Column("password")]
        public string Password { get; set; }

      
    [StringLength(10, ErrorMessage = "Phone number cannot exceed 15 characters")]
    [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be exactly 10 digits")]

    [Column("phone")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Gender is required.")]
        [Column("gender")]
        public string Gender { get; set; }

        [Column("photo")]
        public string? Photo { get; set; }

        [Required(ErrorMessage = "Qualification is required.")]
        [Column("qualification")]
        public string Qualification { get; set; }

        [Range(0, 50, ErrorMessage = "Experience must be between 0 and 50 years.")]
        [Column("experience_years")]
        public int ExperienceYears { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }


    //public int TeacherId { get; set; }

    //public string? Name { get; set; }

    //public string? Email { get; set; }

    //public string? Password { get; set; }

    //public string? Phone { get; set; }

    //public string? Gender { get; set; }

    //public string? Photo { get; set; }

    //public string? Qualification { get; set; }

    //public int? ExperienceYears { get; set; }

    //public bool? IsActive { get; set; }

    //public DateTime? CreatedAt { get; set; }

    //public DateTime? UpdatedAt { get; set; }

    [JsonIgnore]
    public virtual ICollection<Behaviour> Behaviours { get; set; } = new List<Behaviour>();

    [JsonIgnore]
    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    [JsonIgnore]
    public virtual ICollection<Performance> Performances { get; set; } = new List<Performance>();

    [JsonIgnore]
    public virtual ICollection<SchoolClass> SchoolClasses { get; set; } = new List<SchoolClass>();

    [JsonIgnore]
    public virtual ICollection<Timetable> Timetables { get; set; } = new List<Timetable>();

    


}
