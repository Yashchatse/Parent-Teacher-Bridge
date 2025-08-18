using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParentTeacherBridge.API.Models;

[Table("behaviour")]
public partial class Behaviour
{
    [Key]
    [Column("behaviour_id")]
    public int BehaviourId { get; set; }


    [Column("student_id")]
    [Required(ErrorMessage = "Student ID is required.")]
    public int StudentId { get; set; }


    [Column("teacher_id")]
    [Required(ErrorMessage = "Teacher ID is required.")]
    public int TeacherId { get; set; }


    [Column("incident_date")]
    [Required(ErrorMessage = "Incident date is required.")]
    public DateTime IncidentDate { get; set; }

    [Column("behaviour_category")]
    [Required(ErrorMessage = "Behaviour category is required.")]
    [StringLength(100, ErrorMessage = "Category cannot exceed 100 characters.")]
    public string BehaviourCategory { get; set; }


    [Column("severity")]
    [Required(ErrorMessage = "Severity is required.")]
    //[severity]='Severe' OR[severity]='Moderate' OR[severity]='Minor'
    [RegularExpression("^(Severe|Moderate|Minor)$", ErrorMessage = "Severity must be Severe, Moderate, or Minor.")]
    public string? Severity { get; set; }


    [Column("description")]
    [Required(ErrorMessage = "Description is required.")]
    public string Description { get; set; }

    [Column("notify_parent")]
    public bool NotifyParent { get; set; } = false;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    // Navigation Properties
    public Student Student { get; set; }   // Links Behaviour → Student
    public Teacher Teacher { get; set; }   // Links Behaviour → Teacher


    //public int BehaviourId { get; set; }

    //public int? StudentId { get; set; }

    //public int? TeacherId { get; set; }

    //public DateOnly? IncidentDate { get; set; }

    //public string? BehaviourCategory { get; set; }

    //public string? Severity { get; set; }

    //public string? Description { get; set; }

    //public bool? NotifyParent { get; set; }

    //public DateTime? CreatedAt { get; set; }

    //public DateTime? UpdatedAt { get; set; }

    //public virtual Student? Student { get; set; }

    //public virtual Teacher? Teacher { get; set; }
}
