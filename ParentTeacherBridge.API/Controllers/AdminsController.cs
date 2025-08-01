using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.DTOs;
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
        private readonly ISchoolClassService _schoolClassService;
        private readonly IStudentService _studentService;
        private readonly ISubjectService _subjectService;
        private readonly ITimetableService _timetableService;
        private readonly IMapper _mapper;
        // Admin Controller for managing admin users All CRUD operations

        public AdminsController(IAdminService adminService,
                                    ITeacherService teacherService,
                                    ISchoolClassService schoolClassService,
                                    IStudentService studentService,
                                    ISubjectService subjectService,
                                    ITimetableService timetableService,
                                    IMapper mapper)
        {
            _adminService = adminService;
            _teacherService = teacherService;
            _schoolClassService = schoolClassService;
            _studentService = studentService;
            _subjectService = subjectService;
            _timetableService = timetableService;
            _mapper = mapper;
        }

        #region Admin CRUD OPERATIONS
        // GET: admin/Admins
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdminDto>>> GetAdmins()
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

        #endregion



        #region TEACHER CRUD OPERATIONS

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

        #endregion

        #region SCHOOL CLASS CRUD OPERATIONS

        // SCHOOL CLASS CRUD OPERATIONS

        // GET: api/admin/classes - Get all classes
        [HttpGet("classes")]
        public async Task<ActionResult<IEnumerable<SchoolClass>>> GetAllClasses()
        {
            try
            {
                var classes = await _schoolClassService.GetAllAsync();
                return Ok(classes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/admin/classes/5 - Get class by ID
        [HttpGet("classes/{id}")]
        public async Task<ActionResult<SchoolClass>> GetClass(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid class ID");
                }

                var schoolClass = await _schoolClassService.GetByIdAsync(id);

                if (schoolClass == null)
                {
                    return NotFound($"Class with ID {id} not found");
                }

                return Ok(schoolClass);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/admin/classes - Create new class
        [HttpPost("classes")]
        public async Task<ActionResult<SchoolClass>> CreateClass([FromBody] SchoolClass schoolClass)
        {
            try
            {
                if (schoolClass == null)
                {
                    return BadRequest("Class data is required");
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(schoolClass.ClassName))
                {
                    return BadRequest("Class name is required");
                }

                // Validate model state
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdClass = await _schoolClassService.CreateAsync(schoolClass);

                return CreatedAtAction("GetClass", new { id = createdClass.ClassId }, createdClass);
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


        // PUT: admin/Admins/classes/5
        [HttpPut("classes/{id}")]
        public async Task<IActionResult> UpdateClass(int id, [FromBody] SchoolClass schoolClass)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid class ID");
                }

                if (schoolClass == null)
                {
                    return BadRequest("Class data is required");
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(schoolClass.ClassName))
                {
                    return BadRequest("Class name is required");
                }

                // Validate model state
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Ensure ID consistency
                if (schoolClass.ClassId != 0 && schoolClass.ClassId != id)
                {
                    return BadRequest("ID in URL does not match ID in body");
                }

                schoolClass.ClassId = id;
                schoolClass.UpdatedAt = DateTime.UtcNow;
                var updatedClass = await _schoolClassService.UpdateAsync(schoolClass);

                if (updatedClass == null)
                {
                    return NotFound($"Class with ID {id} not found");
                }

                return Ok(updatedClass);
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




        // DELETE: api/admin/classes/5 - Delete class
        [HttpDelete("classes/{id}")]
        public async Task<IActionResult> DeleteClass(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid class ID");
                }

                var result = await _schoolClassService.DeleteAsync(id);

                if (!result)
                {
                    return NotFound($"Class with ID {id} not found");
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

        #endregion


        #region STUDENT CRUD OPERATIONS

        // GET: admin/Admins/students
        [HttpGet("students")]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            try
            {
                var students = await _studentService.GetAllStudentsAsync();
                return Ok(students);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/students/5
        [HttpGet("students/{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid student ID");
                }

                var student = await _studentService.GetStudentByIdAsync(id);

                if (student == null)
                {
                    return NotFound($"Student with ID {id} not found");
                }

                return Ok(student);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/students/class/5
        [HttpGet("students/class/{classId}")]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudentsByClass(int classId)
        {
            try
            {
                if (classId <= 0)
                {
                    return BadRequest("Invalid class ID");
                }

                var students = await _studentService.GetStudentsByClassAsync(classId);
                return Ok(students);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/students/search?term=searchTerm
        [HttpGet("students/search")]
        public async Task<ActionResult<IEnumerable<Student>>> SearchStudents([FromQuery] string term)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(term))
                {
                    return BadRequest("Search term is required");
                }

                var students = await _studentService.SearchStudentsAsync(term);
                return Ok(students);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: admin/Admins/students
        [HttpPost("students")]
        public async Task<ActionResult<Student>> CreateStudent([FromBody] Student student)
        {
            try
            {
                if (student == null)
                {
                    return BadRequest("Student data is required");
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(student.Name))
                {
                    return BadRequest("Student name is required");
                }

                if (string.IsNullOrWhiteSpace(student.EnrollmentNo))
                {
                    return BadRequest("Enrollment number is required");
                }

                if (!student.ClassId.HasValue || student.ClassId <= 0)
                {
                    return BadRequest("Valid class ID is required");
                }

                // Validate model state
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _studentService.CreateStudentAsync(student);

                if (!result)
                {
                    return StatusCode(500, "Failed to create student");
                }

                return CreatedAtAction("GetStudent", new { id = student.StudentId }, student);
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

        // PUT: admin/Admins/students/5
        [HttpPut("students/{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] Student student)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid student ID");
                }

                if (student == null)
                {
                    return BadRequest("Student data is required");
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(student.Name))
                {
                    return BadRequest("Student name is required");
                }

                if (string.IsNullOrWhiteSpace(student.EnrollmentNo))
                {
                    return BadRequest("Enrollment number is required");
                }

                if (!student.ClassId.HasValue || student.ClassId <= 0)
                {
                    return BadRequest("Valid class ID is required");
                }

                // Validate model state
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Ensure ID consistency
                if (student.StudentId != 0 && student.StudentId != id)
                {
                    return BadRequest("ID in URL does not match ID in body");
                }

                student.StudentId = id;

                var result = await _studentService.UpdateStudentAsync(id, student);

                if (!result)
                {
                    return NotFound($"Student with ID {id} not found");
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

        // DELETE: admin/Admins/students/5
        [HttpDelete("students/{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid student ID");
                }

                var result = await _studentService.DeleteStudentAsync(id);

                if (!result)
                {
                    return NotFound($"Student with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        #endregion

        #region SUBJECT CRUD OPERATIONS

        // GET: admin/Admins/subjects
        [HttpGet("subjects")]
        public async Task<ActionResult<IEnumerable<Subject>>> GetSubjects()
        {
            try
            {
                var subjects = await _subjectService.GetAllSubjectsAsync();
                return Ok(subjects);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/subjects/5
        [HttpGet("subjects/{id}")]
        public async Task<ActionResult<Subject>> GetSubject(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid subject ID");
                }

                var subject = await _subjectService.GetSubjectByIdAsync(id);

                if (subject == null)
                {
                    return NotFound($"Subject with ID {id} not found");
                }

                return Ok(subject);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/subjects/search?term=searchTerm
        [HttpGet("subjects/search")]
        public async Task<ActionResult<IEnumerable<Subject>>> SearchSubjects([FromQuery] string term)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(term))
                {
                    return BadRequest("Search term is required");
                }

                var subjects = await _subjectService.SearchSubjectsAsync(term);
                return Ok(subjects);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: admin/Admins/subjects
        [HttpPost("subjects")]
        public async Task<ActionResult<Subject>> CreateSubject([FromBody] Subject subject)
        {
            try
            {
                if (subject == null)
                {
                    return BadRequest("Subject data is required");
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(subject.Name))
                {
                    return BadRequest("Subject name is required");
                }

                if (string.IsNullOrWhiteSpace(subject.Code))
                {
                    return BadRequest("Subject code is required");
                }

                // Validate model state
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _subjectService.CreateSubjectAsync(subject);

                if (!result)
                {
                    return StatusCode(500, "Failed to create subject");
                }

                return CreatedAtAction("GetSubject", new { id = subject.SubjectId }, subject);
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
        // Complete the Subject PUT operation (this was cut off in your original code)
        // PUT: admin/Admins/subjects/5
        [HttpPut("subjects/{id}")]
        public async Task<IActionResult> UpdateSubject(int id, [FromBody] Subject subject)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid subject ID");
                }

                if (subject == null)
                {
                    return BadRequest("Subject data is required");
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(subject.Name))
                {
                    return BadRequest("Subject name is required");
                }

                if (string.IsNullOrWhiteSpace(subject.Code))
                {
                    return BadRequest("Subject code is required");
                }

                // Validate model state
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Ensure ID consistency
                if (subject.SubjectId != 0 && subject.SubjectId != id)
                {
                    return BadRequest("ID in URL does not match ID in body");
                }

                subject.SubjectId = id;

                var result = await _subjectService.UpdateSubjectAsync(id, subject);

                if (!result)
                {
                    return NotFound($"Subject with ID {id} not found");
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

        // DELETE: admin/Admins/subjects/5
        [HttpDelete("subjects/{id}")]
        public async Task<IActionResult> DeleteSubject(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid subject ID");
                }

                var result = await _subjectService.DeleteSubjectAsync(id);

                if (!result)
                {
                    return NotFound($"Subject with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        #endregion

        #region TIMETABLE CRUD OPERATIONS

        // GET: admin/Admins/timetables
        [HttpGet("timetables")]
        public async Task<ActionResult<IEnumerable<Timetable>>> GetTimetables()
        {
            try
            {
                var timetables = await _timetableService.GetAllTimetablesAsync();
                return Ok(timetables);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/timetables/5
        [HttpGet("timetables/{id}")]
        public async Task<ActionResult<Timetable>> GetTimetable(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid timetable ID");
                }

                var timetable = await _timetableService.GetTimetableByIdAsync(id);

                if (timetable == null)
                {
                    return NotFound($"Timetable with ID {id} not found");
                }

                return Ok(timetable);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/timetables/class/5
        [HttpGet("timetables/class/{classId}")]
        public async Task<ActionResult<IEnumerable<Timetable>>> GetTimetablesByClass(int classId)
        {
            try
            {
                if (classId <= 0)
                {
                    return BadRequest("Invalid class ID");
                }

                var timetables = await _timetableService.GetTimetablesByClassAsync(classId);
                return Ok(timetables);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/timetables/teacher/5
        [HttpGet("timetables/teacher/{teacherId}")]
        public async Task<ActionResult<IEnumerable<Timetable>>> GetTimetablesByTeacher(int teacherId)
        {
            try
            {
                if (teacherId <= 0)
                {
                    return BadRequest("Invalid teacher ID");
                }

                var timetables = await _timetableService.GetTimetablesByTeacherAsync(teacherId);
                return Ok(timetables);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/timetables/weekday/Monday
        [HttpGet("timetables/weekday/{weekday}")]
        public async Task<ActionResult<IEnumerable<Timetable>>> GetTimetablesByWeekday(string weekday)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(weekday))
                {
                    return BadRequest("Weekday is required");
                }

                // Validate weekday
                var validWeekdays = new[] { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" };
                if (!validWeekdays.Contains(weekday, StringComparer.OrdinalIgnoreCase))
                {
                    return BadRequest("Invalid weekday. Valid values are: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday");
                }

                var timetables = await _timetableService.GetTimetablesByWeekdayAsync(weekday);
                return Ok(timetables);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: admin/Admins/timetables
        [HttpPost("timetables")]
        public async Task<ActionResult<Timetable>> CreateTimetable([FromBody] Timetable timetable)
        {
            try
            {
                if (timetable == null)
                {
                    return BadRequest("Timetable data is required");
                }

                // Validate required fields
                if (!timetable.ClassId.HasValue || timetable.ClassId <= 0)
                {
                    return BadRequest("Valid class ID is required");
                }

                if (!timetable.SubjectId.HasValue || timetable.SubjectId <= 0)
                {
                    return BadRequest("Valid subject ID is required");
                }

                if (!timetable.TeacherId.HasValue || timetable.TeacherId <= 0)
                {
                    return BadRequest("Valid teacher ID is required");
                }

                if (string.IsNullOrWhiteSpace(timetable.Weekday))
                {
                    return BadRequest("Weekday is required");
                }

                // Validate weekday
                var validWeekdays = new[] { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" };
                if (!validWeekdays.Contains(timetable.Weekday, StringComparer.OrdinalIgnoreCase))
                {
                    return BadRequest("Invalid weekday. Valid values are: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday");
                }

                if (!timetable.StartTime.HasValue)
                {
                    return BadRequest("Start time is required");
                }

                if (!timetable.EndTime.HasValue)
                {
                    return BadRequest("End time is required");
                }

                // Validate time range
                if (timetable.StartTime >= timetable.EndTime)
                {
                    return BadRequest("Start time must be before end time");
                }

                // Validate model state
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _timetableService.CreateTimetableAsync(timetable);

                if (!result)
                {
                    return StatusCode(500, "Failed to create timetable");
                }

                return CreatedAtAction("GetTimetable", new { id = timetable.TimetableId }, timetable);
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

        // PUT: admin/Admins/timetables/5
        [HttpPut("timetables/{id}")]
        public async Task<IActionResult> UpdateTimetable(int id, [FromBody] Timetable timetable)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid timetable ID");
                }

                if (timetable == null)
                {
                    return BadRequest("Timetable data is required");
                }

                // Validate required fields
                if (!timetable.ClassId.HasValue || timetable.ClassId <= 0)
                {
                    return BadRequest("Valid class ID is required");
                }

                if (!timetable.SubjectId.HasValue || timetable.SubjectId <= 0)
                {
                    return BadRequest("Valid subject ID is required");
                }

                if (!timetable.TeacherId.HasValue || timetable.TeacherId <= 0)
                {
                    return BadRequest("Valid teacher ID is required");
                }

                if (string.IsNullOrWhiteSpace(timetable.Weekday))
                {
                    return BadRequest("Weekday is required");
                }

                // Validate weekday
                var validWeekdays = new[] { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" };
                if (!validWeekdays.Contains(timetable.Weekday, StringComparer.OrdinalIgnoreCase))
                {
                    return BadRequest("Invalid weekday. Valid values are: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday");
                }

                if (!timetable.StartTime.HasValue)
                {
                    return BadRequest("Start time is required");
                }

                if (!timetable.EndTime.HasValue)
                {
                    return BadRequest("End time is required");
                }

                // Validate time range
                if (timetable.StartTime >= timetable.EndTime)
                {
                    return BadRequest("Start time must be before end time");
                }

                // Validate model state
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Ensure ID consistency
                if (timetable.TimetableId != 0 && timetable.TimetableId != id)
                {
                    return BadRequest("ID in URL does not match ID in body");
                }

                timetable.TimetableId = id;

                var result = await _timetableService.UpdateTimetableAsync(id, timetable);

                if (!result)
                {
                    return NotFound($"Timetable with ID {id} not found");
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

        // DELETE: admin/Admins/timetables/5
        [HttpDelete("timetables/{id}")]
        public async Task<IActionResult> DeleteTimetable(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid timetable ID");
                }

                var result = await _timetableService.DeleteTimetableAsync(id);

                if (!result)
                {
                    return NotFound($"Timetable with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        #endregion



    }
}
