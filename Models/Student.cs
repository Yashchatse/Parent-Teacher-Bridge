using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ParentTeacherBridge.API.Models
{
    [Table("student")]
    public partial class Student
    {
        [Column("student_id")]
        public int StudentId { get; set; }

        [Column("name")]
        public string? Name { get; set; }

        [Column("dob")]
        public DateOnly? Dob { get; set; }

        [Column("gender")]
        public string? Gender { get; set; }

        [Column("enrollment_no")]
        public string? EnrollmentNo { get; set; }

        [Column("blood_group")]
        public string? BloodGroup { get; set; }

        [Column("class_id")]
        public int? ClassId { get; set; }

        [Column("profile_photo")]
        public string? ProfilePhoto { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        // 🧭 Navigation properties
        public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
        public virtual ICollection<Behaviour> Behaviours { get; set; } = new List<Behaviour>();
        public virtual ICollection<Performance> Performances { get; set; } = new List<Performance>();
        public virtual ICollection<Timetable> Timetables { get; set; } = new List<Timetable>();
        public virtual ICollection<Event> Events { get; set; } = new List<Event>();

        public virtual SchoolClass? Class { get; set; }

        // ✅ Removed ParentId FK column — handled via Parent entity now
        // ✅ Removed navigation property — handled via reverse navigation

        // ❌ Removed: public int ParentId { get; set; }
        // ❌ Removed: public virtual Parent Parent { get; set; }

        // ⛔ Removed join table if unused
        // public virtual ICollection<StudentParent> StudentParents { get; set; } = new List<StudentParent>();
    }
}
