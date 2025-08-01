using System;
using System.Collections.Generic;

namespace ParentTeacherBridge.API.Models;

public partial class Event
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

    public virtual Teacher? Teacher { get; set; }
}
