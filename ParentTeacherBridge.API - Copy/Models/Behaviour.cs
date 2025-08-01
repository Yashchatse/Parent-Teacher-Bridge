using System;
using System.Collections.Generic;

namespace ParentTeacherBridge.API.Models;

public partial class Behaviour
{
    public int BehaviourId { get; set; }

    public int? StudentId { get; set; }

    public int? TeacherId { get; set; }

    public DateOnly? IncidentDate { get; set; }

    public string? BehaviourCategory { get; set; }

    public string? Severity { get; set; }

    public string? Description { get; set; }

    public bool? NotifyParent { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Student? Student { get; set; }

    public virtual Teacher? Teacher { get; set; }
}
