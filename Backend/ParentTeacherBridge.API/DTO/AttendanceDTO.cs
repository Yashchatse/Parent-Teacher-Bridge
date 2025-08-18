using System;

namespace ParentTeacherBridge.API.DTO
{
    // For viewing attendance records
    public class AttendanceDto
    {
        public int AttendanceId { get; set; }
        public int StudentId { get; set; }
        // public int TeacherId { get; set; }
        public int ClassId { get; set; }
        public DateOnly Date { get; set; }
        public bool IsPresent { get; set; }

        public string? Status { get; set; }
        public string Remarks { get; set; }
    }

    // For creating new attendance records
    public class AttendanceCreateDto
    {
        public int AttendanceId { get; set; }
        public int StudentId { get; set; }
        // public int TeacherId { get; set; }
        public int ClassId { get; set; }
        public DateOnly Date { get; set; }
        public bool IsPresent { get; set; }
        public string? Status { get; set; }
        public string Remarks { get; set; }
    }

    // For updating existing attendance records
    public class AttendanceUpdateDto
    {
        public int AttendanceId { get; set; }
        public int StudentId { get; set; }
        //public int TeacherId { get; set; }
        public int ClassId { get; set; }
        public DateOnly Date { get; set; }
        public bool IsPresent { get; set; }
        public string Remarks { get; set; }

        public string? Status { get; set; }
    }
}