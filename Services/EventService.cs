using AutoMapper;
using ParentTeacherBridge.API.Models;

public class EventService : IEventService
{
    private readonly IEventRepository _repository;
    private readonly IMapper _mapper;

    public EventService(IEventRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<EventDto>> GetAllEventsAsync()
    {
        var events = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<EventDto>>(events);
    }

    public async Task<EventDto?> GetEventByIdAsync(int id)
    {
        var evnt = await _repository.GetByIdAsync(id);
        return _mapper.Map<EventDto?>(evnt);
    }

    public async Task<EventDto> CreateEventAsync(EventDto eventDto)
    {
        var evnt = _mapper.Map<Event>(eventDto);
        var created = await _repository.CreateAsync(evnt);
        return _mapper.Map<EventDto>(created);
    }

    public async Task UpdateEventAsync(EventDto eventDto)
    {
        var evnt = _mapper.Map<Event>(eventDto);
        await _repository.UpdateAsync(evnt);
    }

    public async Task DeleteEventAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }
}