using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParentTeacherBridge.API.Models;

[Table("student_parent")]
public partial class StudentParent
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("student_id")]
    public int? StudentId { get; set; }

    [Column("parent_id")]
    public int? ParentId { get; set; }

    [Column("relationship")]
    public string? Relationship { get; set; }

    [Column("is_primary_guardian")]
    public bool? IsPrimaryGuardian { get; set; }

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties (don't need column attributes)
    public virtual Parent? Parent { get; set; }
    public virtual Student? Student { get; set; }
}
