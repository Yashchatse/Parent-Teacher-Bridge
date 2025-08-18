using ParentTeacherBridge.API.Models;

namespace ParentTeacherBridge.API.Services
{
    public interface ISubjectService
    {
        Task<IEnumerable<Subject>> GetAllSubjectsAsync();
        Task<Subject?> GetSubjectByIdAsync(int id);
        Task<Subject?> GetSubjectByCodeAsync(string code);
        Task<bool> CreateSubjectAsync(Subject subject);
        Task<bool> UpdateSubjectAsync(int id, Subject subject);
        Task<bool> DeleteSubjectAsync(int id);
        Task<bool> SubjectExistsAsync(int id);
        Task<IEnumerable<Subject>> SearchSubjectsAsync(string searchTerm);
        Task<bool> ValidateSubjectDataAsync(Subject subject, int? excludeId = null);
    }
}
