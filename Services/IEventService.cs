using ParentTeacherBridge.API.Models;

public interface IEventService
{
    Task<IEnumerable<EventDto>> GetAllEventsAsync();
    Task<EventDto?> GetEventByIdAsync(int id);
    Task<EventDto> CreateEventAsync(EventDto eventDto);
    Task UpdateEventAsync(EventDto eventDto);
    Task DeleteEventAsync(int id);
}