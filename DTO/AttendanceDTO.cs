
using System;
using System.ComponentModel.DataAnnotations;

namespace ParentTeacherBridge.API.DTO
{
    public class AttendanceDto
    {
        public int AttendanceId { get; set; }
        public int StudentId { get; set; }
        public int ClassId { get; set; }
        public DateOnly Date { get; set; }
        public string Status { get; set; }
        public string? Remark { get; set; }
        public TimeOnly? MarkedTime { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateAttendanceDto
    {
        [Required(ErrorMessage = "Student ID is required.")]
        public int StudentId { get; set; }

        [Required(ErrorMessage = "Class ID is required.")]
        public int ClassId { get; set; }

        [Required(ErrorMessage = "Date is required.")]
        public DateOnly Date { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        [MaxLength(20)]
        public string Status { get; set; }

        [MaxLength(250)]
        public string? Remark { get; set; }
    }
}

//using System.ComponentModel.DataAnnotations;

//namespace ParentTeacherBridge.API.DTOs
//{
//    public class AttendanceDTO
//    {
//        public int Attendance_Id { get; set; }
//        public int Student_Id { get; set; }
//        public int Class_Id { get; set; }
//        public DateTime Date { get; set; }
//        public string? Status { get; set; }
//        public string? Remark { get; set; }
//        public TimeOnly? Marked_Time { get; set; }
//        public DateTime? Created_At { get; set; }
//        public DateTime? Updated_At { get; set; }
//    }

//    public class CreateAttendanceDto
//    {
//        [Required(ErrorMessage = "Student ID is required")]
//        public int Student_Id { get; set; }

//        [Required(ErrorMessage = "Class ID is required")]
//        public int Class_Id { get; set; }

//        [Required(ErrorMessage = "Date is required")]
//        public DateTime Date { get; set; }

//        [Required(ErrorMessage = "Status is required")]
//        //[RegularExpression(@"^(Present|Absent|Late|Excused)$", ErrorMessage = "Status must be Present, Absent, Late, or Excused")]
//        public string Status { get; set; } = string.Empty;

//        [StringLength(500, ErrorMessage = "Remark cannot exceed 500 characters")]
//        public string? Remark { get; set; }

//        public TimeOnly? Marked_Time { get; set; }
//    }

//    public class UpdateAttendanceDto
//    {
//        [Required(ErrorMessage = "Date is required")]
//        public DateTime Date { get; set; }

//        [Required(ErrorMessage = "Status is required")]
//        [RegularExpression(@"^(Present|Absent|Late|Excused)$", ErrorMessage = "Status must be Present, Absent, Late, or Excused")]
//        public string Status { get; set; } = string.Empty;

//        [StringLength(500, ErrorMessage = "Remark cannot exceed 500 characters")]
//        public string? Remark { get; set; }

//        public TimeOnly? Marked_Time { get; set; }
//    }
//}