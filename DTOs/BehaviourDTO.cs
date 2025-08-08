namespace ParentTeacherBridge.API.DTOs
{
    public class BehaviourDTO
    {
        public DateOnly? IncidentDate { get; set; } // mapped from incident_date
        public string? BehaviourCategory { get; set; } // mapped from behaviour_category
        public string? Severity { get; set; } // mapped from severity
        public string? Description { get; set; } // mapped from description
    }
}
