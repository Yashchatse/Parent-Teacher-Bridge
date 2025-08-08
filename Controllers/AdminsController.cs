using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Models;
using ParentTeacherBridge.API.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ParentTeacherBridge.API.Controllers
{
    [Route("admin/[controller]")]
    [ApiController]
    public class AdminsController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminsController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // GET: admin/Admins
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Admin>>> GetAdmins()
        {
            try
            {
                var admins = await _adminService.GetAllAdminsAsync();
                return Ok(admins);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Admin>> GetAdmin(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid admin ID");
                }

                var admin = await _adminService.GetAdminByIdAsync(id);

                if (admin == null)
                {
                    return NotFound($"Admin with ID {id} not found");
                }

                return Ok(admin);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: admin/Admins/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAdmin(int id, Admin admin)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid admin ID");
                }

                if (admin == null)
                {
                    return BadRequest("Admin data is required");
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(admin.Name))
                {
                    return BadRequest("Admin name is required");
                }

                if (string.IsNullOrWhiteSpace(admin.Email))
                {
                    return BadRequest("Admin email is required");
                }

                var result = await _adminService.UpdateAdminAsync(id, admin);

                if (!result)
                {
                    return NotFound($"Admin with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: admin/Admins
        [HttpPost]
        public async Task<ActionResult<Admin>> PostAdmin(Admin admin)
        {
            try
            {
                if (admin == null)
                {
                    return BadRequest("Admin data is required");
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(admin.Name))
                {
                    return BadRequest("Admin name is required");
                }

                if (string.IsNullOrWhiteSpace(admin.Email))
                {
                    return BadRequest("Admin email is required");
                }

                var result = await _adminService.CreateAdminAsync(admin);

                if (!result)
                {
                    return StatusCode(500, "Failed to create admin");
                }

                return CreatedAtAction("GetAdmin", new { id = admin.AdminId }, admin);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: admin/Admins/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdmin(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid admin ID");
                }

                var result = await _adminService.DeleteAdminAsync(id);

                if (!result)
                {
                    return NotFound($"Admin with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        //// Manage teachers
        //[HttpPost("CreateTeacher")]
        //public async Task<ActionResult<Teacher>> CreateTeacher(Teacher teacher)
        //{
        //    _context.Set<Teacher>().Add(teacher);
        //    await _context.SaveChangesAsync();
        //    return Ok(teacher);
        //}

        //// ✅ Manage Students
        //[HttpPost("CreateStudent")]
        //public async Task<ActionResult<Student>> CreateStudent(Student student)
        //{
        //    _context.Set<Student>().Add(student);
        //    await _context.SaveChangesAsync();
        //    return Ok(student);
        //}

        //// ✅ Assign teachers to classes (school_class)
        //[HttpPost("AssignTeacherToClass")]
        //public async Task<IActionResult> AssignTeacherToClass([FromBody] SchoolClass assignment)
        //{
        //    _context.Set<SchoolClass>().Add(assignment);
        //    await _context.SaveChangesAsync();
        //    return Ok(assignment);
        //}

        //// ✅ Create Timetables
        //[HttpPost("CreateTimetable")]
        //public async Task<IActionResult> CreateTimetable([FromBody] Timetable timetable)
        //{
        //    _context.Set<Timetable>().Add(timetable);
        //    await _context.SaveChangesAsync();
        //    return Ok(timetable);
        //}

        // ✅ Set up User Roles & Permissions (optional - extend with role model later)
    }
}
