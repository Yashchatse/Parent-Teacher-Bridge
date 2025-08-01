using AutoMapper;
using ParentTeacherBridge.API.DTOs;
using ParentTeacherBridge.API.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ParentTeacherBridge.API.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Admin mappings
            CreateMap<Admin, AdminDto>();
            CreateMap<CreateAdminDto, Admin>();
            CreateMap<UpdateAdminDto, Admin>()
                .ForMember(dest => dest.Password, opt => opt.Condition(src => !string.IsNullOrWhiteSpace(src.Password)));

            // Teacher mappings
            CreateMap<Teacher, TeacherDto>();
            CreateMap<CreateTeacherDto, Teacher>();
            CreateMap<UpdateTeacherDto, Teacher>()
                .ForMember(dest => dest.Password, opt => opt.Condition(src => !string.IsNullOrWhiteSpace(src.Password)));

            // SchoolClass mappings
            CreateMap<SchoolClass, SchoolClassDto>()
                .ForMember(dest => dest.ClassTeacherName, opt => opt.MapFrom(src => src.ClassTeacher != null ? src.ClassTeacher.Name : null));
            CreateMap<CreateSchoolClassDto, SchoolClass>();
            CreateMap<UpdateSchoolClassDto, SchoolClass>();


            CreateMap<Student, StudentDto>()
     .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class != null ? src.Class.ClassName : null));
            CreateMap<CreateStudentDto, Student>();
            CreateMap<UpdateStudentDto, Student>();

            // Subject mappings
            CreateMap<Subject, SubjectDto>();
            CreateMap<CreateSubjectDto, Subject>();
            CreateMap<UpdateSubjectDto, Subject>();

            // Timetable mappings
            CreateMap<Timetable, TimetableDto>()
                .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class != null ? src.Class.ClassName : null))
                .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject != null ? src.Subject.Name : null))
                .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.Teacher != null ? src.Teacher.Name : null));
            CreateMap<CreateTimetableDto, Timetable>();
            CreateMap<UpdateTimetableDto, Timetable>();
        }
    }
}