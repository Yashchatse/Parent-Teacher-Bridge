using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ParentTeacherBridge.API.Models;

[Table("student")]
public partial class Student
{

        [Key]
        [Column("student_id")]
        public int StudentId { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Date of birth is required.")]
        [Column("dob")]
        public DateOnly Dob { get; set; }

        [Required(ErrorMessage = "Gender is required.")]
        [RegularExpression("^(Male|Female|Other)$", ErrorMessage = "Gender must be Male, Female, or Other.")]
        [Column("gender")]
        public string Gender { get; set; } = string.Empty;

        [Required(ErrorMessage = "Enrollment number is required.")]
        [StringLength(50, ErrorMessage = "Enrollment number cannot exceed 50 characters.")]
        [Column("enrollment_no")]
        public string EnrollmentNo { get; set; } = string.Empty;

        [StringLength(10, ErrorMessage = "Blood group cannot exceed 10 characters.")]
        [Column("blood_group")]
        public string BloodGroup { get; set; } = string.Empty;

        [Required(ErrorMessage = "Class ID is required.")]
        [Column("class_id")]
        public int ClassId { get; set; }

        [Column("profile_photo")]
        public string? ProfilePhoto { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }


    [JsonIgnore]
    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    [JsonIgnore]
    public virtual ICollection<Behaviour> Behaviours { get; set; } = new List<Behaviour>();

    [JsonIgnore]
    public virtual SchoolClass? Class { get; set; }

    [JsonIgnore]
    public virtual ICollection<Performance> Performances { get; set; } = new List<Performance>();

    [JsonIgnore]
    public virtual ICollection<StudentParent> StudentParents { get; set; } = new List<StudentParent>();

   

}
