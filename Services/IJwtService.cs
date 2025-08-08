using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Services
{
    public interface IJwtService
    {
        string GenerateToken(Admin admin);
        string GenerateToken(Teacher teacher);
        string GenerateToken(Parent parent);
    }
}
