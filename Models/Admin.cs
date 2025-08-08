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
    [Required(ErrorMessage = "Name is required")]
    public string? Name { get; set; }

    [Column("email")]
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string? Email { get; set; }

    [Column("password")]
    [StringLength(255, ErrorMessage = "Password cannot exceed 255 characters")]
    public string? Password { get; set; }

    [Column("is_active")]
    public bool? IsActive { get; set; }
}
