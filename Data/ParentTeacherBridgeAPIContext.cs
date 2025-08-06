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

        public DbSet<ParentTeacherBridge.API.Models.Admin> Admin { get; set; } = default!;
        public DbSet<ParentTeacherBridge.API.Models.Teacher> Teacher { get; set; } = default!;

        public DbSet<ParentTeacherBridge.API.Models.Behaviour> Behaviour { get; set; } = default!;

        public DbSet<ParentTeacherBridge.API.Models.Student> Student { get; set; } = default!;
        public DbSet<ParentTeacherBridge.API.Models.Parent> Parent { get; set; } = default!;
        public DbSet<ParentTeacherBridge.API.Models.Attendance> Attendance { get; set; } = default!;

        public DbSet<ParentTeacherBridge.API.Models.Event> Event { get; set; } = default!;
        public DbSet<ParentTeacherBridge.API.Models.Performance> Performance { get; set; } = default!;
        public DbSet<ParentTeacherBridge.API.Models.SchoolClass> SchoolClass { get; set; } = default!;
        public DbSet<ParentTeacherBridge.API.Models.Subject> Subject { get; set; } = default!;
        public DbSet<ParentTeacherBridge.API.Models.Timetable> Timetable { get; set; } = default!;
        //public DbSet<ParentTeacherBridge.API.Models.Message> Message { get; set; } = default!;
        //public DbSet<ParentTeacherBridge.API.Models.StudentParent> StudentParent { get; set; } = default!;
        //public DbSet<ParentTeacherBridge.API.Models.Events> Events { get; set; } = default!;
        //public DbSet<Login> Login { get; set; } = default!;
    }
}
