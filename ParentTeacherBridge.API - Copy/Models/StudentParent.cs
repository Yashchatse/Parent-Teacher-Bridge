using System;
using System.Collections.Generic;

namespace ParentTeacherBridge.API.Models;

public partial class StudentParent
{
    public int Id { get; set; }

    public int? StudentId { get; set; }

    public int? ParentId { get; set; }

    public string? Relationship { get; set; }

    public bool? IsPrimaryGuardian { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Parent? Parent { get; set; }

    public virtual Student? Student { get; set; }
}
