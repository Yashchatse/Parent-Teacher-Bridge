using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParentTeacherBridge.API.Models;
[Table("admin")]
public partial class Admin
{
    [Key]
    [Column("admin_id")] 
    public int AdminId { get; set; }

    [Column("name")]
    public string? Name { get; set; }

    [Column("email")]
    public string? Email { get; set; }

    [Column("password")]
    public string? Password { get; set; }

    [Column("is_active")] // If your database column is named "Active" instead of "IsActive"
    public bool? IsActive { get; set; }
}
