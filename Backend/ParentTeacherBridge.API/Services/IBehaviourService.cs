using ParentTeacherBridge.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ParentTeacherBridge.API.Services
{
    public interface IBehaviourService
    {
        Task<IEnumerable<Behaviour>> GetAllBehavioursByTeacherAsync(int teacherId);
        Task<IEnumerable<Behaviour>> GetBehavioursByStudentAsync(int teacherId, int studentId);
        Task<Behaviour> GetBehaviourByIdAsync(int teacherId, int studentId, int behaviourId);
        Task<Behaviour> AddBehaviourAsync(Behaviour behaviour);
        Task<Behaviour> UpdateBehaviourAsync(int teacherId, int studentId, int behaviourId, Behaviour behaviour);
        Task<bool> DeleteBehaviourAsync(int teacherId, int studentId, int behaviourId);
        //Task<IEnumerable<Behaviour>> GetBehavioursByTeacherAsync(int teacherId);
        //Task<Behaviour?> GetBehaviourByIdAsync(int teacherId, int behaviourId);
        //Task<Behaviour> AddBehaviourAsync(Behaviour behaviour);
        //Task<Behaviour?> UpdateBehaviourAsync(int teacherId, int behaviourId, Behaviour updatedBehaviour);
        //Task<bool> DeleteBehaviourAsync(int teacherId, int behaviourId);


    }
 
}
