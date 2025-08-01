using System;
using System.Collections.Generic;

namespace ParentTeacherBridge.API.Models;

public partial class Attendance
{
    public int AttendanceId { get; set; }

    public int? StudentId { get; set; }

    public int? ClassId { get; set; }

    public DateOnly? Date { get; set; }

    public string? Status { get; set; }

    public string? Remark { get; set; }

    public TimeOnly? MarkedTime { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual SchoolClass? Class { get; set; }

    public virtual Student? Student { get; set; }
}
