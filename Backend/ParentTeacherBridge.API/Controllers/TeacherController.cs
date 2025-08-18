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
            IAttendanceService attendanceService,
            IEventService eventService,
            ITimetableService timetableService,
            IMapper mapper)
        {
            _teacherService = teacherService;
            _behaviourService = behaviourService;
            _studentService = studentService;
            _performanceService = performanceService;
            _attendanceService = attendanceService;
            _eventService = eventService;
            _timetableService = timetableService;
            _mapper = mapper;
        }


        #region filter student
        [HttpGet("{teacherId}/students")]
        public async Task<IActionResult> GetStudentsByTeacher(int teacherId)
        {
            // Fetch all students where the teacher is the class teacher
            var students = await _studentService.GetStudentsByTeacherAsync(teacherId);

            if (!students.Any())
                return Ok(new List<StudentDto>()); // Return empty array if no students

            return Ok(_mapper.Map<IEnumerable<StudentDto>>(students));
        } 
        #endregion


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

                var result = await _teacherService.UpdateTeacherAsync(id,teacher);
                if (!result) return NotFound($"Teacher with ID {id} not found");

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteTeacher(int id)
        //{
        //    try
        //    {
        //        if (id <= 0) return BadRequest("Invalid teacher ID");

        //        var result = await _teacherService.DeleteTeacherAsync(id);
        //        if (!result) return NotFound($"Teacher with ID {id} not found");

        //        return NoContent();
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal server error: {ex.Message}");
        //    }
        //}
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteTeacher(int id)
        //{
        //    if (id <= 0)
        //        return BadRequest("Invalid teacher ID");

        //    try
        //    {
        //        var result = await _teacherService.DeleteTeacherAsync(id);

        //        if (!result)
        //            return NotFound(new { Message = $"Teacher with ID {id} not found" });

        //        return Ok(new { Message = $"Teacher with ID {id} deleted successfully" });
        //    }
        //    catch (Exception ex)
        //    {
        //        // Optional: log the exception here using your logging framework
        //        return StatusCode(500, new { Message = "Internal server error", Details = ex.Message });
        //    }
        //}
        #endregion

        #region Behaviour CRUD

        [HttpGet("{teacherId}/behaviours")]
        public async Task<IActionResult> GetAllBehavioursByTeacher(int teacherId)
        {
            var behaviours = await _behaviourService.GetAllBehavioursByTeacherAsync(teacherId);
            if (!behaviours.Any())
                return Ok(new List<BehaviourDto>());

            return Ok(_mapper.Map<IEnumerable<BehaviourDto>>(behaviours));
        }

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


        // Create attendance
        [HttpPost("{teacherId}/attendance")]
        public IActionResult CreateAttendance(int teacherId, [FromBody] AttendanceCreateDto dto)
        {
            if (dto == null || dto.StudentId <= 0 || dto.ClassId <= 0)
                return BadRequest("Missing or invalid fields");

            // dto.TeacherId = teacherId;
            var result = _attendanceService.CreateAttendance(dto);
            return Ok(result);
        }

        // Update attendance
        [HttpPut("attendance/{id}")]
        public IActionResult UpdateAttendance(int id, [FromBody] AttendanceUpdateDto dto)
        {
            if (dto == null) return BadRequest("Invalid data");

            var result = _attendanceService.UpdateAttendance(id, dto);
            if (result == null) return NotFound($"Attendance with ID {id} not found");

            return Ok(result);
        }

        //  Delete attendance
        [HttpDelete("attendance/{id}")]
        public IActionResult DeleteAttendance(int id)
        {
            _attendanceService.DeleteAttendance(id);
            return NoContent();
        }

        // Get attendance by student ID
        [HttpGet("student/{studentId}/attendance")]
        public IActionResult GetAttendanceByStudent(int studentId)
        {
            var result = _attendanceService.GetAttendanceByStudentId(studentId);
            return Ok(result);
        }



        // Get attendance by class ID
        [HttpGet("class/{classId}/attendance")]
        public IActionResult GetAttendanceByClass(int classId)
        {
            var result = _attendanceService.GetAttendanceByClassId(classId);
            return Ok(result);
        }


        #endregion

        #endregion

        #region Teacher Performance Extensions

        [HttpGet("{teacherId}/performance")]
        public async Task<IActionResult> GetPerformanceByTeacherId(int teacherId)
        {
            var performances = await _performanceService.GetPerformanceByTeacherIdAsync(teacherId);
            return Ok(_mapper.Map<IEnumerable<PerformanceDto>>(performances));
        }

        [HttpPost("performance")]
        public async Task<IActionResult> AddTeacherPerformance([FromBody] CreatePerformanceDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var performance = _mapper.Map<Performance>(dto);
            var newPerformance = await _performanceService.AddPerformanceAsync(performance);

            return CreatedAtAction(nameof(GetPerformanceById),
                new { id = newPerformance.PerformanceId },
                _mapper.Map<PerformanceDto>(newPerformance));
        }

        [HttpPut("performance/{performanceId}")]
        public async Task<IActionResult> UpdateTeacherPerformance(int performanceId, [FromBody] CreatePerformanceDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existing = await _performanceService.GetPerformanceByIdAsync(performanceId);
            if (existing == null) return NotFound("Performance record not found.");

            var updated = _mapper.Map(dto, existing); // map dto values to existing object
            updated.PerformanceId = performanceId;
            updated.UpdatedAt = DateTime.UtcNow;

            var result = await _performanceService.UpdatePerformanceAsync(updated);
            return Ok(_mapper.Map<PerformanceDto>(result));
        }

        #endregion



    }
}







