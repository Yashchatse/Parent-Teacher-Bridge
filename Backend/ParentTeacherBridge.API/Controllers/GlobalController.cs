using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Controllers
{
    [ApiController]
    [Route("global/[controller]")]
    public class GlobalController : ControllerBase
    {
        private readonly ParentTeacherBridgeAPIContext _context;

        public GlobalController(ParentTeacherBridgeAPIContext context)
        {
            _context = context;
        }

        // 📅 GET: All Timetables with selected related data
        [HttpGet("timetables")]
        public async Task<IActionResult> GetAllTimetables()
        {
            var timetables = await _context.Timetable
                .Include(t => t.Class)
                .Include(t => t.Subject)
                .Include(t => t.Teacher)
                .Select(t => new {
                    t.TimetableId,
                    t.Weekday,
                    t.StartTime,
                    t.EndTime,
                    Class = t.Class.ClassName,
                    Subject = t.Subject.Name,
                    Teacher = t.Teacher.Name
                    // No Student or StudentId reference here
                })
                .ToListAsync();

            return Ok(timetables);
        }

        // 🎉 GET: All Events with selected related data
        [HttpGet("events")]
        public async Task<IActionResult> GetAllEvents()
        {
            var events = await _context.Event
                .Include(e => e.Teacher)
                .Select(e => new {
                    e.EventId,
                    e.Title,
                    e.Description,
                    e.EventDate,
                    Teacher = e.Teacher.Name
                    // Avoiding navigation to Student
                })
                .ToListAsync();

            return Ok(events);
        }
    }
}
