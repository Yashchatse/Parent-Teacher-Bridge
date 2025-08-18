using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Controllers
{
    [Route("message/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly ParentTeacherBridgeAPIContext _context;

        public MessageController(ParentTeacherBridgeAPIContext context)
        {
            _context = context;
        }

        // POST: api/message/send
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            if (message == null || string.IsNullOrWhiteSpace(message.MessageContext))
                return BadRequest("Message text is required.");

            message.SentAt = DateTime.UtcNow;
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(message);
        }

        // GET: api/message/inbox/{role}/{userId}
        [HttpGet("inbox/{role}/{userId}")]
        public async Task<IActionResult> GetInbox(string role, int userId)
        {
            var messages = await _context.Messages
                .Where(m => m.ReceiverRole == role && m.ReceiverId == userId)
                .OrderByDescending(m => m.SentAt)
                .ToListAsync();

            return Ok(messages);
        }

        // GET: api/message/conversation/{user1Id}/{user1Role}/{user2Id}/{user2Role}
        [HttpGet("conversation/{user1Id}/{user1Role}/{user2Id}/{user2Role}")]
        public async Task<IActionResult> GetConversation(int user1Id, string user1Role, int user2Id, string user2Role)
        {
            var messages = await _context.Messages
                .Where(m =>
                    (m.SenderId == user1Id && m.SenderRole == user1Role &&
                     m.ReceiverId == user2Id && m.ReceiverRole == user2Role)
                  || (m.SenderId == user2Id && m.SenderRole == user2Role &&
                      m.ReceiverId == user1Id && m.ReceiverRole == user1Role))
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return Ok(messages);
        }

        // Optional: DELETE a specific message
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var message = await _context.Messages.FindAsync(id);
            if (message == null)
                return NotFound();

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
