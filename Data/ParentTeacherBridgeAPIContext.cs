using Microsoft.EntityFrameworkCore;
using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Data
{
    public class ParentTeacherBridgeAPIContext : DbContext
    {
        public ParentTeacherBridgeAPIContext(DbContextOptions<ParentTeacherBridgeAPIContext> options)
            : base(options)
        {
        }

        public DbSet<Admin> Admins { get; set; } = default!;
        public DbSet<Message> Messages { get; set; } = default!;
        public DbSet<Parent> Parents { get; set; } = default!;
        public DbSet<Student> Students { get; set; } = default!;
        public DbSet<Attendance> Attendances { get; set; } = default!;
        public DbSet<Behaviour> Behaviours { get; set; } = default!;
        public DbSet<Performance> Performances { get; set; } = default!;
        public DbSet<Timetable> Timetables { get; set; } = default!;
        public DbSet<Event> Events { get; set; } = default!;

        // Optional: Uncomment if Teacher model and logic are introduced
        // public DbSet<Teacher> Teachers { get; set; } = default!;
    }
}
