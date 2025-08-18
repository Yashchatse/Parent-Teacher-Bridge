using AutoMapper;
using ParentTeacherBridge.API.DTOs;
using ParentTeacherBridge.API.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;


namespace ParentTeacherBridge.API.DTO
{
    public class MappingProfile:Profile
    {
       public MappingProfile()
        {

            // Admin mappings
            CreateMap<Admin, AdminDto>();
            CreateMap<CreateAdminDto, Admin>();
            CreateMap<UpdateAdminDto, Admin>()
                .ForMember(dest => dest.Password, opt => opt.Condition(src => !string.IsNullOrWhiteSpace(src.Password))); 


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

            //CreateMap<Student, StudentDto>().ReverseMap();
            CreateMap<Student, StudentDto>()
         .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class != null ? src.Class.ClassName : null));
            CreateMap<CreateStudentDto, Student>();
            CreateMap<UpdateStudentDto, Student>();

            CreateMap<Performance, PerformanceDto>().ReverseMap();

            CreateMap<CreatePerformanceDto, Performance>();
            CreateMap<UpdatePerformanceDto, Performance>().ReverseMap();

            // Subject mappings
            CreateMap<Subject, SubjectDto>();
            CreateMap<CreateSubjectDto, Subject>();
            CreateMap<UpdateSubjectDto, Subject>();

            //Attendance Mapping
            CreateMap<AttendanceCreateDto, Attendance>();
            CreateMap<AttendanceUpdateDto, Attendance>();
            CreateMap<Attendance, AttendanceDto>();
            // CreateMap<Attendance, AttendanceDto>().ReverseMap();
            //    CreateMap<AttendanceDto, Attendance>();
            //    CreateMap<AttendanceDto, Attendance>()
            //.ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.Date)));
            //    CreateMap<Attendance, AttendanceDto>()
            // .ForMember(dest => dest.Date, opt => opt.MapFrom(src =>
            //     src.Date.HasValue ? src.Date.Value.ToDateTime(TimeOnly.MinValue) : default));

            //Events Mapping
            CreateMap<EventCreateDto, Event>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));


            CreateMap<EventUpdateDto, Event>()
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));


            CreateMap<EventDto, Event>().ReverseMap();

            CreateMap<Attendance, AttendanceDto>().ReverseMap();

            //CreateMap<Timetable, TimetableDto>().ReverseMap();
            // Timetable mappings
            CreateMap<Timetable, TimetableDto>();
                //.ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class != null ? src.Class.ClassName : null))
                //.ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject != null ? src.Subject.Name : null))
                //.ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.Teacher != null ? src.Teacher.Name : null));
            CreateMap<CreateTimetableDto, Timetable>();
            CreateMap<UpdateTimetableDto, Timetable>();

            CreateMap<Parent, ParentDTO>().ReverseMap();

            // SchoolClass mappings
            CreateMap<SchoolClass, SchoolClassDto>()
                .ForMember(dest => dest.ClassTeacherName, opt => opt.MapFrom(src => src.ClassTeacher != null ? src.ClassTeacher.Name : null));
            CreateMap<CreateSchoolClassDto, SchoolClass>();
            CreateMap<UpdateSchoolClassDto, SchoolClass>();

        }

    }
}
