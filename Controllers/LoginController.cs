using Microsoft.AspNetCore.Mvc;
using ParentTeacherBridge.API.DTOs;
using ParentTeacherBridge.API.Repositories;
using ParentTeacherBridge.API.Services; // Assume JWT Service is here

namespace ParentTeacherBridge.API.Controllers
{
    [ApiController]
    [Route("login/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly IAdminRepository _adminRepo;
        private readonly ITeacherRepository _teacherRepo;
        private readonly IParentRepository _parentRepo;
        private readonly IJwtService _jwtService;
        private readonly ILogger<LoginController> _logger;

        public LoginController(
            IAdminRepository adminRepo,
            ITeacherRepository teacherRepo,
            IParentRepository parentRepo,
            IJwtService jwtService,
            ILogger<LoginController> logger)
        {
            _adminRepo = adminRepo;
            _teacherRepo = teacherRepo;
            _parentRepo = parentRepo;
            _jwtService = jwtService;
            _logger = logger;
        }

        [HttpPost("admin/login")]
        public async Task<IActionResult> AdminLogin([FromBody] AdminLoginDto dto)
        {
            var admin = (await _adminRepo.GetAllAsync())
                .FirstOrDefault(a => a.Email == dto.Email);

           // //if (admin == null || !VerifyPassword(dto.Password, admin.Password))
                //return Unauthorized("Invalid admin credentials");

            if (admin == null || !BCrypt.Net.BCrypt.Verify(dto.Password, admin.Password))
                return Unauthorized("Invalid admin credentials");

            var token = _jwtService.GenerateToken(admin);
            return Ok(new { token });
        }

        [HttpPost("teacher/login")]
        public async Task<IActionResult> TeacherLogin([FromBody] TeacherLoginDto dto)
        {
            var teacher = (await _teacherRepo.GetAllAsync())
                .FirstOrDefault(t => t.Email == dto.Email);

            //if (teacher == null || !VerifyPassword(dto.Password, teacher.Password))
            //    return Unauthorized("Invalid teacher credentials");
            if (teacher == null || !BCrypt.Net.BCrypt.Verify(dto.Password, teacher.Password))
                return Unauthorized("Invalid admin credentials");

            var token = _jwtService.GenerateToken(teacher);
            return Ok(new { token });
        }

        [HttpPost("parent/login")]
        public async Task<IActionResult> ParentLogin([FromBody] ParentLoginDto dto)
        {
            if (dto == null)
                return BadRequest("Invalid login data.");

            var parents = await _parentRepo.GetAllAsync();

            var parent = parents.FirstOrDefault(p =>
                p.Email == dto.Email &&
                p.StudEnrollmentNo == dto.StudEnrollmentNo);

            if (parent == null)
                return Unauthorized("Parent not found.");

            // Add password check if needed
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, parent.Password))
                return Unauthorized("Invalid password.");


            var token = _jwtService.GenerateToken(parent);
            return Ok(new { token });
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            // Replace with real hash comparison logic like BCrypt
            return password == storedHash;
        }
    }
}
