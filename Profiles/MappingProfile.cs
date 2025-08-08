using AutoMapper;
using ParentTeacherBridge.API.Models;
using ParentTeacherBridge.API.DTOs;

namespace ParentTeacherBridge.API.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            
            CreateMap<Parent, ParentDTO>().ReverseMap();

            
            CreateMap<Student, StudentDTO>().ReverseMap();

            
            CreateMap<Attendance, AttendanceDTO>().ReverseMap();

            
            CreateMap<Behaviour, BehaviourDTO>().ReverseMap();

            // ✅ Performance ↔ PerformanceDTO
            CreateMap<Performance, PerformanceDTO>().ReverseMap();

            // ✅ Timetable ↔ TimetableDTO
            CreateMap<Timetable, TimetableDTO>().ReverseMap();

            // ✅ Event ↔ EventDTO
            CreateMap<Event, EventDTO>().ReverseMap();

            // 🧑‍🏫 Extendable mappings (uncomment when needed)
            // CreateMap<Teacher, TeacherDTO>().ReverseMap();
            // CreateMap<Message, MessageDTO>().ReverseMap();
        }
    }
}
