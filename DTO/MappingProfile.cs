using ParentTeacherBridge.API.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;
using AutoMapper;


namespace ParentTeacherBridge.API.DTO
{
    public class MappingProfile:Profile
    {
       public MappingProfile()
        {
            CreateMap<Teacher, TeacherDto>();
            CreateMap<CreateTeacherDto, Teacher>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
            CreateMap<UpdateTeacherDto, Teacher>()
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));



            /// Behaviour mappings
        CreateMap<Behaviour, BehaviourDto>();
            CreateMap<CreateBehaviourDto, Behaviour>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

            CreateMap<UpdateBehaviourDto, Behaviour>()
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

            CreateMap<Student, StudentDto>();

            CreateMap<Performance, PerformanceDto>().ReverseMap();
            CreateMap<CreatePerformanceDto, Performance>();
            CreateMap<UpdatePerformanceDto, Performance>().ReverseMap();


            //Attendance Mapping
            //    CreateMap<Attendance, AttendanceDTO>().ReverseMap();
            //    CreateMap<Attendance, CreateAttendanceDto>().ReverseMap();
            //    CreateMap<Attendance, UpdateAttendanceDto>().ReverseMap();
            //    CreateMap<AttendanceDTO, Attendance>();
            //    CreateMap<AttendanceDTO, Attendance>()
            //.ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.Date)));
            //    CreateMap<Attendance, AttendanceDTO>()
            // .ForMember(dest => dest.Date, opt => opt.MapFrom(src =>
            //     src.Date.HasValue ? src.Date.Value.ToDateTime(TimeOnly.MinValue) : default));

            //Events Mapping
            CreateMap<EventCreateDto, Event>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));


            CreateMap<EventUpdateDto, Event>()
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));


            CreateMap<EventDto, Event>().ReverseMap();

        }

    }
}
