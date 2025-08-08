using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ParentTeacherBridge.API.Models
{
    [Table("parent")]
    public partial class Parent
    {
        [Column("parent_id")]
        public int ParentId { get; set; }

        [Column("name")]
        public string? Name { get; set; }

        [Column("email")]
        public string? Email { get; set; }

        [Column("stud_enrollment_no")]
        public string? StudEnrollmentNo { get; set; }

        [Column("student_id")]
        public int? StudentId { get; set; } //  FK pointing to Student

        [ForeignKey("StudentId")]
        public virtual Student? Student { get; set; } //  Navigation property

        [Column("phone")]
        public string? Phone { get; set; }

        [Column("password")]
        [JsonIgnore]
        public string? Password { get; set; }

        [Column("address")]
        public string? Address { get; set; }

        [Column("gender")]
        public string? Gender { get; set; }

        [Column("occupation")]
        public string? Occupation { get; set; }

        [Column("photo")]
        public string? Photo { get; set; }

        [Column("is_active")]
        [JsonIgnore]
        public bool? IsActive { get; set; }

        [Column("created_at")]
        [JsonIgnore]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        [JsonIgnore]
        public DateTime? UpdatedAt { get; set; }

        // ❌ Removed one-to-many relationship — no longer needed
        // public virtual ICollection<Student> Students { get; set; } = new List<Student>();
    }
}
