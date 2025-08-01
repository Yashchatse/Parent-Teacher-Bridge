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
        }
    }
}