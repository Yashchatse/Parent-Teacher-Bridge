using System;
using System.Collections.Generic;

namespace ParentTeacherBridge.API.Models;

public partial class Student
{
    public int StudentId { get; set; }

    public string? Name { get; set; }

    public DateOnly? Dob { get; set; }

    public string? Gender { get; set; }

    public string? EnrollmentNo { get; set; }

    public string? BloodGroup { get; set; }

    public int? ClassId { get; set; }

    public string? ProfilePhoto { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

    public virtual ICollection<Behaviour> Behaviours { get; set; } = new List<Behaviour>();

    public virtual SchoolClass? Class { get; set; }

    public virtual ICollection<Performance> Performances { get; set; } = new List<Performance>();

    public virtual ICollection<StudentParent> StudentParents { get; set; } = new List<StudentParent>();
}
