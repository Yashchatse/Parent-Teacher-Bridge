namespace ParentTeacherBridge.API.DTOs
{
    public class EventDTO
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public string? Location { get; set; }
    }

}
