
using System;
using System.ComponentModel.DataAnnotations;
public class EventDto // Read or details DTO
{
    public int EventId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateOnly? EventDate { get; set; }
    public TimeOnly? StartTime { get; set; }
    public TimeOnly? EndTime { get; set; }
    public string? Venue { get; set; }
    public string? EventType { get; set; }
    public int? TeacherId { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
public class EventCreateDto
{
    [Required(ErrorMessage = "Title is required.")]
    [StringLength(100, ErrorMessage = "Title can't be longer than 100 characters.")]
    public string? Title { get; set; }

    [StringLength(500, ErrorMessage = "Description can't be longer than 500 characters.")]
    public string? Description { get; set; }

    public DateOnly? EventDate { get; set; }

    public TimeOnly? StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }

    [StringLength(200, ErrorMessage = "Venue can't be longer than 200 characters.")]
    public string? Venue { get; set; }

    [Required(ErrorMessage = "Event type is required.")]
    [StringLength(50, ErrorMessage = "Event type can't be longer than 50 characters.")]
    public string? EventType { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Teacher ID must be a positive integer.")]
    public int? TeacherId { get; set; }

    public bool? IsActive { get; set; }
}

public class EventUpdateDto
{
    [Required]
    public int EventId { get; set; }

    [Required(ErrorMessage = "Title is required.")]
    [StringLength(100, ErrorMessage = "Title can't be longer than 100 characters.")]
    public string? Title { get; set; }

    [StringLength(500, ErrorMessage = "Description can't be longer than 500 characters.")]
    public string? Description { get; set; }

    public DateOnly? EventDate { get; set; }

    public TimeOnly? StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }

    [StringLength(200, ErrorMessage = "Venue can't be longer than 200 characters.")]
    public string? Venue { get; set; }

    [Required(ErrorMessage = "Event type is required.")]
    [StringLength(50, ErrorMessage = "Event type can't be longer than 50 characters.")]
    public string? EventType { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Teacher ID must be a positive integer.")]
    public int? TeacherId { get; set; }

    public bool? IsActive { get; set; }
}

public class EventDeleteDto
{
    [Required]
    public int EventId { get; set; }

    public string? Title { get; set; } // Optional, useful for confirmation display
}
