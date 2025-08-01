using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public DbSet<Student> Student { get; set; }
        public DbSet<Parent> Parent { get; set; }
        public DbSet<Subject> Subject { get; set; }
        public DbSet<Timetable> Timetable { get; set; }

        public DbSet<Teacher> Teacher { get; set; }
        public DbSet<Admin> Admin { get; set; }
        public DbSet<SchoolClass> SchoolClass { get; set; }
    }
}
