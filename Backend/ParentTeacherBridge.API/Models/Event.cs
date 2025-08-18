using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParentTeacherBridge.API.Models;

[Table("events")]
public partial class Event
{

    [Key]
    [Column("event_id")]
    public int EventId { get; set; }

    [Column("title")]
    [Required(ErrorMessage = "Title is required")]
    [MaxLength(100, ErrorMessage = "Title can't exceed 100 characters")]
    public string? Title { get; set; }

    [Column("description")]
    [MaxLength(500, ErrorMessage = "Description can't exceed 500 characters")]
    public string? Description { get; set; }

    [Column("event_date")]
    [Required(ErrorMessage = "Event date is required")]
    public DateOnly? EventDate { get; set; }

    [Column("start_time")]
    [Required(ErrorMessage = "Start time is required")]
    public TimeOnly? StartTime { get; set; }

    [Column("end_time")]
    [Required(ErrorMessage = "End time is required")]
    public TimeOnly? EndTime { get; set; }

    [Column("venue")]
    [MaxLength(100, ErrorMessage = "Venue can't exceed 100 characters")]
    public string? Venue { get; set; }

    [Column("event_type")]
    [MaxLength(50, ErrorMessage = "Event type can't exceed 50 characters")]
    public string? EventType { get; set; }

    [Column("teacher_id")]
    [Required(ErrorMessage = "Teacher ID is required")]
    public int? TeacherId { get; set; }

    [Column("is_active")]
    public bool? IsActive { get; set; } = true;

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }

    public virtual Teacher? Teacher { get; set; }
    //public int EventId { get; set; }

    //public string? Title { get; set; }

    //public string? Description { get; set; }

    //public DateOnly? EventDate { get; set; }

    //public TimeOnly? StartTime { get; set; }

    //public TimeOnly? EndTime { get; set; }

    //public string? Venue { get; set; }

    //public string? EventType { get; set; }

    //public int? TeacherId { get; set; }

    //public bool? IsActive { get; set; }

    //public DateTime? CreatedAt { get; set; }

    //public DateTime? UpdatedAt { get; set; }

    //public virtual Teacher? Teacher { get; set; }
}
