using ParentTeacherBridge.API.Models;

public interface IEventRepository
{
    Task<IEnumerable<Event>> GetAllAsync();
    Task<Event?> GetByIdAsync(int id);
    Task<Event> CreateAsync(Event evnt);
    Task UpdateAsync(Event evnt);
    Task DeleteAsync(int id);
}