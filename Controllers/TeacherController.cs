using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ParentTeacherBridge.API.DTO;
//using ParentTeacherBridge.API.DTOs;
using ParentTeacherBridge.API.Models;
using ParentTeacherBridge.API.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ParentTeacherBridge.API.Controllers
{
    [Route("teacher/[controller]")]
    [ApiController]
    public class TeachersController : ControllerBase
    {
        private readonly ITeacherService _teacherService;
        private readonly IBehaviourService _behaviourService;
        private readonly IStudentService _studentService;
        private readonly IPerformanceService _performanceService;
        private readonly IEventService _eventService;
        private readonly ITimetableService _timetableService;
        private readonly IAttendanceService _attendanceService;
        private readonly IMapper _mapper;

        public TeachersController(
            ITeacherService teacherService,
            IBehaviourService behaviourService,
            IStudentService studentService,
            IPerformanceService performanceService,
            IEventService eventService,
            ITimetableService timetableService,
            IMapper mapper)
        {
            _teacherService = teacherService;
            _behaviourService = behaviourService;
            _studentService = studentService;
            _performanceService = performanceService;
            _eventService = eventService;
            _timetableService = timetableService;
            _mapper = mapper;
        }

        #region Teacher CRUD

        [HttpGet("{id}")]
        public async Task<ActionResult<Teacher>> GetTeacher(int id)
        {
            try
            {
                if (id <= 0) return BadRequest("Invalid teacher ID");

                var teacher = await _teacherService.GetTeacherByIdAsync(id);
                if (teacher == null) return NotFound($"Teacher with ID {id} not found");

                return Ok(teacher);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTeacher(int id, Teacher teacher)
        {
            try
            {
                if (id <= 0 || teacher == null || id != teacher.TeacherId)
                    return BadRequest("Invalid input data");

                if (string.IsNullOrWhiteSpace(teacher.Name))
                    return BadRequest("Teacher name is required");

                if (string.IsNullOrWhiteSpace(teacher.Email))
                    return BadRequest("Teacher email is required");

                var result = await _teacherService.UpdateTeacherAsync(teacher);
                if (!result) return NotFound($"Teacher with ID {id} not found");

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            try
            {
                if (id <= 0) return BadRequest("Invalid teacher ID");

                var result = await _teacherService.DeleteTeacherAsync(id);
                if (!result) return NotFound($"Teacher with ID {id} not found");

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        #endregion

        #region Behaviour CRUD

        [HttpGet("{teacherId}/students/{studentId}/behaviours")]
        public async Task<IActionResult> GetBehaviours(int teacherId, int studentId)
        {
            var behaviours = await _behaviourService.GetBehavioursByStudentAsync(teacherId, studentId);
            if (!behaviours.Any()) return Ok(new List<BehaviourDto>());
            return Ok(_mapper.Map<IEnumerable<BehaviourDto>>(behaviours));
        }

        [HttpGet("{teacherId}/students/{studentId}/behaviours/{behaviourId}")]
        public async Task<IActionResult> GetBehaviour(int teacherId, int studentId, int behaviourId)
        {
            var behaviour = await _behaviourService.GetBehaviourByIdAsync(teacherId, studentId, behaviourId);
            if (behaviour == null) return NotFound("Behaviour record not found.");
            return Ok(_mapper.Map<BehaviourDto>(behaviour));
        }

        [HttpPost("{teacherId}/students/{studentId}/behaviours")]
        public async Task<IActionResult> AddBehaviour(int teacherId, int studentId, [FromBody] CreateBehaviourDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var behaviour = _mapper.Map<Behaviour>(dto);
            behaviour.TeacherId = teacherId;
            behaviour.StudentId = studentId;

            var newBehaviour = await _behaviourService.AddBehaviourAsync(behaviour);
            var behaviourDto = _mapper.Map<BehaviourDto>(newBehaviour);

            return CreatedAtAction(nameof(GetBehaviour),
                new { teacherId, studentId, behaviourId = behaviourDto.BehaviourId },
                behaviourDto);
        }

        [HttpPut("{teacherId}/students/{studentId}/behaviours/{behaviourId}")]
        public async Task<IActionResult> UpdateBehaviour(int teacherId, int studentId, int behaviourId, [FromBody] UpdateBehaviourDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var updatedBehaviour = _mapper.Map<Behaviour>(dto);
            var updated = await _behaviourService.UpdateBehaviourAsync(teacherId, studentId, behaviourId, updatedBehaviour);

            if (updated == null) return NotFound("Behaviour record not found.");
            return NoContent();
        }

        [HttpDelete("{teacherId}/students/{studentId}/behaviours/{behaviourId}")]
        public async Task<IActionResult> DeleteBehaviour(int teacherId, int studentId, int behaviourId)
        {
            var deleted = await _behaviourService.DeleteBehaviourAsync(teacherId, studentId, behaviourId);
            if (!deleted) return NotFound("Behaviour record not found.");
            return NoContent();
        }
        #endregion

        #region Student CRUD & Info

        [HttpGet("students")]
        public async Task<IActionResult> GetAllStudents()
        {
            try
            {
                var students = await _studentService.GetAllStudentsAsync();
                if (!students.Any()) return NotFound("No students found.");
                return Ok(_mapper.Map<IEnumerable<StudentDto>>(students));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("students/{id}")]
        public async Task<IActionResult> GetStudentById(int id)
        {
            try
            {
                if (id <= 0) return BadRequest("Invalid student ID");

                var student = await _studentService.GetStudentByIdAsync(id);
                if (student == null) return NotFound($"Student with ID {id} not found.");

                return Ok(_mapper.Map<StudentDto>(student));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        #endregion

        #region Performance CRUD

        [HttpGet("students/{studentId}/performance")]
        public async Task<IActionResult> GetStudentPerformance(int studentId)
        {
            var performances = await _performanceService.GetPerformanceByStudentIdAsync(studentId);
            return Ok(_mapper.Map<IEnumerable<PerformanceDto>>(performances));
        }

        [HttpGet("students/performance/{id}")]
        public async Task<IActionResult> GetPerformanceById(int id)
        {
            var performance = await _performanceService.GetPerformanceByIdAsync(id);
            if (performance == null) return NotFound("Performance record not found.");
            return Ok(_mapper.Map<PerformanceDto>(performance));
        }

        [HttpPost("students/performance")]
        public async Task<IActionResult> AddPerformance([FromBody] CreatePerformanceDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var performance = _mapper.Map<Performance>(dto);
            var newPerformance = await _performanceService.AddPerformanceAsync(performance);

            return CreatedAtAction(nameof(GetPerformanceById),
                new { id = newPerformance.PerformanceId },
                _mapper.Map<PerformanceDto>(newPerformance));
        }

        [HttpDelete("students/performance/{id}")]
        public async Task<IActionResult> DeletePerformance(int id)
        {
            var deleted = await _performanceService.DeletePerformanceAsync(id);
            if (!deleted) return NotFound("Performance record not found.");
            return NoContent();
        }
        #endregion

        #region Events CRUD

        [HttpGet("events")]
        public async Task<IActionResult> GetEvents() => Ok(await _eventService.GetAllEventsAsync());

        [HttpGet("events/{id}")]
        public async Task<IActionResult> GetEvent(int id)
        {
            var result = await _eventService.GetEventByIdAsync(id);
            return result is null ? NotFound() : Ok(result);
        }

        [HttpPost("events")]
        public async Task<IActionResult> CreateEvent([FromBody] EventDto eventDto)
        {
            var created = await _eventService.CreateEventAsync(eventDto);
            return CreatedAtAction(nameof(GetEvent), new { id = created.EventId }, created);
        }

        [HttpPut("events/{id}")]
        public async Task<IActionResult> UpdateEvent(int id, [FromBody] EventDto eventDto)
        {
            if (id != eventDto.EventId) return BadRequest();
            await _eventService.UpdateEventAsync(eventDto);
            return NoContent();
        }

        [HttpDelete("events/{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            await _eventService.DeleteEventAsync(id);
            return NoContent();
        }
        #endregion

        #region Timetable
        [HttpGet("timetable/{teacherId}")]
        public async Task<IActionResult> GetTimetable(int teacherId)
        {
            var timetable = await _timetableService.GetTimetableForTeacherAsync(teacherId);
            return Ok(timetable);
        }
        #endregion

        #region Attendance CRUD

        #region Attendance CRUD

        [HttpPost("{teacherId}/attendance")]
        public async Task<IActionResult> MarkAttendance(int teacherId, [FromBody] CreateAttendanceDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var created = await _attendanceService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetAttendanceById), new { id = created.AttendanceId }, created);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("attendance/{id}")]
        public async Task<IActionResult> UpdateAttendance(int id, [FromBody] AttendanceDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = await _attendanceService.UpdateAsync(id, dto);
            if (updated == null) return NotFound("Attendance record not found.");
            return Ok(updated);
        }

        [HttpDelete("attendance/{id}")]
        public async Task<IActionResult> DeleteAttendance(int id)
        {
            var deleted = await _attendanceService.DeleteAsync(id);
            if (!deleted) return NotFound("Attendance record not found.");
            return NoContent();
        }

        [HttpGet("attendance/{id}")]
        public async Task<IActionResult> GetAttendanceById(int id)
        {
            var record = await _attendanceService.GetByIdAsync(id);
            if (record == null) return NotFound("Attendance record not found.");
            return Ok(record);
        }

        [HttpGet("attendance/student/{studentId}")]
        public async Task<IActionResult> GetAttendanceByStudent(int studentId)
        {
            var records = await _attendanceService.GetByStudentIdAsync(studentId);
            return Ok(records);
        }

        [HttpGet("attendance/class/{classId}/{date}")]
        public async Task<IActionResult> GetAttendanceByClassAndDate(int classId, DateOnly date)
        {
            var records = await _attendanceService.GetByClassAndDateAsync(classId, date);
            return Ok(records);
        }

        #endregion


        //[HttpPost("attendance")]
        //public async Task<IActionResult> CreateAttendance([FromBody] AttendanceDto dto)
        //{
        //    if (!ModelState.IsValid) return BadRequest(ModelState);
        //    var created = await _attendanceService.CreateAsync(dto);
        //    return CreatedAtAction(nameof(GetAttendanceById), new { id = created.AttendanceId }, created);
        //}

        //[HttpPut("attendance/{id}")]
        //public async Task<IActionResult> UpdateAttendance(int id, [FromBody] AttendanceDto dto)
        //{
        //    if (!ModelState.IsValid) return BadRequest(ModelState);
        //    var updated = await _attendanceService.UpdateAsync(id, dto);
        //    if (updated == null) return NotFound("Attendance record not found.");
        //    return Ok(updated);
        //}

        //[HttpDelete("attendance/{id}")]
        //public async Task<IActionResult> DeleteAttendance(int id)
        //{
        //    var deleted = await _attendanceService.DeleteAsync(id);
        //    if (!deleted) return NotFound("Attendance record not found.");
        //    return NoContent();
        //}

        //[HttpGet("attendance/{id}")]
        //public async Task<IActionResult> GetAttendanceById(int id)
        //{
        //    var record = await _attendanceService.GetByIdAsync(id);
        //    if (record == null) return NotFound("Attendance record not found.");
        //    return Ok(record);
        //}

        //[HttpGet("attendance/student/{studentId}")]
        //public async Task<IActionResult> GetAttendanceByStudent(int studentId)
        //{
        //    var records = await _attendanceService.GetByStudentIdAsync(studentId);
        //    return Ok(records);
        //}

        #endregion

    }
}





//using AutoMapper;
//using Microsoft.AspNetCore.Mvc;
//using ParentTeacherBridge.API.DTO;
//using ParentTeacherBridge.API.Models;
//using ParentTeacherBridge.API.Services;
//using System;
//using System.Collections.Generic;
//using System.Threading.Tasks;

//namespace ParentTeacherBridge.API.Controllers
//{
//    [Route("teacher/[controller]")]
//    [ApiController]
//    public class TeachersController : ControllerBase
//    {
//        private readonly ITeacherService _teacherService;
//        private readonly IBehaviourService _behaviourService;
//        private readonly IStudentService _studentService;
//        private readonly IPerformanceService _performanceService;
//        private readonly IMapper _mapper;

//        public TeachersController(ITeacherService teacherService, IBehaviourService behaviourService, IMapper mapper, IStudentService studentService, IPerformanceService performanceService)
//        {
//            _teacherService = teacherService;
//            _behaviourService = behaviourService;
//            _mapper = mapper;
//            _studentService = studentService;
//            _performanceService = performanceService;
//        }

//        //// GET: teacher/Teachers
//        //[HttpGet]
//        //public async Task<ActionResult<IEnumerable<Teacher>>> GetTeachers()
//        //{
//        //    try
//        //    {
//        //        var teachers = await _teacherService.GetAllTeachersAsync();
//        //        return Ok(teachers);
//        //    }
//        //    catch (Exception ex)
//        //    {
//        //        return StatusCode(500, $"Internal server error: {ex.Message}");
//        //    }
//        //}

//        // GET: teacher/Teachers/5
//        [HttpGet("{id}")]
//        public async Task<ActionResult<Teacher>> GetTeacher(int id)
//        {
//            try
//            {
//                if (id <= 0)
//                    return BadRequest("Invalid teacher ID");

//                var teacher = await _teacherService.GetTeacherByIdAsync(id);

//                if (teacher == null)
//                    return NotFound($"Teacher with ID {id} not found");

//                return Ok(teacher);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Internal server error: {ex.Message}");
//            }
//        }

//        // PUT: teacher/Teachers/5
//        [HttpPut("{id}")]
//        public async Task<IActionResult> PutTeacher(int id, Teacher teacher)
//        {
//            try
//            {
//                if (id <= 0 || teacher == null || id != teacher.TeacherId)
//                    return BadRequest("Invalid input data");

//                if (string.IsNullOrWhiteSpace(teacher.Name))
//                    return BadRequest("Teacher name is required");

//                if (string.IsNullOrWhiteSpace(teacher.Email))
//                    return BadRequest("Teacher email is required");

//                var result = await _teacherService.UpdateTeacherAsync(teacher);

//                if (!result)
//                    return NotFound($"Teacher with ID {id} not found");

//                return NoContent();
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Internal server error: {ex.Message}");
//            }
//        }

//        //// POST: teacher/Teachers
//        //[HttpPost]
//        //public async Task<ActionResult<Teacher>> PostTeacher(Teacher teacher)
//        //{
//        //    try
//        //    {
//        //        if (teacher == null)
//        //            return BadRequest("Teacher data is required");

//        //        if (string.IsNullOrWhiteSpace(teacher.Name))
//        //            return BadRequest("Teacher name is required");

//        //        if (string.IsNullOrWhiteSpace(teacher.Email))
//        //            return BadRequest("Teacher email is required");

//        //        var result = await _teacherService.CreateTeacherAsync(teacher);

//        //        if (!result)
//        //            return StatusCode(500, "Failed to create teacher");

//        //        return CreatedAtAction(nameof(GetTeacher), new { id = teacher.TeacherId }, teacher);
//        //    }
//        //    catch (Exception ex)
//        //    {
//        //        return StatusCode(500, $"Internal server error: {ex.Message}");
//        //    }
//        //}

//        // DELETE: teacher/Teachers/5
//        [HttpDelete("{id}")]
//        public async Task<IActionResult> DeleteTeacher(int id)
//        {
//            try
//            {
//                if (id <= 0)
//                    return BadRequest("Invalid teacher ID");

//                var result = await _teacherService.DeleteTeacherAsync(id);

//                if (!result)
//                    return NotFound($"Teacher with ID {id} not found");

//                return NoContent();
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Internal server error: {ex.Message}");
//            }
//        }

//        #region Behaviour
//        //[HttpGet("{teacherId}/behaviour")]
//        //public async Task<IActionResult> GetBehaviours(int teacherId)
//        //{
//        //    var behaviours = await _behaviourService.GetBehavioursByTeacherAsync(teacherId);
//        //    if (!behaviours.Any()) return Ok(new List<Behaviour>()); // Empty list instead of 404
//        //    return Ok(behaviours);
//        //}

//        //[HttpGet("{teacherId}/behaviour/{behaviourId}")]
//        //public async Task<IActionResult> GetBehaviour(int teacherId, int behaviourId)
//        //{
//        //    var behaviour = await _behaviourService.GetBehaviourByIdAsync(teacherId, behaviourId);
//        //    if (behaviour == null) return NotFound($"Behaviour record not found.");
//        //    return Ok(behaviour);
//        //}

//        //[HttpPost("{teacherId}/behaviour")]
//        //public async Task<IActionResult> AddBehaviour(int teacherId, [FromBody] Behaviour behaviour)
//        //{
//        //    if (!ModelState.IsValid) return BadRequest(ModelState);
//        //    behaviour.TeacherId = teacherId;
//        //    var newBehaviour = await _behaviourService.AddBehaviourAsync(behaviour);
//        //    return CreatedAtAction(nameof(GetBehaviour), new { teacherId, behaviourId = newBehaviour.BehaviourId }, newBehaviour);
//        //}

//        //[HttpPut("{teacherId}/behaviour/{behaviourId}")]
//        //public async Task<IActionResult> UpdateBehaviour(int teacherId, int behaviourId, [FromBody] Behaviour behaviour)
//        //{
//        //    if (!ModelState.IsValid) return BadRequest(ModelState);
//        //    var updated = await _behaviourService.UpdateBehaviourAsync(teacherId, behaviourId, behaviour);
//        //    if (updated == null) return NotFound("Behaviour record not found.");
//        //    return NoContent();
//        //}

//        //[HttpDelete("{teacherId}/behaviour/{behaviourId}")]
//        //public async Task<IActionResult> DeleteBehaviour(int teacherId, int behaviourId)
//        //{
//        //    var deleted = await _behaviourService.DeleteBehaviourAsync(teacherId, behaviourId);
//        //    if (!deleted) return NotFound("Behaviour record not found.");
//        //    return NoContent();
//        //} 
//        #endregion

//        //[HttpGet("{teacherId}/behaviour")]
//        //public async Task<IActionResult> GetBehaviours(int teacherId)
//        //{
//        //    var behaviours = await _behaviourService.GetBehavioursByTeacherAsync(teacherId);
//        //    if (!behaviours.Any()) return Ok(new List<BehaviourDto>());

//        //    return Ok(_mapper.Map<IEnumerable<BehaviourDto>>(behaviours));
//        //}

//        //[HttpGet("{teacherId}/behaviour/{behaviourId}")]
//        //public async Task<IActionResult> GetBehaviour(int teacherId, int behaviourId)
//        //{
//        //    var behaviour = await _behaviourService.GetBehaviourByIdAsync(teacherId, behaviourId);
//        //    if (behaviour == null) return NotFound("Behaviour record not found.");

//        //    return Ok(_mapper.Map<BehaviourDto>(behaviour));
//        //}

//        //[HttpPost("{teacherId}/behaviour")]
//        //public async Task<IActionResult> AddBehaviour(int teacherId, [FromBody] CreateBehaviourDto dto)
//        //{
//        //    if (!ModelState.IsValid) return BadRequest(ModelState);

//        //    var behaviour = _mapper.Map<Behaviour>(dto);
//        //    behaviour.TeacherId = teacherId;

//        //    var newBehaviour = await _behaviourService.AddBehaviourAsync(behaviour);
//        //    var behaviourDto = _mapper.Map<BehaviourDto>(newBehaviour);

//        //    return CreatedAtAction(nameof(GetBehaviour), new { teacherId, behaviourId = behaviourDto.BehaviourId }, behaviourDto);
//        //}

//        //[HttpPut("{teacherId}/behaviour/{behaviourId}")]
//        //public async Task<IActionResult> UpdateBehaviour(int teacherId, int behaviourId, [FromBody] UpdateBehaviourDto dto)
//        //{
//        //    if (!ModelState.IsValid) return BadRequest(ModelState);

//        //    var updatedBehaviour = _mapper.Map<Behaviour>(dto);
//        //    var updated = await _behaviourService.UpdateBehaviourAsync(teacherId, behaviourId, updatedBehaviour);

//        //    if (updated == null) return NotFound("Behaviour record not found.");
//        //    return NoContent();
//        //}

//        //[HttpDelete("{teacherId}/behaviour/{behaviourId}")]
//        //public async Task<IActionResult> DeleteBehaviour(int teacherId, int behaviourId)
//        //{
//        //    var deleted = await _behaviourService.DeleteBehaviourAsync(teacherId, behaviourId);
//        //    if (!deleted) return NotFound("Behaviour record not found.");
//        //    return NoContent();
//        //}

//        [HttpGet("{teacherId}/students/{studentId}/behaviours")]
//        public async Task<IActionResult> GetBehaviours(int teacherId, int studentId)
//        {
//            var behaviours = await _behaviourService.GetBehavioursByStudentAsync(teacherId, studentId);
//            if (!behaviours.Any()) return Ok(new List<BehaviourDto>());

//            return Ok(_mapper.Map<IEnumerable<BehaviourDto>>(behaviours));
//        }

//        [HttpGet("{teacherId}/students/{studentId}/behaviours/{behaviourId}")]
//        public async Task<IActionResult> GetBehaviour(int teacherId, int studentId, int behaviourId)
//        {
//            var behaviour = await _behaviourService.GetBehaviourByIdAsync(teacherId, studentId, behaviourId);
//            if (behaviour == null) return NotFound("Behaviour record not found.");

//            return Ok(_mapper.Map<BehaviourDto>(behaviour));
//        }

//        [HttpPost("{teacherId}/students/{studentId}/behaviours")]
//        public async Task<IActionResult> AddBehaviour(int teacherId, int studentId, [FromBody] CreateBehaviourDto dto)
//        {
//            if (!ModelState.IsValid) return BadRequest(ModelState);

//            var behaviour = _mapper.Map<Behaviour>(dto);
//            behaviour.TeacherId = teacherId;
//            behaviour.StudentId = studentId;

//            var newBehaviour = await _behaviourService.AddBehaviourAsync(behaviour);
//            var behaviourDto = _mapper.Map<BehaviourDto>(newBehaviour);

//            return CreatedAtAction(nameof(GetBehaviour),
//                new { teacherId, studentId, behaviourId = behaviourDto.BehaviourId },
//                behaviourDto);
//        }

//        [HttpPut("{teacherId}/students/{studentId}/behaviours/{behaviourId}")]
//        public async Task<IActionResult> UpdateBehaviour(int teacherId, int studentId, int behaviourId, [FromBody] UpdateBehaviourDto dto)
//        {
//            if (!ModelState.IsValid) return BadRequest(ModelState);

//            var updatedBehaviour = _mapper.Map<Behaviour>(dto);
//            var updated = await _behaviourService.UpdateBehaviourAsync(teacherId, studentId, behaviourId, updatedBehaviour);

//            if (updated == null) return NotFound("Behaviour record not found.");
//            return NoContent();
//        }

//        [HttpDelete("{teacherId}/students/{studentId}/behaviours/{behaviourId}")]
//        public async Task<IActionResult> DeleteBehaviour(int teacherId, int studentId, int behaviourId)
//        {
//            var deleted = await _behaviourService.DeleteBehaviourAsync(teacherId, studentId, behaviourId);
//            if (!deleted) return NotFound("Behaviour record not found.");
//            return NoContent();
//        }




//        #region StudentInfo
//        //[HttpGet("{teacherId}/students")]
//        //public async Task<IActionResult> GetStudentsByTeacher(int teacherId)
//        //{
//        //    var teacher = await _teacherService.GetTeacherByIdAsync(teacherId);
//        //    if (teacher == null) return NotFound($"Teacher with ID {teacherId} not found.");

//        //    var students = await _studentService.GetStudentsByClassAsync(teacher.ClassId);
//        //    if (!students.Any()) return Ok(new List<Student>()); // Return empty list if no students

//        //    return Ok(students);
//        //}

//        //[HttpGet("{teacherId}/students/{studentId}")]
//        //public async Task<IActionResult> GetStudentInfo(int teacherId, int studentId)
//        //{
//        //    var teacher = await _teacherService.GetTeacherByIdAsync(teacherId);
//        //    if (teacher == null) return NotFound($"Teacher with ID {teacherId} not found.");

//        //    var student = await _studentService.GetStudentByIdAsync(studentId);
//        //    if (student == null) return NotFound($"Student with ID {studentId} not found.");

//        //    // Ensure student belongs to teacher's class
//        //    if (student.ClassId != teacher.ClassId)
//        //        return Forbid("You are not authorized to view this student's info.");

//        //    return Ok(student);
//        //} 
//        #endregion


//        #region studentinfo without mapper
//        //[HttpGet("students")]
//        //public async Task<IActionResult> GetAllStudents()
//        //{
//        //    try
//        //    {
//        //        var students = await _studentService.GetAllStudentsAsync();
//        //        if (!students.Any())
//        //            return NotFound("No students found.");

//        //        return Ok(students); // Returns list of all students
//        //    }
//        //    catch (Exception ex)
//        //    {
//        //        return StatusCode(500, $"Internal server error: {ex.Message}");
//        //    }
//        //} 
//        #endregion

//        [HttpGet("students")]
//        public async Task<IActionResult> GetAllStudents()
//        {
//            try
//            {
//                var students = await _studentService.GetAllStudentsAsync();
//                if (!students.Any())
//                    return NotFound("No students found.");

//                var studentDtos = _mapper.Map<IEnumerable<StudentDto>>(students);
//                return Ok(studentDtos);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Internal server error: {ex.Message}");
//            }
//        }


//        #region StudenrInfo without dto
//        //[HttpGet("{teacherId}/students")]
//        //public async Task<IActionResult> GetStudentsByTeacher(int teacherId)
//        //{
//        //    // Check if teacher exists
//        //    var teacher = await _teacherService.GetTeacherByIdAsync(teacherId);
//        //    if (teacher == null)
//        //        return NotFound($"Teacher with ID {teacherId} not found.");

//        //    // ✅ Fetch class where teacher is class teacher
//        //    var schoolClass = await _studentService.GetClassByTeacherIdAsync(teacherId);
//        //    if (schoolClass == null)
//        //        return NotFound($"No class assigned to Teacher ID {teacherId}.");

//        //    // ✅ Fetch students in that class
//        //    var students = await _studentService.GetStudentsByClassAsync(schoolClass.ClassId);
//        //    if (!students.Any())
//        //        return Ok(new List<Student>()); // Return empty list instead of 404

//        //    return Ok(students);
//        //} 
//        #endregion

//        [HttpGet("students/{id}")]
//        public async Task<IActionResult> GetStudentById(int id)
//        {
//            try
//            {
//                if (id <= 0)
//                    return BadRequest("Invalid student ID");

//                var student = await _studentService.GetStudentByIdAsync(id);
//                if (student == null)
//                    return NotFound($"Student with ID {id} not found.");

//                var studentDto = _mapper.Map<StudentDto>(student);
//                return Ok(studentDto);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Internal server error: {ex.Message}");
//            }
//        }

//        #region Student Performance CRUD

//        [HttpGet("students/{studentId}/performance")]
//        public async Task<IActionResult> GetStudentPerformance(int studentId)
//        {
//            var performances = await _performanceService.GetPerformanceByStudentIdAsync(studentId);
//            return Ok(_mapper.Map<IEnumerable<PerformanceDto>>(performances));
//        }

//        [HttpGet("students/performance/{id}")]
//        public async Task<IActionResult> GetPerformanceById(int id)
//        {
//            var performance = await _performanceService.GetPerformanceByIdAsync(id);
//            if (performance == null) return NotFound("Performance record not found.");
//            return Ok(_mapper.Map<PerformanceDto>(performance));
//        }

//        [HttpPost("students/performance")]
//        public async Task<IActionResult> AddPerformance([FromBody] CreatePerformanceDto dto)
//        {
//            if (!ModelState.IsValid) return BadRequest(ModelState);

//            var performance = _mapper.Map<Performance>(dto);
//            var newPerformance = await _performanceService.AddPerformanceAsync(performance);

//            return CreatedAtAction(nameof(GetPerformanceById),
//                new { id = newPerformance.PerformanceId },
//                _mapper.Map<PerformanceDto>(newPerformance));
//        }



//        //[HttpPut("students/performance/{id}")]
//        //public async Task<IActionResult> UpdatePerformance(int id, [FromBody] UpdatePerformanceDto dto)
//        //{
//        //    if (!ModelState.IsValid)
//        //        return BadRequest(ModelState);

//        //    var updatedPerformance = _mapper.Map<Performance>(dto);
//        //    //updatedPerformance.PerformanceId = id;
//        //    var result = await _performanceService.UpdatePerformanceAsync(id, updatedPerformance);

//        //    if (result == null)
//        //        return NotFound("Performance record not found.");

//        //    return Ok(result); // or NoContent() if you don't want to return the record
//        //}


//        //[HttpPut("students/performance/{id}")]
//        //public async Task<IActionResult> UpdatePerformance(int id, [FromBody] UpdatePerformanceDto dto)
//        //{
//        //    if (!ModelState.IsValid) return BadRequest(ModelState);

//        //    var updatedPerformance = _mapper.Map<Performance>(dto);
//        //    var result = await _performanceService.UpdatePerformanceAsync(id, updatedPerformance);

//        //    if (result == null) return NotFound("Performance record not found.");
//        //    return NoContent();
//        //}

//        [HttpDelete("students/performance/{id}")]
//        public async Task<IActionResult> DeletePerformance(int id)
//        {
//            var deleted = await _performanceService.DeletePerformanceAsync(id);
//            if (!deleted) return NotFound("Performance record not found.");
//            return NoContent();
//        }

//        #endregion

//    }
//}