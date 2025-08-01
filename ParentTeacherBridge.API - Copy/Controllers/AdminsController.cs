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
        // Injecting services for admin and teacher operations

        private readonly IAdminService _adminService;
        private readonly ITeacherService _teacherService;
        // Admin Controller for managing admin users All CRUD operations

        public AdminsController(IAdminService adminService, ITeacherService teacherService)
        {
            _adminService = adminService;
            _teacherService = teacherService;
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

                if (admin.AdminId != 0 && admin.AdminId != id)
                {
                    return BadRequest("ID in URL does not match ID in body");
                }

                admin.AdminId = id;

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

        // TEACHER CRUD OPERATIONS

        // GET: admin/Admins/teachers
        [HttpGet("teachers")]
        public async Task<ActionResult<IEnumerable<Teacher>>> GetTeachers()
        {
            try
            {
                var teachers = await _teacherService.GetAllTeachersAsync();
                return Ok(teachers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/teachers/5
        [HttpGet("teachers/{id}")]
        public async Task<ActionResult<Teacher>> GetTeacher(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid teacher ID");
                }

                var teacher = await _teacherService.GetTeacherByIdAsync(id);

                if (teacher == null)
                {
                    return NotFound($"Teacher with ID {id} not found");
                }

                return Ok(teacher);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/teachers/active
        [HttpGet("teachers/active")]
        public async Task<ActionResult<IEnumerable<Teacher>>> GetActiveTeachers()
        {
            try
            {
                var teachers = await _teacherService.GetActiveTeachersAsync();
                return Ok(teachers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/teachers/search?term=searchTerm
        [HttpGet("teachers/search")]
        public async Task<ActionResult<IEnumerable<Teacher>>> SearchTeachers([FromQuery] string term)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(term))
                {
                    return BadRequest("Search term is required");
                }

                var teachers = await _teacherService.SearchTeachersAsync(term);
                return Ok(teachers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: admin/Admins/teachers
        [HttpPost("teachers")]
        public async Task<ActionResult<Teacher>> CreateTeacher(Teacher teacher)
        {
            try
            {
                if (teacher == null)
                {
                    return BadRequest("Teacher data is required");
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(teacher.Name))
                {
                    return BadRequest("Teacher name is required");
                }

                if (string.IsNullOrWhiteSpace(teacher.Email))
                {
                    return BadRequest("Teacher email is required");
                }

                if (string.IsNullOrWhiteSpace(teacher.Password))
                {
                    return BadRequest("Teacher password is required");
                }

                // Validate model state
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _teacherService.CreateTeacherAsync(teacher);

                if (!result)
                {
                    return StatusCode(500, "Failed to create teacher");
                }

                return CreatedAtAction("GetTeacher", new { id = teacher.TeacherId }, teacher);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: admin/Admins/teachers/5
        [HttpPut("teachers/{id}")]
        public async Task<IActionResult> UpdateTeacher(int id, Teacher teacher)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid teacher ID");
                }

                if (teacher == null)
                {
                    return BadRequest("Teacher data is required");
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(teacher.Name))
                {
                    return BadRequest("Teacher name is required");
                }

                if (string.IsNullOrWhiteSpace(teacher.Email))
                {
                    return BadRequest("Teacher email is required");
                }

                // Validate model state
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Ensure ID consistency
                if (teacher.TeacherId != 0 && teacher.TeacherId != id)
                {
                    return BadRequest("ID in URL does not match ID in body");
                }

                teacher.TeacherId = id;

                var result = await _teacherService.UpdateTeacherAsync(id, teacher);

                if (!result)
                {
                    return NotFound($"Teacher with ID {id} not found");
                }

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: admin/Admins/teachers/5
        [HttpDelete("teachers/{id}")]
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid teacher ID");
                }

                var result = await _teacherService.DeleteTeacherAsync(id);

                if (!result)
                {
                    return NotFound($"Teacher with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



    }
}
