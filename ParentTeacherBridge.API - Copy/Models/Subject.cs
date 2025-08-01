using System;
using System.Collections.Generic;

namespace ParentTeacherBridge.API.Models;

public partial class Subject
{
    public int SubjectId { get; set; }

    public string? Name { get; set; }

    public string? Code { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Performance> Performances { get; set; } = new List<Performance>();

    public virtual ICollection<Timetable> Timetables { get; set; } = new List<Timetable>();
}
