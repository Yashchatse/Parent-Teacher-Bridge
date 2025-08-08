using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Xml.Linq;

public class EventRepository : IEventRepository
{
    private readonly ParentTeacherBridgeAPIContext _context;
    private readonly ILogger<EventRepository> _logger;

    public EventRepository(ParentTeacherBridgeAPIContext context, ILogger<EventRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<Event>> GetAllAsync()
    {
        _logger.LogInformation("Fetching all events from database...");
        return await _context.Set<Event>().ToListAsync();
    }

    public async Task<Event?> GetByIdAsync(int id)
    {
        _logger.LogInformation("Fetching event with ID: {EventId}", id);
        return await _context.Set<Event>().FindAsync(id);
    }

    public async Task<Event> CreateAsync(Event evnt)
    {
        _logger.LogInformation("Creating new event with title: {Title}", evnt.Title);
        _context.Set<Event>().Add(evnt);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Event created with ID: {EventId}", evnt.EventId);
        return evnt;
    }

    public async Task UpdateAsync(Event evnt)
    {
        _logger.LogInformation("Updating event with ID: {EventId}", evnt.EventId);
        _context.Set<Event>().Update(evnt);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Event updated successfully.");
    }

    public async Task DeleteAsync(int id)
    {
        _logger.LogInformation("Attempting to delete event with ID: {EventId}", id);
        var evnt = await GetByIdAsync(id);
        if (evnt != null)
        {
            _context.Set<Event>().Remove(evnt);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Event with ID: {EventId} deleted", id);
        }
        else
        {
            _logger.LogWarning("Event with ID: {EventId} not found; delete operation skipped", id);
        }
    }
}