using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using ParentTeacherBridge.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ParentTeacherBridge.API.Data
{
    public class ParentTeacherBridgeAPIContext : DbContext
    {
        public ParentTeacherBridgeAPIContext (DbContextOptions<ParentTeacherBridgeAPIContext> options)
            : base(options)
        {
        }

        public DbSet<Admin> Admin { get; set; } = default!;
        public DbSet<Teacher> Teacher { get; set; } = default!;
        public DbSet<Behaviour> Behaviour { get; set; } = default!;
        public DbSet<Student> Student { get; set; } = default!;
        public DbSet<Parent> Parent { get; set; } = default!;
        public DbSet<Attendance> Attendance { get; set; } = default!;
        public DbSet<Event> Event { get; set; } = default!;
        public DbSet<Performance> Performance { get; set; } = default!;
        public DbSet<SchoolClass> SchoolClass { get; set; } = default!;
        public DbSet<Subject> Subject { get; set; } = default!;
        public DbSet<Timetable> Timetable { get; set; } = default!;

        public DbSet<Message> Messages { get; set; } = default!;
        //public DbSet<ParentTeacherBridge.API.Models.StudentParent> StudentParent { get; set; } = default!;
        //public DbSet<ParentTeacherBridge.API.Models.Events> Events { get; set; } = default!;
        //public DbSet<Login> Login { get; set; } = default!;
    }
}
