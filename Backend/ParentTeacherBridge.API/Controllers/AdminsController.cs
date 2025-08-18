using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.DTO;
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

                if (string.IsNullOrWhiteSpace(admin.Password))
                    return BadRequest("Admin password is required");

                admin.Password = BCrypt.Net.BCrypt.HashPassword(admin.Password);

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
                if (string.IsNullOrWhiteSpace(admin.Password))
                    return BadRequest("Admin password is required");

                admin.Password = BCrypt.Net.BCrypt.HashPassword(admin.Password);

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


                //if (string.IsNullOrWhiteSpace(teacher.Password))
                //{
                //    return BadRequest("Teacher password is required");
                //}

                if (string.IsNullOrWhiteSpace(teacher.Password))
                    return BadRequest("Admin password is required");

                teacher.Password = BCrypt.Net.BCrypt.HashPassword(teacher.Password);

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

                if (string.IsNullOrWhiteSpace(teacher.Password))
                    return BadRequest("Admin password is required");

                teacher.Password = BCrypt.Net.BCrypt.HashPassword(teacher.Password);

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
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetStudents()
        {
            try
            {
                var students = await _studentService.GetAllStudentsAsync();
                var studentDtos = _mapper.Map<IEnumerable<StudentDto>>(students);
                return Ok(studentDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/students/5
        [HttpGet("students/{id}")]
        public async Task<ActionResult<StudentDto>> GetStudent(int id)
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

                var studentDto = _mapper.Map<StudentDto>(student);
                return Ok(studentDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/students/class/5
        [HttpGet("students/class/{classId}")]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetStudentsByClass(int classId)
        {
            try
            {
                if (classId <= 0)
                {
                    return BadRequest("Invalid class ID");
                }

                var students = await _studentService.GetStudentsByClassAsync(classId);
                var studentDtos = _mapper.Map<IEnumerable<StudentDto>>(students);
                return Ok(studentDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/students/search?term=searchTerm
        [HttpGet("students/search")]
        public async Task<ActionResult<IEnumerable<StudentDto>>> SearchStudents([FromQuery] string term)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(term))
                {
                    return BadRequest("Search term is required");
                }

                var students = await _studentService.SearchStudentsAsync(term);
                var studentDtos = _mapper.Map<IEnumerable<StudentDto>>(students);
                return Ok(studentDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: admin/Admins/students
        [HttpPost("students")]
        public async Task<ActionResult<StudentDto>> CreateStudent([FromBody] CreateStudentDto createStudentDto)
        {
            try
            {
                if (createStudentDto == null)
                {
                    return BadRequest("Student data is required");
                }

                // Model validation is handled by data annotations
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var student = _mapper.Map<Student>(createStudentDto);
                var result = await _studentService.CreateStudentAsync(student);

                if (!result)
                {
                    return StatusCode(500, "Failed to create student");
                }

                var studentDto = _mapper.Map<StudentDto>(student);
                return CreatedAtAction("GetStudent", new { id = student.StudentId }, studentDto);
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
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] UpdateStudentDto updateStudentDto)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid student ID");
                }

                if (updateStudentDto == null)
                {
                    return BadRequest("Student data is required");
                }

                // Model validation is handled by data annotations
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var student = _mapper.Map<Student>(updateStudentDto);
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
        public async Task<ActionResult<IEnumerable<SubjectDto>>> GetSubjects()
        {
            try
            {
                var subjects = await _subjectService.GetAllSubjectsAsync();
                var subjectDtos = _mapper.Map<IEnumerable<SubjectDto>>(subjects);
                return Ok(subjectDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/subjects/5
        [HttpGet("subjects/{id}")]
        public async Task<ActionResult<SubjectDto>> GetSubject(int id)
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

                var subjectDto = _mapper.Map<SubjectDto>(subject);
                return Ok(subjectDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/subjects/search?term=searchTerm
        [HttpGet("subjects/search")]
        public async Task<ActionResult<IEnumerable<SubjectDto>>> SearchSubjects([FromQuery] string term)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(term))
                {
                    return BadRequest("Search term is required");
                }

                var subjects = await _subjectService.SearchSubjectsAsync(term);
                var subjectDtos = _mapper.Map<IEnumerable<SubjectDto>>(subjects);
                return Ok(subjectDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: admin/Admins/subjects
        [HttpPost("subjects")]
        public async Task<ActionResult<SubjectDto>> CreateSubject([FromBody] CreateSubjectDto createSubjectDto)
        {
            try
            {
                if (createSubjectDto == null)
                {
                    return BadRequest("Subject data is required");
                }

                // Model validation is handled by data annotations
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var subject = _mapper.Map<Subject>(createSubjectDto);
                var result = await _subjectService.CreateSubjectAsync(subject);

                if (!result)
                {
                    return StatusCode(500, "Failed to create subject");
                }

                var subjectDto = _mapper.Map<SubjectDto>(subject);
                return CreatedAtAction("GetSubject", new { id = subject.SubjectId }, subjectDto);
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

        // PUT: admin/Admins/subjects/5
        [HttpPut("subjects/{id}")]
        public async Task<IActionResult> UpdateSubject(int id, [FromBody] UpdateSubjectDto updateSubjectDto)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid subject ID");
                }

                if (updateSubjectDto == null)
                {
                    return BadRequest("Subject data is required");
                }

                // Model validation is handled by data annotations
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var subject = _mapper.Map<Subject>(updateSubjectDto);
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
        public async Task<ActionResult<IEnumerable<TimetableDto>>> GetTimetables()
        {
            try
            {
                var timetables = await _timetableService.GetAllTimetablesAsync();
                var timetableDtos = _mapper.Map<IEnumerable<TimetableDto>>(timetables);
                return Ok(timetableDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/timetables/5
        [HttpGet("timetables/{id}")]
        public async Task<ActionResult<TimetableDto>> GetTimetable(int id)
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

                var timetableDto = _mapper.Map<TimetableDto>(timetable);
                return Ok(timetableDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/timetables/class/5
        [HttpGet("timetables/class/{classId}")]
        public async Task<ActionResult<IEnumerable<TimetableDto>>> GetTimetablesByClass(int classId)
        {
            try
            {
                if (classId <= 0)
                {
                    return BadRequest("Invalid class ID");
                }

                var timetables = await _timetableService.GetTimetablesByClassAsync(classId);
                var timetableDtos = _mapper.Map<IEnumerable<TimetableDto>>(timetables);
                return Ok(timetableDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/timetables/teacher/5
        [HttpGet("timetables/teacher/{teacherId}")]
        public async Task<ActionResult<IEnumerable<TimetableDto>>> GetTimetablesByTeacher(int teacherId)
        {
            try
            {
                if (teacherId <= 0)
                {
                    return BadRequest("Invalid teacher ID");
                }

                var timetables = await _timetableService.GetTimetablesByTeacherAsync(teacherId);
                var timetableDtos = _mapper.Map<IEnumerable<TimetableDto>>(timetables);
                return Ok(timetableDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: admin/Admins/timetables/weekday/Monday
        [HttpGet("timetables/weekday/{weekday}")]
        public async Task<ActionResult<IEnumerable<TimetableDto>>> GetTimetablesByWeekday(string weekday)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(weekday))
                {
                    return BadRequest("Weekday is required");
                }

                var timetables = await _timetableService.GetTimetablesByWeekdayAsync(weekday);
                var timetableDtos = _mapper.Map<IEnumerable<TimetableDto>>(timetables);
                return Ok(timetableDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: admin/Admins/timetables
        [HttpPost("timetables")]
        public async Task<ActionResult<TimetableDto>> CreateTimetable([FromBody] CreateTimetableDto createTimetableDto)
        {
            try
            {
                if (createTimetableDto == null)
                {
                    return BadRequest("Timetable data is required");
                }

                // Model validation is handled by data annotations
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Additional time validation
                if (createTimetableDto.StartTime >= createTimetableDto.EndTime)
                {
                    return BadRequest("Start time must be before end time");
                }

                var timetable = _mapper.Map<Timetable>(createTimetableDto);
                var result = await _timetableService.CreateTimetableAsync(timetable);

                if (!result)
                {
                    return StatusCode(500, "Failed to create timetable");
                }

                var timetableDto = _mapper.Map<TimetableDto>(timetable);
                return CreatedAtAction("GetTimetable", new { id = timetable.TimetableId }, timetableDto);
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
        public async Task<IActionResult> UpdateTimetable(int id, [FromBody] UpdateTimetableDto updateTimetableDto)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid timetable ID");
                }

                if (updateTimetableDto == null)
                {
                    return BadRequest("Timetable data is required");
                }

                // Model validation is handled by data annotations
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Additional time validation
                if (updateTimetableDto.StartTime >= updateTimetableDto.EndTime)
                {
                    return BadRequest("Start time must be before end time");
                }

                var timetable = _mapper.Map<Timetable>(updateTimetableDto);
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
