using ParentTeacherBridge.API.Models;
using ParentTeacherBridge.API.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ParentTeacherBridge.API.Services
{
    public class BehaviourService : IBehaviourService
    {
        private readonly IBehaviourRepository _repository;

        public BehaviourService(IBehaviourRepository repository)
        {
            _repository = repository;
        }

        public Task<IEnumerable<Behaviour>> GetAllBehavioursByTeacherAsync(int teacherId) =>
        _repository.GetAllBehavioursByTeacherAsync(teacherId);
        public Task<IEnumerable<Behaviour>> GetBehavioursByStudentAsync(int teacherId, int studentId) =>
            _repository.GetBehavioursByStudentAsync(teacherId, studentId);

        public Task<Behaviour> GetBehaviourByIdAsync(int teacherId, int studentId, int behaviourId) =>
            _repository.GetBehaviourByIdAsync(teacherId, studentId, behaviourId);

        public Task<Behaviour> AddBehaviourAsync(Behaviour behaviour) =>
            _repository.AddBehaviourAsync(behaviour);

        public Task<Behaviour> UpdateBehaviourAsync(int teacherId, int studentId, int behaviourId, Behaviour behaviour) =>
            _repository.UpdateBehaviourAsync(teacherId, studentId, behaviourId, behaviour);

        public Task<bool> DeleteBehaviourAsync(int teacherId, int studentId, int behaviourId) =>
            _repository.DeleteBehaviourAsync(teacherId, studentId, behaviourId);
        //private readonly IBehaviourRepository _repository;

        //public BehaviourService(IBehaviourRepository repository)
        //{
        //    _repository = repository;
        //}

        //public async Task<IEnumerable<Behaviour>> GetBehavioursByTeacherAsync(int teacherId)
        //{
        //    return await _repository.GetBehavioursByTeacherAsync(teacherId);
        //}

        //public async Task<Behaviour?> GetBehaviourByIdAsync(int teacherId, int behaviourId)
        //{
        //    return await _repository.GetBehaviourByIdAsync(teacherId, behaviourId);
        //}

        //public async Task<Behaviour> AddBehaviourAsync(Behaviour behaviour)
        //{
        //    behaviour.CreatedAt = DateTime.UtcNow;
        //    behaviour.UpdatedAt = DateTime.UtcNow;
        //    return await _repository.AddBehaviourAsync(behaviour);
        //}

        //public async Task<Behaviour?> UpdateBehaviourAsync(int teacherId, int behaviourId, Behaviour updatedBehaviour)
        //{
        //    var existingBehaviour = await _repository.GetBehaviourByIdAsync(teacherId, behaviourId);
        //    if (existingBehaviour == null) return null;

        //    // Update fields
        //    existingBehaviour.StudentId = updatedBehaviour.StudentId;
        //    existingBehaviour.IncidentDate = updatedBehaviour.IncidentDate;
        //    existingBehaviour.BehaviourCategory = updatedBehaviour.BehaviourCategory;
        //    existingBehaviour.Severity = updatedBehaviour.Severity;
        //    existingBehaviour.Description = updatedBehaviour.Description;
        //    existingBehaviour.NotifyParent = updatedBehaviour.NotifyParent;
        //    existingBehaviour.UpdatedAt = DateTime.UtcNow;

        //    return await _repository.UpdateBehaviourAsync(existingBehaviour);
        //}

        //public async Task<bool> DeleteBehaviourAsync(int teacherId, int behaviourId)
        //{
        //    return await _repository.DeleteBehaviourAsync(teacherId, behaviourId);
        //}


    }

    }



