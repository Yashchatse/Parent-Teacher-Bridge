using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Data
{
    public class ParentTeacherBridgeAPIContext(DbContextOptions<ParentTeacherBridgeAPIContext> options) : DbContext(options)
    {
        public DbSet<Teacher> Teacher { get; set; }
        public object? Admin { get; internal set; }
        // Existing DbSet<Admin> Admin { get; set; } and other DbSets...
    }
}
