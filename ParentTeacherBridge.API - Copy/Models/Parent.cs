using System;
using System.Collections.Generic;

namespace ParentTeacherBridge.API.Models;

public partial class Parent
{
    public int ParentId { get; set; }

    public string? Name { get; set; }

    public string? Email { get; set; }

    public string? StudEnrollmentNo { get; set; }

    public string? Phone { get; set; }

    public string? Password { get; set; }

    public string? Address { get; set; }

    public string? Gender { get; set; }

    public string? Occupation { get; set; }

    public string? Photo { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<StudentParent> StudentParents { get; set; } = new List<StudentParent>();
}
