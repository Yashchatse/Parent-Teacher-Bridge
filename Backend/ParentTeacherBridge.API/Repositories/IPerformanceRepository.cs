using ParentTeacherBridge.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ParentTeacherBridge.API.Repositories
{
    public interface IPerformanceRepository
    {
            Task<IEnumerable<Performance>> GetPerformanceByStudentIdAsync(int studentId);
            Task<Performance?> GetPerformanceByIdAsync(int id);
            Task<Performance> AddPerformanceAsync(Performance performance);
            Task<Performance?> UpdatePerformanceAsync(Performance performance);
            Task<bool> DeletePerformanceAsync(int id);
        Task<IEnumerable<Performance>> GetPerformanceByTeacherIdAsync(int teacherId);


    }


}
