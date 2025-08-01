using System;
using System.Collections.Generic;

namespace ParentTeacherBridge.API.Models;

public partial class Timetable
{
    public int TimetableId { get; set; }

    public int? ClassId { get; set; }

    public int? SubjectId { get; set; }

    public int? TeacherId { get; set; }

    public string? Weekday { get; set; }

    public TimeOnly? StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual SchoolClass? Class { get; set; }

    public virtual Subject? Subject { get; set; }

    public virtual Teacher? Teacher { get; set; }
}
