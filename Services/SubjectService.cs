using Microsoft.EntityFrameworkCore;
using ParentTeacherBridge.API.Data;
using ParentTeacherBridge.API.Models;
using ParentTeacherBridge.API.Repositories;

namespace ParentTeacherBridge.API.Services
{
    public class SubjectService : ISubjectService
    {
        private readonly ISubjectRepository _repo;
        private readonly ILogger<SubjectService> _logger;


        public SubjectService(ISubjectRepository repo, ILogger<SubjectService> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        public async Task<IEnumerable<Subject>> GetAllSubjectsAsync()
        {
            try
            {
                return await _repo.GetAllAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SubjectService.GetAllSubjectsAsync");
                throw;
            }
        }

        public async Task<Subject?> GetSubjectByIdAsync(int id)
        {
            try
            {
                return await _repo.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SubjectService.GetSubjectByIdAsync for ID {SubjectId}", id);
                throw;
            }
        }

        public async Task<Subject?> GetSubjectByCodeAsync(string code)
        {
            try
            {
                return await _repo.GetByCodeAsync(code);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SubjectService.GetSubjectByCodeAsync for code {Code}", code);
                throw;
            }
        }

        public async Task<bool> CreateSubjectAsync(Subject subject)
        {
            try
            {
                // Validate subject data
                if (!await ValidateSubjectDataAsync(subject))
                {
                    return false;
                }

                await _repo.AddAsync(subject);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SubjectService.CreateSubjectAsync");
                throw;
            }
        }

        public async Task<bool> UpdateSubjectAsync(int id, Subject subject)
        {
            try
            {
                var existing = await _repo.GetByIdAsync(id);
                if (existing == null)
                    return false;

                // Validate subject data (excluding current subject from code check)
                if (!await ValidateSubjectDataAsync(subject, id))
                {
                    return false;
                }

                subject.SubjectId = id;
                await _repo.UpdateAsync(subject);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SubjectService.UpdateSubjectAsync for ID {SubjectId}", id);
                throw;
            }
        }

        public async Task<bool> DeleteSubjectAsync(int id)
        {
            try
            {
                var subject = await _repo.GetByIdAsync(id);
                if (subject == null)
                    return false;

                await _repo.DeleteAsync(subject);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SubjectService.DeleteSubjectAsync for ID {SubjectId}", id);
                throw;
            }
        }

        public async Task<bool> SubjectExistsAsync(int id)
        {
            try
            {
                return await _repo.ExistsAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SubjectService.SubjectExistsAsync for ID {SubjectId}", id);
                throw;
            }
        }

        public async Task<IEnumerable<Subject>> SearchSubjectsAsync(string searchTerm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return await GetAllSubjectsAsync();
                }

                return await _repo.SearchSubjectsAsync(searchTerm);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SubjectService.SearchSubjectsAsync");
                throw;
            }
        }

        public async Task<bool> ValidateSubjectDataAsync(Subject subject, int? excludeId = null)
        {
            try
            {
                // Check if subject code already exists
                if (!string.IsNullOrWhiteSpace(subject.Code))
                {
                    var codeExists = await _repo.CodeExistsAsync(subject.Code, excludeId);
                    if (codeExists)
                    {
                        throw new InvalidOperationException("Subject code already exists");
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SubjectService.ValidateSubjectDataAsync");
                throw;
            }
        }
    }
}
