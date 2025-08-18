using Microsoft.AspNetCore.Mvc;
using ParentTeacherBridge.API.DTO;
using ParentTeacherBridge.API.Services;

namespace ParentTeacherBridge.API.Controllers
{
    [Route("parent/[controller]")]
    [ApiController]
    public class ParentController : ControllerBase
    {
        private readonly IParentService _service;

        public ParentController(IParentService service)
        {
            _service = service;
        }

        //  Get all parents
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var parents = await _service.GetAllAsync();
            return Ok(parents);
        }

        //  Get parent by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var parent = await _service.GetByIdAsync(id);
            return parent == null ? NotFound() : Ok(parent);
        }

        // 🎓 Parent name
        [HttpGet("{id}/name")]
        public async Task<IActionResult> GetName(int id)
        {
            var parent = await _service.GetByIdAsync(id);
            return parent == null ? NotFound() : Ok(parent.Name);
        }

        // 📧 Parent email
        [HttpGet("{id}/email")]
        public async Task<IActionResult> GetEmail(int id)
        {
            var parent = await _service.GetByIdAsync(id);
            return parent == null ? NotFound() : Ok(parent.Email);
        }

        // 🆕 Create new parent
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ParentDTO parentDto)
        {
            parentDto.Password = BCrypt.Net.BCrypt.HashPassword(parentDto.Password);
            await _service.CreateAsync(parentDto);
            return CreatedAtAction(nameof(GetById), new { id = parentDto.ParentId }, parentDto);
        }

        // 🛠️ Update parent
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ParentDTO updatedDto)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null) return NotFound();
            if (id != updatedDto.ParentId) return BadRequest();
            updatedDto.Password = BCrypt.Net.BCrypt.HashPassword(updatedDto.Password);

            var result = await _service.UpdateAsync(updatedDto);
            return result ? NoContent() : StatusCode(500, "Update failed");
        }

        // 🗑️ Delete parent
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            return result ? NoContent() : NotFound();
        }

        // 👨‍🎓 Get associated student
        [HttpGet("{id}/student")]

        public async Task<IActionResult> GetAssociatedStudent(int id)
        {
            var student = await _service.GetAssociatedStudentAsync(id);
            return student is null
                ? NotFound("No student found for this parent.")
                : Ok(student);
        }

        //public async Task<IActionResult> GetAssociatedStudent(int id)
        //{
        //    var student = await _service.GetAssociatedStudentAsync(id);
        //    return student == null ? NotFound("No student found for this parent.") : Ok(student);
        //}

        // 🗓️ Student attendance
        [HttpGet("{id}/student/attendance")]
        public async Task<IActionResult> GetStudentAttendance(int id)
        {
            var attendance = await _service.GetAttendanceForStudentAsync(id);
            return Ok(attendance);
        }

        // 📘 Student behaviour
        [HttpGet("{id}/student/behaviour")]
        public async Task<IActionResult> GetStudentBehaviour(int id)
        {
            var behaviour = await _service.GetBehaviourForStudentAsync(id);
            return Ok(behaviour);
        }

        // 🧠 Student performance
        [HttpGet("{id}/student/performance")]
        public async Task<IActionResult> GetStudentPerformance(int id)
        {
            var performance = await _service.GetPerformanceForStudentAsync(id);
            return Ok(performance);
        }

        // 📊 Global timetables
        [HttpGet("timetables")]
        public async Task<IActionResult> GetAllTimetables()
        {
            var timetables = await _service.GetAllTimetablesAsync();
            return Ok(timetables);
        }

        // 🎉 Global events
        [HttpGet("events")]
        public async Task<IActionResult> GetAllEvents()
        {
            var events = await _service.GetAllEventsAsync();
            return Ok(events);
        }
    }
}
